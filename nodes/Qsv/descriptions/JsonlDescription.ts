import type { INodeProperties } from 'n8n-workflow';

export const JsonlDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['jsonl'],
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
        operation: ['jsonl'],
      },
    },
  },
  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv jsonl (Docs: https://github.com/dathere/qsv/blob/master/docs/help/jsonl.md)',
    displayOptions: {
      show: {
        operation: ['jsonl'],
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
        operation: ['jsonl'],
      },
    },
    options: [
    {
      displayName: 'Batch',
      name: 'batch',
      type: 'number',
      default: 50000,
      description: 'The number of rows per batch to load into memory, before running in parallel. Set to 0 to load all rows in one batch.',
    },
    {
      displayName: 'Delimiter',
      name: 'delimiter',
      type: 'string',
      default: '',
      description: 'The delimiter to use when writing CSV data. Must be a single character. (default: ,)',
    },
    {
      displayName: 'Ignore Errors',
      name: 'ignoreErrors',
      type: 'boolean',
      default: false,
      description: 'Skip malformed input lines.',
    },
    ],
  },
];
