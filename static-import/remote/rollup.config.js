import typescript from 'rollup-plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import pkg from './package.json'

const env = process.env.BUILD_ENV || 'umd'
const plugins = [
  typescript({
    exclude: 'node_modules/**',
    typescript: require('typescript')
  })
]

const env2outputConf = {
  es: {
    format: 'es',
    name: pkg.name,
    file: `hel_proxy_es/entry.js`
  },
  umd: {
    format: 'umd',
    name: pkg.name,
    file: `hel_proxy/entry.js`
  },
};

const outputObj = env2outputConf[env]

if (process.env.MIN === 'true') {
  plugins.push(terser())
  const [dirName] = outputObj.file.split('/')
  outputObj.file = `${dirName}/entry.min.js`
}

module.exports = {
  input: 'src/entrance/libTypes.ts',
  plugins,
  output: [
    outputObj
  ]
}
