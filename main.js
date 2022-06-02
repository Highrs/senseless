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

const drawMap = () => {
  return getSvg({w:getPageWidth() - 10, h:getPageHeight() - 10 , i:'allTheStuff'}).concat([
    ['defs'],
    ['g', {id: 'map'},
      ['g', {id: 'spawnPoints'},
        ['g', {id: 'sp-green'}],
        ['g', {id: 'sp-red'}]
      ],
      ['g', {id: 'weps'}],
      ['g', {id: 'crafts'}]
    ],

  ]);
};

let craftList = [];
let deadCraftList = [];

const iDGenGen = () => {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
};

const iDGen = iDGenGen();
const iDWepGen = iDGenGen();

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

const genPoint = (spawnPoint, point = {x: 0, y: 0}) => {
  point.x = rand(0, spawnPoint.r);
  point.y = rand(0, spawnPoint.r);

  if ( calcRange({x:0, y:0}, point) > spawnPoint.r ) {
    genPoint(spawnPoint, point);
  }

  return point;
};

const makeCraft = (teamColor = 'green') => {
  let id = iDGen();
  let mapID = 'C-' + id;
  advRenderer.appendRend('crafts', (['g', {id: mapID}]));

  let crafto = {
    id: teamColor[0] + id,
    mapID: mapID,
    renderer: undefined,
    location: {x: 0, y: 0},
    vector: {x: 0, y: 0},
    team: teams[teamColor],
    weaponsList: ['lance'],
    weapons: [],
    ranges: [],
    health: 5,
    status: 'normal',
    dead: false
  };

  crafto.renderer = function () {
    advRenderer.normRend(mapID, drawCraft(crafto));
  };

  makeWeps(crafto);

  const spawnPoint = crafto.team.spawnPoint;


  let point = genPoint(spawnPoint);

  crafto.location.x = point.x + spawnPoint.x;
  crafto.location.y = point.y + spawnPoint.y;

  crafto.vector.x = spawnPoint.vx;
  crafto.vector.y = spawnPoint.vy;


  craftList.push(crafto);
  teams[teamColor].members.push(crafto);

  console.log(crafto);

  return crafto;
};

const spawnPoints = {
  'green': {x: 250, y: 250, r: 100, vx: -10, vy:-10, renderer: undefined},
  'red': {x: -250, y:-250, r: 200, vx: 10, vy: 10, renderer: undefined}
};

const teams = {
  green: {color: 'green', spawnPoint: spawnPoints.green,  members: [], enemy: undefined, kills: 0, losses: 0},
  red:   {color: 'red',   spawnPoint: spawnPoints.red,    members: [], enemy: undefined, kills: 0, losses: 0}
};
teams.green.enemy = teams.red;
teams.red.enemy =   teams.green;

const makeWeps = (crafto) => {
  crafto.weaponsList.forEach(e => {
    let id = iDWepGen();
    let mapID = 'W-' + id;
    let wepo = {
      id: id,
      mapID: mapID,
      ...weps[e],
      reloadProg: 0,
      counter: 0,
      status: 'ready',
      pulseProg: 0,
      renderer: undefined,
      host: crafto,
      target: {},
    };
    crafto.ranges.push(weps[e].range) ;
    advRenderer.appendRend('weps', (['g', {id: mapID}]));
    wepo.renderer = function () {
      advRenderer.normRend(mapID, drawWep(wepo));
    };
    wepo.renderer();
    hide(wepo.mapID);
    crafto.weapons.push(wepo);
  });
};

const drawWep = (wepo) => {
  let drawnWep = ['g', {}];

  drawnWep.push(
    ['line', {
      id: wepo.mapID + '-LINE',
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      class: 'wepFire1'
    }]
  );

  return drawnWep;
};

const weps = {
  lance: {damage: 1, reloadTime: 5000, range: 100, pulseTime: 2000}
};

const drawCraft = (crafto) => {
  let drawnCraft = ['g', {id: crafto.id}];

  if (crafto.dead) {

    drawnCraft.push(icons.hull(crafto));

  } else {

    crafto.ranges.forEach(range => {
      drawnCraft.push(['circle', {r: range, class: 'wepsRangeCircle ' + crafto.team.color + ' ' + crafto.team.color +'Fill'}]);
    });

    drawnCraft.push(icons.hull(crafto));
    drawnCraft.push(['text', {
      x: 5,
      y: 5,
      class: 'craftIconText ' + crafto.team.color +'Fill'
    },
      crafto.id
    ]);

  }

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

const calcMotion = (crafto, timeDelta) => {
  ['x', 'y'].forEach(e => {
      crafto.location[e] += crafto.vector[e] * timeDelta;
    });
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

const calcRange = (pt1, pt2) => {
  const dx = pt1.x - pt2.x;
  const dy = pt1.y - pt2.y;
  return sqrt((dx * dx) + (dy * dy));
};

const updateWepLine = (crafto, enemyo, wep) => {
  let wepLine = document.getElementById(wep.mapID + '-LINE');
  wepLine.setAttribute('x1', crafto.location.x);
  wepLine.setAttribute('y1', crafto.location.y);
  wepLine.setAttribute('x2', enemyo.location.x);
  wepLine.setAttribute('y2', enemyo.location.y);
};

const wepsFire = (wep, td) => {
  let crafto = wep.host;
  let enemyo = wep.target;

  switch (wep.status) {
    case 'ready':
      updateWepLine(crafto, enemyo, wep);
      unhide(wep.mapID);

      enemyo.health -= wep.damage;
      wep.status = 'firing';
      wep.counter += 1;
      console.log(crafto.id + ' fires on ' + enemyo.id + ',  HP:' + enemyo.health);

      if (enemyo.health <= 0) {killCraft(enemyo);}

      break;
    case 'firing':
      wep.pulseProg += td;
      if (wep.pulseProg >= wep.pulseTime) {
        wep.status = 'reloading';
        wep.pulseProg = 0;
        wep.target = {};
        hide(wep.mapID);
      }
      updateWepLine(crafto, enemyo, wep);
      break;
    case 'reloading':
      wep.reloadProg += td;
      if (wep.reloadProg >= wep.reloadTime) {
        wep.status = 'ready';
        wep.reloadProg = 0;
      }
      break;
  }

};

const hide = (id) => {
  document.getElementById(id).style.visibility = "hidden";
};
const unhide = (id) => {
  document.getElementById(id).style.visibility = "visible";
};

const makeManyCraft = (number, color) => {
  for (let i = 0; i < number; i++) {
    makeCraft(color);
  }
};

const killCraft = (crafto) => {
    crafto.dead = true;
    crafto.team.losses += 1;
    crafto.team.enemy.kills += 1;

    deadCraftList.push(crafto);
    craftList.splice(craftList.indexOf(crafto), 1);
    crafto.team.members.splice(crafto.team.members.indexOf(crafto), 1);
    crafto.weapons.forEach(wep => {
      hide(wep.mapID);
    });
    crafto.renderer();

    console.log(crafto.id + ' destroyed');
};

const main = () => {
  console.log('Giant alien spiders are no joke.');

  let renderMain = mkRndr('content');
  renderMain(drawMap());

  makeManyCraft(20, 'green');
  makeManyCraft(30, 'red');

  craftList.forEach(e => {
    e.renderer();
  });

  ['green', 'red'].forEach(e => {
    let point = spawnPoints[e];
    point.renderer = function () { advRenderer.normRend('sp-' + e, drawSpawn(point.x, point.y, point.r, e)); };
    point.renderer();
  });

  mapPan.x = getPageWidth()/2;
  mapPan.y = getPageHeight()/2;
  changeElementTT('map', mapPan.x, mapPan.y);

  let simpRate = 1 / 1000;

  let clockZero = performance.now();
  // let currentTime = Date.now();

  const loop = () => {
    let time = performance.now();
    let timeDelta = time - clockZero;
    clockZero = time;
    let workTime = (timeDelta * options.rate * simpRate);
    // currentTime += workTime;

    craftList.forEach(crafto => {
      calcMotion(crafto, workTime);
      changeElementTT(crafto.mapID, crafto.location.x, crafto.location.y);
      return crafto.weapons.find(wep => {
        if (wep.status === 'ready') {
          return crafto.team.enemy.members.find(enemyo => {
            let range = calcRange(crafto.location, enemyo.location);
            if (
              range < wep.range
            ) {
              wep.target = enemyo;
              wepsFire(wep, timeDelta);
              return wep.target;
            }
          });
        } else if (wep.status === 'firing' || wep.status === 'reloading') {
          wepsFire(wep, timeDelta);
        }
      });
    });

    // craftList.forEach(crafto => {
    //   if (crafto.health <= 0) {killCraft(crafto);}
    // });

    setTimeout(loop, 1000/options.targetFrames);
  };
  loop();
};

window.onload = main;
