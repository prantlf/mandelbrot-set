/* global addEventListener */

let form
let graph

function refreshGraph () {
  const settings = form.getValues()
  graph.setAttributes(settings)
  graph.render()
}

function initializePage () {
  form = document.getElementById('settings')
  graph = document.getElementById('graph')
  form.addEventListener('submit', refreshGraph)
  refreshGraph()
}

addEventListener('DOMContentLoaded', initializePage)
