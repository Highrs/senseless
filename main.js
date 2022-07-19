'use strict';
const renderer = require('onml/renderer.js');
const Stats = require('stats.js');

const advRenderer = require('./advRenderer.js');

const hullTemps = require('./hullTemp.js');
const drawMap = require('./drawMap.js');


function getPageWidth() {return document.body.clientWidth;}
function getPageHeight() {return document.body.clientHeight;}

const mkRndr = (place) => {
  return renderer(document.getElementById(place));
};

let craftList = [];
let deadCraftList = [];

const iDerGenGen  = (prefix) => {
  let id = 0;
  return () => {
    id += 1;
    return prefix + '-' + id;
  };
};
const craftNamer  = iDerGenGen('HULL');
const craftIDer   = iDerGenGen('C');
//const iDGen     = iDerGenGen();
const iDWepGen    = iDerGenGen('W');

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
const makeCraft = (crafto, name, id, mapID, owner = 'player') => {
  //(crafto, name, id, owner = 'EMPIRE')
  const initWait = 10;
  advRenderer.appendRend('crafts', (['g', {id: mapID}]));
  advRenderer.appendRend('wepsRanges', (['g', {id: mapID + '-WEPS-RANGE'}]));

  let newCrafto = Object.assign(
    crafto,
    {
      id: owner[0] + id,
      mapID: mapID,

      renderer: undefined,
      wepsRangeRenderer: undefined,

      location: {x: 0, y: 0, z: 0},
      vector: {x: 0, y: 0, z: 0},
      team: teams[owner],

      weapons: [],
      ranges: [],

      status: 'normal',
      dead: false,

      name: name,
      speed: 0,
      course: 0,
      accelStat: 0,
      intercept: {},
      route: [],
      lastStop: [],
      cargo: {},
      fuel: crafto.fuelCapacity,
      owner: owner,
      waitCycle: 0 + initWait,
      render: false,
      visible: true,

      state: 'stopped'
    }
  );

  newCrafto.renderer = function () {
    advRenderer.normRend(mapID, drawMap.drawCraft(newCrafto));
  };
  newCrafto.wepsRangeRenderer = function () {
    advRenderer.normRend(mapID + '-WEPS-RANGE', drawMap.drawWepRanges(newCrafto));
  };

  makeWeps(newCrafto);

  const spawnPoint = newCrafto.team.spawnPoint;


  let point = genPoint(spawnPoint);

  newCrafto.location.x = point.x + spawnPoint.x;
  newCrafto.location.y = point.y + spawnPoint.y;

  newCrafto.vector.x = spawnPoint.vx;
  newCrafto.vector.y = spawnPoint.vy;

  calcCourse(newCrafto, newCrafto.vector);

  craftList.push(newCrafto);
  teams[owner].members.push(newCrafto);

  console.log(crafto);

  return newCrafto;
};
const calcCourse = (crafto, targeto) => {
  crafto.course = (Math.atan2(targeto.y, targeto.x) * 180 / Math.PI) - 90;
};
const makeManyCraft = (craftType, numberToMake, owner = undefined) => {
  for (let i = 0; i < numberToMake; i++) {
    const baseTemplate = hullTemps[craftType]();
    const name = craftNamer();
    const id = craftIDer();
    const mapID = id + '-MID';

    makeCraft(baseTemplate, name, id, mapID, owner);

    console.log('Made ' + name + ' (' + id + ')');
  }
};

const spawnPoints = {
  'player':  {x: 150,  y: 150, r: 50,  vx: -10, vy:-10, renderer: undefined},
  'enemy':    {x: -150, y:-150, r: 100,  vx: 10,  vy: 10, renderer: undefined}
};

const teams = {
  player: {color: 'player', spawnPoint: spawnPoints.player,  members: [], enemy: undefined, kills: 0, losses: 0},
  enemy:   {color: 'enemy',   spawnPoint: spawnPoints.enemy,    members: [], enemy: undefined, kills: 0, losses: 0}
};
teams.player.enemy = teams.enemy;
teams.enemy.enemy =   teams.player;

const makeWeps = (crafto) => {
  crafto.weaponsList.forEach(e => {
    let id = iDWepGen();
    let mapID = id;
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
      advRenderer.normRend(mapID, drawMap.drawWep(wepo));
    };
    wepo.renderer();
    hide(wepo.mapID);
    crafto.weapons.push(wepo);
  });
};

const weps = {
  MiniLance:  {damage: 1, range: 50,  reloadTime: 100,  pulseTime: 100,  color: "wepFire0"},
  Lance:      {damage: 2, range: 100, reloadTime: 1000, pulseTime: 1000, color: "wepFire1"},
  SuperLance: {damage: 3, range: 300, reloadTime: 5000, pulseTime: 1000, color: "wepFire2"}
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
  targetFrames: 60,
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
const killCraft = (crafto) => {
    crafto.dead = true;
    crafto.team.losses += 1;
    crafto.team.enemy.kills += 1;

    deadCraftList.push(crafto);
    craftList.splice(craftList.indexOf(crafto), 1);
    crafto.team.members.splice(crafto.team.members.indexOf(crafto), 1);
    crafto.weapons.forEach(wep => {
      hide(wep.mapID);
      hide(crafto.id + '-WEPRANGE');
    });
    crafto.renderer();

    console.log(crafto.id + ' destroyed');
};

const craftAI = (crafto, workTime) => {
  calcMotion(crafto, workTime);
};

const main = () => {
  console.log('Giant alien spiders are no joke.');

  let renderMain = mkRndr('content');
  renderMain(drawMap.drawPage());

  advRenderer.normRend('windowFrame', drawMap.drawWindowFrame());

  makeManyCraft('arrow', 3, 'player');
  makeManyCraft('bolt',  2,  'player');
  makeManyCraft('spear',  1,  'player');

  makeManyCraft('swarmer', 18, 'enemy');

  craftList.forEach(e => {
    e.renderer();
    e.wepsRangeRenderer();
    document.getElementById(e.id + '-SELECTOR').addEventListener('click', function () {
      e.state = 'plotting';
      console.log('Click Click');
    });
  });

  ['player', 'enemy'].forEach(e => {
    let point = spawnPoints[e];
    point.renderer = function () { advRenderer.normRend('sp-' + e, drawMap.drawSpawn(point.x, point.y, point.r, e)); };
    point.renderer();
  });

  mapPan.x = getPageWidth()/2;
  mapPan.y = getPageHeight()/2;

  changeElementTT('map', mapPan.x, mapPan.y);

  let simpRate = 1 / 1000;

  let clockZero = performance.now();
  // let currentTime = Date.now();

  //Stats FPS tracking
  var stats = new Stats();
  stats.dom.style.left = "";
  stats.dom.style.right = '0px';
  console.log(stats.dom);
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  const loop = () => {

    stats.begin(); //Stats FPS tracking

    let time = performance.now();
    let timeDelta = time - clockZero;
    clockZero = time;
    let workTime = (timeDelta * options.rate * simpRate);
    // currentTime += workTime;

    craftList.forEach(crafto => {
      craftAI(crafto, workTime);

      changeElementTT(crafto.mapID, crafto.location.x, crafto.location.y);
      changeElementTT(crafto.mapID + '-WEPS-RANGE', crafto.location.x, crafto.location.y);

      return crafto.weapons.find(wep => {
        if (wep.status === 'ready' && crafto.team.enemy.members.length > 0) {
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


    deadCraftList.forEach(crafto => {
      calcMotion(crafto, workTime);
      changeElementTT(crafto.mapID, crafto.location.x, crafto.location.y);
    });

    stats.end(); //Stats FPS tracking

    setTimeout(loop, 1000/options.targetFrames);
  };



  loop();
};

window.onload = main;
