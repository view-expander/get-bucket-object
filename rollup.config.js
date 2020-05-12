import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import builtins from 'builtin-modules'
import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import progress from 'rollup-plugin-progress'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: './src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'cjs',
    },
  ],
  external: ['aws-sdk', 'imgix-core-js', ...builtins],
  plugins: [
    progress(),
    typescript({
      tsconfigOverride: {
        exclude: ['__test__'],
      },
    }),
    resolve(),
    commonjs(),
    json(),
    filesize(),
  ],
}
