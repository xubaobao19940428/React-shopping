// @ts-nocheck
import React, { useState, useEffect } from "react";
import { ApplyPluginsType, useModel } from "umi";
import { plugin } from "../core/umiExports";

export default props => {
  const [runtimeConfig, setRuntimeConfig] = useState(null);

  const initialInfo = (useModel && useModel("@@initialState")) || {
    initialState: undefined,
    loading: false,
    setInitialState: null
  }; // plugin-initial-state 未开启

  useEffect(() => {
    const useRuntimeConfig =
      plugin.applyPlugins({
        key: "layout",
        type: ApplyPluginsType.modify,
        initialValue: initialInfo
      }) || {};
    if (useRuntimeConfig instanceof Promise) {
      useRuntimeConfig.then(config => {
        setRuntimeConfig(config);
      });
      return;
    }
    setRuntimeConfig(useRuntimeConfig);
  }, [initialInfo?.initialState]);

  const userConfig = {
    ...{'name':'fingo','theme':'PRO','locale':false,'showBreadcrumb':true,'siderWidth':186},
    ...runtimeConfig || {}
  };

  if(!runtimeConfig){
    return null
  }

  return React.createElement(require("/Users/fingo/Downloads/fingo-boss/node_modules/@umijs/plugin-layout/lib/layout/index.js").default, {
    userConfig,
    ...props
  });
};
