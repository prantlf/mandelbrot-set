const CleanCSS = require('clean-css')
const { join } = require('path')
let { readFile, writeFile } = require('fs')
const { promisify } = require('util')
readFile = promisify(readFile)
writeFile = promisify(writeFile)

const stylesheetName = 'mini-default'
const inputName = join(__dirname, `../node_modules/mini.css/dist/${stylesheetName}.css`)
const outputName = join(__dirname, `../public/assets/${stylesheetName}.css`)
const minifiedName = join(__dirname, `../public/assets/${stylesheetName}.min.css`)
const sourceMapName = join(__dirname, `../public/assets/${stylesheetName}.min.css.map`)

function removeIcons (content) {
  const lines = content.split('\n')
  const length = lines.length
  let skippingIcons
  const newLines = lines.filter((line, index) => {
    if (skippingIcons) {
      if (line.startsWith('/*')) {
        skippingIcons = false
        return true
      }
      return false
    }
    if (line.startsWith('/*') && index < length - 1 &&
        lines[index + 1].includes('Definitions for icons')) {
      skippingIcons = true
      return false
    }
    return true
  })
  return newLines.join('\n')
}

function minifyStylesheet (original) {
  const minifier = new CleanCSS({
    level: 2,
    sourceMap: true
  })
  let { styles: minified, sourceMap } = minifier.minify({
    [stylesheetName + '.css']: { styles: original }
  })
  minified += `\n/*# sourceMappingURL=${stylesheetName}.min.css.map */`
  return { original, minified, sourceMap }
}

async function saveStylesheet ({ original, minified, sourceMap }) {
  await writeFile(outputName, original)
  await writeFile(minifiedName, minified)
  await writeFile(sourceMapName, sourceMap)
}

console.log(`Writing "${stylesheetName}.css", "${stylesheetName}.min.css" and "${stylesheetName}.min.css.map" to "public/assets"...`)
readFile(inputName, { encoding: 'utf-8' })
  .then(removeIcons)
  .then(minifyStylesheet)
  .then(saveStylesheet)
  .catch(console.error)
