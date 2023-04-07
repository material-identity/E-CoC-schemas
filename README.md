## E-COC-schemas

[![E-CoC Schema CI](https://github.com/material-identity/E-CoC-schemas/actions/workflows/ci.yml/badge.svg)](https://github.com/material-identity/E-CoC-schemas/actions/workflows/ci.yml)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B18065%2Fgithub.com%2Fmaterial-identity%2FE-CoC-schemas.svg?type=shield)](https://app.fossa.com/projects/custom%2B18065%2Fgithub.com%2Fmaterial-identity%2FE-CoC-schemas?ref=badge_shield)

The e-CoC.schema.json is a reimplementation of [e-coc.org schema](https://e-coc.org/schema/v1.0.0/e-coc.json).
This repository contains translations and templates used for HTML / PDF rendering of E-CoC certificates.

Following changes were applied :

- In `TechnicalProperties`.`value` property replace `oneOf` by `anyOf` (since can contain anyOf those enumerated types ) and adding the following possible type ( that was used in some example certificates )

```json
{
  "type": "array",
  "maxItems": 6,
  "minItems": 1,
  "items": {
    "type": "string"
  }
}
```

- In `EcocData` property, the references union (`DataLevelA`, `DataLevelB`, `DataLevelC`) is replaced by `DataLevel` reference, for clarity and easier validation (since properties are not required in `DataLevel` definition in the original version).

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "DataLevel": {
      "enum": ["A", "B", "C"]
    },
    "Data": {
      "$ref": "#/definitions/HigherDataLevel"
    },
    "Results": {
      "$ref": "#/definitions/Results"
    }
  },
  "allOf": [
    {
      "if": {
        "properties": { "DataLevel": { "const": "A" } }
      },
      "then": {
        "properties": {
          "Data": { "default": null },
          "Results": { "default": null }
        }
      }
    },
    {
      "if": {
        "properties": { "DataLevel": { "const": "B" } }
      },
      "then": {
        "properties": {
          "Data": { "$ref": "#/definitions/HigherDataLevel" },
          "Results": { "default": null }
        }
      }
    },
    {
      "if": {
        "properties": { "DataLevel": { "const": "C" } }
      },
      "then": {
        "properties": {
          "Data": { "$ref": "#/definitions/HigherDataLevel" },
          "Results": { "$ref": "#/definitions/Results" }
        }
      }
    }
  ],
  "required": ["DataLevel"]
}
```

## TODO

- in `Declaration`:
  if `ConformityStatus` = WithConcessions, `Concessions` should be required

- in `Party`:
  if `CompanyIdentifier` only allow "DUNS", "VATID", "CageCode", which are absolute identifier
  and separate "CustomerNo", "SupplierNo" in a new property

- in `ObjectOfDeclaration`:
  rename `Object` to `ObjectOfDeclarationItem` ?

- in `Results`
  requires at least oneOf `MaterialCertification` or `ChemicalAnalysis`

Add some descriptions!

## License

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B18065%2Fgithub.com%2Fmaterial-identity%2FE-CoC-schemas.svg?type=large)](https://app.fossa.com/projects/custom%2B18065%2Fgithub.com%2Fmaterial-identity%2FE-CoC-schemas?ref=badge_large)
