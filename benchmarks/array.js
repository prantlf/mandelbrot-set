const createSuite = require('./createSuite')
const size = 200

function testNumber () {
  var array = new Array(size)
  for (let i = 0; i < size; ++i) {
    array[i] = i
  }
}

function testUint8 () {
  var array = new Uint8Array(size)
  for (let i = 0; i < size; ++i) {
    array[i] = i
  }
}

function testUint16 () {
  var array = new Uint16Array(size)
  for (let i = 0; i < size; ++i) {
    array[i] = i
  }
}

function testUint32 () {
  var array = new Uint32Array(size)
  for (let i = 0; i < size; ++i) {
    array[i] = i
  }
}

function testInt8 () {
  var array = new Int8Array(size)
  for (let i = 0; i < size; ++i) {
    array[i] = i
  }
}

function testInt16 () {
  var array = new Int16Array(size)
  for (let i = 0; i < size; ++i) {
    array[i] = i
  }
}

function testInt32 () {
  var array = new Int32Array(size)
  for (let i = 0; i < size; ++i) {
    array[i] = i
  }
}

createSuite('Comparing array types...')
  .add('Number', testNumber)
  .add('Uint8', testUint8)
  .add('Uint16', testUint16)
  .add('Uint32', testUint32)
  .add('Int8', testInt8)
  .add('Int16', testInt16)
  .add('Int32', testInt32)
  .start()
