const fs = require('fs');
const path = require("path");
function applyrelative(file, dirname, relative){
	return dirname && relative && !file.startsWith(dirname) ? path.join(dirname,file) : file;
}
function changePropByPath(obj, path, changeType, value) {
	let parr = path.split(".");
	let curr = obj;
	for (let i = 0; i < parr.length - 1 ; i++) {
		curr = curr[parr[i]];
	}
	switch(changeType){
		case 0:
			if(path) curr[parr[parr.length -1]] = value;
			else obj = value;
			break;
		case 1:
			delete path ? curr[parr[parr.length -1]] : obj;
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
	 * @param {String} file the path to the file
	 * @param {String} dirname the default directory to edit files relatively from
	 * @param {Boolean} relative to specify if the default file directory should be relative to dirname
	 * @returns {EditClient} The `EditClient` instance
	 */
	constructor({defaultFile, dirname, relative} = {}) {
		this.dirname = dirname
		if (defaultFile) this.defaultFile = applyrelative(defaultFile, dirname, relative);
	}
	write(obj = {}, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		if (!(obj instanceof Object)) throw Error("properties must be an Object");
		file = applyrelative(file, this.dirname, relative)
		fs.writeFile(file, obj, () => {});
		return this;
	}
	async set(property, value, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative)
		const content = await fs.promises.readFile(file);
		let fileObject = JSON.parse(content);
		fileObject = changePropByPath(fileObject, property, 0, value);
		return this.write(fileObject, file);
	}
	async delete(property, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = await fs.promises.readFile(file);
		let fileObject = JSON.parse(content);
		fileObject = changePropByPath(fileObject, property, 1);
		return this.write(fileObject, file);
	}
	async bulkDelete(properties, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit")
		file = applyrelative(file, this.dirname, relative);
		if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
		const content = await fs.promises.readFile(file);
		let fileObject = JSON.parse(content);
		for (let i = 0; i < properties.length; i++) fileObject = changePropByPath(fileObject, properties[i], 1);
		return this.write(fileObject, file);
	}
	async bulkSet(properties, values, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
		if (!(values instanceof Array)) throw TypeError("values must be an Array");
		const content = await fs.promises.readFile(file);
		const fileObject = JSON.parse(content);
		for (let i = 0; i < properties.length; i++) fileObject = changePropByPath(fileObject, properties[i], 0, values[i]);
		return this.write(fileObject, file);
	}
	async get(property, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to get value from");
		file = applyrelative(file, this.dirname, relative);
		const content = await fs.promises.readFile(file);
		const fileObject = JSON.parse(content);
		return changePropByPath(fileObject , property, 2);
	}
	async push({ file = this.defaultFile, relative } = {}, property, ...values) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = await fs.promises.readFile(file);
		let fileObject = JSON.parse(content);
		const target = changePropByPath(fileObject, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.push(...values);
		fileObject = changePropByPath(fileObject, property, 0, target);
		return this.write(fileObject, file);
	}
	async unshift({ file = this.defaultFile, relative } = {}, property, ...values) {
 if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = await fs.promises.readFile(file);
		let fileObject = JSON.parse(content);
		const target = changePropByPath(fileObject, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.unshift(...values);
		fileObject = changePropByPath(fileObject, property, 0, target);
		return this.write(fileObject, file);
	}
	async pop(property, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = await fs.promises.readFile(file);
		let fileObject = JSON.parse(content);
		const target = changePropByPath(fileObject, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.pop();
		fileObject = changePropByPath(fileObject, property, 0, target);
		return this.write(fileObject, file);
	}
	async shift(property, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = await fs.promises.readFile(file);
		let fileObject = JSON.parse(content);
		const target = changePropByPath(fileObject, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.shift()
		fileObject = changePropByPath(fileObject, property, 0, target);
		return this.write(fileObject, file);
	}
	async splice({ file = this.defaultFile, relative, } = {}, property, start, deleteCount, ...values) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = await fs.promises.readFile(file);
		let fileObject = JSON.parse(content);
		const target = changePropByPath(fileObject, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.splice(start, deleteCount, ...values);
		fileObject = changePropByPath(fileObject, property, 0, target);
		return this.write(fileObject, file);
	}
	setSync(property, value, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative)
		const content = fs.readFileSync(file);
		let fileObject = JSON.parse(content);
		fileObject = changePropByPath(fileObject, property,0,value);
		return this.write(fileObject, file);
	}
	deleteSync(property, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = fs.readFileSync(file);
		let fileObject = JSON.parse(content);
		fileObject = changePropByPath(fileObject, property, 1);
		return this.write(fileObject, file);
	}
	bulkDeleteSync(properties, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit")
		file = applyrelative(file, this.dirname, relative);
		if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
		const content = fs.readFileSync(file);
		let fileObject = JSON.parse(content);
				for (let i = 0; i < properties.length; i++) fileObject = changePropByPath(fileObject, properties[i], 1);
		return this.write(fileObject, file);
	}
	bulkSetSync(properties, values, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
		if (!(values instanceof Array)) throw TypeError("values must be an Array");
		const content = fs.readFileSync(file);
		let fileObject = JSON.parse(content);
		for (let i = 0; i < properties.length; i++) fileObject = changePropByPath(fileObject, properties[i], 0, values[i]);
		return this.write(fileObject, file);
	}
	getSync(property, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to get value from");
		file = applyrelative(file, this.dirname, relative);
		const content = fs.readFileSync(file);
		const fileObject = JSON.parse(content);
		return changePropByPath(fileObject , property, 2);
	}
	pushSync({ file = this.defaultFile, relative } = {}, property, ...values) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = fs.readFileSync(file);
		let fileObject = JSON.parse(content);
		const target = changePropByPath(fileObject, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.push(...values);
		return changePropByPath(fileObject , property, 2);
		return this.write(fileObject, file);
	}
	unshiftSync({ file = this.defaultFile, relative } = {}, property, ...values) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = fs.readFileSync(file);
		let fileObject = JSON.parse(content);
		const target = changePropByPath(fileObject, property, 2);
		if (!(targeted instanceof Array)) throw TypeError("property must have a value of Array");
		target.unshift(...values)
		fileObject = changePropByPath(fileObject, property, 0, target);
		return this.write(fileObject, file);
	}
	popSync(property, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = fs.readFileSync(file);
		let fileObject = JSON.parse(content);
		const target = changePropByPath(fileObject, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.pop();
		fileObject = changePropByPath(fileObject, property, 0, target);
		return this.write(fileObject, file);
	}
	shiftSync(property, file = this.defaultFile, relative) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = fs.readFileSync(file);
		let fileObject = JSON.parse(content);
		const target = changePropByPath(fileObject, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.shift();
		fileObject = changePropByPath(fileObject, property, 0, target);
		return this.write(fileObject, file);
	}
	spliceSync({ file = this.defaultFile, relative, } = {}, property, start, deleteCount, ...values) {
		if (!file) throw ReferenceError("No JSON to edit");
		file = applyrelative(file, this.dirname, relative);
		const content = fs.readFileSync(file);
		let fileObject = JSON.parse(content);
		const target = changePropByPath(fileObject, property, 2);
		if (!(target instanceof Array)) throw TypeError("property must have a value of Array");
		target.splice(start, deleteCount, ...values);
		fileObject = changePropByPath(fileObject, property, 0, target);
		return this.write(fileObject, file);
	}
};