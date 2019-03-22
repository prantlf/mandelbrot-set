const defaultComputerUrl = 'https://unpkg.com/mandelbrot-set@2.1.0/public/scripts/computer.js'
let computerUrl = defaultComputerUrl

function getComputerUrl () {
  return computerUrl
}

class MandelbrotSetComputerElement extends HTMLElement {
  constructor () {
    super()
    computerUrl = this.getAttribute('src') || defaultComputerUrl
  }
}

customElements.define('mandelbrot-set-computer', MandelbrotSetComputerElement)

export { getComputerUrl }
