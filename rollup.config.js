import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    input: 'packages/vue/src/index.ts',
    output: [
      {
        sourcemap: true,
        file: './packages/vue/src/dist/vue.js',
        format: 'iife',
        name: 'Vue'
      }
    ],
    plugins: [
      typescript({
        sourceMap: true
      }),
      resolve(),
      commonjs()
    ]
  }
]
