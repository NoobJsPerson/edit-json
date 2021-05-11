const fs = require('fs');
function applyrelative(file,dirname, relative){
	dirname && relative && !file.startsWith(dirname) ?dir+(file.startsWith(".")?file.replace(".",""):!file.startsWith("/")?"/"+file:file):file
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
  constructor(defaultFile,dirname,relative){
    this.dirname = dirname  	
    if(defaultFile) this.defaultFile = applyrelative(defaultFile, dirname, relative);
  }
   async write(file,obj = {},relative){
   	if(!file) throw Error("No JSON to edit");
       if(!(properties instanceof Object)) throw Error("properties must be an Object");
   	file = applyrelative(file, this.defaultFile, this.dirname, relative)
   	return await fs.promises.writeFile(file, JSON.stringify(obj));
   }
  async set(property,value,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit");
    file = applyrelative(file, this.dirname, relative)
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    fileObject[property] = value;
    return await this.write(file, fileObject);
  }
  async delete(property,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    delete fileObject[property];
    return await this.write(file, fileObject);
  }
  async bulDelete(properties,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit")
    file = applyrelative(file, this.dirname, relative);
    if(!(properties instanceof Array)) throw Error("properties must be an Array");
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    for(let i = 0;i < properties.length;i++) delete fileObject[properties[i]];
    return await this.write(file, fileObject);
  }
  async bulkSet(properties,values ,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    if(!(properties instanceof Array)) throw Error("properties must be an Array");
    if(!(values instanceof Array)) throw Error("values must be an Array");
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    for(let i = 0;i < properties.length;i++) fileObject[properties[i]] = values[i];
    return await this.write(file, fileObject);
  }
  async get(property,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to get value from");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    return property ? content[property] : content;
  }
  async push(property, ...values){
    if(!file) throw Error("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if(!(fileObject[property] instanceof Array)) throw Error("property must have a value of Array");
    fileObject[property].push(...values)
    return await this.write(file, fileObject);
  }
  async unshift(property, value){
    if(!file) throw Error("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if(!(fileObject[property] instanceof Array)) throw Error("property must have a value of Array");
    fileObject[property].unshift(value)
    return await this.write(file, fileObject);
  }
  async pop(property){
    if(!file) throw Error("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if(!(fileObject[property] instanceof Array)) throw Error("property must have a value of Array");
    fileObject[property].pop()
    return await this.write(file, fileObject);
  }
  async shift(property){
    if(!file) throw Error("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if(!(fileObject[property] instanceof Array)) throw Error("property must have a value of Array");
    fileObject[property].shift()
    return await this.write(file, fileObject);
  }
  async splice(property, start, deleteCount, ...values){
    if(!file) throw Error("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if(!(fileObject[property] instanceof Array)) throw Error("property must have a value of Array");
    fileObject[property].splice(start,deleteCount,...values);
    return await this.write(file, fileObject);
  }
};