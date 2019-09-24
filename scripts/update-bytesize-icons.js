const { minify } = require('terser')
const { join } = require('path')
let { readFile, writeFile } = require('fs')
const { promisify } = require('util')
readFile = promisify(readFile)
writeFile = promisify(writeFile)

const scriptName = 'bytesize-icon-elements'
const assetDir = 'public/assets'
const inputName = join(__dirname, '../node_modules/bytesize-icon-elements/index.js')
const outputName = join(__dirname, `../${assetDir}/${scriptName}.js`)
const minifiedName = join(__dirname, `../${assetDir}/${scriptName}.min.js`)
const sourceMapName = join(__dirname, `../${assetDir}/${scriptName}.min.js.map`)

function minifyScript (original) {
  const { code: minified, map: sourceMap } = minify({
    [`${scriptName}.js`]: original
  }, {
    compress: {
      ecma: 7
    },
    output: {
      ecma: 7
    },
    sourceMap: {
      filename: `${scriptName}.js`,
      url: `${scriptName}.min.js.map`
    }
  })
  return { original, minified, sourceMap }
}

async function saveScript ({ original, minified, sourceMap }) {
  await writeFile(outputName, original)
  await writeFile(minifiedName, minified)
  await writeFile(sourceMapName, sourceMap)
}

console.log(`Writing "${scriptName}.js", "${scriptName}.min.js" and "${scriptName}.min.js.map" to "${assetDir}"...`)
readFile(inputName, { encoding: 'utf-8' })
  .then(minifyScript)
  .then(saveScript)
  .catch(console.error)
