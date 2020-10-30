import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: [
    {
      extend: true,
      file: 'build/three.interactive.js',
      format: 'umd',
      globals: {
        three: 'THREE',
      },
      name: 'THREE',
      sourcemap: true
    },
    {
      file: 'build/three.interactive.module.js',
      format: 'es',
      sourcemap: true
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  external: [ 'three' ],
  watch: {
    exclude: [ 'node_modules/**' ],
  },
};
