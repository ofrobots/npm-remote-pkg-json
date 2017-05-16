# Given package spec, fetch remove package.json

```js
const remotePackageJson = require('npm-remote-pkg-json');

// pass in a simple package name
const pjson = await remotePackageJson('got');
// or a specific version
const pjson = await remotePackageJson('got@5.7.0');
// or a tag
const pjson = await remotePackageJson('got@rc');
```

