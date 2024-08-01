import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  ProjectConfiguration,
  TargetConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nx/devkit';
import { join } from 'path';
import {
  addGoWorkDependency,
  createGoMod,
  isGoWorkspace,
  normalizeOptions,
} from '../../utils';
import type { ApplicationGeneratorSchema } from './schema';

export const defaultTargets: { [targetName: string]: TargetConfiguration } = {
  build: {
    executor: '@clsx524/nx-go:build',
    options: {
      main: '{projectRoot}/main.go',
    },
  },
  serve: {
    executor: '@clsx524/nx-go:serve',
    options: {
      main: '{projectRoot}/main.go',
    },
  },
  test: {
    executor: '@clsx524/nx-go:test',
  },
  lint: {
    executor: '@clsx524/nx-go:lint',
  },
};

export default async function applicationGenerator(
  tree: Tree,
  schema: ApplicationGeneratorSchema
) {
  const options = await normalizeOptions(
    tree,
    schema,
    'application',
    '@clsx524/nx-go:application'
  );
  const projectConfiguration: ProjectConfiguration = {
    root: options.projectRoot,
    projectType: options.projectType,
    sourceRoot: options.projectRoot,
    tags: options.parsedTags,
    targets: defaultTargets,
  };

  addProjectConfiguration(tree, schema.name, projectConfiguration);

  generateFiles(tree, join(__dirname, 'files'), options.projectRoot, options);

  if (isGoWorkspace(tree)) {
    createGoMod(tree, options.projectRoot, options.projectRoot);
    addGoWorkDependency(tree, options.projectRoot);
    projectConfiguration.targets.tidy = {
      executor: '@clsx524/nx-go:tidy',
    };
    updateProjectConfiguration(tree, schema.name, projectConfiguration);
  }

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }
}
