/* eslint-disable no-undef */
const { loadExternalFile } = require('@s1seven/schema-tools-utils');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const createAjvInstance = () => {
  const ajv = new Ajv({
    loadSchema: (uri) => loadExternalFile(uri, 'json'),
    strictSchema: true,
    strictNumbers: true,
    strictRequired: true,
    strictTypes: true,
    allErrors: true,
    discriminator: true,
  });
  ajv.addKeyword('meta:license');
  addFormats(ajv);
  return ajv;
};

describe('Validate', function () {
  const schemaPath = resolve(__dirname, '../schema.json');
  const localSchema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
  const materialCertificationSchemaPath = resolve(__dirname, '../material-certification.json');
  const materialCertificationSchema = JSON.parse(readFileSync(materialCertificationSchemaPath, 'utf-8'));
  const chemicalAnalysisSchemaPath = resolve(__dirname, '../chemical-analysis.json');
  const chemicalAnalysisSchema = JSON.parse(readFileSync(chemicalAnalysisSchemaPath, 'utf-8'));
  // force using local schemas
  localSchema.definitions = {
    ...localSchema.definitions,
    ...materialCertificationSchema.definitions,
    ...chemicalAnalysisSchema.definitions,
  };
  localSchema.definitions.Results.properties.MaterialCertification.$ref = '#/definitions/MaterialTest';
  localSchema.definitions.Results.properties.ChemicalAnalysis.$ref = '#/definitions/ChemicalAnalysis';

  const validCertTestSuitesMap = [
    {
      certificateName: `valid_certificate_1`,
    },
  ];
  const invalidCertTestSuitesMap = [
    {
      certificateName: `invalid_certificate_1`,
      expectedErrors: [
        {
          instancePath: '/Url',
          keyword: 'format',
          message: 'must match format "uri"',
          params: {
            format: 'uri',
          },
          schemaPath: '#/properties/Url/format',
        },
        {
          instancePath: '/EcocData',
          keyword: 'required',
          message: "must have required property 'Results'",
          params: {
            missingProperty: 'Results',
          },
          schemaPath: '#/properties/EcocData/oneOf/2/required',
        },
        {
          instancePath: '/EcocData/Data/Parties/0',
          keyword: 'required',
          message: "must have required property 'PartyIdentifier'",
          params: {
            missingProperty: 'PartyIdentifier',
          },
          schemaPath: '#/required',
        },
        {
          instancePath: '/EcocData/Data/Parties/0/PartyAddress',
          keyword: 'required',
          message: "must have required property 'CountryCode'",
          params: {
            missingProperty: 'CountryCode',
          },
          schemaPath: '#/definitions/Address/required',
        },
        {
          instancePath: '/EcocData/Data/Parties/0/AdditionalPartyProperties',
          keyword: 'minItems',
          message: 'must NOT have fewer than 1 items',
          params: {
            limit: 1,
          },
          schemaPath: '#/definitions/AddProperties/minItems',
        },
        {
          instancePath: '/EcocData/Data/Parties/1/PartyIdentifier/0/NameOfIdentifier',
          keyword: 'enum',
          message: 'must be equal to one of the allowed values',
          params: {
            allowedValues: ['DUNS', 'VATID', 'CageCode', 'CustomerNo', 'SupplierNo'],
          },
          schemaPath: '#/definitions/CompanyIdentifier/properties/NameOfIdentifier/enum',
        },
        {
          instancePath: '/EcocData/Data/Parties/1/PartyRole',
          keyword: 'enum',
          message: 'must be equal to one of the allowed values',
          params: {
            allowedValues: [
              'Certifier',
              'Customer',
              'InspectionParty',
              'Manufacturer',
              'Processor',
              'Recipient',
              'Requester',
              'Supplier',
              'TestLab',
            ],
          },
          schemaPath: '#/definitions/PartyRole/enum',
        },
        {
          instancePath: '/EcocData/Data/ObjectOfDeclaration/0',
          keyword: 'required',
          message: "must have required property 'PartyRefId'",
          params: {
            missingProperty: 'PartyRefId',
          },
          schemaPath: '#/required',
        },
        {
          instancePath: '/EcocData/Data/ObjectOfDeclaration/0/NormativeRef',
          keyword: 'minItems',
          message: 'must NOT have fewer than 1 items',
          params: {
            limit: 1,
          },
          schemaPath: '#/definitions/NormativeRef/minItems',
        },
        {
          instancePath: '/EcocData/Data/ObjectOfDeclaration/1',
          keyword: 'required',
          message: "must have required property 'PartyRefId'",
          params: {
            missingProperty: 'PartyRefId',
          },
          schemaPath: '#/required',
        },
        {
          instancePath: '/EcocData/Data/ObjectOfDeclaration/1/NormativeRef',
          keyword: 'minItems',
          message: 'must NOT have fewer than 1 items',
          params: {
            limit: 1,
          },
          schemaPath: '#/definitions/NormativeRef/minItems',
        },
        {
          instancePath: '/Declaration/Signature',
          keyword: 'required',
          message: "must have required property 'PartyRefOfSigner'",
          params: {
            missingProperty: 'PartyRefOfSigner',
          },
          schemaPath: '#/properties/Declaration/properties/Signature/required',
        },
      ],
    },
    {
      certificateName: `invalid_certificate_2`,
      expectedErrors: [
        {
          instancePath: '/EcocData/Data/Parties/0/PartyAddress',
          keyword: 'required',
          message: "must have required property 'CountryCode'",
          params: {
            missingProperty: 'CountryCode',
          },
          schemaPath: '#/definitions/Address/required',
        },
        {
          instancePath: '/EcocData/Results/MaterialCertification/0/SampleNumber',
          keyword: 'type',
          message: 'must be string',
          params: {
            type: 'string',
          },
          schemaPath: '#/properties/SampleNumber/type',
        },
        {
          instancePath: '/EcocData/Results/MaterialCertification/0/TestOK',
          keyword: 'type',
          message: 'must be boolean',
          params: {
            type: 'boolean',
          },
          schemaPath: '#/properties/TestOK/type',
        },
        {
          instancePath: '/Declaration/Signature',
          keyword: 'required',
          message: "must have required property 'PartyRefOfSigner'",
          params: {
            missingProperty: 'PartyRefOfSigner',
          },
          schemaPath: '#/properties/Declaration/properties/Signature/required',
        },
        {
          instancePath: '/Attachment/HashAlgorithm',
          keyword: 'enum',
          message: 'must be equal to one of the allowed values',
          params: {
            allowedValues: ['SHA1', 'MD5'],
          },
          schemaPath: '#/definitions/Attachment/properties/HashAlgorithm/enum',
        },
      ],
    },
  ];

  it('should validate schema', async () => {
    const ajv = createAjvInstance();
    const validateSchema = ajv.compile(localSchema);
    expect(() => validateSchema()).not.toThrow();
  });

  validCertTestSuitesMap.forEach(({ certificateName }) => {
    it(`${certificateName} should be a valid certificate`, async () => {
      const certificatePath = resolve(__dirname, `./fixtures/${certificateName}.json`);
      const certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
      const validator = await createAjvInstance().compileAsync(localSchema);
      //
      const isValid = await validator(certificate);
      expect(isValid).toBe(true);
      expect(validator.errors).toBeNull();
    });
  });

  invalidCertTestSuitesMap.forEach(({ certificateName, expectedErrors }) => {
    it(`${certificateName} should be an invalid certificate`, async () => {
      const certificatePath = resolve(__dirname, `./fixtures/${certificateName}.json`);
      const certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
      const validator = await createAjvInstance().compileAsync(localSchema);
      //
      const isValid = await validator(certificate);
      expect(isValid).toBe(false);
      expect(validator.errors).toEqual(expectedErrors);
    });
  });
});
