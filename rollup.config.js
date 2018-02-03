import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import json from "rollup-plugin-json";
import license from "rollup-plugin-license";
import resolve from "rollup-plugin-node-resolve";
import replace from "rollup-plugin-replace";
import uglify from "rollup-plugin-uglify";
import vue from "rollup-plugin-vue";
import { minify } from "uglify-es";
import path from "path";

const projectName = "vue-finder";

const builds = {
  // (CommonJS). Used by bundlers e.g. Webpack & Browserify
  cjs: {
    entry: "src/index.js",
    dest: `dist/${projectName}.common.js`,
    format: "cjs"
  },
  // (ES Modules). Used by bundlers that support ES Modules,
  // e.g. Rollup & Webpack 2
  esm: {
    entry: "src/index.js",
    dest: `dist/${projectName}.esm.js`,
    format: "es"
  },
  // build (Browser)
  "umd-dev": {
    entry: "src/index.umd.js",
    dest: `dist/${projectName}.js`,
    format: "umd",
    env: "development"
  },
  // production build (Browser)
  "umd-prod": {
    entry: "src/index.umd.js",
    dest: `dist/${projectName}.min.js`,
    format: "umd",
    env: "production"
  }
};

function genConfig(name) {
  const opts = builds[name];
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      resolve({
        browser: true,
        jsnext: true,
        preferBuiltins: false,
        extensions: [".js", ".json", ".vue"]
      }),
      commonjs(),
      vue({ compileTemplate: true, css: true }),
      json(),
      babel({
        exclude: "node_modules/**",
        runtimeHelpers: true
      }),
      filesize()
    ].concat(opts.plugins || []),
    output: {
      exports: "named",
      file: opts.dest,
      format: opts.format,
      name: opts.moduleName || projectName
    }
  };

  if (opts.env) {
    config.plugins.push(
      replace({
        "process.env.NODE_ENV": JSON.stringify(opts.env)
      })
    );

    // minify on production targets
    if (opts.env === "production") {
      config.plugins.push(uglify({}, minify));
    }
  }

  // output a license to builds
  config.plugins.push(
    license({
      sourceMap: true,
      banner: {
        file: path.resolve("LICENSE.md")
      }
    })
  );

  Object.defineProperty(config, "_name", {
    enumerable: false,
    value: name
  });

  return config;
}

const target = process.env.TARGET || "umd-prod";
module.exports = genConfig(target);
