# edit-json
A small package to edit your json files with ease
# Documentation
```js
//defining the package
const edit = require('@noobjsperson/edit-json');
// creating an instance of editClient with './storage.json' as the default file
const client = new edit('./storage.json');
// assign a value to a property in the default file
client.setProperty('color','blue')```
