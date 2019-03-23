import { SetGraphElement, observedAttributes } from './set-graph.js'

const observedJuliaAttributes = observedAttributes.concat('kr', 'ki')

class JuliaSetGraphElement extends SetGraphElement {
  constructor () {
    super('julia')
  }

  getParameters () {
    const parameters = super.getParameters()
    parameters.kr = +(this.getAttribute('kr') || 0.4)
    parameters.ki = +(this.getAttribute('ki') || 0.4)
    return parameters
  }

  setParameters (parameters) {
    super.setParameters(parameters)
    const { kr, ki } = parameters
    this.setAttribute('kr', kr)
    this.setAttribute('ki', ki)
  }

  static get observedAttributes () {
    return observedJuliaAttributes
  }
}

customElements.define('julia-set-graph', JuliaSetGraphElement)
