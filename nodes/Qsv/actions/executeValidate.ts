import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export async function executeValidate(
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
  const jsonSchema = (this.getNodeParameter('jsonSchema', itemIndex, '') as string) || '';
  const outputPath = (this.getNodeParameter('outputPath', itemIndex, '') as string) || '';
  const additionalArgs = (this.getNodeParameter('additionalArgs', itemIndex, '') as string) || '';
  const options = (this.getNodeParameter('options', itemIndex, {}) as any) || {};

  const args: string[] = ['validate'];
  if (subcommand && String(subcommand).trim()) {
    args.push(String(subcommand).trim());
  }
  if (options.backtrackLimit !== undefined && options.backtrackLimit !== '') {
    args.push('--backtrack-limit', String(options.backtrackLimit));
  }
  if (options.batch !== undefined && options.batch !== '') {
    args.push('--batch', String(options.batch));
  }
  if (options.cacheDir !== undefined && options.cacheDir !== '') {
    args.push('--cache-dir', String(options.cacheDir));
  }
  if (options.ckanApi !== undefined && options.ckanApi !== '') {
    args.push('--ckan-api', String(options.ckanApi));
  }
  if (options.delimiter !== undefined && options.delimiter !== '') {
    args.push('--delimiter', String(options.delimiter));
  }
  if (options.dfaSizeLimit !== undefined && options.dfaSizeLimit !== '') {
    args.push('--dfa-size-limit', String(options.dfaSizeLimit));
  }
  if (options.emailDisplayText === true) {
    args.push('--email-display-text');
  }
  if (options.emailDomainLiteral === true) {
    args.push('--email-domain-literal');
  }
  if (options.emailMinSubdomains !== undefined && options.emailMinSubdomains !== '') {
    args.push('--email-min-subdomains', String(options.emailMinSubdomains));
  }
  if (options.emailRequiredTld === true) {
    args.push('--email-required-tld');
  }
  if (options.failFast === true) {
    args.push('--fail-fast');
  }
  if (options.fancyRegex === true) {
    args.push('--fancy-regex');
  }
  if (options.invalid !== undefined && options.invalid !== '') {
    args.push('--invalid', String(options.invalid));
  }
  if (options.json === true) {
    args.push('--json');
  }
  if (options.noFormatValidation === true) {
    args.push('--no-format-validation');
  }
  if (options.noHeaders === true) {
    args.push('--no-headers');
  }
  if (options.offline === true) {
    args.push('--offline');
  }
  if (options.prettyJson === true) {
    args.push('--pretty-json');
  }
  if (options.sizeLimit !== undefined && options.sizeLimit !== '') {
    args.push('--size-limit', String(options.sizeLimit));
  }
  if (options.splitRagged === true) {
    args.push('--split-ragged');
  }
  if (options.timeout !== undefined && options.timeout !== '') {
    args.push('--timeout', String(options.timeout));
  }
  if (options.trim === true) {
    args.push('--trim');
  }
  if (options.valid !== undefined && options.valid !== '') {
    args.push('--valid', String(options.valid));
  }
  if (options.validOutput !== undefined && options.validOutput !== '') {
    args.push('--valid-output', String(options.validOutput));
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
  args.push(inputPath);
  if (jsonSchema !== undefined && String(jsonSchema).trim()) {
    args.push(String(jsonSchema).trim());
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
        command: 'qsv validate',
        inputPath,
        rawOutput: stdout,
      };
    }

    const returnJson: Record<string, any> = {
      success: true,
      command: 'validate',
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
          description: `Please ensure 'qsv' is installed and available in the system PATH where n8n is running, or specify its absolute path via the DARTFX_QSV_BIN_PATH environment variable. (Docs: https://github.com/dathere/qsv/blob/master/docs/help/validate.md)`,
        },
      );
    }

    if (error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' || (error.message && error.message.includes('maxBuffer'))) {
      throw new NodeOperationError(
        this.getNode(),
        `QSV execution exceeded maximum stdout buffer (50 MB)`,
        {
          itemIndex,
          description: `qsv validate returned more data than could fit into memory. Specify an 'Output File Path' to stream results directly to disk instead.`,
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
        `Operation 'validate' is not available in the installed QSV binary`,
        {
          itemIndex,
          description: `The installed QSV binary at '${qsvBin}' does not include the 'validate' feature. This feature requires a QSV build with the corresponding Cargo feature enabled (or 'all_features'). See https://github.com/dathere/qsv/blob/master/docs/help/validate.md and https://github.com/dathere/qsv#feature-flags`,
        },
      );
    }

    if (rawError.includes('No such file or directory') || rawError.includes('os error 2')) {
      throw new NodeOperationError(
        this.getNode(),
        `Input file not found: '${inputPath}'`,
        {
          itemIndex,
          description: `qsv validate could not find the file at '${inputPath}'. Check for typos, or if n8n is running in Docker, ensure the host directory is mounted into the container.`,
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
          description: `qsv validate was denied read access to '${inputPath}'. On macOS, check Full Disk Access or Removable Volumes permissions for the application running n8n.`,
        },
      );
    }

    throw new NodeOperationError(
      this.getNode(),
      `Failed executing 'qsv validate': ${rawError}`,
      { itemIndex },
    );
  }
}
