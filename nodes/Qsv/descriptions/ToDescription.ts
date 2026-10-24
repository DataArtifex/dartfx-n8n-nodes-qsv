import type { INodeProperties } from 'n8n-workflow';

export const ToDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['to'],
      },
    },
  },
  {
    displayName: 'Target Format',
    name: 'format',
    type: 'options',
    required: true,
    default: 'datapackage',
    options: [
        { name: 'datapackage', value: 'datapackage' },
        { name: 'ods', value: 'ods' },
        { name: 'parquet', value: 'parquet' },
        { name: 'postgres', value: 'postgres' },
        { name: 'sqlite', value: 'sqlite' },
        { name: 'xlsx', value: 'xlsx' },
    ],
    description: 'Subcommand to execute. Valid values: datapackage, ods, parquet, postgres, sqlite, xlsx',
    displayOptions: {
      show: {
        operation: ['to'],
      },
    },
  },
  {
    displayName: 'Destination',
    name: 'destination',
    type: 'string',
    required: true,
    default: '',
    description: 'The output target, which varies by subcommand: * parquet: output directory (created if needed) * postgres: connection string or env=VAR_NAME (with --dump: dump file path or - for stdout) * sqlite: database file path (with --dump: dump file path or - for stdout) * xlsx: output .xlsx file path * ods: output .ods file path * datapackage: output .json file path',
    displayOptions: {
      show: {
        operation: ['to'],
      },
    },
  },

  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv to (Docs: https://github.com/dathere/qsv/blob/master/docs/help/to.md)',
    displayOptions: {
      show: {
        operation: ['to'],
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
        operation: ['to'],
      },
    },
    options: [
    {
      displayName: 'All Strings',
      name: 'allStrings',
      type: 'boolean',
      default: false,
      description: 'Convert all fields to strings. For parquet, columns are read as strings without type inference, so the inference length and any pschema.json are not used.',
    },
    {
      displayName: 'Compress Level',
      name: 'compressLevel',
      type: 'number',
      default: 0,
      description: 'Compression level (parquet only). For gzip: 1-9 (default: 6). For zstd: -7 to 22 (default: 3). Ignored for other codecs.',
    },
    {
      displayName: 'Compression',
      name: 'compression',
      type: 'string',
      default: '',
      description: 'Parquet compression codec (parquet only). Valid values: zstd (default), gzip, snappy, lz4raw, uncompressed.',
    },
    {
      displayName: 'Delimiter',
      name: 'delimiter',
      type: 'string',
      default: '',
      description: 'The field delimiter for reading CSV data. Must be a single character. (default: ,)',
    },
    {
      displayName: 'Drop',
      name: 'drop',
      type: 'boolean',
      default: false,
      description: 'Drop tables before loading new data into them (postgres/sqlite only).',
    },
    {
      displayName: 'Dump',
      name: 'dump',
      type: 'boolean',
      default: false,
      description: 'Create database dump file for use with `psql` or `sqlite3` command line tools (postgres/sqlite only).',
    },
    {
      displayName: 'Evolve',
      name: 'evolve',
      type: 'boolean',
      default: false,
      description: 'If loading into existing db, alter existing tables so that new data will load. (postgres/sqlite only).',
    },
    {
      displayName: 'Infer Len',
      name: 'inferLen',
      type: 'number',
      default: 0,
      description: 'The number of rows to use for schema inference (parquet only). Note that even if a pschema.json file exists for an input file, explicitly specifying infer-len will cause qsv to ignore the pschema.json and infer the schema from the CSV data instead, including when set to 0. Set to 0 to infer from all rows (not recommended for large files).',
    },
    {
      displayName: 'Pipe',
      name: 'pipe',
      type: 'boolean',
      default: false,
      description: 'Adjust output format for piped data (omits row counts and field format columns).',
    },
    {
      displayName: 'Print Package',
      name: 'printPackage',
      type: 'boolean',
      default: false,
      description: 'Print statistics as datapackage, by default will print field summary.',
    },
    {
      displayName: 'Schema',
      name: 'schema',
      type: 'string',
      default: '',
      description: 'The schema to load the data into. (postgres only).',
    },
    {
      displayName: 'Separator',
      name: 'separator',
      type: 'string',
      default: '',
      description: 'For xlsx, use this character to help truncate xlsx sheet names. Defaults to space.',
    },
    {
      displayName: 'Stats',
      name: 'stats',
      type: 'boolean',
      default: false,
      description: 'Produce extra statistics about the data beyond just type guessing.',
    },
    {
      displayName: 'Stats Csv',
      name: 'statsCsv',
      type: 'string',
      default: '',
      description: 'Output stats as CSV to specified file.',
    },
    {
      displayName: 'Table',
      name: 'table',
      type: 'string',
      default: '',
      description: 'Use this as the table/sheet/file name (postgres/sqlite/xlsx/ods/parquet). Overrides the default name derived from the input filename. When reading from stdin, the default table name is "stdin". Only valid with a single input file. For postgres/sqlite: must start with a letter or underscore, contain only alphanumeric characters and underscores (max 63). For xlsx/ods: used as sheet name (max 31 chars, cannot contain \\ / * [ ] : ?).',
    },
    {
      displayName: 'Try Parse Dates',
      name: 'tryParseDates',
      type: 'boolean',
      default: false,
      description: 'Attempt to parse date/datetime columns with polars\' date inference logic. This may result in more accurate date parsing, but can be slower on large files. (parquet only).',
    },
    ],
  },
];
