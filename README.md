## E-COC-schemas
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs1seven%2FE-CoC-schemas.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs1seven%2FE-CoC-schemas?ref=badge_shield)


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


## License
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fs1seven%2FE-CoC-schemas.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fs1seven%2FE-CoC-schemas?ref=badge_large)