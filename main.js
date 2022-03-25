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
      ['g', {id: 'spawnPoints'},
        ['g', {id: 'sp0'}],
        ['g', {id: 'sp1'}]
      ],
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

function rand(mean, deviation, prec = 0, upper = Infinity, lower = -Infinity) {
  let max = mean + deviation > upper ? upper : mean + deviation;
  let min = mean - deviation < lower ? lower : mean - deviation;

  return (
    ( Math.round(
      (Math.random() * (max - min) + min) * Math.pow(10, prec)
      ) / Math.pow(10, prec)
    )
  );
}

const sqrt  = Math.sqrt;

const makeCraft = (team = 0) => {
  let id = iDGen();
  advRenderer.appendRend('crafts', (['g', {id: 'C-' + id}]));

  let crafto = {
    id: id,
    renderer: undefined,
    drawer: undefined,
    location: {x: 0, y: 0},
    vector: {x: 0, y: 0},
    team: team,
    color: 'green'
  };

  crafto.renderer = function () {
    advRenderer.normRend('C-' + id, drawCraft(crafto));
  };

  if (team === 0) {
    crafto.color = 'red';
  }

  const spawnPoint = spawnPoints[crafto.team];

  const genPoint = (point = {x: 0, y: 0}) => {
    point.x = rand(0, spawnPoint.r);
    point.y = rand(0, spawnPoint.r);

    if ( sqrt((point.x * point.x) + (point.y * point.y)) > spawnPoint.r ) {
      genPoint(point);
    }

    return point;
  };

  let point = genPoint();

  crafto.location.x = point.x + spawnPoint.x;
  crafto.location.y = point.y + spawnPoint.y;

  crafto.vector.x = spawnPoint.vx;
  crafto.vector.y = spawnPoint.vy;


  return crafto;
};

const spawnPoints = {
  0: {x: 0, y: 500, r: 100, vx: 0, vy:-10, renderer: undefined, color: 'green'},
  1: {x: 0, y:-500, r: 100, vx: 0, vy: 10, renderer: undefined, color: 'red'}
};

const drawCraft = (crafto) => {
  let drawnCraft = ['g', tt(crafto.location.x, crafto.location.y, {id: crafto.id})];

  drawnCraft.push(icons.hull(crafto));

  return drawnCraft;
};

const drawSpawn = (x, y, r, color) => {
  let drawnPoint = ['g', tt(x, y)];

  drawnPoint.push(
    ['circle', {
      r: r,
      class:  'spawnPoint ' + color
    }]
  );

  return drawnPoint;
};

const changeElementTT = (id, x, y) => {
  document.getElementById(id).setAttribute(
    'transform', 'translate(' + x + ', ' + y + ')'
  );
};

Window.options = {
  rate: 1,
  targetFrames: 30,
};
const options = Window.options;

let mapPan = {
  x: 0,
  y: 0,
  xLast: 0,
  yLast: 0,
  zoom: 1,
  zoomLast: 1,
  cursOriginX: 0,
  cursOriginY: 0,
  mousePosX: 0,
  mousePosY: 0,
  zoomChange: 0,
  interceptUpdated: true,
  boxes: {
    boxSettings: false,
  }
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
  [0,1].forEach(e => {
    let point = spawnPoints[e];
    point.renderer = function () { advRenderer.normRend('sp' + e, drawSpawn(point.x, point.y, point.r, point.color)); };
    point.renderer();
  });

  mapPan.x = getPageWidth()/2;
  mapPan.y = getPageHeight()/2;
  changeElementTT('map', mapPan.x, getPageHeight()/2);

  let simpRate = 1 / 1000;

  let clockZero = performance.now();
  let currentTime = Date.now();

  const loop = () => {
    let time = performance.now();
    let timeDelta = time - clockZero;
    clockZero = time;
    let workTime = (timeDelta * options.rate * simpRate);
    currentTime += workTime;

    // console.log('here');

    setTimeout(loop, 1000/options.targetFrames);
  };
  loop();

  // console.log(craftList);
};

window.onload = main;
