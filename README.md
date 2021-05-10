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
### **EditClient() (constructor):**
* parameters: 
  * **file**: the default directory of the file you want to edit
  * **dirname**: the directory that the client edits files relatively from
  * **relative**: a boolean specifying if the default directory should be relative to the location of the file that the function got called in
* returns:
An instance of the `EditClient` class
### **set():**
* parameters:
  * **property**: a string containing the name of the property you to edit/create.
  * **value**: the value assigned to the property it can be a number, string or another object
  * **file**: the directory of the file you want to edit (if empty it'll edit the default file that got passed to the EditClient's constructor)
  * **relative**: a boolean specifying if the directory should be relative to the location of the file that the function got called in.
* returns:
An empty promise.
#### Disclaimer
this package is still under development consider contributing to it in the GitHub repository


