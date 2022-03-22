'use strict';
const renderer = require('onml/renderer.js');
const icons = require('./icons.js');
const advRenderer = require('./advRenderer.js');
const tt = require('onml/tt.js');

const getSvg = require('./get-svg.js');

function getPageWidth() {return document.body.clientWidth;}
function getPageHeight() {return document.body.clientHeight;}

const mkRndr = (place) => {
  return renderer(document.getElementById(place));
};

let drawMap = () => {
  return getSvg({w:getPageWidth() - 10, h:getPageHeight() - 10 , i:'allTheStuff'}).concat([
    ['defs'],
    ['g', {id: 'map'},
      ['g', {id: 'crafts'}]
    ],

  ]);
};


let craftList = [];

const iDGenGen = () => {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
};

const iDGen = iDGenGen();

const makeCraft = (team = 0) => {
  let id = iDGen();
  advRenderer.appendRend('crafts', (['g', {id: 'C-' + id}]));

  let crafto = {
    id: id,
    renderer: undefined,
    drawer: undefined,
    location: {x: 0, y: 0},
    vector: {x: 0, y: 0},
    color: 'green'
  };

  crafto.renderer = function () {
    advRenderer.normRend('C-' + id, drawCraft(crafto));
  };

  if (team === 0) {
    crafto.location.y = 100;
  } else {
    crafto.location.y = -100;
    crafto.color = 'red';
  }

  return crafto;
};

const drawCraft = (crafto) => {
  let drawnCraft = ['g', tt(crafto.location.x, crafto.location.y, {id: crafto.id})];

  drawnCraft.push(icons.hull(crafto));

  return drawnCraft;
};

const changeElementTT = (id, x, y) => {
  document.getElementById(id).setAttribute(
    'transform', 'translate(' + x + ', ' + y + ')'
  );
};

const main = () => {
  console.log('Giant alien spiders are no joke.');

  let renderMain = mkRndr('content');
  renderMain(drawMap());

  craftList.push(makeCraft(0));
  craftList.push(makeCraft(1));

  craftList.forEach(e => {
    e.renderer();
  });

  changeElementTT('map', getPageWidth()/2, getPageHeight()/2);
  // console.log(craftList);
};

window.onload = main;
