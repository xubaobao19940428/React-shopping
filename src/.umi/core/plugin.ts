// @ts-nocheck
import { Plugin } from '/Users/fingo/Downloads/fingo-boss/node_modules/@umijs/runtime';

const plugin = new Plugin({
  validKeys: ['modifyClientRenderOpts','patchRoutes','rootContainer','render','onRouteChange','getInitialState','locale','locale','layout','request',],
});
plugin.register({
  apply: require('/Users/fingo/Downloads/fingo-boss/src/app.tsx'),
  path: '/Users/fingo/Downloads/fingo-boss/src/app.tsx',
});
plugin.register({
  apply: require('/Users/fingo/Downloads/fingo-boss/node_modules/umi-plugin-antd-icon-config/lib/app.js'),
  path: '/Users/fingo/Downloads/fingo-boss/node_modules/umi-plugin-antd-icon-config/lib/app.js',
});
plugin.register({
  apply: require('/Users/fingo/Downloads/fingo-boss/src/.umi/plugin-access/rootContainer.ts'),
  path: '/Users/fingo/Downloads/fingo-boss/src/.umi/plugin-access/rootContainer.ts',
});
plugin.register({
  apply: require('../plugin-initial-state/runtime'),
  path: '../plugin-initial-state/runtime',
});
plugin.register({
  apply: require('/Users/fingo/Downloads/fingo-boss/src/.umi/plugin-locale/runtime.tsx'),
  path: '/Users/fingo/Downloads/fingo-boss/src/.umi/plugin-locale/runtime.tsx',
});
plugin.register({
  apply: require('@@/plugin-layout/runtime.tsx'),
  path: '@@/plugin-layout/runtime.tsx',
});
plugin.register({
  apply: require('../plugin-model/runtime'),
  path: '../plugin-model/runtime',
});

export { plugin };
