/* global customElements */

import { SetGraphElement, observedAttributes } from './set-graph.js'

const observedJuliaAttributes = observedAttributes.concat('kr', 'ki')

class JuliaSetGraphElement extends SetGraphElement {
  constructor () {
    super('julia')
  }

  getAttributes () {
    const attributes = super.getAttributes()
    attributes.kr = +(this.getAttribute('kr') || 0.4)
    attributes.ki = +(this.getAttribute('ki') || 0.4)
    return attributes
  }

  setAttributes (attributes) {
    super.setAttributes(attributes)
    const { kr, ki } = attributes
    this.setAttribute('k-r', kr)
    this.setAttribute('k-i', ki)
  }

  static get observedAttributes () { return observedJuliaAttributes }
}

customElements.define('julia-set-graph', JuliaSetGraphElement)
