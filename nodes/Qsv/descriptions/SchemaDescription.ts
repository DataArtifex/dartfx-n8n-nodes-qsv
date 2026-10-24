import type { INodeProperties } from 'n8n-workflow';

export const SchemaDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['schema'],
      },
    },
  },

  {
    displayName: 'Output File Path',
    name: 'outputPath',
    type: 'string',
    default: '',
    description: 'Optional path to write output file directly to disk (if omitted, results are returned in node output)',
    displayOptions: {
      show: {
        operation: ['schema'],
      },
    },
  },
  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv schema [⚡ Runs faster when CSV index (.qsv.idx) is present.] (Docs: https://github.com/dathere/qsv/blob/master/docs/help/schema.md)',
    displayOptions: {
      show: {
        operation: ['schema'],
      },
    },
  },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        operation: ['schema'],
      },
    },
    options: [
    {
      displayName: 'Dates Whitelist',
      name: 'datesWhitelist',
      type: 'string',
      default: 'date,time,due,open,close,created',
      description: 'The case-insensitive patterns to look for when shortlisting fields for date inference. i.e. if the field\'s name has any of these patterns, it is shortlisted for date inferencing. Set to "all" to inspect ALL fields for date/datetime types.',
    },
    {
      displayName: 'Delimiter',
      name: 'delimiter',
      type: 'string',
      default: '',
      description: 'The field delimiter for reading CSV data. Must be a single character.',
    },
    {
      displayName: 'Enum Threshold',
      name: 'enumThreshold',
      type: 'number',
      default: 50,
      description: 'Cardinality threshold for adding enum constraints. Enum constraints are compiled for String & Integer types.',
    },
    {
      displayName: 'Force',
      name: 'force',
      type: 'boolean',
      default: false,
      description: 'Force recomputing cardinality and unique values even if stats cache file exists and is current.',
    },
    {
      displayName: 'Ignore Case',
      name: 'ignoreCase',
      type: 'boolean',
      default: false,
      description: 'Ignore case when compiling unique values for enum constraints. String columns are then checked against the enum threshold by their case-insensitive cardinality. As the `validate` command is case-sensitive, the enum & const constraints of String columns are written as equivalent case-insensitive regex patterns instead (e.g. "^(?i:false|true)$"). These use the inline `(?i:...)` modifier, which other JSON Schema validators may not support, e.g. on older JavaScript engines.',
    },
    {
      displayName: 'Memcheck',
      name: 'memcheck',
      type: 'boolean',
      default: false,
      description: 'Check if there is enough memory to load the entire CSV into memory using CONSERVATIVE heuristics.',
    },
    {
      displayName: 'No Headers',
      name: 'noHeaders',
      type: 'boolean',
      default: false,
      description: 'When set, the first row will not be interpreted as headers. Namely, it will be processed with the rest of the rows. Otherwise, the first row will always appear as the header row in the output.',
    },
    {
      displayName: 'Pattern Columns',
      name: 'patternColumns',
      type: 'string',
      default: '',
      description: 'Select columns to derive regex pattern constraints. That is, this will create a regular expression that matches all values for each specified column. Columns are selected using `select` syntax (see `qsv select --help` for details).',
    },
    {
      displayName: 'Polars',
      name: 'polars',
      type: 'boolean',
      default: false,
      description: 'Infer a Polars schema instead of a JSON Schema. This option is only available if the `polars` feature is enabled. The generated Polars schema will be written to a file with the `.pschema.json` suffix appended to the input filename.',
    },
    {
      displayName: 'Prefer Dmy',
      name: 'preferDmy',
      type: 'boolean',
      default: false,
      description: 'Prefer to parse dates in dmy format. Otherwise, use mdy format.',
    },
    {
      displayName: 'Stdout',
      name: 'stdout',
      type: 'boolean',
      default: false,
      description: 'Send generated JSON schema file to stdout instead.',
    },
    {
      displayName: 'Strict Dates',
      name: 'strictDates',
      type: 'boolean',
      default: false,
      description: 'Enforce Internet Datetime format (RFC-3339) for detected date/datetime columns. Otherwise, even if columns are inferred as date/datetime, they are set to type "string" in the schema instead of "date" or "date-time".',
    },
    {
      displayName: 'Strict Formats',
      name: 'strictFormats',
      type: 'boolean',
      default: false,
      description: 'Enforce JSON Schema format constraints for detected email, hostname, and IP address columns. When enabled, String fields are checked against email, hostname, IPv4, and IPv6 formats. Format constraints are only added if ALL unique values in the field match the detected format.',
    },
    ],
  },
];
