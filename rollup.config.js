export default {
  input: 'src/index.mjs',
  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'UPNG',
    },
    {
      file: 'dist/index.common.js',
      format: 'cjs',
    },
    {
      file: 'dist/index.mjs',
      format: 'esm',
    },
  ],
}
