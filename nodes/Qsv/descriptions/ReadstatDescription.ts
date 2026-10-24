import type { INodeProperties } from 'n8n-workflow';

export const ReadstatDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['readstat'],
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
        operation: ['readstat'],
      },
    },
  },
  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv readstat [⚠️ High memory operation.] (Docs: https://github.com/dathere/qsv/blob/master/docs/help/readstat.md)',
    displayOptions: {
      show: {
        operation: ['readstat'],
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
        operation: ['readstat'],
      },
    },
    options: [
    {
      displayName: 'Batch',
      name: 'batch',
      type: 'number',
      default: 50000,
      description: 'Number of rows to read into memory at a time. Does not apply to SPSS portable (.por) files - they have no chunked reader upstream, so they are read whole & memory scales with the file. Nor does it apply to .sav & .zsav files while their sentinels are tracked, which also reads them whole: with the option --sentinels-as value or label, or by the sentinel check when a variable declares missing values & the file holds at most about 128 MB of data (see --sentinels-as none).',
    },
    {
      displayName: 'Compress Numeric',
      name: 'compressNumeric',
      type: 'boolean',
      default: false,
      description: 'Write float variables that only ever hold whole numbers as integers, without the ".0" (e.g. 3.0 becomes 3). SPSS stores every number as a float, so this matters most for SPSS files. It is decided per variable, over the rows written: one value like 2.5 keeps the ".0" on every row of that variable. The file is read twice - once to check the values. With sentinel labels embedded, a variable with a label that reads as a number (e.g. "1.0") keeps its ".0", so the label is not rewritten.',
    },
    {
      displayName: 'Delimiter',
      name: 'delimiter',
      type: 'string',
      default: '',
      description: 'The delimiter to use when writing CSV data. Must be a single character. (default: ,)',
    },
    {
      displayName: 'Dictionary',
      name: 'dictionary',
      type: 'string',
      default: '',
      description: 'Also write a JSON Schema data dictionary of the CSV written to <file>. Name it <stem>.schema.json after the CSV & \'qsv viz smart\' finds it on its own. It describes the data as written, so the other options shape it too: the types follow the option --compress-numeric, the enums follow --value-labels, & so on.',
    },
    {
      displayName: 'Limit',
      name: 'limit',
      type: 'number',
      default: 0,
      description: 'Write at most <n> rows, counted after the rows skipped by --offset.',
    },
    {
      displayName: 'Metadata',
      name: 'metadata',
      type: 'string',
      default: 'none',
      description: 'Dump variable metadata instead of the data. Valid values: none, csv, json, pretty-json. For SAS, the value labels are included when a format catalog is used (see --value-labels).',
    },
    {
      displayName: 'Offset',
      name: 'offset',
      type: 'number',
      default: 0,
      description: 'Skip the first <n> rows.',
    },
    {
      displayName: 'Sample',
      name: 'sample',
      type: 'number',
      default: 0,
      description: 'Write a random sample of <n> rows, in file order, drawn from the rows --offset & --limit select. If there are no more than <n> such rows, all of them are written.',
    },
    {
      displayName: 'Sas7bcat',
      name: 'sas7bcat',
      type: 'string',
      default: '',
      description: 'The SAS format catalog (.sas7bcat) holding the value labels of a .sas7bdat file, for use by the options --value-labels, --sentinels-as label & --metadata. It only names the catalog, so the data needs one of the first two.',
    },
    {
      displayName: 'Seed',
      name: 'seed',
      type: 'number',
      default: 0,
      description: 'Seed the random number generator of --sample, so the same sample is drawn every time.',
    },
    {
      displayName: 'Select',
      name: 'select',
      type: 'string',
      default: '',
      description: 'The variables to read, in the order given, using qsv\'s select syntax: names, 1-based indices, ranges (q1-q20) & /regex/, or a leading ! to read every variable except those listed. See \'qsv select --help\' for the full syntax. Variables left out are skipped by the reader. Also applies to the option --metadata, which then lists only these variables.',
    },
    {
      displayName: 'Sentinels As',
      name: 'sentinelsAs',
      type: 'string',
      default: '',
      description: 'Keep sentinels instead of writing them as empty cells. Each eligible variable gets a <name>_null column right after it, holding the sentinel of each row that has one & empty otherwise. Valid values: none, value, label. none  - write them as empty cells, without the check & its warning. value - the sentinel\'s code (e.g. .A or 99). label - the sentinel\'s value label if it has one, else its code. label labels only the sentinels: other values stay codes unless --value-labels is also given. SAS takes its sentinel labels from the format catalog, found as for --value-labels. For SPSS, value cannot be combined with --value-labels. Not supported for .xpt & .por files. Tracking sentinels reads files on a single thread, so the option --jobs has no effect, and reads SPSS .sav & .zsav files whole (see --batch).',
    },
    {
      displayName: 'Sentinels Columns',
      name: 'sentinelsColumns',
      type: 'string',
      default: '',
      description: 'Comma-separated variables to keep sentinels for. Requires --sentinels-as. By default, every eligible variable: the numeric ones for SAS & Stata, those with declared missing values for SPSS.',
    },
    {
      displayName: 'Sentinels Embedded',
      name: 'sentinelsEmbedded',
      type: 'boolean',
      default: false,
      description: 'Write each sentinel into its variable\'s own column instead of a <name>_null column. Those columns then mix numbers & sentinels. Requires --sentinels-as.',
    },
    {
      displayName: 'Value Labels',
      name: 'valueLabels',
      type: 'boolean',
      default: false,
      description: 'Decode coded values to their label strings (e.g. 1 becomes "Male") instead of writing the underlying codes. For SAS .sas7bdat files, the labels come from the format catalog: the file named by --sas7bcat, else <name>.sas7bcat or formats.sas7bcat next to the data file. Not supported for .xpt files.',
    },
    ],
  },
];
