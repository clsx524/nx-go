import { checkFilesExist, runCommandAsync } from '@nx/plugin/testing';
import { execSync } from 'child_process';
import { rmSync } from 'fs';
import createTestProject from '../shared/create-test-project';

describe('nx-go: create workspace', () => {
  let workspaceDirectory: string;

  beforeAll(() => {
    workspaceDirectory = createTestProject('@clsx524/nx-go');
  });

  afterAll(() => {
    rmSync(workspaceDirectory, { recursive: true, force: true });
  });

  it('should be installed', () => {
    // npm ls will fail if the package is not installed properly
    execSync('npm ls @clsx524/nx-go', {
      cwd: workspaceDirectory,
      stdio: 'inherit',
    });
  });

  it('should be able to convert the workspace to one Go module', async () => {
    await runCommandAsync(`nx g @clsx524/nx-go:convert-to-one-mod`, {
      cwd: workspaceDirectory,
    });
    expect(() => checkFilesExist(`go.mod`)).not.toThrow();
    expect(() => checkFilesExist(`go.work`)).toThrow();
  });
});
