import type { INodeProperties } from 'n8n-workflow';

export const GeoconvertDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['geoconvert'],
      },
    },
  },
  {
    displayName: 'Input Format',
    name: 'inputFormat',
    type: 'string',
    required: true,
    default: '',
    description: 'Valid values are "geojson", "shp", and "csv"',
    displayOptions: {
      show: {
        operation: ['geoconvert'],
      },
    },
  },
  {
    displayName: 'Output Format',
    name: 'outputFormat',
    type: 'string',
    required: true,
    default: '',
    description: 'Valid values are:',
    displayOptions: {
      show: {
        operation: ['geoconvert'],
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
        operation: ['geoconvert'],
      },
    },
  },
  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv geoconvert (Docs: https://github.com/dathere/qsv/blob/master/docs/help/geoconvert.md)',
    displayOptions: {
      show: {
        operation: ['geoconvert'],
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
        operation: ['geoconvert'],
      },
    },
    options: [
    {
      displayName: 'Delimiter',
      name: 'delimiter',
      type: 'string',
      default: '',
      description: 'The field delimiter for reading CSV input. Must be a single character. (default: ,)',
    },
    {
      displayName: 'Geometry',
      name: 'geometry',
      type: 'string',
      default: '',
      description: 'The name of the column that has WKT geometry. Alternative to --latitude and --longitude.',
    },
    {
      displayName: 'Latitude',
      name: 'latitude',
      type: 'string',
      default: '',
      description: 'The name of the column with northing values.',
    },
    {
      displayName: 'Longitude',
      name: 'longitude',
      type: 'string',
      default: '',
      description: 'The name of the column with easting values.',
    },
    {
      displayName: 'Max Length',
      name: 'maxLength',
      type: 'number',
      default: 0,
      description: 'The maximum column length in bytes when the output format is CSV. Oftentimes, the geometry column is too long to fit in a CSV file, causing other tools like Python & PostgreSQL to fail. If a column is too long, it will be truncated to the specified length and an ellipsis ("...") will be appended, so a truncated value is up to 3 bytes longer.',
    },
    ],
  },
];
