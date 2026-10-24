import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function executeSqlp(
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

  const sql = (this.getNodeParameter('sql', itemIndex, '') as string) || '';
  if (!sql || !String(sql).trim()) {
    throw new NodeOperationError(
      this.getNode(),
      'Parameter "SQL Query" is required for sqlp.',
      { itemIndex },
    );
  }
  const outputPath = (this.getNodeParameter('outputPath', itemIndex, '') as string) || '';
  const additionalArgs = (this.getNodeParameter('additionalArgs', itemIndex, '') as string) || '';
  const options = (this.getNodeParameter('options', itemIndex, {}) as any) || {};

  const args: string[] = ['sqlp'];
  if (options.cacheSchema === true) {
    args.push('--cache-schema');
  }
  if (options.compressLevel !== undefined && options.compressLevel !== '') {
    args.push('--compress-level', String(options.compressLevel));
  }
  if (options.compression !== undefined && options.compression !== '') {
    args.push('--compression', String(options.compression));
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
  if (options.floatPrecision !== undefined && options.floatPrecision !== '') {
    args.push('--float-precision', String(options.floatPrecision));
  }
  if (options.format !== undefined && options.format !== '') {
    args.push('--format', String(options.format));
  }
  if (options.ignoreErrors === true) {
    args.push('--ignore-errors');
  }
  if (options.inferLen !== undefined && options.inferLen !== '') {
    args.push('--infer-len', String(options.inferLen));
  }
  if (options.noOptimizations === true) {
    args.push('--no-optimizations');
  }
  if (options.rnullValues !== undefined && options.rnullValues !== '') {
    args.push('--rnull-values', String(options.rnullValues));
  }
  if (options.statistics === true) {
    args.push('--statistics');
  }
  if (options.streaming === true) {
    args.push('--streaming');
  }
  if (options.timeFormat !== undefined && options.timeFormat !== '') {
    args.push('--time-format', String(options.timeFormat));
  }
  if (options.truncateRaggedLines === true) {
    args.push('--truncate-ragged-lines');
  }
  if (options.tryParsedates === true) {
    args.push('--try-parsedates');
  }
  if (options.wnullValue !== undefined && options.wnullValue !== '') {
    args.push('--wnull-value', String(options.wnullValue));
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
  args.push(inputPath);
  args.push(String(sql).trim());

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
        command: 'qsv sqlp',
        inputPath,
        rawOutput: stdout,
      };
    }

    const returnJson: Record<string, any> = {
      success: true,
      command: 'sqlp',
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
          description: `Please ensure 'qsv' is installed and available in the system PATH where n8n is running, or specify its absolute path via the DARTFX_QSV_BIN_PATH environment variable. (Docs: https://github.com/dathere/qsv/blob/master/docs/help/sqlp.md)`,
        },
      );
    }

    if (error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' || (error.message && error.message.includes('maxBuffer'))) {
      throw new NodeOperationError(
        this.getNode(),
        `QSV execution exceeded maximum stdout buffer (50 MB)`,
        {
          itemIndex,
          description: `qsv sqlp returned more data than could fit into memory. Specify an 'Output File Path' to stream results directly to disk instead.`,
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
        `Operation 'sqlp' is not available in the installed QSV binary`,
        {
          itemIndex,
          description: `The installed QSV binary at '${qsvBin}' does not include the 'sqlp' feature. This command requires the 'polars' Cargo feature in QSV. This feature requires a QSV build with the corresponding Cargo feature enabled (or 'all_features'). See https://github.com/dathere/qsv/blob/master/docs/help/sqlp.md and https://github.com/dathere/qsv#feature-flags`,
        },
      );
    }

    if (rawError.includes('No such file or directory') || rawError.includes('os error 2')) {
      throw new NodeOperationError(
        this.getNode(),
        `Input file not found: '${inputPath}'`,
        {
          itemIndex,
          description: `qsv sqlp could not find the file at '${inputPath}'. Check for typos, or if n8n is running in Docker, ensure the host directory is mounted into the container.`,
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
          description: `qsv sqlp was denied read access to '${inputPath}'. On macOS, check Full Disk Access or Removable Volumes permissions for the application running n8n.`,
        },
      );
    }

    throw new NodeOperationError(
      this.getNode(),
      `Failed executing 'qsv sqlp': ${rawError}`,
      { itemIndex },
    );
  }
}
