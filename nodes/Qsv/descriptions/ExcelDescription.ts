import type { INodeProperties } from 'n8n-workflow';

export const ExcelDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['excel'],
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
        operation: ['excel'],
      },
    },
  },
  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv excel (Docs: https://github.com/dathere/qsv/blob/master/docs/help/excel.md)',
    displayOptions: {
      show: {
        operation: ['excel'],
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
        operation: ['excel'],
      },
    },
    options: [
    {
      displayName: 'Cell',
      name: 'cell',
      type: 'string',
      default: '',
      description: 'A single cell reference - like C3 or \'Sheet1!C3\' to extract. This is a convenience option equivalent to --range C3:C3. If both --cell and --range are specified, --cell takes precedence.',
    },
    {
      displayName: 'Date Format',
      name: 'dateFormat',
      type: 'string',
      default: '',
      description: 'Optional date format to use when formatting dates. See https://docs.rs/chrono/latest/chrono/format/strftime/index.html for the full list of supported format specifiers. Note that if a date format is invalid, qsv will fall back and return the date as if no date-format was specified.',
    },
    {
      displayName: 'Delimiter',
      name: 'delimiter',
      type: 'string',
      default: '',
      description: 'The delimiter to use when writing CSV data. Must be a single character. (default: ,)',
    },
    {
      displayName: 'Error Format',
      name: 'errorFormat',
      type: 'string',
      default: 'code',
      description: 'The format to use when formatting error cells. There are 3 formats: * "code": return the error code. (#DIV/0!; #N/A; #NAME?; #NULL!; #NUM!; #REF!; #VALUE!; #DATA!) * "formula": return the formula, prefixed with \'#\'. (e.g. #=A1/B1 where B1 is 0; #=100/0) * "both": return both error code and the formula. (e.g. #DIV/0!: =A1/B1)',
    },
    {
      displayName: 'Flexible',
      name: 'flexible',
      type: 'boolean',
      default: false,
      description: 'Continue even if the number of columns is different from row to row.',
    },
    {
      displayName: 'Header Row',
      name: 'headerRow',
      type: 'number',
      default: 0,
      description: 'The header row. Set if other than the first non-empty row of the sheet.',
    },
    {
      displayName: 'Keep Zero Time',
      name: 'keepZeroTime',
      type: 'boolean',
      default: false,
      description: 'Keep the time part of a date-time field if it is 00:00:00. By default, qsv will remove the time part if it is 00:00:00.',
    },
    {
      displayName: 'Metadata',
      name: 'metadata',
      type: 'string',
      default: 'none',
      description: 'Outputs workbook metadata in CSV or JSON format: index, sheet_name, type, visible, headers, column_count, row_count, safe_headers, safe_headers_count, unsafe_headers, unsafe_headers_count and duplicate_headers_count, names, name_count, tables, table_count. headers is a list of the first row which is presumed to be the header row. type is the sheet type (WorkSheet, DialogSheet, MacroSheet, ChartSheet, Vba). visible is the sheet visibility (Visible, Hidden, VeryHidden). row_count includes all rows, including the first row. safe_headers is a list of headers with "safe"(PostgreSQL-ready) names. unsafe_headers is a list of headers with "unsafe" names. duplicate_headers_count is a count of duplicate header names. names is a list of defined names in the workbook, with the associated formula. name_count is the number of defined names in the workbook. tables is a list of tables in the workbook, along with the sheet where the table is found, the columns and the column_count.  (XLSX only) table_count is the number of tables in the workbook.  (XLSX only)',
    },
    {
      displayName: 'Range',
      name: 'range',
      type: 'string',
      default: '',
      description: 'An Excel format range - like RangeName, C:T, C3:T25 or \'Sheet1!C3:T25\' to extract to the CSV. If the specified range contains the required sheet, the --sheet option is ignored. If the range is not found, qsv will exit with an error.',
    },
    {
      displayName: 'Sheet',
      name: 'sheet',
      type: 'string',
      default: '0',
      description: 'Name (case-insensitive) or zero-based index of sheet to export. Negative indices start from the end (-1 = last sheet). If the sheet cannot be found, qsv will read the first sheet.',
    },
    {
      displayName: 'Table',
      name: 'table',
      type: 'string',
      default: '',
      description: 'An Excel table (case-insensitive) to extract to a CSV. Only valid for XLSX files. The --sheet option is ignored as a table could be in any sheet. Overrides --range option.',
    },
    {
      displayName: 'Trim',
      name: 'trim',
      type: 'boolean',
      default: false,
      description: 'Trim all fields so that leading & trailing whitespaces are removed. Also removes embedded linebreaks.',
    },
    ],
  },
];
