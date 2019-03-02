const createSuite = require('./createSuite')
const size = 200

function testMultiArrays () {
  const array = new Array(size)
  for (let i = 0; i < size; ++i) {
    array[i] = [ i + 1, i + 2, i + 3 ]
  }
}

function testSingleArray () {
  const length = size * 3
  const array = new Array(length)
  for (let i = 0; i < length; i += 3) {
    array[i] = i + 1
    array[i + 1] = i + 2
    array[i + 2] = i + 3
  }
}

createSuite('Comparing array storage...')
  .add('multiple arrays', testMultiArrays)
  .add('single array', testSingleArray)
  .start()
