import typescript from "rollup-plugin-typescript";
import scss from "rollup-plugin-scss";
import url from "rollup-plugin-url";
import svgr from "@svgr/rollup";

import pkg from "./package.json";

export default {
  input: "./src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      sourcemap: true
    }
  ],
  plugins: [url(), svgr(), scss(), typescript()],
  external: ["react", "react-dom", "classnames", "luxon"]
};
