# edit-json
A small package to edit your json files with ease
# Documentation
Example:
```js
//defining the package
const edit = require('@noobjsperson/edit-json');
// creating an instance of EditClient with './storage.json' as the default file
const client = new edit('./storage.json');
// assign a value to a property in the default file
client.set('color','blue')
//result {"color":"blue"}
```
### `EditClient(file, dirname, relative)`

#### Params

- **String** `file`: the default directory of the file you want to edit
- **String** `dirname`: the directory that the client edits files relatively from
- **Boolean** `relative`: to specifying if the default directory should be relative to the location of the file that the function got called in

#### Returns

- **EditClient** The instance of the `EditClient` class

### `set(property, value, sync, file, relative)`

#### Params

  * **String** `property`: the name of the property you to edit/create.
  * **String** `value`: the value assigned to the property it can be a number, string or another object
  * **String** `file`: the directory of the file you want to edit (if empty it'll edit the default file that got passed to the EditClient's constructor)
  * **Boolean** `sync` : specifying if it should be sync or async (false by default (Recommended))
  * **Boolean** `relative`: specifying if the directory should be relative to the location of the file that the function got called in. (false by default)
  
#### Returns
  
An empty promise.

### `delete(property, file, relative)`

#### Params

* **String** `property`: the name of the property you to delete.
* **String** `file`: the directory of the file you want to edit (if empty it'll edit the default file that got passed to the EditClient's constructor)
* **Boolean** `relative`: a boolean specifying if the directory should be relative to the location of the file that the function got called in (false by default)

#### Returns

An empty promise.

#### Disclaimer
this package is still under development consider contributing to it in the GitHub repository


