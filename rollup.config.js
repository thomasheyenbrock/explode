import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "rollup-plugin-typescript";

export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/explode.js",
      format: "umd",
      name: "Explode"
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      babel({
        exclude: "node_modules/**"
      })
    ]
  },
  {
    input: "example/index.js",
    output: {
      file: "example/bundle.js",
      format: "iife",
      name: "Example"
    },
    plugins: [
      babel({
        exclude: "node_modules/**"
      })
    ]
  }
];
