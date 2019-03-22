# Julia and Mandelbrot Sets

[![NPM version](https://badge.fury.io/js/mandelbrot-set.png)](http://badge.fury.io/js/mandelbrot-set)
[![Build Status](https://travis-ci.org/prantlf/mandelbrot-set.png)](https://travis-ci.org/prantlf/mandelbrot-set)
[![Maintainability](https://api.codeclimate.com/v1/badges/6a288ae050f171fee473/maintainability)](https://codeclimate.com/github/prantlf/mandelbrot-set/maintainability)
[![devDependency Status](https://david-dm.org/prantlf/mandelbrot-set/dev-status.svg)](https://david-dm.org/prantlf/mandelbrot-set#info=devDependencies)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Web components and a web worker for painting [Julia] and [Mandelbrot] sets on a web page, [including interactive controls](https://prantlf.github.io/mandelbrot-set/public/demo.html). See the [sources](//github.com/prantlf/mandelbrot-set/blob/master/public/mandelbrot.html) too.

- [Usage](#usage)
- [Configuration Form](#configuration-form)
- [Manipulation Toolbar](#manipulation-toolbar)
- [All-In-One](#all-in-one)
- [Development](#development)

## Usage

Import the web component with Julia or Mandelbrot set graphs by including its module at the end of the `body` element on your HTML page.:

```html
<script>
window.mandelbrotSetComputerUrl = 'https://unpkg.com/mandelbrot-set@2.0.0/public/scripts/computer.js'
</script>
<script src="https://unpkg.com/mandelbrot-set@2.0.0/public/scripts/mandelbrot-set-graph.js"
        type="module"></script>
<script src="https://unpkg.com/mandelbrot-set@2.0.0/public/scripts/julia-set-graph.js"
        type="module"></script>
```

Place the web component where you want to see it and set its attributes. The following ones are the defaults:

```html
<mandelbrot-set-graph id="graph" width="400" height="400" scale="1"
                      offset-x="0" offset-y="0" palette="grayscale"
                      iteration-threshold="20"></mandelbrot-set-graph>
<julia-set-graph id="graph" width="400" height="400" kr="0.4" ki="0.4"
                 scale="1" offset-x="0" offset-y="0" palette="grayscale"
                 iteration-threshold="20"></julia-set-graph>
```

Possible colour palettes are "grayscale", "jewels", "fiety", "rainbow", "sharp", "onion", "poison", "garden", and "sky".

![Mandelbrot Set Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/pictures/mandelbrot-set.png) ![Julia Set Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/pictures/julia-set.png)

## Configuration Form

In addition to Julia or Mandelbrot set graphs described above, import the web component with the configuration form by including its module at the end of the `body` element on your HTML page:

```html
<script src="https://unpkg.com/mandelbrot-set@2.0.0/public/scripts/mandelbrot-set-form.js"
        type="module"></script>
```

Place the web component where you want to see the form:

```html
<mandelbrot-set-form id="settings" for="graph"></mandelbrot-set-form>
<julia-set-form id="settings" for="graph"></julia-set-form>
```

![Mandelbrot Configuration Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/pictures/mandelbrot-form.png) ![Julia Configuration Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/pictures/julia-form.png)

If you point the `for` attribute to the element with the graph, the form will be wired with it automaticall, so that changes of fiewld values will result in updating the graph. If you do not, you will be able to reuse the form for multiple graphs, but you will have to wire it to them manually:

```js
addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('settings')
  const graph = document.getElementById('graph')
  form.addEventListener('submit', refreshGraph)

  function refreshGraph () {
    graph.suppressUpdates()
    graph.setParameters(form.getParameters())
    graph.resumeUpdates()
  }
})
```

If you use a stylesheet, which normalizes and styles plain HTML elements, like [mini.css], it will apply to the HTML form with the configuration too:

```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css"
      rel="stylesheet">
```

If you want to isolate the styling of the form, set the stylesheet URL to the `stylesheet` attribute:

```html
<mandelbrot-set-form stylesheet="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css"
                     id="settings"></mandelbrot-set-form>
```

The page [mandelbrot.html](//github.com/prantlf/mandelbrot-set/blob/master/public/mandelbrot.html) integrates the form in-place on the page. The page [julia.html](//github.com/prantlf/mandelbrot-set/blob/master/public/julia.html) opens the form in a modal dialog when clicking on the button with the settings icon.

## Manipulation Toolbar

If you want to make panning and zoomin in Julia or Mandelbrot set graphs easier, import the web component with the manipulation toolbar by including its module at the end of the `body` element on your HTML page:

```html
<script src="https://unpkg.com/mandelbrot-set@2.0.0/public/scripts/mandelbrot-set-toolbar.js"
        type="module"></script>
```

Place the web component where you want to see the toolbar:

```html
<mandelbrot-set-toolbar id="toolbar" for="graph"></mandelbrot-set-toolbar>
```

![Mandelbrot Toolbar Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/pictures/mandelbrot-toolbar.png)

Panning and zooming will be wired to the graph automatically. Opening the configuration form has to be done manually depending on how you integrate the form. For example, if you use a modal dialog:

```js
addEventListener('DOMContentLoaded', function () {
  const toolbar = document.getElementById('toolbar')
  const dialog = document.getElementById('settings-dialog')
  const form = document.getElementById('settings')

  toolbar.addEventListener('open-settings', openSettingsDialog)
  form.addEventListener('submitted', closeSettingsDialog)

  function openSettingsDialog () {
    dialog.showModal()
  }

  function closeSettingsDialog () {
    dialog.close()
  }
})
```

If you use a stylesheet, which normalizes and styles plain HTML elements, like [mini.css], it will apply to the toolbar buttons too:

```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css"
      rel="stylesheet">
```

If you want to isolate the styling of the form, set the stylesheet URL to the `stylesheet` attribute:

```html
<mandelbrot-set-toolbar stylesheet="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css"
                     id="toolbar"></mandelbrot-set-toolbar>
```

The page [julia.html](//github.com/prantlf/mandelbrot-set/blob/master/public/julia.html) demonstrates the usage of the toolbar including opening the configuration form in a modal dialog.

## All-In-One

Import the web component with Julia or Mandelbrot set demonstration by including its module at the end of the `body` element on your HTML page.:

```html
<script>
window.mandelbrotSetComputerUrl = 'https://unpkg.com/mandelbrot-set@2.0.0/public/scripts/computer.js'
</script>
<script src="https://unpkg.com/mandelbrot-set@2.0.0/public/scripts/mandelbrot-set.js"
        type="module"></script>
```

Place the web component where you want to see it and set its attributes. The following ones are the defaults:

```html
<mandelbrot-set type="mandelbrot"></mandelbrot-set>
```

Possible types are "mandelbrot" and "julia". This element includes controls for panning, zooming and configuring the graph.

![Mandelbrot Set Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/pictures/mandelbrot-demo.png)

If you use a stylesheet, which normalizes and styles plain HTML elements, like [mini.css], it will apply to the form, fields and toolbar buttons too:

```html
<link href="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css"
      rel="stylesheet">
```

If you want to isolate the styling of the form, set the stylesheet URL to the `stylesheet` attribute:

```html
<mandelbrot-set stylesheet="https://cdnjs.cloudflare.com/ajax/libs/mini.css/3.0.1/mini-default.min.css"></mandelbrot-set-toolbar>
```

The page [demo.html](//github.com/prantlf/mandelbrot-set/blob/master/public/demo.html) demonstrates the usage of this element.

## Development

This project installs support for a local web server and code validation using [NPM]. Make sure, that you use [Node.js] version 8 or newer.

```sh
npm ci
npm start
open http://localhost:8008/mandelbrot.html
open http://localhost:8008/julia.html
```

## Examples

![Grayscale Full Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/pictures/mandelbrot-set-grayscale-full.png) 

![Fiery Detail Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/pictures/mandelbrot-set-fiery-detail.png) 

![Rainbow Zoom Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/pictures/julia-set-rainbow-zoomed.png) 

![Jewels Dialog Example](https://raw.githubusercontent.com/prantlf/mandelbrot-set/master/pictures/julia-set-jewels-dialog.png) 

[Node.js]: https://nodejs.org/
[NPM]: https://www.npmjs.com/
[Julia]: https://prantlf.github.io/mandelbrot-set/public/julia.html
[Mandelbrot]: https://prantlf.github.io/mandelbrot-set/public/mandelbrot.html
[mini.css]: https://minicss.org/
