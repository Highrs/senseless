'use strict';
const renderer = require('onml/renderer.js');
const Stats = require('stats.js');
const advRenderer = require('./advRenderer.js');
const hullTemps = require('./hullTemp.js');
const drawMap = require('./drawMap.js');
const ui = require('./ui.js');

function getPageWidth() {return document.body.clientWidth;}
function getPageHeight() {return document.body.clientHeight;}

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

Window.options = {
  rate: 0.2,
  targetFrames: 60,

  rateSetting: 3,
  simRates: [0, 0.1, 0.5, 1, 2, 3, 4],

  grid: true,
  gridStep: 10,
  gridCrossSize: 5,

  keyPanStep: 50,
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
  },
  unitSelected: false,
  selectedUnit: undefined,
  selectedChange: false,
  preppingWaypoint: false,
};
const spawnPoints = {
  'player':  {
    side: 'player',
    loc: {x: 150, y: 150, z: 0},
    r: 50,
    vec: {x:-10, y:-10},
    renderer: undefined},
  'enemy':    {
    side: 'enemy',
    loc: {x: -150, y: -150, z: 0},
    r: 100,
    vec:{x:20, y:20,},
    renderer: undefined}
};
const teams = {
  player: {color: 'player', spawnPoint: spawnPoints.player,  members: [], enemy: undefined, kills: 0, losses: 0},
  enemy:   {color: 'enemy',   spawnPoint: spawnPoints.enemy,    members: [], enemy: undefined, kills: 0, losses: 0}
};
teams.player.enemy = teams.enemy;
teams.enemy.enemy = teams.player;
const weps = {
  MiniLance:  {damage: 1, range: 50,  reloadTime: 0.100,  pulseTime: 0.100,  color: "wepFire0"},
  Lance:      {damage: 2, range: 100, reloadTime: 1.000, pulseTime: 1.000, color: "wepFire1"},
  SuperLance: {damage: 3, range: 300, reloadTime: 5.000, pulseTime: 1.000, color: "wepFire2"}
};
let craftList = [];
let deadCraftList = [];
let activeWepsList = [];
function rand(mean, deviation, prec = 0, upper = Infinity, lower = -Infinity) {
  let max = mean + deviation > upper ? upper : mean + deviation;
  let min = mean - deviation < lower ? lower : mean - deviation;

  return (
    ( Math.round(
      (Math.random() * (max - min) + min) * (0 ** prec)
    ) / (10 ** prec)
    )
  );
}
const sqrt  = Math.sqrt;

const mkRndr = (place) => {
  return renderer(document.getElementById(place));
};
const genPoint = (spawnPoint, point = {x: 0, y: 0}) => {
  point.x = rand(0, spawnPoint.r);
  point.y = rand(0, spawnPoint.r);

  if ( calcRange({x: 0, y: 0}, point) > spawnPoint.r ) {
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
      type: 'craft',

      renderer: undefined,
      wepsRangeRenderer: undefined,

      selected: false,
      updateSelector: undefined,

      loc: {x: 0, y: 0, z: 0},
      vec: {x: 0, y: 0, z: 0},
      team: teams[owner],
      waypoints: [],

      weapons: [],
      ranges: [],

      status: 'normal',
      dead: false,

      name: name,
      speed: 0,
      heading: 0,
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
      updateHeading: true,

      state: 'normal'
    }
  );

  newCrafto.renderer = function () {
    advRenderer.normRend(mapID, drawMap.drawCraft(newCrafto));
  };
  newCrafto.wepsRangeRenderer = function () {
    advRenderer.normRend(mapID + '-WEPS-RANGE', drawMap.drawWepRanges(newCrafto, mapPan));
  };
  newCrafto.updateSelector = function () {
    drawMap.updateSelector(newCrafto);
  };

  makeWeps(newCrafto);

  const spawnPoint = newCrafto.team.spawnPoint;


  let point = genPoint(spawnPoint);

  newCrafto.loc.x = point.x + spawnPoint.loc.x;
  newCrafto.loc.y = point.y + spawnPoint.loc.y;

  newCrafto.vec.x = spawnPoint.vec.x;
  newCrafto.vec.y = spawnPoint.vec.y;

  //calcHeading({x:0, y:0}, newCrafto.vec);

  craftList.push(newCrafto);
  teams[owner].members.push(newCrafto);

  return newCrafto;
};
const calcHeading = (crafto) => {
  let newHeading = (Math.atan2(crafto.vec.y, crafto.vec.x) * 180 / Math.PI) - 90;
  if (newHeading !== crafto.heading) {
    crafto.updateHeading = true;
    crafto.heading = newHeading;
  }
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
const wepsRangeInCraftoRanges = (crafto, wepo) => {
  return crafto.ranges.find(range => {
    if (range === wepo.range) {
      return true;
    }
  });
};
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

    if (!wepsRangeInCraftoRanges(crafto, wepo)) {
      crafto.ranges.push(wepo.range);
    }

    advRenderer.appendRend('weps', (['g', {id: mapID}]));
    wepo.renderer = function () {
      advRenderer.normRend(mapID, drawMap.drawWep(wepo));
    };
    wepo.renderer();
    hide(wepo.mapID);
    crafto.weapons.push(wepo);
  });
};
const changeElementTT = (id, x, y) => {
  document.getElementById(id).setAttribute(
    'transform', 'translate(' + x + ', ' + y + ')'
  );
};
const calcMotion = (crafto, workTime) => {
  ['x', 'y'].forEach(e => {
      crafto.loc[e] += crafto.vec[e] * workTime;
    });
};
const calcRange = (pt1, pt2) => {
  const dx = pt1.x - pt2.x;
  const dy = pt1.y - pt2.y;
  return sqrt((dx * dx) + (dy * dy));
};
const updateWepLine = (wep) => {
  let enemyo = wep.target;
  let crafto = wep.host;
  let wepLine = document.getElementById(wep.mapID + '-LINE');
  wepLine.setAttribute('x1', crafto.loc.x * mapPan.zoom);
  wepLine.setAttribute('y1', crafto.loc.y * mapPan.zoom);
  wepLine.setAttribute('x2', enemyo.loc.x * mapPan.zoom);
  wepLine.setAttribute('y2', enemyo.loc.y * mapPan.zoom);
};
const wepsFire = (wep, td) => {
  let crafto = wep.host;
  let enemyo = wep.target;

  switch (wep.status) {
    case 'ready':
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
        activeWepsList.splice(activeWepsList.indexOf(wep), 1);
        wep.status = 'reloading';
        wep.pulseProg = 0;
        wep.target = {};
        hide(wep.mapID);
      }
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
const updateZoom = (mapPan) => {
  // Updates Zoom (WHO WHOULDA THOUGHT?)
  if (mapPan.zoomChange != 0) {
    if (mapPan.zoom + mapPan.zoomChange < 1) {
      mapPan.zoom = 1;
    } else if (mapPan.zoom + mapPan.zoomChange > 20) {
      mapPan.zoom = 20;
    } else {
      mapPan.zoom += mapPan.zoomChange;
    }
    mapPan.x = mapPan.mousePosX + (mapPan.x - mapPan.mousePosX) * (mapPan.zoom / mapPan.zoomLast);
    mapPan.y = mapPan.mousePosY + (mapPan.y - mapPan.mousePosY) * (mapPan.zoom / mapPan.zoomLast);

    mapPan.zoomChange = 0;
    mapPan.zoomLast = mapPan.zoom;
    return true;
  }
  return false;
};
const updatePan = (mapPan) => {
  // Update Pan here, who woulda guessed
  if ((mapPan.x != mapPan.xLast) || (mapPan.y != mapPan.yLast)) {
    changeElementTT('map', mapPan.x, mapPan.y);
    mapPan.xLast = mapPan.x;
    mapPan.yLast = mapPan.y;
    return true;
  }
  return false;
};

const main = () => {
  console.log('Giant alien spiders are no joke.');

  let renderMain = mkRndr('content');
  renderMain(drawMap.drawPage());

  let renderRateCounter     = undefined;
  const initRateRenderer = () => {
    renderRateCounter     = mkRndr('rateCounter');
  };

  let renderGrid            = mkRndr('grid');
  let renderGridScaleBar    = mkRndr('gridScaleBar');
  let renderScreenFrame     = mkRndr('screenFrame');

  advRenderer.normRend('screenFrame', drawMap.drawScreenFrame());

  let renderBoxSettings     = mkRndr('boxMainSettings');

  makeManyCraft('arrow', 3, 'player');
  makeManyCraft('bolt', 2, 'player');
  makeManyCraft('spear', 1, 'player');

  makeManyCraft('swarmer', 15, 'enemy');

  //CHANGE 'IS PAUSED' TO SEPARATE AI AND ZOOM/PAN!!!

  function reReRenderScaleBar(options, mapPan) {
    renderGridScaleBar(drawMap.drawGridScaleBar(options, mapPan));
  }
  const renderAllResizedStatics = (options, mapPan) => {
    renderGrid(drawMap.drawGrid(mapPan, options, reReRenderScaleBar));
  };

  craftList.forEach(crafto => {
    crafto.renderer();
    crafto.wepsRangeRenderer();
    ui.addCraftListeners(crafto, mapPan);
  });

  ['player', 'enemy'].forEach(e => {
    let point = spawnPoints[e];
    point.renderer = function () {
      advRenderer.normRend('sp-' + e, drawMap.drawSpawn(point, mapPan));
    };
    point.updater = function () {
      drawMap.updateSpawn(point, mapPan);
    };

    point.renderer();
    point.updater();
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
  stats.dom.style.right = '3px';
  stats.dom.style.top = '3px';
  stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild( stats.dom );

  const updateRateCounter = (options) => {
    renderRateCounter(drawMap.drawRateCounter(options));
  };

  const resizeWindow = () => {
    document.getElementById('allTheStuff').setAttribute('width', getPageWidth());
    document.getElementById('allTheStuff').setAttribute('height', getPageHeight());
    document.getElementById('allTheStuff').setAttribute('viewBox',
      [0, 0, getPageWidth() + 1, getPageHeight() + 1].join(' ')
    );
    reRendScreenFrame();
  };

  const placecheckBoxSettings = () => {
    if (mapPan.boxes.boxSettings) {
      renderBoxSettings(drawMap.drawBoxSettings());
      ui.addBoxSettingsListeners(mapPan, renderBoxSettings);
      ui.addRateListeners(options, updateRateCounter);
      initRateRenderer();
      updateRateCounter(options);
    }
    else {
      renderBoxSettings([]);
    }
  };

  let renderers = {
    resizeWindow: resizeWindow,
    boxSettings: placecheckBoxSettings
  };

  const reRendScreenFrame = () => {
    renderScreenFrame(drawMap.drawScreenFrame());
    ui.addFrameListeners(mapPan, renderers);
  };

  reRendScreenFrame(mapPan, renderers);

  ui.addListeners(options, mapPan, renderers);

  const loop = () => {

    let time = performance.now();
    let timeDelta = time - clockZero;
    clockZero = time;
    let workTime = (timeDelta * options.rate * simpRate);
    // currentTime += workTime;

    stats.begin(); //Stats FPS tracking

    if (!options.isPaused) {
      craftList.forEach(crafto => {
        craftAI(crafto, workTime);
        calcHeading(crafto);

        return crafto.weapons.find(wep => {
          if (wep.status === 'ready' && crafto.team.enemy.members.length > 0) {
            return crafto.team.enemy.members.find(enemyo => {
              let range = calcRange(crafto.loc, enemyo.loc);
              if (
                range < wep.range
              ) {
                activeWepsList.push(wep);
                wep.target = enemyo;
                wepsFire(wep, workTime);
                return wep.target;
              }
            });
          } else if (wep.status === 'firing') {
            wepsFire(wep, workTime);
          } else if (wep.status === 'reloading') {
            wepsFire(wep, workTime);
          }
        });
      });

      deadCraftList.forEach(crafto => {
        calcMotion(crafto, workTime);
      });
    }

    // if (mapPan.selectedChange) {
    //   mapPan.selectedUnit.updateSelector;
    // }

    let someMapUpdate = false;
    if (updateZoom(mapPan)) {
      mapPan.interceptUpdated = true;
      renderAllResizedStatics(options, mapPan);
      craftList.forEach(e => {drawMap.updateWepRanges(e, mapPan);});
      drawMap.updateSpawn(spawnPoints['player'], mapPan);
      drawMap.updateSpawn(spawnPoints['enemy'], mapPan);
      someMapUpdate = true;
    }

    if (updatePan(mapPan)) {
      renderGrid(drawMap.drawGrid(mapPan, options, reReRenderScaleBar));
      someMapUpdate = true;
    }

    if (!options.isPaused || someMapUpdate) {
      activeWepsList.forEach(wep => {
        updateWepLine(wep);
      });

      [
        ...craftList
      ].forEach(e => {
        changeElementTT(e.mapID, e.loc.x * mapPan.zoom, e.loc.y * mapPan.zoom);
        if (e.type === 'craft') {
          changeElementTT(e.mapID + '-WEPS-RANGE', e.loc.x * mapPan.zoom, e.loc.y * mapPan.zoom);
          if (e.updateHeading) {
            e.updateHeading = false;
            drawMap.updateCraft(e);
          }
        }
      });

      deadCraftList.forEach(crafto => {
        changeElementTT(crafto.mapID, crafto.loc.x * mapPan.zoom, crafto.loc.y * mapPan.zoom);
      });
    }

    stats.end(); //Stats FPS tracking

    setTimeout(loop, 1000/options.targetFrames);
  };

  loop();
};

window.onload = main;
