const fs = require('fs');
function adjustfiledir(file){
	return __dirname+(file.startsWith(".")?file.replace(".",""):file);
}
module.exports = class EditClient {
  constructor(defaultFile,relative){
    this.defaultFile = relative?adjustfiledir(defaultFile):defaultFile;
  }
  async editProperty(property,value,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit");
    if(relative && (this.defaultFile != file || !file.startsWith(__dirname))) file = adjustfiledir(file);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    fileObject[property] = value;
    
    return await fs.promises.writeFile(file, JSON.stringify(fileObject));
  }
  async deleteProperty(property,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit");
    if(relative && (this.defaultFile != file || !file.startsWith(__dirname))) file = adjustfiledir(file);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    delete fileObject[property];
    
    return await fs.promises.writeFile(file, JSON.stringify(fileObject));
  }
  async deleteProperties(properties,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit")
    if(relative && (this.defaultFile != file || !file.startsWith(__dirname))) file = adjustfiledir(file);
    if(!(properties instanceof Array)) throw Error("properties must be an Array");
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    for(let i = 0;i < properties.length;i++){
    delete fileObject[properties[i]];
    }
    return await fs.promises.writeFile(file, JSON.stringify(fileObject));
  }
  async editProperties(properties,values ,file = this.defaultFile,relative){
    if(!file) throw Error("No JSON to edit");
    if(relative && (this.defaultFile != file || !file.startsWith(__dirname))) file = adjustfiledir(file);
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
    if(relative && (this.defaultFile != file || !file.startsWith(__dirname))) file = adjustfiledir(file);
    const content = await fs.promises.readFile(file);
    return property ? content[property] : content;
  }
}