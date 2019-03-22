const { rollup } = require('rollup')
const multiEntry = require('rollup-plugin-multi-entry')
const { terser } = require('rollup-plugin-terser')

const scriptDir = 'public/scripts'
const scriptName = 'mandelbrot-all.min.js'

async function build () {
  const bundle = await rollup({
    input: [
      `${scriptDir}/color-space.js`, `${scriptDir}/mandelbrot-set-computer.js`,
      `${scriptDir}/palette.js`, `${scriptDir}/mandelbrot-set-form.js`,
      `${scriptDir}/set-form.js`, `${scriptDir}/element-utils.js`,
      `${scriptDir}/mandelbrot-set-graph.js`, `${scriptDir}/set-graph.js`,
      `${scriptDir}/julia-set-form.js`, `${scriptDir}/mandelbrot-set-toolbar.js`,
      `${scriptDir}/julia-set-graph.js`, `${scriptDir}/mandelbrot-set.js`
    ],
    plugins: [
      multiEntry(),
      terser({
        compress: {
          ecma: 7
        },
        output: {
          ecma: 7
        }
      })
    ]
  })
  await bundle.write({
    file: `${scriptDir}/${scriptName}`,
    sourcemap: true,
    sourcemapFile: `${scriptDir}/${scriptName}.map`,
    format: 'esm'
  })
}

console.log(`Writing "${scriptName}" and "${scriptName}.map" to "${scriptDir}"...`)
build()
  .catch(console.error)
