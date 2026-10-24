import type { INodeProperties } from 'n8n-workflow';

export const PivotpDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['pivotp'],
      },
    },
  },
  {
    displayName: 'On Columns',
    name: 'onCols',
    type: 'string',
    required: false,
    default: '',
    description: 'The column(s) to pivot on (creates new columns). When omitted, pivotp runs in group-by mode.',
    displayOptions: {
      show: {
        operation: ['pivotp'],
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
        operation: ['pivotp'],
      },
    },
  },
  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv pivotp (Docs: https://github.com/dathere/qsv/blob/master/docs/help/pivotp.md)',
    displayOptions: {
      show: {
        operation: ['pivotp'],
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
        operation: ['pivotp'],
      },
    },
    options: [
    {
      displayName: 'Agg',
      name: 'agg',
      type: 'string',
      default: 'smart',
      description: 'The aggregation function to use: first - First value encountered last - Last value encountered sum - Sum of values min - Minimum value max - Maximum value mean - Average value median - Median value quantile@<p> - Quantile at probability p in [0, 1] using linear interpolation. Alias: q@<p>. Examples: quantile@0.95, q@0.5 (q@0.5 is equivalent to median for even-length groups). len - Count of values item - Get single value from group. Raises error if there are multiple values. smart - use value column data type & statistics to pick an aggregation. Always uses type, cardinality, sparsity, CV, sign distribution (n_negative/n_positive), and sort_order from streaming stats. High variability means a CV above 100% (stddev > mean). When the stats cache includes non-streaming stats (from a prior `stats --everything` or `stats --mode`), also uses mode_count. With a single --values column, smart first runs moarstats --advanced to enrich the input\'s stats cache (writing <stem>.stats.csv, .stats.csv.json and .stats.csv.data.jsonl beside it) unless the cache already has those stats. This one-time pass reads the whole file; skip it with --no-moarstats. It is also skipped with an explicit --delimiter, stdin and special formats. The moarstats stats used are outlier profile, Pearson skewness, MAD/stddev ratio, median/mean ratio and quartile coefficient of dispersion (the two ratios only for positive data), moment skewness (|G1| >= 1 picks median; Pearson skewness is the fallback), kurtosis, bimodality (bimodality coefficient >= 0.60 with negative excess kurtosis), entropy and Gini coefficient. A single-value column uses first. The choice depends on the data, so pass an explicit --agg to pin a result across qsv versions. For Date/DateTime values, checks sparsity and sort order. Will only work if there is one value column, otherwise it falls back to `first`',
    },
    {
      displayName: 'Col Separator',
      name: 'colSeparator',
      type: 'string',
      default: '_',
      description: 'The separator in generated column names in case of multiple --values columns. (pivot mode only; ignored in group-by mode)',
    },
    {
      displayName: 'Decimal Comma',
      name: 'decimalComma',
      type: 'boolean',
      default: false,
      description: 'Use comma as decimal separator when READING the input. Note that you will need to specify an alternate --delimiter.',
    },
    {
      displayName: 'Delimiter',
      name: 'delimiter',
      type: 'string',
      default: '',
      description: 'The field delimiter for reading/writing CSV data. Must be a single character. If not set, QSV_DEFAULT_DELIMITER is used, else \',\'. A .tsv/.tab (tab) or .ssv (semicolon) extension on the input or --output file sets that file\'s delimiter. (default: ,)',
    },
    {
      displayName: 'Grand Total',
      name: 'grandTotal',
      type: 'boolean',
      default: false,
      description: 'Append a grand total row summing all numeric non-index columns. The first index column will contain "Grand <total-label>".',
    },
    {
      displayName: 'Ignore Errors',
      name: 'ignoreErrors',
      type: 'boolean',
      default: false,
      description: 'Skip rows that can\'t be parsed.',
    },
    {
      displayName: 'Index',
      name: 'index',
      type: 'string',
      default: '',
      description: 'The column(s) to use as the index (row labels). Specify multiple columns by separating them with a comma. The output will have one row for each unique combination of the index\'s values. In pivot mode, if None, all remaining columns not specified on --on and --values will be used; at least one of --index and --values must be specified. Required in group-by mode.',
    },
    {
      displayName: 'Infer Len',
      name: 'inferLen',
      type: 'number',
      default: 10000,
      description: 'Number of rows to scan when inferring schema. Set to 0 to scan entire file.',
    },
    {
      displayName: 'Maintain Order',
      name: 'maintainOrder',
      type: 'boolean',
      default: false,
      description: 'Accepted for compatibility. Output is always in first-appearance order: rows follow their index values\' first appearance and pivoted columns their <on-cols> values\' first appearance.',
    },
    {
      displayName: 'Max Columns',
      name: 'maxColumns',
      type: 'number',
      default: 100000,
      description: 'Maximum number of columns the pivot may create before it is refused. Guards against pivoting on a high-cardinality column, which can exhaust memory. Unlike --validate, this ALWAYS runs. Set to 0 for no limit, for a deliberately wide pivot. (pivot mode only; ignored in group-by mode)',
    },
    {
      displayName: 'No Moarstats',
      name: 'noMoarstats',
      type: 'boolean',
      default: false,
      description: 'For smart aggregation, do not run moarstats --advanced to enrich the stats cache. Smart aggregation then uses whatever stats are already cached (or basic `stats --cardinality` stats).',
    },
    {
      displayName: 'Sort Columns',
      name: 'sortColumns',
      type: 'boolean',
      default: false,
      description: 'Sort the transposed columns by name. (pivot mode only)',
    },
    {
      displayName: 'Subtotal',
      name: 'subtotal',
      type: 'boolean',
      default: false,
      description: 'Insert subtotal rows after each group in the first index column. The second index column will contain the total label. Requires 2+ index columns. (pivot mode only)',
    },
    {
      displayName: 'Total Label',
      name: 'totalLabel',
      type: 'string',
      default: 'Total',
      description: 'Custom label for total rows.',
    },
    {
      displayName: 'Try Parsedates',
      name: 'tryParsedates',
      type: 'boolean',
      default: false,
      description: 'When set, will attempt to parse columns as dates.',
    },
    {
      displayName: 'Validate',
      name: 'validate',
      type: 'boolean',
      default: false,
      description: 'Report the pivot column(s)\' cardinality before pivoting. Informational only - it does not refuse a pivot; --max-columns does that. (pivot mode only)',
    },
    {
      displayName: 'Values',
      name: 'values',
      type: 'string',
      default: '',
      description: 'The column(s) containing values to aggregate. If an aggregation is specified, these are the values on which the aggregation will be computed. In pivot mode, if None, all remaining columns not specified on --on and --index will be used; at least one of --index and --values must be specified. In group-by mode, if omitted, a single "count" column is produced.',
    },
    ],
  },
];
