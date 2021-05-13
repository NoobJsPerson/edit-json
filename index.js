const fs = require('fs');

function applyrelative(file, dirname, relative) {
  return dirname && relative && !file.startsWith(dirname) ? dirname + (file.startsWith(".") ? file.replace(".", "") : !file.startsWith("/") ? "/" + file : file) : file;
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
  constructor(defaultFile, dirname, relative) {
    this.dirname = dirname
    if (defaultFile) this.defaultFile = applyrelative(defaultFile, dirname, relative);
  }
  async write(obj = {}, sync, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    if (!(obj instanceof Object)) throw Error("properties must be an Object");
    file = applyrelative(file, this.dirname, relative)
    if (sync) return fs.writeFileSync(file, JSON.stringify(obj));
    else return await fs.promises.writeFile(file, JSON.stringify(obj));
  }
  async set(property, value, sync, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative)
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    fileObject[property] = value;
    return await this.write(fileObject, sync, file);
  }
  async delete(property, sync, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    delete fileObject[property];
    return await this.write(fileObject, sync, file);
  }
  async bulkDelete(properties, sync, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit")
    file = applyrelative(file, this.dirname, relative);
    if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    for (let i = 0; i < properties.length; i++) delete fileObject[properties[i]];
    return await this.write(fileObject, sync, file);
  }
  async bulkSet(properties, values, sync, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
    if (!(values instanceof Array)) throw TypeError("values must be an Array");
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    for (let i = 0; i < properties.length; i++) fileObject[properties[i]] = values[i];
    return await this.write(fileObject, sync, file);
  }
  async get(property, sync, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to get value from");
    file = applyrelative(file, this.dirname, relative);
    const content = sync ? fs.readFileSync(file) : await fs.promises.readFile(file);
    return property ? content[property] : content;
  }
  async push({ file = this.defaultFile, sync, relative } = {}, property, ...values) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).push(...values)
    return await this.write(fileObject, sync, file);
  }
  async unshift({ file = this.defaultFile, sync, relative } = {}, property, ...values) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).unshift(...values)
    return await this.write(fileObject, sync, file);
  }
  async pop(property, sync, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).pop()
    return await this.write(fileObject, sync, file);
  }
  async shift(property, sync, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).shift()
    return await this.write(fileObject, sync, file);
  }
  async splice({ file = this.defaultFile, relative, sync } = {}, property, start, deleteCount, ...values) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).splice(start, deleteCount, ...values);
    return await this.write(fileObject, sync, file);
  }
};