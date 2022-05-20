'use strict';

const axios = require('axios');
const semver = require('semver');
const urlJoin = require('url-join');

function getNpmInfo(npmName, registry) {
  if (!npmName) return null;

  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);

  return axios
    .get(npmInfoUrl)
    .then((res) => {
      if (res.status === 200) return res.data;
      return null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

function getDefaultRegistry(isOriginal = true) {
  return isOriginal
    ? 'https://registry.npmjs.org'
    : 'https://registry.npm.taobao.org';
}

async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);

  return data ? Object.keys(data.versions) : [];
}

/**
 * @param {String} baseVerion
 * @param {Array<String>} versions
 */
function getSemverVerisons(baseVerion, versions) {
  return versions
    .filter((version) => semver.satisfies(version, `>${baseVerion}`))
    .sort((a, b) => (semver.gt(b, a) ? 1 : -1));
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getSemverVerisons(baseVersion, versions);

  if (newVersions?.length) return newVersions[0];
  return null;
}

async function getNpmLastesVerion(npmName, registry) {
  let versions = await getNpmVersions(npmName, registry);

  if (versions) {
    return versions.sort((a, b) => (semver.gt(b, a) ? 1 : -1))[0];
  }
  return null;
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getSemverVerisons,
  getDefaultRegistry,
  getNpmLastesVerion,
  getNpmSemverVersion,
};
