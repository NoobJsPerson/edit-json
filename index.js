const fs = require('fs');
function adjustfiledir(file,dir){
	return dir+(file.startsWith(".")?file.replace(".",""):file);
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
    this.defaultFile = dirname&&relative?adjustfiledir(defaultFile,dirname):defaultFile;
  }
  async setProperty(property,value,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit");
    if(relative && (this.defaultFile != file || file && !file.startsWith(this.dirname)) && this.dirname) file = adjustfiledir(file,this.dirname);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    fileObject[property] = value;
    
    return await fs.promises.writeFile(file, JSON.stringify(fileObject));
  }
  async deleteProperty(property,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit");
    if(relative && (this.defaultFile != file || file && !file.startsWith(this.dirname)) && this.dirname) file = adjustfiledir(file,this.dirname);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    delete fileObject[property];
    
    return await fs.promises.writeFile(file, JSON.stringify(fileObject));
  }
  async deleteProperties(properties,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit")
    if(relative && (this.defaultFile != file || file && !file.startsWith(this.dirname)) && this.dirname) file = adjustfiledir(file,this.dirname);
    if(!(properties instanceof Array)) throw Error("properties must be an Array");
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    for(let i = 0;i < properties.length;i++){
    delete fileObject[properties[i]];
    }
    return await fs.promises.writeFile(file, JSON.stringify(fileObject));
  }
  async setProperties(properties,values ,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit");
    if(relative && (this.defaultFile != file || file && !file.startsWith(this.dirname))&&this.dirname) file = adjustfiledir(file,this.dirname);
    if(!(properties instanceof Array)) throw Error("properties must be an Array");
    if(!(values instanceof Array)) throw Error("values must be an Array");
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    for(let i = 0;i < properties.length;i++){
    fileObject[properties[i]] = values[i];
    }
    
    return await fs.promises.writeFile(file, JSON.stringify(fileObject));
  }
  async getValue(property,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to get value from");
    if(relative && (this.defaultFile != file || file && !file.startsWith(this.dirname))&& this.dirname) file = adjustfiledir(file,this.dirname);
    const content = await fs.promises.readFile(file);
    return property ? content[property] : content;
  }
};