const { execSync } = require('child_process');
const { SchemaRepositoryVersion } = require('@s1seven/schema-tools-versioning');
const { version: pkgVersion } = require('../package.json');
const { defaultServerUrl } = require('./constants');

const schemaFilePaths = [
  {
    filePath: 'schema.json',
    properties: [
      { path: '$id', value: 'schema.json' },
      {
        path: 'definitions.Results.properties.MaterialCertification.$ref',
        value: 'material-certification.json#/definitions/MaterialTest',
      },
      {
        path: 'definitions.Results.properties.ChemicalAnalysis.$ref',
        value: 'chemical-analysis.json#/definitions/ChemicalAnalysis',
      },
    ],
  },
  {
    filePath: 'material-certification.json',
    properties: [{ path: '$id', value: 'material-certification.schema.json' }],
  },
  {
    filePath: 'chemical-analysis.json',
    properties: [{ path: '$id', value: 'chemical-analysis.schema.json' }],
  },
];
const fixturesFolder = 'test/fixtures';
const jsonFixturesPattern = `${fixturesFolder}/*valid_certificate_*.json`;

function stageAndCommitChanges(version) {
  const schemasPaths = schemaFilePaths.map(({ filePath }) => filePath).join(' ');
  execSync(`git add ${jsonFixturesPattern} ${schemasPaths}`);
  execSync(`git commit -m 'chore: sync versions to ${version}'`);
}

(async function (argv) {
  const version = argv[2] || pkgVersion;
  const updater = new SchemaRepositoryVersion(defaultServerUrl, schemaFilePaths, version, {}, 'schema.json');
  await updater.updateSchemasVersion();
  await updater.updateJsonFixturesVersion(jsonFixturesPattern);
  stageAndCommitChanges(version);
})(process.argv);
