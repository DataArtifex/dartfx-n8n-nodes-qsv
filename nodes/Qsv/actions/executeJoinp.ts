import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function executeJoinp(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const inputPath = this.getNodeParameter('inputPath', itemIndex) as string;
  if (!inputPath || !inputPath.trim()) {
    throw new NodeOperationError(
      this.getNode(),
      'Input CSV file path is required.',
      { itemIndex },
    );
  }

  const columns1 = (this.getNodeParameter('columns1', itemIndex, '') as string) || '';
  const columns2 = (this.getNodeParameter('columns2', itemIndex, '') as string) || '';
  const input2 = (this.getNodeParameter('input2', itemIndex, '') as string) || '';
  if (!input2 || !String(input2).trim()) {
    throw new NodeOperationError(
      this.getNode(),
      'Parameter "Second Input File Path" is required for joinp.',
      { itemIndex },
    );
  }
  const outputPath = (this.getNodeParameter('outputPath', itemIndex, '') as string) || '';
  const additionalArgs = (this.getNodeParameter('additionalArgs', itemIndex, '') as string) || '';
  const options = (this.getNodeParameter('options', itemIndex, {}) as any) || {};

  const args: string[] = ['joinp'];
  if (options.allowExactMatches === true) {
    args.push('--allow-exact-matches');
  }
  if (options.asof === true) {
    args.push('--asof');
  }
  if (options.cacheSchema !== undefined && options.cacheSchema !== '') {
    args.push('--cache-schema', String(options.cacheSchema));
  }
  if (options.coalesce === true) {
    args.push('--coalesce');
  }
  if (options.cross === true) {
    args.push('--cross');
  }
  if (options.dateFormat !== undefined && options.dateFormat !== '') {
    args.push('--date-format', String(options.dateFormat));
  }
  if (options.datetimeFormat !== undefined && options.datetimeFormat !== '') {
    args.push('--datetime-format', String(options.datetimeFormat));
  }
  if (options.decimalComma === true) {
    args.push('--decimal-comma');
  }
  if (options.delimiter !== undefined && options.delimiter !== '') {
    args.push('--delimiter', String(options.delimiter));
  }
  if (options.filterLeft !== undefined && options.filterLeft !== '') {
    args.push('--filter-left', String(options.filterLeft));
  }
  if (options.filterRight !== undefined && options.filterRight !== '') {
    args.push('--filter-right', String(options.filterRight));
  }
  if (options.floatPrecision !== undefined && options.floatPrecision !== '') {
    args.push('--float-precision', String(options.floatPrecision));
  }
  if (options.full === true) {
    args.push('--full');
  }
  if (options.ignoreCase === true) {
    args.push('--ignore-case');
  }
  if (options.ignoreErrors === true) {
    args.push('--ignore-errors');
  }
  if (options.ignoreLeadingZeros === true) {
    args.push('--ignore-leading-zeros');
  }
  if (options.inferLen !== undefined && options.inferLen !== '') {
    args.push('--infer-len', String(options.inferLen));
  }
  if (options.left === true) {
    args.push('--left');
  }
  if (options.leftAnti === true) {
    args.push('--left-anti');
  }
  if (options.leftSemi === true) {
    args.push('--left-semi');
  }
  if (options.left_by !== undefined && options.left_by !== '') {
    args.push('--left_by', String(options.left_by));
  }
  if (options.maintainOrder !== undefined && options.maintainOrder !== '') {
    args.push('--maintain-order', String(options.maintainOrder));
  }
  if (options.noOptimizations === true) {
    args.push('--no-optimizations');
  }
  if (options.noSort === true) {
    args.push('--no-sort');
  }
  if (options.nonEqui !== undefined && options.nonEqui !== '') {
    args.push('--non-equi', String(options.nonEqui));
  }
  if (options.normUnicode !== undefined && options.normUnicode !== '') {
    args.push('--norm-unicode', String(options.normUnicode));
  }
  if (options.nullValue !== undefined && options.nullValue !== '') {
    args.push('--null-value', String(options.nullValue));
  }
  if (options.nulls === true) {
    args.push('--nulls');
  }
  if (options.right === true) {
    args.push('--right');
  }
  if (options.rightAnti === true) {
    args.push('--right-anti');
  }
  if (options.rightSemi === true) {
    args.push('--right-semi');
  }
  if (options.right_by !== undefined && options.right_by !== '') {
    args.push('--right_by', String(options.right_by));
  }
  if (options.sqlFilter !== undefined && options.sqlFilter !== '') {
    args.push('--sql-filter', String(options.sqlFilter));
  }
  if (options.strategy !== undefined && options.strategy !== '') {
    args.push('--strategy', String(options.strategy));
  }
  if (options.streaming === true) {
    args.push('--streaming');
  }
  if (options.timeFormat !== undefined && options.timeFormat !== '') {
    args.push('--time-format', String(options.timeFormat));
  }
  if (options.tolerance !== undefined && options.tolerance !== '') {
    args.push('--tolerance', String(options.tolerance));
  }
  if (options.tryParsedates === true) {
    args.push('--try-parsedates');
  }
  if (options.validate !== undefined && options.validate !== '') {
    args.push('--validate', String(options.validate));
  }
  if (additionalArgs.trim()) {
    const rawMatches = additionalArgs.match(/[^\s"']+|"[^"]*"|'[^']*'/g) || [];
    const parsedArgs = rawMatches.map((arg) => {
      if ((arg.startsWith('"') && arg.endsWith('"')) || (arg.startsWith("'") && arg.endsWith("'"))) {
        return arg.slice(1, -1);
      }
      return arg;
    });
    args.push(...parsedArgs);
  }
  if (outputPath.trim()) {
    args.push('--output', outputPath.trim());
  }
  if (columns1 !== undefined && String(columns1).trim()) {
    args.push(String(columns1).trim());
  }
  args.push(inputPath);
  if (columns2 !== undefined && String(columns2).trim()) {
    args.push(String(columns2).trim());
  }
  args.push(String(input2).trim());

  const qsvBin =
    process.env.DARTFX_QSV_BIN_PATH ||
    process.env.QSV_BIN_PATH ||
    process.env.QSV_PATH ||
    'qsv';

  try {
    const { stdout, stderr } = await execFileAsync(qsvBin, args, {
      maxBuffer: 50 * 1024 * 1024,
      encoding: 'utf8',
    });
    let resultJson: any;

    try {
      resultJson = JSON.parse(stdout);
    } catch {
      resultJson = {
        command: 'qsv joinp',
        inputPath,
        rawOutput: stdout,
      };
    }

    const returnJson: Record<string, any> = {
      success: true,
      command: 'joinp',
      inputPath,
      result: resultJson,
    };

    if (outputPath.trim()) {
      returnJson.outputPath = outputPath.trim();
    }

    if (stderr && stderr.trim()) {
      returnJson.warnings = stderr.trim();
    }

    return [
      {
        json: returnJson,
      },
    ];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      throw new NodeOperationError(
        this.getNode(),
        `The QSV CLI binary ('${qsvBin}') was not found`,
        {
          itemIndex,
          description: `Please ensure 'qsv' is installed and available in the system PATH where n8n is running, or specify its absolute path via the DARTFX_QSV_BIN_PATH environment variable. (Docs: https://github.com/dathere/qsv/blob/master/docs/help/joinp.md)`,
        },
      );
    }

    if (error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' || (error.message && error.message.includes('maxBuffer'))) {
      throw new NodeOperationError(
        this.getNode(),
        `QSV execution exceeded maximum stdout buffer (50 MB)`,
        {
          itemIndex,
          description: `qsv joinp returned more data than could fit into memory. Specify an 'Output File Path' to stream results directly to disk instead.`,
        },
      );
    }

    const rawError = (error.stderr || error.message || '').trim();

    if (
      rawError.includes('with any of the allowed variants') ||
      rawError.includes('Could not match') ||
      rawError.includes('is not a qsv command') ||
      rawError.includes('unrecognized subcommand') ||
      rawError.includes('not available in this')
    ) {
      throw new NodeOperationError(
        this.getNode(),
        `Operation 'joinp' is not available in the installed QSV binary`,
        {
          itemIndex,
          description: `The installed QSV binary at '${qsvBin}' does not include the 'joinp' feature. This command requires the 'polars' Cargo feature in QSV. This feature requires a QSV build with the corresponding Cargo feature enabled (or 'all_features'). See https://github.com/dathere/qsv/blob/master/docs/help/joinp.md and https://github.com/dathere/qsv#feature-flags`,
        },
      );
    }

    if (rawError.includes('No such file or directory') || rawError.includes('os error 2')) {
      throw new NodeOperationError(
        this.getNode(),
        `Input file not found: '${inputPath}'`,
        {
          itemIndex,
          description: `qsv joinp could not find the file at '${inputPath}'. Check for typos, or if n8n is running in Docker, ensure the host directory is mounted into the container.`,
        },
      );
    }

    if (
      rawError.includes('Operation not permitted') ||
      rawError.includes('os error 1') ||
      rawError.includes('Permission denied') ||
      rawError.includes('os error 13')
    ) {
      throw new NodeOperationError(
        this.getNode(),
        `Permission denied accessing file: '${inputPath}'`,
        {
          itemIndex,
          description: `qsv joinp was denied read access to '${inputPath}'. On macOS, check Full Disk Access or Removable Volumes permissions for the application running n8n.`,
        },
      );
    }

    throw new NodeOperationError(
      this.getNode(),
      `Failed executing 'qsv joinp': ${rawError}`,
      { itemIndex },
    );
  }
}
