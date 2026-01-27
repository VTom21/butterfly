
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/js/index.js",
  output: {
    file: "dist/js/index.min.js",
    format: "iife", 
    name: "MyFramework" 
  },
  plugins: [terser()] 
};
