const fs = require('fs');
const path = require("path");
function applyrelative(file, dirname, relative = this.relative){
	return dirname && relative && !file.startsWith(dirname) ? path.join(dirname,file) : file;
}
function changePropByPath(obj, path = "", changeType, value) {
	let parr = path.split(".");
	let curr = obj;
	for (let i = 0; i < parr.length - 1 ; i++) curr = curr[parr[i]];
	switch(changeType){
		case 0:
			if(path) curr[parr[parr.length -1]] = value;
			else obj = value;
			break;
		case 1:
			if(path) delete curr[parr[parr.length -1]];
			else delete obj;
			break;
		case 2:
			return path ? curr[parr[parr.length -1]] : obj;
	}
	return obj;
}
module.exports = class EditClient {
	/**
	 * EditClient
	 *
	 * @name EditClient
	 * @function
	 * @param {Object} obj - the parameters's object
	 * @param {String} obj.file - the path to the file
	 * @param {String} obj.dirname - the default directory to edit files relatively from
	 * @param {Boolean} obj.relative - to specify if the default file directory should be relative to dirname
	 * @param {Boolean} obj.parseFirst - to specify if the file content should get parsed at the start or no
	 * @param {Object} obj.placeholderObj - the initial object to get written when the write method gets called
	 * @returns {EditClient} The `EditClient` instance
	 */
	constructor({ defaultFile, dirname, relative, autosave, parseFirst} = {}) {
		this.relative = relative;
		this.dirname = dirname;
		this.autosave = autosave;
		this.parseFirst = parseFirst;
		this.defaultFile = applyrelative(defaultFile, dirname, relative = this.relative);
		this.currentObj = parseFirst ? JSON.parse(fs.readFileSync(defaultFile)) : {};
	}
	async write(obj = this.currentObj, file = this.defaultFile, relative = this.relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		if (!(obj instanceof Object)) throw Error("properties must be an Object");
		file = applyrelative(file, this.dirname, relative = this.relative);
		fs.promises.writeFile(file, JSON.stringify(obj));
		return this;
	}
	writeSync(obj = this.currentObj, file = this.defaultFile, relative = this.relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		if (!(obj instanceof Object)) throw Error("properties must be an Object");
		file = applyrelative(file, this.dirname, relative = this.relative);
		fs.writeFileSync(file, JSON.stringify(obj));
		return this;
	}
	async set(property, value, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative)
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = await fs.promises.readFile(file);
		this.currentObj = JSON.parse(content);
		}
		this.currentObj = changePropByPath(this.currentObj, property, 0, value);
		return this.autosave ? await this.write(this.currentObj, file) : this;
	}
	async delete(property, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = await fs.promises.readFile(file);
		this.currentObj = JSON.parse(content);
		}
		this.currentObj = changePropByPath(this.currentObj, property, 1);
		return this.autosave ? await this.write(this.currentObj, file) : this;
	}
	async bulkDelete(properties, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit")
		file = applyrelative(file, this.dirname, relative = this.relative);
		if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = await fs.promises.readFile(file);
		this.currentObj = JSON.parse(content);
		}
		for (let i = 0; i < properties.length; i++) this.currentObj = changePropByPath(this.currentObj, properties[i], 1);
		return this.autosave ? await this.write(this.currentObj, file) : this;
	}
	async bulkSet(properties, values, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
		if (!(values instanceof Array)) throw TypeError("values must be an Array");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = await fs.promises.readFile(file);
		this.currentObj = JSON.parse(content);
		}
		for (let i = 0; i < properties.length; i++) this.currentObj = changePropByPath(this.currentObj, properties[i], 0, values[i]);
		return this.autosave ? await this.write(this.currentObj, file) : this;
	}
	async get(property, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to get value from");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = await fs.promises.readFile(file);
		this.currentObj = JSON.parse(content);
		}
		return changePropByPath(this.currentObj , property, 2);
	}
	async push({ file = this.defaultFile, relative } = {}, property, ...values) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = await fs.promises.readFile(file);
		this.currentObj = JSON.parse(content);
		}
		const target = changePropByPath(this.currentObj, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.push(...values);
		this.currentObj = changePropByPath(this.currentObj, property, 0, target);
		return this.autosave ? await this.write(this.currentObj, file) : this;
	}
	async unshift({ file = this.defaultFile, relative } = {}, property, ...values) {
 if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = await fs.promises.readFile(file);
		this.currentObj = JSON.parse(content);
		}
		const target = changePropByPath(this.currentObj, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.unshift(...values);
		this.currentObj = changePropByPath(this.currentObj, property, 0, target);
		return this.autosave ? await this.write(this.currentObj, file) : this;
	}
	async pop(property, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = await fs.promises.readFile(file);
		this.currentObj = JSON.parse(content);
		}
		const target = changePropByPath(this.currentObj, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.pop();
		this.currentObj = changePropByPath(this.currentObj, property, 0, target);
		return this.autosave ? await this.write(this.currentObj, file) : this;
	}
	async shift(property, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = await fs.promises.readFile(file);
		this.currentObj = JSON.parse(content);
		}
		const target = changePropByPath(this.currentObj, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.shift()
		this.currentObj = changePropByPath(this.currentObj, property, 0, target);
		return this.autosave ? await this.write(this.currentObj, file) : this;
	}
	async splice({ file = this.defaultFile, relative, } = {}, property, start, deleteCount, ...values) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = await fs.promises.readFile(file);
		this.currentObj = JSON.parse(content);
		}
		const target = changePropByPath(this.currentObj, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.splice(start, deleteCount, ...values);
		this.currentObj = changePropByPath(this.currentObj, property, 0, target);
		return this.autosave ? await this.write(this.currentObj, file) : this;
	}
	setSync(property, value, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative)
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = fs.readFileSync(file);
		this.currentObj = JSON.parse(content);
		}
		this.currentObj = changePropByPath(this.currentObj, property,0,value);
		return this.autosave ? this.writeSync(this.currentObj, file) : this;
	}
	deleteSync(property, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = fs.readFileSync(file);
		this.currentObj = JSON.parse(content);
		}
		this.currentObj = changePropByPath(this.currentObj, property, 1);
		return this.autosave ? this.writeSync(this.currentObj, file) : this;
	}
	bulkDeleteSync(properties, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit")
		file = applyrelative(file, this.dirname, relative = this.relative);
		if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = fs.readFileSync(file);
		this.currentObj = JSON.parse(content);
		}
				for (let i = 0; i < properties.length; i++) this.currentObj = changePropByPath(this.currentObj, properties[i], 1);
		return this.autosave ? this.writeSync(this.currentObj, file) : this;
	}
	bulkSetSync(properties, values, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
		if (!(values instanceof Array)) throw TypeError("values must be an Array");
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = fs.readFileSync(file);
		this.currentObj = JSON.parse(content);
		}
		for (let i = 0; i < properties.length; i++) this.currentObj = changePropByPath(this.currentObj, properties[i], 0, values[i]);
		return this.autosave ? this.writeSync(this.currentObj, file) : this;
	}
	getSync(property, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to get value from");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = fs.readFileSync(file);
		this.currentObj = JSON.parse(content);
		}
		return changePropByPath(this.currentObj, property, 2);
	}
	pushSync({ file = this.defaultFile, relative } = {}, property, ...values) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = fs.readFileSync(file);
		this.currentObj = JSON.parse(content);
		}
		const target = changePropByPath(this.currentObj, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.push(...values);
		return changePropByPath(this.currentObj , property, 2);
		return this.autosave ? this.writeSync(this.currentObj, file) : this;
	}
	unshiftSync({ file = this.defaultFile, relative } = {}, property, ...values) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = fs.readFileSync(file);
		this.currentObj = JSON.parse(content);
		}
		const target = changePropByPath(this.currentObj, property, 2);
		if (!(targeted instanceof Array)) throw TypeError("property must have a value of Array");
		target.unshift(...values)
		this.currentObj = changePropByPath(this.currentObj, property, 0, target);
		return this.autosave ? this.writeSync(this.currentObj, file) : this;
	}
	popSync(property, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = fs.readFileSync(file);
		this.currentObj = JSON.parse(content);
		}
		const target = changePropByPath(this.currentObj, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.pop();
		this.currentObj = changePropByPath(this.currentObj, property, 0, target);
		return this.autosave ? this.writeSync(this.currentObj, file) : this;
	}
	shiftSync(property, file = this.defaultFile, relative = this.relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = fs.readFileSync(file);
		this.currentObj = JSON.parse(content);
		}
		const target = changePropByPath(this.currentObj, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.shift();
		this.currentObj = changePropByPath(this.currentObj, property, 0, target);
		return this.autosave ? this.writeSync(this.currentObj, file) : this;
	}
	spliceSync({ file = this.defaultFile, relative, } = {}, property, start, deleteCount, ...values) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative = this.relative);
		if(file != this.defaultFile || this.currentObj == this.placeholderObj){
		const content = fs.readFileSync(file);
		this.currentObj = JSON.parse(content);
		}
		const target = changePropByPath(this.currentObj, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.splice(start, deleteCount, ...values);
		this.currentObj = changePropByPath(this.currentObj, property, 0, target);
		return this.autosave ? this.writeSync(this.currentObj, file) : this;
	}
};
