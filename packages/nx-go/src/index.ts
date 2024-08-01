import { NxPlugin } from '@nx/devkit';
import { createDependencies } from './graph/create-dependencies';
import { createNodes } from './graph/create-nodes';

const plugin: NxPlugin = {
  name: '@clsx524/nx-go',
  createDependencies,
  createNodes,
};

export = plugin;
