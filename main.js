'use strict';
const renderer = require('onml/renderer.js');
// const advRenderer = require('./advRenderer.js');

const getSvg = require('./get-svg.js');

function getPageWidth() {return document.body.clientWidth;}
function getPageHeight() {return document.body.clientHeight;}

const mkRndr = (place) => {
  return renderer(document.getElementById(place));
};

const main = () => {
  console.log('Giant alien spiders are no joke.');

  let renderMain = mkRndr('content');
  let drawMap = () => {
    return getSvg({w:getPageWidth() - 10, h:getPageHeight() - 10 , i:'allTheStuff'}).concat([
      ['defs'],
      ['g', {id: 'main'}],
      ['g', {id: 'ships'}]
    ]);
  };
  renderMain(drawMap());
};

window.onload = main;
