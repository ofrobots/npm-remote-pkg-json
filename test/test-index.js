'use strict';

const nock = require('nock');
const test = require('ava');
const registryUrl = require('registry-url')();
const remotePackageJson = require('..');

const FAKE_REPLY = {
  'dist-tags': {
    latest: '1.2.3',
    rc: '1.1.1'
  },
  versions: {
    '1.2.3': {
      name: 'fake-module',
      version: '1.2.3'
    },
    '1.1.1': {
      name: 'fake-module',
      version: '1.1.1'
    },
    '1.0.0': {
      name: 'fake-module',
      version: '1.0.0'
    }
  }
};

debugger;
nock.disableNetConnect();

test('should parse simple package names correctly', async t => {
  const spec = 'foo';

  nock(registryUrl)
      .get(`/${spec}`)
      .once()
      .reply(200, FAKE_REPLY);
  
  const pjson = await remotePackageJson(spec);
  t.deepEqual(pjson, FAKE_REPLY.versions['1.2.3']);
});

test('should parse scoped packages', async t => {
  const spec = '@foo/bar';

  nock(registryUrl)
      .get(`/@foo%2fbar`)
      .once()
      .reply(200, FAKE_REPLY);

  const pjson = await remotePackageJson(spec);
  t.deepEqual(pjson, FAKE_REPLY.versions['1.2.3']);
});

test('should parse packages with version spec', async t => {
  const spec = '@foo/bar@1.0.0';

  nock(registryUrl)
      .get(`/@foo%2fbar`) // only the package name
      .once()
      .reply(200, FAKE_REPLY);

  const pjson = await remotePackageJson(spec);
  t.deepEqual(pjson, FAKE_REPLY.versions['1.0.0']);
});

test('should parse packages with tag spec', async t => {
  const spec = '@foo/bar@rc';

  nock(registryUrl)
      .get(`/@foo%2fbar`) // only the package name
      .once()
      .reply(200, FAKE_REPLY);

  const pjson = await remotePackageJson(spec);
  t.deepEqual(pjson, FAKE_REPLY.versions['1.1.1']);
});