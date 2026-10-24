import type { INodeProperties } from 'n8n-workflow';

export const ScoresqlDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['scoresql'],
      },
    },
  },
  {
    displayName: 'SQL Query',
    name: 'sql',
    type: 'string',
    required: true,
    default: '',
    description: 'The SQL query to score/analyze. If the query ends with ".sql", it will be read as a SQL script file, with single-line "--" comments stripped. If the script has multiple queries separated by ";", only the last non-empty query is scored.',
    displayOptions: {
      show: {
        operation: ['scoresql'],
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
        operation: ['scoresql'],
      },
    },
  },
  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv scoresql (Docs: https://github.com/dathere/qsv/blob/master/docs/help/scoresql.md)',
    displayOptions: {
      show: {
        operation: ['scoresql'],
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
        operation: ['scoresql'],
      },
    },
    options: [
    {
      displayName: 'Delimiter',
      name: 'delimiter',
      type: 'string',
      default: '',
      description: 'The field delimiter for reading CSV data. Must be a single character. (default: ,)',
    },
    {
      displayName: 'Duckdb',
      name: 'duckdb',
      type: 'boolean',
      default: false,
      description: 'Use DuckDB for query plan analysis instead of Polars. Uses the QSV_DUCKDB_PATH environment variable if set, otherwise looks for "duckdb" in PATH.',
    },
    {
      displayName: 'Ignore Errors',
      name: 'ignoreErrors',
      type: 'boolean',
      default: false,
      description: 'Ignore errors when parsing CSVs.',
    },
    {
      displayName: 'Infer Len',
      name: 'inferLen',
      type: 'number',
      default: 10000,
      description: 'Number of rows to scan when inferring schema.',
    },
    {
      displayName: 'Json',
      name: 'json',
      type: 'boolean',
      default: false,
      description: 'Output results as JSON instead of human-readable report.',
    },
    {
      displayName: 'Truncate Ragged Lines',
      name: 'truncateRaggedLines',
      type: 'boolean',
      default: false,
      description: 'Truncate lines with more fields than the header.',
    },
    {
      displayName: 'Try Parsedates',
      name: 'tryParsedates',
      type: 'boolean',
      default: false,
      description: 'Automatically try to parse dates/datetimes and time.',
    },
    ],
  },
];
