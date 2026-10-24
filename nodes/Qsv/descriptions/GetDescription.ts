import type { INodeProperties } from 'n8n-workflow';

export const GetDescription: INodeProperties[] = [
  {
    displayName: 'Input CSV File Path',
    name: 'inputPath',
    type: 'string',
    required: true,
    default: '',
    description: 'Path to input CSV file on disk or host filesystem',
    displayOptions: {
      show: {
        operation: ['get'],
      },
    },
  },
  {
    displayName: 'Subcommand',
    name: 'subcommand',
    type: 'options',
    required: false,
    default: 'cache-clear',
    options: [
        { name: 'cache-clear', value: 'cache-clear' },
        { name: 'cache-fetch', value: 'cache-fetch' },
        { name: 'cache-info', value: 'cache-info' },
        { name: 'cache-list', value: 'cache-list' },
        { name: 'cache-prune', value: 'cache-prune' },
        { name: 'cache-set-policy', value: 'cache-set-policy' },
        { name: 'cache-set-ttl', value: 'cache-set-ttl' },
    ],
    description: 'Subcommand to execute. Valid values: cache-clear, cache-fetch, cache-info, cache-list, cache-prune, cache-set-policy, cache-set-ttl',
    displayOptions: {
      show: {
        operation: ['get'],
      },
    },
  },
  {
    displayName: 'Source',
    name: 'source',
    type: 'string',
    required: false,
    default: '',
    description: 'One or more sources to fetch into the cache.',
    displayOptions: {
      show: {
        operation: ['get'],
      },
    },
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    required: false,
    default: '',
    description: 'For cache-fetch / cache-set-ttl / cache-set-policy: the cached logical name (`dc:` handle) to read or modify. A leading `dc:` prefix is accepted and ignored.',
    displayOptions: {
      show: {
        operation: ['get'],
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
        operation: ['get'],
      },
    },
  },
  {
    displayName: 'Additional Flags',
    name: 'additionalArgs',
    type: 'string',
    default: '',
    description: 'Additional raw command line arguments to pass to qsv get [⚡ Runs faster when CSV index (.qsv.idx) is present.] (Docs: https://github.com/dathere/qsv/blob/master/docs/help/get.md)',
    displayOptions: {
      show: {
        operation: ['get'],
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
        operation: ['get'],
      },
    },
    options: [
    {
      displayName: 'Cache Dir',
      name: 'cacheDir',
      type: 'string',
      default: '~/.qsv-cache',
      description: 'The qsv cache directory. If the QSV_CACHE_DIR envvar is set, it will be used instead.',
    },
    {
      displayName: 'Ckan Api',
      name: 'ckanApi',
      type: 'string',
      default: 'https://data.dathere.com/api/3/action',
      description: 'CKAN Action API base URL. Overrides the QSV_CKAN_API env var.',
    },
    {
      displayName: 'Cloud Opt',
      name: 'cloudOpt',
      type: 'string',
      default: '',
      description: 'Extra cloud object-store config as a `key=value` pair (repeatable), e.g. region=us-east-1 or skip_signature=true. Overrides the AWS_*/AZURE_*/GOOGLE_* environment. (get_cloud only)',
    },
    {
      displayName: 'Compress',
      name: 'compress',
      type: 'string',
      default: 'zstd',
      description: 'Transparent blob compression: zstd or none.',
    },
    {
      displayName: 'Force',
      name: 'force',
      type: 'boolean',
      default: false,
      description: 'Re-fetch even if a fresh cached copy exists.',
    },
    {
      displayName: 'Json',
      name: 'json',
      type: 'boolean',
      default: false,
      description: 'For cache-list/cache-info: output JSON instead of a table.',
    },
    {
      displayName: 'Name',
      name: 'name',
      type: 'string',
      default: '',
      description: 'Logical cache name (the `dc:` handle) for the fetched entry. Defaults to the source\'s terminal path segment. Ignored when multiple sources are given.',
    },
    {
      displayName: 'Offset',
      name: 'offset',
      type: 'number',
      default: 0,
      description: 'PREVIEW: skip ~<mb> megabytes (via an HTTP Range request) before sampling, realigning to the next record boundary. Implies --sample. Requires a Range-capable source.',
    },
    {
      displayName: 'Older Than',
      name: 'olderThan',
      type: 'string',
      default: '',
      description: 'For cache-prune: remove entries older than this age. Accepts seconds, or a value with an s/m/h/d/w suffix (e.g. 3600, 90m, 30d, 2w).',
    },
    {
      displayName: 'Random',
      name: 'random',
      type: 'boolean',
      default: false,
      description: 'PREVIEW: random (reservoir) sampling. Streams the full source and parses it from the start, so quoted multi-line records stay intact. Slower than --sample (which only reads the head); use it when you need a uniform sample.',
    },
    {
      displayName: 'Refresh',
      name: 'refresh',
      type: 'string',
      default: 'on-stale',
      description: 'Revalidation policy for `dc:` use: on-stale, always or never. A `dc:` input re-fetches only past TTL; `always` does not change that - it only makes that fetch unconditional, skipping If-None-Match/If-Modified-Since revalidation. Also the value applied by cache-set-policy.',
    },
    {
      displayName: 'Sample',
      name: 'sample',
      type: 'number',
      default: 0,
      description: 'PREVIEW: stream the first N data records of <source> to stdout (or the --output file) WITHOUT caching. No `dc:` entry is created. The sniffed header row is re-attached. Single <source> only.',
    },
    {
      displayName: 'Timeout',
      name: 'timeout',
      type: 'number',
      default: 60,
      description: 'HTTP timeout in seconds. For cache downloads this is an INACTIVITY timeout: the transfer aborts only if no data is received from the server for this long, so a slow-but-steady download is NOT cut off. Preview mode (--sample / --offset / --random) instead uses it as a total-request timeout. 0 = no timeout.',
    },
    {
      displayName: 'Ttl',
      name: 'ttl',
      type: 'number',
      default: 2419200,
      description: 'Per-entry time-to-live in seconds. -1 = never expire. Also the value applied by cache-set-ttl.',
    },
    {
      displayName: 'Verify',
      name: 'verify',
      type: 'boolean',
      default: false,
      description: 'For cache-list: recompute each cached blob\'s BLAKE3 and report OK/FAIL per name (exits non-zero on any failure).',
    },
    ],
  },
];
