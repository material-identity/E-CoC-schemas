const fs = require('fs');
const { promisify } = require('util');

const serverUrl = 'https://schemas.en10204.io/e-coc-schemas';
const schemaFilePaths = ['schema.json', 'chemical-analysis.json', 'material-certification.json'];

function readFile(path) {
  return promisify(fs.readFile)(path, 'utf8');
}

function writeFile(path, data) {
  return promisify(fs.writeFile)(path, data);
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

(async function (argv) {
  const version = argv[2];
  await updateSchemasVersion(version);
})(process.argv);
