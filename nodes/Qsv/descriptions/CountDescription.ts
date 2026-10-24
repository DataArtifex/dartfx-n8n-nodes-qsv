import type { INodeProperties } from 'n8n-workflow';

export const CountDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['count'],
      },
    },
  },


  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv count [⚡ Runs faster when CSV index (.qsv.idx) is present.] (Docs: https://github.com/dathere/qsv/blob/master/docs/help/count.md)',
    displayOptions: {
      show: {
        operation: ['count'],
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
        operation: ['count'],
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
      displayName: 'Flexible',
      name: 'flexible',
      type: 'boolean',
      default: false,
      description: 'Do not validate if the CSV has different number of fields per record, increasing performance when counting without an index.',
    },
    {
      displayName: 'Human Readable',
      name: 'humanReadable',
      type: 'boolean',
      default: false,
      description: 'Comma separate counts.',
    },
    {
      displayName: 'Json',
      name: 'json',
      type: 'boolean',
      default: false,
      description: 'Output the width stats in JSON format.',
    },
    {
      displayName: 'No Headers',
      name: 'noHeaders',
      type: 'boolean',
      default: false,
      description: 'When set, the first row will be included in the count.',
    },
    {
      displayName: 'No Polars',
      name: 'noPolars',
      type: 'boolean',
      default: false,
      description: 'Use the "regular", single-threaded, streaming CSV reader instead of the much faster multithreaded, mem-mapped Polars CSV reader. Use this when you encounter memory issues when counting with the Polars CSV reader. The streaming reader is slower but can read any valid CSV file of any size.',
    },
    {
      displayName: 'Width',
      name: 'width',
      type: 'boolean',
      default: false,
      description: 'Also return the estimated widths of each record. Its an estimate as it doesn\'t count quotes, and will be an undercount if the record has quoted fields. The count and width are separated by a semicolon. It will return the max, avg, median, min, variance, stddev & MAD widths, separated by hyphens. If --human-readable is set, the widths will be labeled as "max", "avg", "median", "min", "stddev" & "mad" respectively, separated by spaces. Note that this option will require scanning the entire file using the "regular", single-threaded, streaming CSV reader, using the index if available for the count. If the file is very large, it may not be able to compile some stats - particularly avg, variance, stddev & MAD. In this case, it will return 0.0 for those stats.',
    },
    {
      displayName: 'Width No Delims',
      name: 'widthNoDelims',
      type: 'boolean',
      default: false,
      description: 'Same as --width but does not count the delimiters in the width.',
    },
    ],
  },
];
