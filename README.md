Julia and Mandelbrot Sets
=========================

Web components and a web worker for painting [Julia] and [Mandelbrot] sets on a web page. See the [sources](//github.com/prantlf/mandelbrot-set/blob/master/public/mandelbrot.html) too.

Usage
-----

Import the web component with Julia or Mandelbrot set graphs by including its module at the end of the `body` element on your HTML page:

```html
<script>
window.mandelbrotSetComputerUrl = 'https://unpkg.com/mandelbrot-set@1.0.1/public/scripts/computer.js'
</script>
<script src="https://unpkg.com/mandelbrot-set@1.0.1/public/scripts/mandelbrot-set-graph.js"
        type="module"></script>
```

Place the web component where you want to see it and set its attributes. The following ones are the defaults:

```html
<mandelbrot-set-graph id="graph" width="400" height="400" scale="1"
                      offset-x="0" offset-y="0" palette="grayscale"
                      iteration-threshold="20"></mandelbrot-set-graph>
```

Configuration
-------------

In addition to Julia or Mandelbrot set graphs described above, import the web component with the configuration form by including its module at the end of the `body` element on your HTML page:

```html
<script src="https://unpkg.com/mandelbrot-set@1.0.1/public/scripts/mandelbrot-set-form.js"
        type="module"></script>
```

Place the web component where you want to see the form:

```html
<mandelbrot-set-form id="settings"></mandelbrot-set-form>
```

Wire up the graph and the form, so that the form fields will edit the graph attributes:

```js
addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('settings')
  const graph = document.getElementById('graph')
  form.addEventListener('submit', refreshGraph)

  function refreshGraph () {
    graph.setAttributes(form.getValues())
    graph.render()
  }
})
```

You man consider applying a stylesheet for common HTML forms like [mini.css] by appending it to the document `head` element:

```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css"
      rel="stylesheet">
```

Development
-----------

This project installs support for a local web server and code validation using [NPM]. Make sure, that you use [Node.js] version 8 or newer.

```sh
npm ci
npm start
open http://localhost:8008/mandelbrot.html
open http://localhost:8008/julia.html
```

Examples
--------

![Grayscale Full Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/mandelbrot-set-grayscale-full.png) 

![Fiery Detail Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/mandelbrot-set-fiery-detail.png) 

![Rainbow Zoom Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/julia-set-rainbow-zoomed.png) 

[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[Julia]: https://prantlf.github.io/mandelbrot-set/public/julia.html
[Mandelbrot]: https://prantlf.github.io/mandelbrot-set/public/mandelbrot.html
[mini.css]: https://minicss.org/
