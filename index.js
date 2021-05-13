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
  write(obj = {}, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    if (!(obj instanceof Object)) throw Error("properties must be an Object");
    file = applyrelative(file, this.dirname, relative)
    fs.writeFile(file, obj, () => {});
    return obj;
  }
  async set(property, value, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative)
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    fileObject[property] = value;
    return this.write(fileObject, file);
  }
  async delete(property, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    delete fileObject[property];
    return this.write(fileObject, file);
  }
  async bulkDelete(properties, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit")
    file = applyrelative(file, this.dirname, relative);
    if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    for (let i = 0; i < properties.length; i++) delete fileObject[properties[i]];
    return this.write(fileObject, file);
  }
  async bulkSet(properties, values, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
    if (!(values instanceof Array)) throw TypeError("values must be an Array");
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    for (let i = 0; i < properties.length; i++) fileObject[properties[i]] = values[i];
    return this.write(fileObject, file);
  }
  async get(property, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to get value from");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    return property ? content[property] : content;
  }
  async push({ file = this.defaultFile, relative } = {}, property, ...values) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).push(...values)
    return this.write(fileObject, file);
  }
  async unshift({ file = this.defaultFile, relative } = {}, property, ...values) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).unshift(...values)
    return this.write(fileObject, file);
  }
  async pop(property, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).pop()
    return this.write(fileObject, file);
  }
  async shift(property, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).shift()
    return this.write(fileObject, file);
  }
  async splice({ file = this.defaultFile, relative, } = {}, property, start, deleteCount, ...values) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = await fs.promises.readFile(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).splice(start, deleteCount, ...values);
    return this.write(fileObject, file);
  }
  setSync(property, value, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative)
    const content = fs.readFileSync(file);
    const fileObject = JSON.parse(content);
    fileObject[property] = value;
    return this.write(fileObject, file);
  }
  deleteSync(property, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = fs.readFileSync(file);
    const fileObject = JSON.parse(content);
    delete fileObject[property];
    return this.write(fileObject, file);
  }
  bulkDeleteSync(properties, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit")
    file = applyrelative(file, this.dirname, relative);
    if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
    const content = fs.readFileSync(file);
    const fileObject = JSON.parse(content);
    for (let i = 0; i < properties.length; i++) delete fileObject[properties[i]];
    return this.write(fileObject, file);
  }
  bulkSetSync(properties, values, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    if (!(properties instanceof Array)) throw TypeError("properties must be an Array");
    if (!(values instanceof Array)) throw TypeError("values must be an Array");
    const content = fs.readFileSync(file);
    const fileObject = JSON.parse(content);
    for (let i = 0; i < properties.length; i++) fileObject[properties[i]] = values[i];
    return this.write(fileObject, file);
  }
  getSync(property, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to get value from");
    file = applyrelative(file, this.dirname, relative);
    const content = fs.readFileSync(file);
    return property ? content[property] : content;
  }
  pushSync({ file = this.defaultFile, relative } = {}, property, ...values) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = fs.readFileSync(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).push(...values)
    return this.write(fileObject, file);
  }
  unshiftSync({ file = this.defaultFile, relative } = {}, property, ...values) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = fs.readFileSync(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).unshift(...values)
    return this.write(fileObject, file);
  }
  popSync(property, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = fs.readFileSync(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).pop()
    return this.write(fileObject, file);
  }
  shiftSync(property, file = this.defaultFile, relative) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = fs.readFileSync(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).shift()
    return this.write(fileObject, file);
  }
  spliceSync({ file = this.defaultFile, relative, } = {}, property, start, deleteCount, ...values) {
    if (!file) throw ReferenceError("No JSON to edit");
    file = applyrelative(file, this.dirname, relative);
    const content = fs.readFileSync(file);
    const fileObject = JSON.parse(content);
    if (!(property != "this" ? fileObject[property] : fileObject instanceof Array)) throw TypeError("property must have a value of Array");
    (property != "this" ? fileObject[property] : fileObject).splice(start, deleteCount, ...values);
    return this.write(fileObject, file);
  }
};