import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { ApplyDescription } from './descriptions/ApplyDescription';
import { BeheadDescription } from './descriptions/BeheadDescription';
import { Blake3Description } from './descriptions/Blake3Description';
import { CatDescription } from './descriptions/CatDescription';
import { CountDescription } from './descriptions/CountDescription';
import { DatefmtDescription } from './descriptions/DatefmtDescription';
import { DedupDescription } from './descriptions/DedupDescription';
import { DenullDescription } from './descriptions/DenullDescription';
import { DescribegptDescription } from './descriptions/DescribegptDescription';
import { DiffDescription } from './descriptions/DiffDescription';
import { EditDescription } from './descriptions/EditDescription';
import { EnumDescription } from './descriptions/EnumDescription';
import { ExcelDescription } from './descriptions/ExcelDescription';
import { ExcludeDescription } from './descriptions/ExcludeDescription';
import { ExplodeDescription } from './descriptions/ExplodeDescription';
import { ExtdedupDescription } from './descriptions/ExtdedupDescription';
import { ExtsortDescription } from './descriptions/ExtsortDescription';
import { FetchDescription } from './descriptions/FetchDescription';
import { FetchpostDescription } from './descriptions/FetchpostDescription';
import { FillDescription } from './descriptions/FillDescription';
import { FixedwidthDescription } from './descriptions/FixedwidthDescription';
import { FixlengthsDescription } from './descriptions/FixlengthsDescription';
import { FlattenDescription } from './descriptions/FlattenDescription';
import { FmtDescription } from './descriptions/FmtDescription';
import { ForeachDescription } from './descriptions/ForeachDescription';
import { FrequencyDescription } from './descriptions/FrequencyDescription';
import { GeocodeDescription } from './descriptions/GeocodeDescription';
import { GeoconvertDescription } from './descriptions/GeoconvertDescription';
import { GetDescription } from './descriptions/GetDescription';
import { HeadersDescription } from './descriptions/HeadersDescription';
import { ImplodeDescription } from './descriptions/ImplodeDescription';
import { IndexDescription } from './descriptions/IndexDescription';
import { InputDescription } from './descriptions/InputDescription';
import { JoinDescription } from './descriptions/JoinDescription';
import { JoinpDescription } from './descriptions/JoinpDescription';
import { JsonDescription } from './descriptions/JsonDescription';
import { JsonlDescription } from './descriptions/JsonlDescription';
import { LuauDescription } from './descriptions/LuauDescription';
import { MoarstatsDescription } from './descriptions/MoarstatsDescription';
import { PartitionDescription } from './descriptions/PartitionDescription';
import { PivotpDescription } from './descriptions/PivotpDescription';
import { PragmastatDescription } from './descriptions/PragmastatDescription';
import { ProDescription } from './descriptions/ProDescription';
import { ProfileDescription } from './descriptions/ProfileDescription';
import { PseudoDescription } from './descriptions/PseudoDescription';
import { ReadstatDescription } from './descriptions/ReadstatDescription';
import { RenameDescription } from './descriptions/RenameDescription';
import { ReplaceDescription } from './descriptions/ReplaceDescription';
import { ReverseDescription } from './descriptions/ReverseDescription';
import { SafenamesDescription } from './descriptions/SafenamesDescription';
import { SampleDescription } from './descriptions/SampleDescription';
import { SchemaDescription } from './descriptions/SchemaDescription';
import { ScoresqlDescription } from './descriptions/ScoresqlDescription';
import { SearchDescription } from './descriptions/SearchDescription';
import { SearchsetDescription } from './descriptions/SearchsetDescription';
import { SelectDescription } from './descriptions/SelectDescription';
import { SliceDescription } from './descriptions/SliceDescription';
import { SnappyDescription } from './descriptions/SnappyDescription';
import { SniffDescription } from './descriptions/SniffDescription';
import { SortDescription } from './descriptions/SortDescription';
import { SortcheckDescription } from './descriptions/SortcheckDescription';
import { SplitDescription } from './descriptions/SplitDescription';
import { SqlpDescription } from './descriptions/SqlpDescription';
import { StatsDescription } from './descriptions/StatsDescription';
import { SynthesizeDescription } from './descriptions/SynthesizeDescription';
import { TableDescription } from './descriptions/TableDescription';
import { TemplateDescription } from './descriptions/TemplateDescription';
import { ToDescription } from './descriptions/ToDescription';
import { TojsonlDescription } from './descriptions/TojsonlDescription';
import { TransposeDescription } from './descriptions/TransposeDescription';
import { ValidateDescription } from './descriptions/ValidateDescription';
import { VizDescription } from './descriptions/VizDescription';
import { WritestatDescription } from './descriptions/WritestatDescription';

import { executeApply } from './actions/executeApply';
import { executeBehead } from './actions/executeBehead';
import { executeBlake3 } from './actions/executeBlake3';
import { executeCat } from './actions/executeCat';
import { executeCount } from './actions/executeCount';
import { executeDatefmt } from './actions/executeDatefmt';
import { executeDedup } from './actions/executeDedup';
import { executeDenull } from './actions/executeDenull';
import { executeDescribegpt } from './actions/executeDescribegpt';
import { executeDiff } from './actions/executeDiff';
import { executeEdit } from './actions/executeEdit';
import { executeEnum } from './actions/executeEnum';
import { executeExcel } from './actions/executeExcel';
import { executeExclude } from './actions/executeExclude';
import { executeExplode } from './actions/executeExplode';
import { executeExtdedup } from './actions/executeExtdedup';
import { executeExtsort } from './actions/executeExtsort';
import { executeFetch } from './actions/executeFetch';
import { executeFetchpost } from './actions/executeFetchpost';
import { executeFill } from './actions/executeFill';
import { executeFixedwidth } from './actions/executeFixedwidth';
import { executeFixlengths } from './actions/executeFixlengths';
import { executeFlatten } from './actions/executeFlatten';
import { executeFmt } from './actions/executeFmt';
import { executeForeach } from './actions/executeForeach';
import { executeFrequency } from './actions/executeFrequency';
import { executeGeocode } from './actions/executeGeocode';
import { executeGeoconvert } from './actions/executeGeoconvert';
import { executeGet } from './actions/executeGet';
import { executeHeaders } from './actions/executeHeaders';
import { executeImplode } from './actions/executeImplode';
import { executeIndex } from './actions/executeIndex';
import { executeInput } from './actions/executeInput';
import { executeJoin } from './actions/executeJoin';
import { executeJoinp } from './actions/executeJoinp';
import { executeJson } from './actions/executeJson';
import { executeJsonl } from './actions/executeJsonl';
import { executeLuau } from './actions/executeLuau';
import { executeMoarstats } from './actions/executeMoarstats';
import { executePartition } from './actions/executePartition';
import { executePivotp } from './actions/executePivotp';
import { executePragmastat } from './actions/executePragmastat';
import { executePro } from './actions/executePro';
import { executeProfile } from './actions/executeProfile';
import { executePseudo } from './actions/executePseudo';
import { executeReadstat } from './actions/executeReadstat';
import { executeRename } from './actions/executeRename';
import { executeReplace } from './actions/executeReplace';
import { executeReverse } from './actions/executeReverse';
import { executeSafenames } from './actions/executeSafenames';
import { executeSample } from './actions/executeSample';
import { executeSchema } from './actions/executeSchema';
import { executeScoresql } from './actions/executeScoresql';
import { executeSearch } from './actions/executeSearch';
import { executeSearchset } from './actions/executeSearchset';
import { executeSelect } from './actions/executeSelect';
import { executeSlice } from './actions/executeSlice';
import { executeSnappy } from './actions/executeSnappy';
import { executeSniff } from './actions/executeSniff';
import { executeSort } from './actions/executeSort';
import { executeSortcheck } from './actions/executeSortcheck';
import { executeSplit } from './actions/executeSplit';
import { executeSqlp } from './actions/executeSqlp';
import { executeStats } from './actions/executeStats';
import { executeSynthesize } from './actions/executeSynthesize';
import { executeTable } from './actions/executeTable';
import { executeTemplate } from './actions/executeTemplate';
import { executeTo } from './actions/executeTo';
import { executeTojsonl } from './actions/executeTojsonl';
import { executeTranspose } from './actions/executeTranspose';
import { executeValidate } from './actions/executeValidate';
import { executeViz } from './actions/executeViz';
import { executeWritestat } from './actions/executeWritestat';

export class Qsv implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'QSV Data Wrangler',
    name: 'qsv',
    icon: 'file:qsv.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Ultra-fast tabular data wrangling, stats, and transformations via QSV (generated for QSV 26.0.0; requires qsv CLI on host)',
    defaults: {
      name: 'QSV',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Apply (apply)',
            value: 'apply',
            description: 'Apply series of string, date, math & currency transformations to given CSV column/s. It also has some basic NLP functions (similarity, sentiment analysis, profanity, eudex, language & name gender) detection. Its `summarize` subcommand condenses a column or group of columns using an OpenAI API-compatible LLM (local or commercial) with customizable, MiniJinja-templated per-record prompts. (Category: transformation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/apply.md)',
            action: 'Apply',
          },
          {
            name: 'Behead (behead)',
            value: 'behead',
            description: 'Drop headers from a CSV. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/behead.md)',
            action: 'Behead',
          },
          {
            name: 'Blake3 (blake3)',
            value: 'blake3',
            description: 'Compute or check BLAKE3 hashes of files. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/blake3.md)',
            action: 'Blake3',
          },
          {
            name: 'Cat (cat)',
            value: 'cat',
            description: 'Concatenate CSV files by row or by column. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/cat.md)',
            action: 'Cat',
          },
          {
            name: 'Count (count)',
            value: 'count',
            description: 'Count the rows and optionally compile record width statistics of a CSV file. (11.87 seconds for a 15gb, 28m row NYC 311 dataset without an index. Instantaneous with an index.) If the `polars` feature is enabled, uses Polars\' multithreaded, mem-mapped CSV reader for fast counts even without an index (Category: aggregation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/count.md)',
            action: 'Count',
          },
          {
            name: 'Datefmt (datefmt)',
            value: 'datefmt',
            description: 'Formats recognized date fields (19 formats recognized) to a specified date format using strftime date format specifiers. (Category: transformation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/datefmt.md)',
            action: 'Datefmt',
          },
          {
            name: 'Dedup (dedup)',
            value: 'dedup',
            description: 'Remove duplicate rows (See also `extdedup`, `extsort`, `sort` & `sortcheck` commands). (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/dedup.md)',
            action: 'Dedup',
          },
          {
            name: 'Denull (denull)',
            value: 'denull',
            description: 'Detect null sentinels — literal text like `NULL` or `N/A` standing in for a missing value, which makes `stats` type a numeric column as String (its `nullcount` stays 0, no quartiles are computed) and silently degrades `viz`, `schema` & `describegpt` downstream. Reports by default; `--apply` blanks the sentinels in the columns it confirmed, per column. Scans once with bounded memory. Numeric sentinels (`-999`) are deliberately NOT detected — they parse as valid numbers and no scan can tell them from real data. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/denull.md)',
            action: 'Denull',
          },
          {
            name: 'Describegpt (describegpt) [Feature: feature-gated]',
            value: 'describegpt',
            description: 'Infer a "neuro-symbolic" Data Dictionary, Description & Tags or ask questions about a CSV with a configurable, MiniJinja prompt file, using any OpenAI API-compatible cloud/local LLM. (e.g. Markdown, JSON, TOON, JSON Schema, Semantic Markdown, OKF, Everything, Content Type inferencing, Spanish, Mandarin, Controlled Tags; --prompt "What are the top 10 complaint types by community board & borough by year?" - deterministic, hallucination-free SQL RAG result; iterative, session-based SQL RAG refinement - refined SQL RAG result) (Category: documentation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/describegpt.md)',
            action: 'Describegpt',
          },
          {
            name: 'Diff (diff)',
            value: 'diff',
            description: 'Find the difference between two CSVs with ludicrous speed! e.g. _compare two CSVs with 1M rows x 9 columns in under 600ms!_ (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/diff.md)',
            action: 'Diff',
          },
          {
            name: 'Edit (edit)',
            value: 'edit',
            description: 'Replace the value of a cell specified by its row and column. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/edit.md)',
            action: 'Edit',
          },
          {
            name: 'Enum (enum)',
            value: 'enum',
            description: 'Add a new column enumerating rows by adding a column of incremental or uuid identifiers. Can also be used to copy a column or fill a new column with a constant value. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/enum.md)',
            action: 'Enum',
          },
          {
            name: 'Excel (excel)',
            value: 'excel',
            description: 'Exports a specified Excel/ODS sheet to a CSV file. (Category: conversion | Docs: https://github.com/dathere/qsv/blob/master/docs/help/excel.md)',
            action: 'Excel',
          },
          {
            name: 'Exclude (exclude)',
            value: 'exclude',
            description: 'Removes a set of CSV data from another set based on the specified columns. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/exclude.md)',
            action: 'Exclude',
          },
          {
            name: 'Explode (explode)',
            value: 'explode',
            description: 'Explode rows into multiple ones by splitting a column value based on the given separator. The inverse of `implode`. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/explode.md)',
            action: 'Explode',
          },
          {
            name: 'Extdedup (extdedup)',
            value: 'extdedup',
            description: 'Remove duplicate rows from an arbitrarily large CSV/text file using a memory-mapped, on-disk hash table. Unlike the `dedup` command, this command does not load the entire file into memory nor does it sort the deduped file. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/extdedup.md)',
            action: 'Extdedup',
          },
          {
            name: 'Extsort (extsort)',
            value: 'extsort',
            description: 'Sort an arbitrarily large CSV/text file using a multithreaded external merge sort algorithm. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/extsort.md)',
            action: 'Extsort',
          },
          {
            name: 'Fetch (fetch)',
            value: 'fetch',
            description: 'Send/Fetch data to/from web services for every row using **HTTP Get**. Comes with HTTP/2 adaptive flow control, jaq JSON query language support, dynamic throttling (RateLimit) & caching with available persistent caching using Redis or a disk-cache. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/fetch.md)',
            action: 'Fetch',
          },
          {
            name: 'Fetchpost (fetchpost)',
            value: 'fetchpost',
            description: 'Similar to `fetch`, but uses **HTTP Post** (HTTP GET vs POST methods). Supports HTML form (application/x-www-form-urlencoded), JSON (application/json) and custom content types - with the ability to render payloads using CSV data using the MiniJinja template engine. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/fetchpost.md)',
            action: 'Fetchpost',
          },
          {
            name: 'Fill (fill)',
            value: 'fill',
            description: 'Fill empty values. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/fill.md)',
            action: 'Fill',
          },
          {
            name: 'Fixedwidth (fixedwidth)',
            value: 'fixedwidth',
            description: 'Convert fixed-width text (fields at fixed byte-column positions, no delimiters) to CSV. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/fixedwidth.md)',
            action: 'Fixedwidth',
          },
          {
            name: 'Fixlengths (fixlengths)',
            value: 'fixlengths',
            description: 'Force a CSV to have same-length records by either padding or truncating them. (Category: formatting | Docs: https://github.com/dathere/qsv/blob/master/docs/help/fixlengths.md)',
            action: 'Fixlengths',
          },
          {
            name: 'Flatten (flatten)',
            value: 'flatten',
            description: 'A flattened view of CSV records. Useful for viewing one record at a time. e.g. `qsv slice -i 5 data.csv | qsv flatten`. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/flatten.md)',
            action: 'Flatten',
          },
          {
            name: 'Fmt (fmt)',
            value: 'fmt',
            description: 'Reformat a CSV with different delimiters, record terminators or quoting rules. (Supports ASCII delimited data.) (Category: formatting | Docs: https://github.com/dathere/qsv/blob/master/docs/help/fmt.md)',
            action: 'Fmt',
          },
          {
            name: 'Foreach (foreach)',
            value: 'foreach',
            description: 'Execute a shell command once per record in a given CSV file. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/foreach.md)',
            action: 'Foreach',
          },
          {
            name: 'Frequency (frequency)',
            value: 'frequency',
            description: 'Build frequency distribution tables of each column. Uses multithreading to go faster if an index is present (Examples: CSV JSON TOON). (Category: aggregation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/frequency.md)',
            action: 'Frequency',
          },
          {
            name: 'Geocode (geocode) [Feature: geocode]',
            value: 'geocode',
            description: 'Geocodes a location against an updatable local copy of the Geonames cities & the Maxmind GeoLite2 databases — with caching and multi-threading, this offline path geocodes up to 360,000 records/sec! Can also geocode online (forward & reverse) via the OpenCage geocoder, geocode New York City addresses, BBLs and BINs via NYC\'s Geoclient API, which also returns NYC attributes such as council districts and census tracts, and geocode US addresses & coordinates via the free US Census Geocoder - single or batch - returning Census state, county, tract, block group & block GEOIDs for Census data enrichment. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/geocode.md)',
            action: 'Geocode',
          },
          {
            name: 'Geoconvert (geoconvert) [Feature: geocode]',
            value: 'geoconvert',
            description: 'Convert between various spatial formats and CSV/SVG including GeoJSON, SHP, and more. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/geoconvert.md)',
            action: 'Geoconvert',
          },
          {
            name: 'Get (get)',
            value: 'get',
            description: 'Get tabular data from local files, URLs (http/https & `dathere://`) & CKAN (`ckan://`) into a managed, queryable disk cache - with conditional revalidation (ETag/Last-Modified), transparent zstd compression, BLAKE3 hashing & automatic indexing. Cached resources are reusable by ANY qsv command via the `dc:` prefix (e.g. `qsv stats dc:data.csv`), with stale entries auto-refreshed. Efficiently seeds `luau` lookup tables, `validate` dynamicEnum reference data & speeds up Datapusher+ harvesting. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/get.md)',
            action: 'Get',
          },
          {
            name: 'Headers (headers)',
            value: 'headers',
            description: 'Show the headers of a CSV. Or show the intersection of all headers between many CSV files. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/headers.md)',
            action: 'Headers',
          },
          {
            name: 'Implode (implode)',
            value: 'implode',
            description: 'Implode rows by grouping on key column(s) and joining a value column with a given separator. The inverse of `explode`. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/implode.md)',
            action: 'Implode',
          },
          {
            name: 'Index (index)',
            value: 'index',
            description: 'Create an index for a CSV. This is very quick (even the 15gb, 28m row NYC 311 dataset takes all of 14 seconds to index) & provides constant time indexing/random access into the CSV. With an index, `count`, `sample` & `slice` work instantaneously; random access mode is enabled in `luau`; and multithreading is enabled for the `frequency`, `split`, `stats` & `schema` commands. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/index.md)',
            action: 'Index',
          },
          {
            name: 'Input (input)',
            value: 'input',
            description: 'Read CSV data with special commenting, quoting, trimming, line-skipping & non-UTF8 encoding handling rules. Typically used to "normalize" a CSV for further processing with other qsv commands. (Category: conversion | Docs: https://github.com/dathere/qsv/blob/master/docs/help/input.md)',
            action: 'Input',
          },
          {
            name: 'Join (join)',
            value: 'join',
            description: 'Inner, outer, right, cross, anti & semi joins. Automatically creates a simple, in-memory hash index to make it fast. (Category: joining | Docs: https://github.com/dathere/qsv/blob/master/docs/help/join.md)',
            action: 'Join',
          },
          {
            name: 'Joinp (joinp) [Feature: polars]',
            value: 'joinp',
            description: 'Inner, outer, right, cross, anti, semi, non-equi & asof joins using the Pola.rs engine. Unlike the `join` command, `joinp` can process files larger than RAM, is multithreaded, has join key validation, a maintain row order option, pre and post-join filtering, join keys unicode normalization, supports "special" non-equi joins and asof joins (which is particularly useful for time series data) & its output columns can be coalesced. (Category: joining | Docs: https://github.com/dathere/qsv/blob/master/docs/help/joinp.md)',
            action: 'Joinp',
          },
          {
            name: 'Json (json)',
            value: 'json',
            description: 'Convert JSON array to CSV. (Category: conversion | Docs: https://github.com/dathere/qsv/blob/master/docs/help/json.md)',
            action: 'Json',
          },
          {
            name: 'Jsonl (jsonl)',
            value: 'jsonl',
            description: 'Convert newline-delimited JSON (JSONL/NDJSON) to CSV. See `tojsonl` command to convert CSV to JSONL. (Category: conversion | Docs: https://github.com/dathere/qsv/blob/master/docs/help/jsonl.md)',
            action: 'Jsonl',
          },
          {
            name: 'Luau (luau) [Feature: luau]',
            value: 'luau',
            description: 'Create multiple new computed columns, filter rows, compute aggregations and build complex data pipelines by executing a Luau 0.740 expression/script for every row of a CSV file (sequential mode), or using random access with an index (random access mode). Can process a single Luau expression or full-fledged data-wrangling scripts using lookup tables with discrete BEGIN, MAIN and END sections. It is not just another qsv command, it is qsv\'s Domain-specific Language (DSL) with numerous qsv-specific helper functions to build production data pipelines. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/luau.md)',
            action: 'Luau',
          },
          {
            name: 'Moarstats (moarstats)',
            value: 'moarstats',
            description: 'Add up to an additional 73 statistical measures, including extended outlier, robust & bivariate statistics to an existing stats CSV file. (example). (Category: aggregation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/moarstats.md)',
            action: 'Moarstats',
          },
          {
            name: 'Partition (partition)',
            value: 'partition',
            description: 'Partition a CSV based on a column value. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/partition.md)',
            action: 'Partition',
          },
          {
            name: 'Pivotp (pivotp) [Feature: polars]',
            value: 'pivotp',
            description: 'Pivot CSV data. Features "smart" aggregation auto-selection based on data type & stats. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/pivotp.md)',
            action: 'Pivotp',
          },
          {
            name: 'Pragmastat (pragmastat)',
            value: 'pragmastat',
            description: 'Compute pragmatic statistics using the Pragmastat library. Uses the stats cache to auto-filter non-numeric columns and support Date/DateTime columns. (Category: aggregation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/pragmastat.md)',
            action: 'Pragmastat',
          },
          {
            name: 'Pro (pro)',
            value: 'pro',
            description: 'Interact with the qsv pro API. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/pro.md)',
            action: 'Pro',
          },
          {
            name: 'Profile (profile) [Feature: profile]',
            value: 'profile',
            description: 'Extract, derive & infer metadata from a CSV (local path or URL) - using the statistical profile of a dataset, mapped and driven by a configurable metadata scheming YAML spec (DCAT-US v3, DCAT-AP v3 and Croissant 1.1 bundled; Geoconnex when built with the `geoconnex` feature), with optional CKAN/DCAT metadata discovery for URL inputs. This enables FAIRification at scale. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/profile.md)',
            action: 'Profile',
          },
          {
            name: 'Pseudo (pseudo)',
            value: 'pseudo',
            description: 'Pseudonymise the value of the given column by replacing them with an incremental identifier. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/pseudo.md)',
            action: 'Pseudo',
          },
          {
            name: 'Readstat (readstat)',
            value: 'readstat',
            description: 'Convert SAS (`.sas7bdat`, `.xpt`), Stata (`.dta`) & SPSS (`.sav`, `.zsav`, `.por`) files to CSV, preserving the underlying codes of labelled values by default. Also dumps the rich variable metadata these formats carry - variable labels, value labels, missing-value codes, measure & display settings - with `--metadata`, or writes them alongside the data as a JSON Schema data dictionary (`--dictionary`) that `validate` and `viz smart --dictionary` read, no LLM needed. Can read just the variables you need (`--select`) and a window or reproducible random sample of rows (`--offset`, `--limit`, `--sample`). Only SPSS portable (`.por`) files are read whole - every other format streams with constant memory, except SPSS `.sav`/`.zsav` files whose user-defined missing values are tracked (`--sentinels-as`, or the default check that warns when they are dropped). (Category: conversion | Docs: https://github.com/dathere/qsv/blob/master/docs/help/readstat.md)',
            action: 'Readstat',
          },
          {
            name: 'Rename (rename)',
            value: 'rename',
            description: 'Rename the columns of a CSV efficiently. (Category: transformation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/rename.md)',
            action: 'Rename',
          },
          {
            name: 'Replace (replace)',
            value: 'replace',
            description: 'Replace CSV data using a regex. Applies the regex to each field individually. (Category: transformation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/replace.md)',
            action: 'Replace',
          },
          {
            name: 'Reverse (reverse)',
            value: 'reverse',
            description: 'Reverse order of rows in a CSV. Unlike the `sort --reverse` command, it preserves the order of rows with the same key. If an index is present, it works with constant memory. Otherwise, it will load all the data into memory. (Category: transformation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/reverse.md)',
            action: 'Reverse',
          },
          {
            name: 'Safenames (safenames)',
            value: 'safenames',
            description: 'Modify headers of a CSV to only have "safe" names - guaranteed "database-ready"/"CKAN-ready" names. (Category: validation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/safenames.md)',
            action: 'Safenames',
          },
          {
            name: 'Sample (sample)',
            value: 'sample',
            description: 'Randomly draw rows (with optional seed) from a CSV using ten different sampling methods - reservoir (default), indexed, bernoulli, systematic, stratified, weighted, varopt, mergeable-reservoir, cluster & timeseries sampling. The `--varopt` & `--mergeable-reservoir` modes support mergeable sketch I/O (`--sketch-out`/`--sketch-in`) so sharded inputs can be sampled and combined without re-reading the corpus. Supports sampling from CSVs on remote URLs. Uses the stats cache to skip unnecessary scanning and inform its sampling strategies. (Category: selection | Docs: https://github.com/dathere/qsv/blob/master/docs/help/sample.md)',
            action: 'Sample',
          },
          {
            name: 'Schema (schema)',
            value: 'schema',
            description: 'Infer either a JSON Schema Validation Draft 2020-12 (Example) or Polars Schema (Example) from CSV data. In JSON Schema Validation mode, it produces a `.schema.json` file replete with inferred data type & domain/range validation rules derived from `stats`. Uses multithreading to go faster if an index is present. See `validate` command to use the generated JSON Schema to validate if similar CSVs comply with the schema. With the `--polars` option, it produces a `.pschema.json` file that all polars commands (`sqlp`, `joinp` & `pivotp`) use to determine the data type of each column & to optimize performance. Both schemas are editable and can be fine-tuned. For JSON Schema, to refine the inferred validation rules. For Polars Schema, to change the inferred Polars data types. (Category: validation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/schema.md)',
            action: 'Schema',
          },
          {
            name: 'Scoresql (scoresql) [Feature: polars]',
            value: 'scoresql',
            description: 'Analyze a SQL query against CSV file caches (stats, moarstats, frequency) to produce a performance score with actionable optimization suggestions BEFORE running the query. Supports Polars (default) and DuckDB modes. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/scoresql.md)',
            action: 'Scoresql',
          },
          {
            name: 'Search (search)',
            value: 'search',
            description: 'Run a regex over a CSV. Applies the regex to selected fields & shows only matching rows. (Category: filtering | Docs: https://github.com/dathere/qsv/blob/master/docs/help/search.md)',
            action: 'Search',
          },
          {
            name: 'Searchset (searchset)',
            value: 'searchset',
            description: '_Run multiple regexes over a CSV in a single pass._ Applies the regexes to each field individually & shows only matching rows. (Category: filtering | Docs: https://github.com/dathere/qsv/blob/master/docs/help/searchset.md)',
            action: 'Searchset',
          },
          {
            name: 'Select (select)',
            value: 'select',
            description: 'Select, re-order, reverse, duplicate or drop columns. (Category: selection | Docs: https://github.com/dathere/qsv/blob/master/docs/help/select.md)',
            action: 'Select',
          },
          {
            name: 'Slice (slice)',
            value: 'slice',
            description: 'Slice rows from any part of a CSV. When an index is present, this only has to parse the rows in the slice (instead of all rows leading up to the start of the slice). (Category: selection | Docs: https://github.com/dathere/qsv/blob/master/docs/help/slice.md)',
            action: 'Slice',
          },
          {
            name: 'Snappy (snappy)',
            value: 'snappy',
            description: 'Does streaming compression/decompression of the input using Google\'s Snappy framing format (more info). (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/snappy.md)',
            action: 'Snappy',
          },
          {
            name: 'Sniff (sniff)',
            value: 'sniff',
            description: 'Quickly sniff & infer CSV metadata (delimiter, header row, preamble rows, quote character, flexible, is_utf8, average record length, number of records, content length & estimated number of records if sniffing a CSV on a URL, number of fields, field names & data types). It is also a general mime type detector. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/sniff.md)',
            action: 'Sniff',
          },
          {
            name: 'Sort (sort)',
            value: 'sort',
            description: 'Sorts CSV data in lexicographical, natural, numerical, reverse, unique or random (with optional seed) order (Also see `extsort` & `sortcheck` commands). (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/sort.md)',
            action: 'Sort',
          },
          {
            name: 'Sortcheck (sortcheck)',
            value: 'sortcheck',
            description: 'Check if a CSV is sorted. With the --json options, also retrieve record count, sort breaks & duplicate count. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/sortcheck.md)',
            action: 'Sortcheck',
          },
          {
            name: 'Split (split)',
            value: 'split',
            description: 'Split one CSV file into many CSV files. It can split by number of rows, number of chunks or file size. Uses multithreading to go faster if an index is present when splitting by rows or chunks. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/split.md)',
            action: 'Split',
          },
          {
            name: 'Sqlp (sqlp) [Feature: polars]',
            value: 'sqlp',
            description: 'Run Polars SQL (a PostgreSQL dialect) queries against several CSVs, Parquet, JSONL and Arrow files - converting queries to blazing-fast Polars LazyFrame expressions, processing larger than memory CSV files. Query results can be saved in CSV, JSON, JSONL, Parquet, Apache Arrow IPC and Apache Avro formats. (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/sqlp.md)',
            action: 'Sqlp',
          },
          {
            name: 'Stats (stats)',
            value: 'stats',
            description: 'Compute up to 48 summary statistics & make GUARANTEED data type inferences (Null, String, Float, Integer, Date, DateTime, Boolean) for each column in a CSV (Example). Uses multithreading to go faster if an index is present. With an index, can compile "streaming" stats on a 1M row sample of NYC\'s 311 data in less than 0.25 seconds vs 2.24 seconds without one. (Category: aggregation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/stats.md)',
            action: 'Stats',
          },
          {
            name: 'Synthesize (synthesize) [Feature: synthesize]',
            value: 'synthesize',
            description: 'Generate a synthetic CSV that is statistically faithful to a source CSV. Runs `stats` + `frequency` on the source so synthesized columns reproduce its per-column attributes — frequency-weighted sampling for categorical columns, quartile-bucketed numeric/date generation, null-ratio preservation. With a Data Dictionary from `describegpt --dictionary --infer-content-type`, semantic Content Types pick realistic fake-rs fakers (names, emails, addresses, UUIDs, etc.) for non-enumerable columns. A dictionary `relationships` array preserves inter-column structure within each row — `joint` (functional dependencies like city/state/zip), `ordered` (monotonic chains like created_date ≤ closed_date) and `correlated` (numeric correlation via a Gaussian copula). Fully reproducible with `--seed`. (Category: generation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/synthesize.md)',
            action: 'Synthesize',
          },
          {
            name: 'Table (table)',
            value: 'table',
            description: 'Align output of a CSV using elastic tabstops for viewing; or to create an "aligned TSV" file or Fixed Width Format file. To interactively view a CSV, use the `lens` command. (Category: formatting | Docs: https://github.com/dathere/qsv/blob/master/docs/help/table.md)',
            action: 'Table',
          },
          {
            name: 'Template (template)',
            value: 'template',
            description: 'Renders a template using CSV data with the MiniJinja template engine (Example). (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/template.md)',
            action: 'Template',
          },
          {
            name: 'To (to) [Feature: to]',
            value: 'to',
            description: 'Convert CSV files to Parquet, PostgreSQL, SQLite, Excel (XLSX), LibreOffice Calc (ODS) and Data Package. (Category: conversion | Docs: https://github.com/dathere/qsv/blob/master/docs/help/to.md)',
            action: 'To',
          },
          {
            name: 'Tojsonl (tojsonl)',
            value: 'tojsonl',
            description: 'Smartly converts CSV to a newline-delimited JSON (JSONL/NDJSON). By scanning the CSV first, it "smartly" infers the appropriate JSON data type for each column. See `jsonl` command to convert JSONL to CSV. (Category: conversion | Docs: https://github.com/dathere/qsv/blob/master/docs/help/tojsonl.md)',
            action: 'Tojsonl',
          },
          {
            name: 'Transpose (transpose)',
            value: 'transpose',
            description: 'Transpose rows/columns of a CSV. (Category: transformation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/transpose.md)',
            action: 'Transpose',
          },
          {
            name: 'Validate (validate)',
            value: 'validate',
            description: 'Validate CSV data _blazingly-fast_ using JSON Schema Validation (Draft 2020-12) (e.g. _up to 1,338,688 rows/sec_[^1] using NYC\'s 311 schema generated by the `schema` command) & put invalid records into a separate file along with a detailed validation error report. Supports several custom JSON Schema formats & keywords: * `currency` custom format with ISO-4217 validation * `dynamicEnum` custom keyword that supports enum validation against a CSV on the filesystem or a URL (http/https/ckan & dathere URL schemes supported) * `uniqueCombinedWith` custom keyword to validate uniqueness across multiple columns for composite key validation. If no JSON schema file is provided, validates if a CSV conforms to the RFC 4180 standard and is UTF-8 encoded. (Category: validation | Docs: https://github.com/dathere/qsv/blob/master/docs/help/validate.md)',
            action: 'Validate',
          },
          {
            name: 'Viz (viz) [Feature: viz]',
            value: 'viz',
            description: 'Generate interactive charts & maps from CSV data using plotly. `viz smart` creates a Data Schematic — a *"neuro-symbolic"* interactive rendering of a dataset\'s schema & statistics — picking appropriate visualizations using the dataset\'s statistics, frequency distributions, data dictionary & optional LLM metadata inferencing/classification, with automatic geocoding enrichment. Outputs self-contained, interactive HTML or static PNG/SVG/PDF/JPEG/WebP with the `viz_static` feature. (Gallery) (Category: utility | Docs: https://github.com/dathere/qsv/blob/master/docs/help/viz.md)',
            action: 'Viz',
          },
          {
            name: 'Writestat (writestat)',
            value: 'writestat',
            description: 'The inverse of `readstat`: write a CSV as an SPSS (`.sav`, `.por`), Stata (`.dta`) or SAS transport (`.xpt`) file. With the JSON Schema data dictionary `readstat --dictionary` wrote, a converted file comes back with its variable labels, value labels, missing values & display settings - and decoded value labels & sentinel columns are turned back into codes & declared missing values. Metadata the output format can\'t hold is refused, not silently dropped, unless `--lossy` is given. (Category: conversion | Docs: https://github.com/dathere/qsv/blob/master/docs/help/writestat.md)',
            action: 'Writestat',
          },
        ],
        default: 'stats',
      },
      ...ApplyDescription,
      ...BeheadDescription,
      ...Blake3Description,
      ...CatDescription,
      ...CountDescription,
      ...DatefmtDescription,
      ...DedupDescription,
      ...DenullDescription,
      ...DescribegptDescription,
      ...DiffDescription,
      ...EditDescription,
      ...EnumDescription,
      ...ExcelDescription,
      ...ExcludeDescription,
      ...ExplodeDescription,
      ...ExtdedupDescription,
      ...ExtsortDescription,
      ...FetchDescription,
      ...FetchpostDescription,
      ...FillDescription,
      ...FixedwidthDescription,
      ...FixlengthsDescription,
      ...FlattenDescription,
      ...FmtDescription,
      ...ForeachDescription,
      ...FrequencyDescription,
      ...GeocodeDescription,
      ...GeoconvertDescription,
      ...GetDescription,
      ...HeadersDescription,
      ...ImplodeDescription,
      ...IndexDescription,
      ...InputDescription,
      ...JoinDescription,
      ...JoinpDescription,
      ...JsonDescription,
      ...JsonlDescription,
      ...LuauDescription,
      ...MoarstatsDescription,
      ...PartitionDescription,
      ...PivotpDescription,
      ...PragmastatDescription,
      ...ProDescription,
      ...ProfileDescription,
      ...PseudoDescription,
      ...ReadstatDescription,
      ...RenameDescription,
      ...ReplaceDescription,
      ...ReverseDescription,
      ...SafenamesDescription,
      ...SampleDescription,
      ...SchemaDescription,
      ...ScoresqlDescription,
      ...SearchDescription,
      ...SearchsetDescription,
      ...SelectDescription,
      ...SliceDescription,
      ...SnappyDescription,
      ...SniffDescription,
      ...SortDescription,
      ...SortcheckDescription,
      ...SplitDescription,
      ...SqlpDescription,
      ...StatsDescription,
      ...SynthesizeDescription,
      ...TableDescription,
      ...TemplateDescription,
      ...ToDescription,
      ...TojsonlDescription,
      ...TransposeDescription,
      ...ValidateDescription,
      ...VizDescription,
      ...WritestatDescription,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const operation = this.getNodeParameter('operation', itemIndex) as string;

      try {
        let result: INodeExecutionData[];

        switch (operation) {
          case 'apply':
            result = await executeApply.call(this, itemIndex);
            break;
          case 'behead':
            result = await executeBehead.call(this, itemIndex);
            break;
          case 'blake3':
            result = await executeBlake3.call(this, itemIndex);
            break;
          case 'cat':
            result = await executeCat.call(this, itemIndex);
            break;
          case 'count':
            result = await executeCount.call(this, itemIndex);
            break;
          case 'datefmt':
            result = await executeDatefmt.call(this, itemIndex);
            break;
          case 'dedup':
            result = await executeDedup.call(this, itemIndex);
            break;
          case 'denull':
            result = await executeDenull.call(this, itemIndex);
            break;
          case 'describegpt':
            result = await executeDescribegpt.call(this, itemIndex);
            break;
          case 'diff':
            result = await executeDiff.call(this, itemIndex);
            break;
          case 'edit':
            result = await executeEdit.call(this, itemIndex);
            break;
          case 'enum':
            result = await executeEnum.call(this, itemIndex);
            break;
          case 'excel':
            result = await executeExcel.call(this, itemIndex);
            break;
          case 'exclude':
            result = await executeExclude.call(this, itemIndex);
            break;
          case 'explode':
            result = await executeExplode.call(this, itemIndex);
            break;
          case 'extdedup':
            result = await executeExtdedup.call(this, itemIndex);
            break;
          case 'extsort':
            result = await executeExtsort.call(this, itemIndex);
            break;
          case 'fetch':
            result = await executeFetch.call(this, itemIndex);
            break;
          case 'fetchpost':
            result = await executeFetchpost.call(this, itemIndex);
            break;
          case 'fill':
            result = await executeFill.call(this, itemIndex);
            break;
          case 'fixedwidth':
            result = await executeFixedwidth.call(this, itemIndex);
            break;
          case 'fixlengths':
            result = await executeFixlengths.call(this, itemIndex);
            break;
          case 'flatten':
            result = await executeFlatten.call(this, itemIndex);
            break;
          case 'fmt':
            result = await executeFmt.call(this, itemIndex);
            break;
          case 'foreach':
            result = await executeForeach.call(this, itemIndex);
            break;
          case 'frequency':
            result = await executeFrequency.call(this, itemIndex);
            break;
          case 'geocode':
            result = await executeGeocode.call(this, itemIndex);
            break;
          case 'geoconvert':
            result = await executeGeoconvert.call(this, itemIndex);
            break;
          case 'get':
            result = await executeGet.call(this, itemIndex);
            break;
          case 'headers':
            result = await executeHeaders.call(this, itemIndex);
            break;
          case 'implode':
            result = await executeImplode.call(this, itemIndex);
            break;
          case 'index':
            result = await executeIndex.call(this, itemIndex);
            break;
          case 'input':
            result = await executeInput.call(this, itemIndex);
            break;
          case 'join':
            result = await executeJoin.call(this, itemIndex);
            break;
          case 'joinp':
            result = await executeJoinp.call(this, itemIndex);
            break;
          case 'json':
            result = await executeJson.call(this, itemIndex);
            break;
          case 'jsonl':
            result = await executeJsonl.call(this, itemIndex);
            break;
          case 'luau':
            result = await executeLuau.call(this, itemIndex);
            break;
          case 'moarstats':
            result = await executeMoarstats.call(this, itemIndex);
            break;
          case 'partition':
            result = await executePartition.call(this, itemIndex);
            break;
          case 'pivotp':
            result = await executePivotp.call(this, itemIndex);
            break;
          case 'pragmastat':
            result = await executePragmastat.call(this, itemIndex);
            break;
          case 'pro':
            result = await executePro.call(this, itemIndex);
            break;
          case 'profile':
            result = await executeProfile.call(this, itemIndex);
            break;
          case 'pseudo':
            result = await executePseudo.call(this, itemIndex);
            break;
          case 'readstat':
            result = await executeReadstat.call(this, itemIndex);
            break;
          case 'rename':
            result = await executeRename.call(this, itemIndex);
            break;
          case 'replace':
            result = await executeReplace.call(this, itemIndex);
            break;
          case 'reverse':
            result = await executeReverse.call(this, itemIndex);
            break;
          case 'safenames':
            result = await executeSafenames.call(this, itemIndex);
            break;
          case 'sample':
            result = await executeSample.call(this, itemIndex);
            break;
          case 'schema':
            result = await executeSchema.call(this, itemIndex);
            break;
          case 'scoresql':
            result = await executeScoresql.call(this, itemIndex);
            break;
          case 'search':
            result = await executeSearch.call(this, itemIndex);
            break;
          case 'searchset':
            result = await executeSearchset.call(this, itemIndex);
            break;
          case 'select':
            result = await executeSelect.call(this, itemIndex);
            break;
          case 'slice':
            result = await executeSlice.call(this, itemIndex);
            break;
          case 'snappy':
            result = await executeSnappy.call(this, itemIndex);
            break;
          case 'sniff':
            result = await executeSniff.call(this, itemIndex);
            break;
          case 'sort':
            result = await executeSort.call(this, itemIndex);
            break;
          case 'sortcheck':
            result = await executeSortcheck.call(this, itemIndex);
            break;
          case 'split':
            result = await executeSplit.call(this, itemIndex);
            break;
          case 'sqlp':
            result = await executeSqlp.call(this, itemIndex);
            break;
          case 'stats':
            result = await executeStats.call(this, itemIndex);
            break;
          case 'synthesize':
            result = await executeSynthesize.call(this, itemIndex);
            break;
          case 'table':
            result = await executeTable.call(this, itemIndex);
            break;
          case 'template':
            result = await executeTemplate.call(this, itemIndex);
            break;
          case 'to':
            result = await executeTo.call(this, itemIndex);
            break;
          case 'tojsonl':
            result = await executeTojsonl.call(this, itemIndex);
            break;
          case 'transpose':
            result = await executeTranspose.call(this, itemIndex);
            break;
          case 'validate':
            result = await executeValidate.call(this, itemIndex);
            break;
          case 'viz':
            result = await executeViz.call(this, itemIndex);
            break;
          case 'writestat':
            result = await executeWritestat.call(this, itemIndex);
            break;
          default:
            throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
              itemIndex,
            });
        }

        returnData.push(...result);
      } catch (error: any) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error.message,
            },
            pairedItem: { item: itemIndex },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
