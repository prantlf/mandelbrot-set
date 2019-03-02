import { Renderer } from './renderer.js'

const type = 'mandelbrot'

class Mandelbrot extends Renderer {
  getParameters () {
    const parameters = super.getParameters()
    return { type, ...parameters }
  }
}

const renderer = new Mandelbrot()
renderer.initialize()
