const { execSync } = require('child_process');
const fs = require('fs');
const glob = require('glob');
const prettier = require('prettier');
const { promisify } = require('util');
const { version: pkgVersion } = require('./package.json');

const serverUrl = 'https://schemas.s1seven.com/e-coc-schemas';
const schemaFilePaths = ['schema.json', 'chemical-analysis.json', 'material-certification.json'];
const fixturesFolder = 'test/fixtures';
const jsonFixturesPattern = `${fixturesFolder}/*valid_certificate_*.json`;

function readFile(path) {
  return promisify(fs.readFile)(path, 'utf8');
}

function writeFile(path, data) {
  return promisify(fs.writeFile)(path, data);
}

function buildRefSchemaUrl(version, schemaName = 'schema') {
  return `${serverUrl}/${version}/${schemaName}.json`;
}

async function updateJsonFixturesVersion(version) {
  const propertyPath = 'RefSchemaUrl';
  const filePaths = glob.sync(jsonFixturesPattern);
  await Promise.all(
    filePaths.map(async (filePath) => {
      const file = JSON.parse(await readFile(filePath));
      const RefSchemaUrl = buildRefSchemaUrl(version);
      file[propertyPath] = RefSchemaUrl;
      const prettierOptions = await prettier.resolveConfig(filePath);
      const json = prettier.format(JSON.stringify(file, null, 2), { ...(prettierOptions || {}), parser: 'json' });
      await writeFile(filePath, json);
    }),
  );
}

async function updateSchemasVersion(version) {
  await Promise.all(
    schemaFilePaths.map(async (filePath) => {
      const schema = JSON.parse(await readFile(filePath));
      let [schemaName] = filePath.split('.');
      schemaName = schemaName === 'schema' ? schemaName : `${schemaName}.schema`;
      schema.$id = `${serverUrl}/${version}/${schemaName}.json`;
      if (schema.definitions.Results) {
        schema.definitions.Results.properties.MaterialCertification.$ref = `${serverUrl}/${version}/material-certification.json#/definitions/MaterialTest`;
        schema.definitions.Results.properties.ChemicalAnalysis.$ref = `${serverUrl}/${version}/chemical-analysis.json#/definitions/ChemicalAnalysis`;
      }
      await writeFile(filePath, JSON.stringify(schema, null, 2));
    }),
  );
}

function stageAndCommitChanges(version) {
  execSync(`git add ${jsonFixturesPattern} ${schemaFilePaths.join(' ')}`);
  execSync(`git commit -m 'chore: sync versions to ${version}'`);
}

(async function (argv) {
  const version = argv[2] || pkgVersion;
  await updateSchemasVersion(version);
  await updateJsonFixturesVersion(version);
  stageAndCommitChanges(version);
})(process.argv);
