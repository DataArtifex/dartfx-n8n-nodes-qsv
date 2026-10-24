import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function executeGeocode(
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

  const subcommand = (this.getNodeParameter('subcommand', itemIndex, '') as string) || '';
  const column = (this.getNodeParameter('column', itemIndex, '') as string) || '';
  const location = (this.getNodeParameter('location', itemIndex, '') as string) || '';
  const indexFile = (this.getNodeParameter('indexFile', itemIndex, '') as string) || '';
  if (!subcommand || !String(subcommand).trim()) {
    throw new NodeOperationError(
      this.getNode(),
      'Parameter "Subcommand" is required for geocode.',
      { itemIndex },
    );
  }
  const outputPath = (this.getNodeParameter('outputPath', itemIndex, '') as string) || '';
  const additionalArgs = (this.getNodeParameter('additionalArgs', itemIndex, '') as string) || '';
  const options = (this.getNodeParameter('options', itemIndex, {}) as any) || {};

  const args: string[] = ['geocode'];
  if (subcommand && String(subcommand).trim()) {
    args.push(String(subcommand).trim());
  }
  if (options.admin1 !== undefined && options.admin1 !== '') {
    args.push('--admin1', String(options.admin1));
  }
  if (options.batch !== undefined && options.batch !== '') {
    args.push('--batch', String(options.batch));
  }
  if (options.benchmark !== undefined && options.benchmark !== '') {
    args.push('--benchmark', String(options.benchmark));
  }
  if (options.cacheDir !== undefined && options.cacheDir !== '') {
    args.push('--cache-dir', String(options.cacheDir));
  }
  if (options.cacheTtl !== undefined && options.cacheTtl !== '') {
    args.push('--cache-ttl', String(options.cacheTtl));
  }
  if (options.censusMode !== undefined && options.censusMode !== '') {
    args.push('--census-mode', String(options.censusMode));
  }
  if (options.citiesUrl !== undefined && options.citiesUrl !== '') {
    args.push('--cities-url', String(options.citiesUrl));
  }
  if (options.country !== undefined && options.country !== '') {
    args.push('--country', String(options.country));
  }
  if (options.delimiter !== undefined && options.delimiter !== '') {
    args.push('--delimiter', String(options.delimiter));
  }
  if (options.endpoint !== undefined && options.endpoint !== '') {
    args.push('--endpoint', String(options.endpoint));
  }
  if (options.force === true) {
    args.push('--force');
  }
  if (options.formatstr !== undefined && options.formatstr !== '') {
    args.push('--formatstr', String(options.formatstr));
  }
  if (options.invalidResult !== undefined && options.invalidResult !== '') {
    args.push('--invalid-result', String(options.invalidResult));
  }
  if (options.k_weight !== undefined && options.k_weight !== '') {
    args.push('--k_weight', String(options.k_weight));
  }
  if (options.language !== undefined && options.language !== '') {
    args.push('--language', String(options.language));
  }
  if (options.languages !== undefined && options.languages !== '') {
    args.push('--languages', String(options.languages));
  }
  if (options.minScore !== undefined && options.minScore !== '') {
    args.push('--min-score', String(options.minScore));
  }
  if (options.newColumn !== undefined && options.newColumn !== '') {
    args.push('--new-column', String(options.newColumn));
  }
  if (options.noAnnotations === true) {
    args.push('--no-annotations');
  }
  if (options.noCache === true) {
    args.push('--no-cache');
  }
  if (options.olderThan !== undefined && options.olderThan !== '') {
    args.push('--older-than', String(options.olderThan));
  }
  if (options.params !== undefined && options.params !== '') {
    args.push('--params', String(options.params));
  }
  if (options.rateLimit !== undefined && options.rateLimit !== '') {
    args.push('--rate-limit', String(options.rateLimit));
  }
  if (options.rename !== undefined && options.rename !== '') {
    args.push('--rename', String(options.rename));
  }
  if (options.reverse === true) {
    args.push('--reverse');
  }
  if (options.timeout !== undefined && options.timeout !== '') {
    args.push('--timeout', String(options.timeout));
  }
  if (options.vintage !== undefined && options.vintage !== '') {
    args.push('--vintage', String(options.vintage));
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
  if (column !== undefined && String(column).trim()) {
    args.push(String(column).trim());
  }
  args.push(inputPath);
  if (location !== undefined && String(location).trim()) {
    args.push(String(location).trim());
  }
  if (indexFile !== undefined && String(indexFile).trim()) {
    args.push(String(indexFile).trim());
  }

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
        command: 'qsv geocode',
        inputPath,
        rawOutput: stdout,
      };
    }

    const returnJson: Record<string, any> = {
      success: true,
      command: 'geocode',
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
          description: `Please ensure 'qsv' is installed and available in the system PATH where n8n is running, or specify its absolute path via the DARTFX_QSV_BIN_PATH environment variable. (Docs: https://github.com/dathere/qsv/blob/master/docs/help/geocode.md)`,
        },
      );
    }

    if (error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' || (error.message && error.message.includes('maxBuffer'))) {
      throw new NodeOperationError(
        this.getNode(),
        `QSV execution exceeded maximum stdout buffer (50 MB)`,
        {
          itemIndex,
          description: `qsv geocode returned more data than could fit into memory. Specify an 'Output File Path' to stream results directly to disk instead.`,
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
        `Operation 'geocode' is not available in the installed QSV binary`,
        {
          itemIndex,
          description: `The installed QSV binary at '${qsvBin}' does not include the 'geocode' feature. This command requires the 'geocode' Cargo feature in QSV. This feature requires a QSV build with the corresponding Cargo feature enabled (or 'all_features'). See https://github.com/dathere/qsv/blob/master/docs/help/geocode.md and https://github.com/dathere/qsv#feature-flags`,
        },
      );
    }

    if (rawError.includes('No such file or directory') || rawError.includes('os error 2')) {
      throw new NodeOperationError(
        this.getNode(),
        `Input file not found: '${inputPath}'`,
        {
          itemIndex,
          description: `qsv geocode could not find the file at '${inputPath}'. Check for typos, or if n8n is running in Docker, ensure the host directory is mounted into the container.`,
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
          description: `qsv geocode was denied read access to '${inputPath}'. On macOS, check Full Disk Access or Removable Volumes permissions for the application running n8n.`,
        },
      );
    }

    throw new NodeOperationError(
      this.getNode(),
      `Failed executing 'qsv geocode': ${rawError}`,
      { itemIndex },
    );
  }
}
