import type { INodeProperties } from 'n8n-workflow';

export const TemplateDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['template'],
      },
    },
  },
  {
    displayName: 'Output Directory',
    name: 'outdir',
    type: 'string',
    required: true,
    default: '',
    description: 'The directory where the output files will be written. If it does not exist, it will be created. If not set, output will be sent to stdout or the specified --output. When writing to <outdir>, files are organized into subdirectories of --outsubdir-size (default: 1000) files each to avoid filesystem navigation & performance issues. For example, with 3500 records: * <outdir>/0000/0001.txt through <outdir>/0000/1000.txt * <outdir>/0001/1001.txt through <outdir>/0001/2000.txt * <outdir>/0002/2001.txt through <outdir>/0002/3000.txt * <outdir>/0003/3001.txt through <outdir>/0003/4000.txt template options:',
    displayOptions: {
      show: {
        operation: ['template'],
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
        operation: ['template'],
      },
    },
  },
  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv template [⚡ Runs faster when CSV index (.qsv.idx) is present.] (Docs: https://github.com/dathere/qsv/blob/master/docs/help/template.md)',
    displayOptions: {
      show: {
        operation: ['template'],
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
        operation: ['template'],
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
      displayName: 'Cache Dir',
      name: 'cacheDir',
      type: 'string',
      default: '~/.qsv-cache',
      description: 'The directory to use for caching downloaded lookup resources. If the directory does not exist, qsv will attempt to create it. If the QSV_CACHE_DIR envvar is set, it will be used instead.',
    },
    {
      displayName: 'Ckan Api',
      name: 'ckanApi',
      type: 'string',
      default: 'https://data.dathere.com/api/3/action',
      description: 'The URL of the CKAN API to use for downloading lookup resources with the "ckan://" scheme. If the QSV_CKAN_API envvar is set, it will be used instead.',
    },
    {
      displayName: 'Customfilter Error',
      name: 'customfilterError',
      type: 'string',
      default: '<FILTER_ERROR>',
      description: 'The value to return when a custom filter returns an error. Use "<empty string>" to return an empty string.',
    },
    {
      displayName: 'Delimiter',
      name: 'delimiter',
      type: 'string',
      default: '',
      description: 'Field separator for reading CSV (default: ,)',
    },
    {
      displayName: 'Globals Json',
      name: 'globalsJson',
      type: 'string',
      default: '',
      description: 'A JSON file containing global variables to make available in templates. The JSON properties can be accessed in templates using the "qsv_g" namespace (e.g. {{qsv_g.school_name}}, {{qsv_g.year}}). This allows sharing common values across all template renders.',
    },
    {
      displayName: 'No Headers',
      name: 'noHeaders',
      type: 'boolean',
      default: false,
      description: 'When set, the first row will not be interpreted as headers. Templates must use numeric 1-based indices with the "_c" prefix. (e.g. col1: {{_c1}} col2: {{_c2}})',
    },
    {
      displayName: 'Outfilename',
      name: 'outfilename',
      type: 'string',
      default: 'QSV_ROWNO',
      description: 'MiniJinja template string to use to create the filename of the output files to write to <outdir>. If set to just QSV_ROWNO, the filestem is set to the current rowno of the record, padded with leading zeroes, with the ".txt" extension (e.g. 001.txt, 002.txt, etc.) Note that all the fields, including QSV_ROWNO, are available when defining the filename template.',
    },
    {
      displayName: 'Outsubdir Size',
      name: 'outsubdirSize',
      type: 'number',
      default: 1000,
      description: 'The number of files per subdirectory in <outdir>.',
    },
    {
      displayName: 'Template',
      name: 'template',
      type: 'string',
      default: '',
      description: 'MiniJinja template string to use (alternative to --template-file)',
    },
    {
      displayName: 'Template File',
      name: 'templateFile',
      type: 'string',
      default: '',
      description: 'MiniJinja template file to use',
    },
    {
      displayName: 'Timeout',
      name: 'timeout',
      type: 'number',
      default: 30,
      description: 'Timeout for downloading lookups on URLs.',
    },
    ],
  },
];
