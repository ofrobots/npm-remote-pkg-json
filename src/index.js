'use strict';

const got = require('got');
const npa = require('npm-package-arg');
const registryUrl = require('registry-url')();

/**
 * @example
 * // pass in a simple package name
 * const pjson = await remotePackageJson('got');
 * // or a specific version
 * const pjson = await remotePackageJson('got@5.7.0');
 * // or a tag
 * const pjson = await remotePackageJson('got@rc');
 * 
 */
async function remotePackageJson(name) {
  const parsed = npa(name);

  const response = await got(`${registryUrl}${parsed.escapedName}`, { json: true });
  if (response.statusCode !== 200) {
    throw new Error('statusCode ${response.statusCode}');
  }

  const packageJson = response.body;

  let version;
  if (parsed.type === 'version') {
    version = parsed.fetchSpec;
  } else if (parsed.type === 'tag') {
    version = packageJson['dist-tags'][parsed.fetchSpec];
    if (!version) {
      throw new Error(`unable to find version tag ${parsed.rawSpec}`);
    }
  } else {
    throw new Error(`unable to understand version spec ${parsed.rawSpec}`);
  }

  const specificPackageJson = packageJson.versions[version];

  return specificPackageJson;
}

module.exports = remotePackageJson;

// When invoked directly, run as a CLI.
if (!module.parent) {
  (async () => {
    if (process.argv.length !== 3) {
      console.error(`Usage: node ${process.argv[1]} <package-name@version-spec>`);
      return;
    }

    try {
      const packageJson = await remotePackageJson(process.argv[2]);
      console.log(packageJson);
    } catch (err) {
      console.error(err);
    }
  })();
}
