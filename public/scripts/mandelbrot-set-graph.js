import { SetGraphElement, observedAttributes } from './set-graph.js'

class MandelbrotSetGraphElement extends SetGraphElement {
  constructor () {
    super('mandelbrot')
  }

  static get observedAttributes () { return observedAttributes }
}

customElements.define('mandelbrot-set-graph', MandelbrotSetGraphElement)
