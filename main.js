'use strict';
const renderer    = require('onml/renderer.js');
const Stats       = require('stats.js');
const advRenderer = require('./advRenderer.js');
const hullTemps   = require('./hullTemp.js');
const missileTemp = require('./missileTemp.js');
const wepTemps    = require('./wepTemp.js');
const drawMap     = require('./drawMap.js');
const ui          = require('./ui.js');

function getPageWidth() {return document.body.clientWidth;}
function getPageHeight() {return document.body.clientHeight;}

const iDerGenGen  = (prefix) => {
  let id = 0;
  return () => {
    id += 1;
    return prefix + '-' + id;
  };
};

const iDWepGen    = iDerGenGen('W');

const craftNamer  = iDerGenGen('HULL');
const craftIDer   = iDerGenGen('C');

const structNamer  = iDerGenGen('STRUCT');
const structIDer   = iDerGenGen('S');

const missileIDer   = iDerGenGen('M');

Window.options = {
  targetFrames: 60,

  rate: 1,
  simRates: [0, 0.1, 0.5, 1, 2, 3, 4],
  rateSetting: 3,
  savedRateSetting: 3,

  grid: true,
  gridStep: 10,
  gridCrossSize: 5,

  keyPanStep: 50,
  isPaused: false
};
const options = Window.options;

let craftList = [];
let structList = [];
let deadCraftList = [];
let deadStructList = [];
let activeWepsList = [];
let activeMissiles = [];
let waypointList = [];
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
    boxSettings: true,
  },
  unitSelected: false,
  selectedUnit: undefined,
  selectedChange: false,
  preppingWaypoint: false,

  waypointsUpdated: false,
  waypointList: waypointList,

  someMapUpdate: true
};
const spawnPoints = {
  'player':  {
    side: 'player',
    loc: {x: 160, y: 160, z: 0},
    r: 50,
    vec: {x:0, y:0},
    heading: 135,
    renderer: undefined},
  'enemy':    {
    side: 'enemy',
    loc: {x: -150, y: -150, z: 0},
    r: 80,
    vec:{x:0, y:0,},
    heading: 315,
    renderer: undefined}
};
const teams = {
  player: {color: 'player', spawnPoint: spawnPoints.player, members: [], munitions: [], enemy: undefined, kills: 0, losses: 0},
  enemy:   {color: 'enemy', spawnPoint: spawnPoints.enemy, members: [], munitions: [], enemy: undefined, kills: 0, losses: 0}
};
teams.player.enemy = teams.enemy;
teams.enemy.enemy = teams.player;

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
function remove(array, item) {
  let i; // Thanks Silver
  while((i = array.indexOf(item))>-1){ array.splice(i, 1); }
  return array;
}

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
const makeCraft = (crafto, name, id, mapID, owner = 'player', kit) => {
  //kit = {0: 'Lance', ammo: {}}
  const initWait = 10;

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

      mobile: true,

      loc: {x: 0, y: 0, z: 0},
      vec: {x: 0, y: 0, z: 0},
      team: teams[owner],

      waypoints: [],
      selectorsNeedUpdating: true,
      courseChange: true,

      weapons: [],
      ranges: [],

      status: 'normal',
      dead: false,

      name: name,
      speed: 0,

      heading: 0,
      updateHeading: true,

      accelStat: 0,
      intercept: {},
      route: [],
      lastStop: [],
      cargo: {},
      fuel: crafto.fuelCapacity,
      owner: owner,
      waitCycle: 0 + initWait,
      render: false,
      visible: true
    }
  );

  makeWeps(newCrafto, kit);

  advRenderer.appendRend('crafts', (['g', {id: mapID}]));
  advRenderer.appendRend('wepsRanges', (['g', {id: mapID + '-WEPS-RANGE'}]));
  advRenderer.appendRend('craftPaths', drawMap.drawCraftPath(crafto));
  hide(crafto.mapID + '-PATH');

  newCrafto.renderer = function () {
    advRenderer.normRend(mapID, drawMap.drawCraft(newCrafto));
  };
  newCrafto.wepsRangeRenderer = function () {
    advRenderer.normRend(mapID + '-WEPS-RANGE', drawMap.drawWepRanges(newCrafto, mapPan));
  };
  newCrafto.updateSelector = function () {
    drawMap.updateSelector(newCrafto);
  };


  const spawnPoint = newCrafto.team.spawnPoint;


  let point = genPoint(spawnPoint);

  newCrafto.loc.x = point.x + spawnPoint.loc.x;
  newCrafto.loc.y = point.y + spawnPoint.loc.y;

  newCrafto.heading = spawnPoint.heading;

  craftList.push(newCrafto);
  teams[owner].members.push(newCrafto);

  console.log(newCrafto);

  return newCrafto;
};
const makeStruct = (structo, name, id, mapID, loc, owner = 'player', kit) => {
  //(crafto, name, id, owner = 'EMPIRE')
  const initWait = 10;

  let newStructo = Object.assign(
    structo,
    {
      id: owner[0] + id,
      mapID: mapID,
      type: 'structure',

      renderer: undefined,
      wepsRangeRenderer: undefined,

      selected: false,
      updateSelector: undefined,

      mobile: false,

      loc: {x: 0, y: 0, z: 0},
      team: teams[owner],

      selectorsNeedUpdating: true,

      weapons: [],
      ranges: [],

      status: 'normal',
      dead: false,

      name: name,

      heading: 0,
      updateHeading: true,

      cargo: {},

      owner: owner,
      waitCycle: 0 + initWait,
      render: false,
      visible: true
    }
  );

  makeWeps(newStructo, kit);

  advRenderer.appendRend('structures', (['g', {id: mapID}]));
  advRenderer.appendRend('wepsRanges', (['g', {id: mapID + '-WEPS-RANGE'}]));

  newStructo.renderer = function () {
    advRenderer.normRend(mapID, drawMap.drawStruct(newStructo));
  };
  newStructo.wepsRangeRenderer = function () {
    advRenderer.normRend(mapID + '-WEPS-RANGE', drawMap.drawWepRanges(newStructo, mapPan));
  };
  newStructo.updateSelector = function () {
    drawMap.updateSelector(newStructo);
  };


  const spawnPoint = newStructo.team.spawnPoint;


  let point = loc;

  newStructo.loc.x = point.x + spawnPoint.loc.x;
  newStructo.loc.y = point.y + spawnPoint.loc.y;

  // newStructo.heading = spawnPoint.heading;

  structList.push(newStructo);
  teams[owner].members.push(newStructo);

  console.log(newStructo);

  return newStructo;
};
const makeAStruct = (structType, loc, owner = undefined, kit) => {
  const baseTemplate = hullTemps[structType]();
  const name = structNamer();
  const id = structIDer();
  const mapID = id + '-MID';

  makeStruct(baseTemplate, name, id, mapID, loc, owner, kit);

  console.log('Made ' + name + ' (' + id + ')');
};
const makeManyCraft = (craftType, numberToMake, owner = undefined, kit) => {
  for (let i = 0; i < numberToMake; i++) {
    const baseTemplate = hullTemps[craftType]();
    const name = craftNamer();
    const id = craftIDer();
    const mapID = id + '-MID';

    makeCraft(baseTemplate, name, id, mapID, owner, kit);

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
const makeWeps = (crafto, kit) => {
  //{0: 'SuperLance', 1:'Lance'}
  crafto.weaponsHardpoints.forEach((socket, idx) => {
    if (!kit[idx]) {
      socket.empty = true;
    } else {
      let wepTemp = wepTemps[kit[idx]]();

      let id = iDWepGen();
      let mapID = id;

      if (wepTemp.type === 'pulse') {

        let wepo = {
          ...socket,
          id: id,
          mapID: mapID,
          ...wepTemp,
          reloadProg: 0,
          counter: 0,
          status: 'ready',
          pulseProg: 0,
          renderer: undefined,
          host: crafto,
          target: {},
          empty: false,
          fireControl: function (wep, td) {wepsLanceFireAi(wep, td);}
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
      }
      if (wepTemp.type === 'launcher') {
        let wepo = {
          ...socket,
          id: id,
          mapID: mapID,
          ...wepTemp,
          reloadProg: 0,
          counter: 0,
          status: 'ready',
          host: crafto,
          target: {},
          empty: false,
          fireControl: function (wep, td) {wepsMiLaFireAi(wep, td);}
        };

        if (!wepsRangeInCraftoRanges(crafto, wepo)) {
          crafto.ranges.push(wepo.range);
        }

        crafto.weapons.push(wepo);
      }
    }
  });

  if (kit.ammo) {
    Object.keys(kit.ammo).forEach(key => {
      let ammoAmount = kit.ammo[key];
      if ( ammoAmount > crafto.cargoCap) {
        console.log(crafto.id + ' has more ammo assigned than ammo capacity.');
        ammoAmount = crafto.cargoCap;
      }
      crafto.cargo[key] = ammoAmount;
    });
  }

};
const changeElementTT = (id, x, y) => {
  document.getElementById(id).setAttribute(
    'transform', 'translate(' + x + ', ' + y + ')'
  );
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

  let wepOffset = {};
  let radians = (Math.PI / 180) * (-crafto.heading),
    cos = Math.cos(radians),
    sin = Math.sin(radians);
  wepOffset.x = (cos * wep.hx) + (sin * wep.hy);
  wepOffset.y = (cos * wep.hy) - (sin * wep.hx);

  wepLine.setAttribute('x1', crafto.loc.x * mapPan.zoom + wepOffset.x);
  wepLine.setAttribute('y1', crafto.loc.y * mapPan.zoom + wepOffset.y);
  wepLine.setAttribute('x2', enemyo.loc.x * mapPan.zoom);
  wepLine.setAttribute('y2', enemyo.loc.y * mapPan.zoom);
};
const wepsLanceFireAi = (wep, td) => {
  let crafto = wep.host;
  let enemyo = wep.target;

  switch (wep.status) {
    case 'ready':
      unhide(wep.mapID);

      enemyo.health -= wep.damage;
      wep.status = 'firing';
      wep.counter += 1;
      document.getElementById(wep.mapID).setAttribute('opacity', 1);
      console.log(crafto.id + ' fires on ' + enemyo.id + ',  HP:' + enemyo.health);

      if (enemyo.health <= 0) {kill(enemyo);}

      break;
    case 'firing':
      wep.pulseProg += td;
      document.getElementById(wep.mapID).setAttribute('opacity', ((wep.pulseTime - wep.pulseProg) / wep.pulseTime));

      if (wep.pulseProg >= wep.pulseTime) {
        remove(activeWepsList, wep);
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
const wepsMiLaFireAi = (miLa, td) => {
  if (miLa.status !== 'empty') {
    switch (miLa.status) {
      case 'ready':
        if (miLa.host.cargo.mslBeam && miLa.host.cargo.mslBeam > 0) {
          launchMissile(miLa, 'mslBeam'); //launches a missile
          miLa.status = 'reloading';
          --miLa.host.cargo.mslBeam;
        } else if (miLa.host.cargo.mslAoe && miLa.host.cargo.mslAoe > 0) {
          launchMissile(miLa, 'mslAoe');
          miLa.status = 'reloading';
          --miLa.host.cargo.mslAoe;
        } else {
          miLa.status = 'empty';
        }
        break;
      case 'reloading':
        miLa.reloadProg += td;
        if (miLa.reloadProg >= miLa.reloadTime) {
          miLa.status = 'ready';
          miLa.reloadProg = 0;
        }
        break;
    }
  }
};
const launchMissile = (miLa, type) => {
  let crafto = miLa.host;
  let enemyo = miLa.target;
  let owner = crafto.owner;

  let missileTemplate = missileTemp[type]();

  let id = missileIDer();
  const mapID = id + '-MID';

  let newMissile = Object.assign(
    missileTemplate,
    {
      id: owner[0] + id,
      mapID: mapID,
      type: 'missile',
      warheadType: type,
      target: enemyo,

      renderer: undefined,
      wepsRangeRenderer: undefined,

      selected: false,
      updateSelector: undefined,

      mobile: true,

      loc: {x: 0, y: 0, z: 0},
      vec: {x: 0, y: 0, z: 0},
      team: teams[owner],

      selectorsNeedUpdating: true,
      courseChange: true,

      status: 'normal',
      dead: false,

      speed: 0,

      heading: 0,
      updateHeading: true,

      accelStat: 0,
      cargo: {},
      fuel: crafto.fuelCapacity,
      owner: owner,
      waitCycle: 0,
      render: false,
      visible: true
    }
  );

  advRenderer.appendRend('missiles', (['g', {id: mapID}]));
  advRenderer.appendRend('missilePaths', drawMap.drawMissilePath(newMissile));

  newMissile.renderer = function () {
    advRenderer.normRend(mapID, drawMap.drawMissile(newMissile));
  };
  // newMissile.updateSelector = function () {
  //   drawMap.updateSelector(newMissile);
  // };

  newMissile.loc.x = crafto.loc.x;
  newMissile.loc.y = crafto.loc.y;

  newMissile.heading = crafto.heading;

  activeMissiles.push(newMissile);
  teams[owner].munitions.push(newMissile);

  newMissile.renderer();

  return newMissile;
};
const hide = (id) => {
  document.getElementById(id).style.visibility = "hidden";
};
const unhide = (id) => {
  document.getElementById(id).style.visibility = "visible";
};
const kill = (targeto) => {
  if (targeto.type === 'missile') killMissile(targeto);
  if (targeto.type === 'craft') killCraft(targeto);
  if (targeto.type === 'structure') killStruct(targeto);
};
const killCraft = (crafto) => {
    removeWaypoint(crafto);
    crafto.dead = true;
    crafto.team.losses += 1;
    crafto.team.enemy.kills += 1;

    deadCraftList.push(crafto);
    remove(craftList, crafto);
    remove(crafto.team.members, crafto);
    crafto.weapons.forEach(wep => {
      if (wep.type === 'pulse') {
        hide(wep.mapID);
      }
      hide(crafto.id + '-WEPRANGE');
    });
    crafto.renderer();

    console.log(crafto.id + ' destroyed');
};
const killStruct = (structo) => {
    structo.dead = true;
    structo.team.losses += 1;
    structo.team.enemy.kills += 1;

    deadStructList.push(structo);
    remove(structList, structo);
    remove(structo.team.members, structo);
    structo.weapons.forEach(wep => {
      if (wep.type === 'pulse') {
        hide(wep.mapID);
      }
      hide(structo.id + '-WEPRANGE');
    });
    structo.renderer();

    console.log(structo.id + ' destroyed');
};
const killMissile = (missileo) => {
    missileo.dead = true;
    // crafto.team.losses += 1;
    // crafto.team.enemy.kills += 1;

    remove(activeMissiles, missileo);
    remove(missileo.team.munitions, missileo);
    hide(missileo.mapID + '-PATH');
    advRenderer.normRend(missileo.mapID, []);

    console.log(missileo.id + ' destroyed');
};

const craftAI = (crafto, workTime) => {
  calcMotion(crafto, workTime);
};
const missileAI = (missileo, workTime) => {

  let relX = missileo.target.loc.x - missileo.loc.x;
  let relY = missileo.target.loc.y - missileo.loc.y;

  let newHeadingRad = ( Math.atan2(relY, relX) - (90 * Math.PI / 180));
  let newHeadingDeg = ( newHeadingRad * (180 / Math.PI) );

  missileo.vec.x = Math.sin(-newHeadingRad) * missileo.accel;
  missileo.vec.y = Math.cos(newHeadingRad) * missileo.accel;

  missileo.updateHeading = true;
  missileo.heading = newHeadingDeg;
  missileo.courseChange = false;


  ['x', 'y'].forEach(e => {
      missileo.loc[e] += missileo.vec[e] * workTime;
  });

  if (calcRange(missileo.loc, missileo.target.loc) < (missileo.range)) {
    missileo.target.health -= missileo.damage;
    if (missileo.target.health <= 0) {killCraft(missileo.target);}
    remove(activeMissiles, missileo);
    remove(missileo.team.munitions, missileo);
    hide(missileo.mapID + '-PATH');
    advRenderer.normRend(missileo.mapID, []);
  }
};
const wepsAI = (unito, workTime) => {
  return unito.weapons.find(wep => {
    if (wep.status === 'ready' && unito.team.enemy.members.length > 0) {
      return [...unito.team.enemy.members, ...unito.team.enemy.munitions].find(enemyo => {
        let range = calcRange(unito.loc, enemyo.loc);
        if (
          range < wep.range
        ) {
          if (wep.type === 'pulse') activeWepsList.push(wep);
          wep.target = enemyo;
          wep.fireControl(wep, workTime);
          return wep.target;
        }
      });
    } else if (wep.status === 'firing') {
      wep.fireControl(wep, workTime);
    } else if (wep.status === 'reloading') {
      wep.fireControl(wep, workTime);
    }
  });
};
const updateZoom = (mapPan) => {
  // Updates Zoom (WHO WHOULDA THOUGHT?)
  if (mapPan.zoomChange != 0) {
    if (mapPan.zoom + mapPan.zoomChange < 0.8) {
      mapPan.zoom = 0.8;
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
const makeWaypoint = (cursorLoc) => {
  let point = {
    craft: mapPan.selectedUnit,
    loc: {x: cursorLoc.x, y: cursorLoc.y}
  };

  mapPan.waypointsUpdated = true;

  mapPan.selectedUnit.waypoints[0] = point;
  waypointList.push(point);
};
const removeWaypoint = (crafto = mapPan.selectedUnit) => {
  if (crafto.mobile && crafto.waypoints.length > 0) {
    remove(waypointList, crafto.waypoints[0]);
    crafto.waypoints.splice(0, 1);
    hide(crafto.mapID + '-PATH');
    hide(crafto.mapID + '-WAY');
  }
};

const calcMotion = (crafto, workTime) => {
  if (crafto.waypoints.length > 0) {
    if (crafto.courseChange) {

      let relX = crafto.waypoints[0].loc.x - crafto.loc.x;
      let relY = crafto.waypoints[0].loc.y - crafto.loc.y;

      let newHeadingRad = ( Math.atan2(relY, relX) - (90 * Math.PI / 180));
      let newHeadingDeg = ( newHeadingRad * (180 / Math.PI) );

      crafto.vec.x = Math.sin(-newHeadingRad) * crafto.accel;
      crafto.vec.y = Math.cos(newHeadingRad) * crafto.accel;

      crafto.updateHeading = true;
      crafto.heading = newHeadingDeg;
      crafto.courseChange = false;

    }

    ['x', 'y'].forEach(e => {
        crafto.loc[e] += crafto.vec[e] * workTime;
    });

    if (calcRange(crafto.loc, crafto.waypoints[0].loc) < (crafto.accel * workTime)) {
      removeWaypoint(crafto);
    }
  }
};

const main = () => {
  console.log('Giant alien spiders are no joke.');

  let renderMain = mkRndr('content');
  renderMain(drawMap.drawPage());

  let renderSuperUI = mkRndr('superUI');
  renderSuperUI(drawMap.drawPausedSign());

  let renderRateCounter     = undefined;
  const initRateRenderer    = () => {
    renderRateCounter       = mkRndr('rateCounter');
  };

  let renderGrid            = mkRndr('grid');
  let renderGridEdge        = mkRndr('gridEdge');
  let renderGridScaleBar    = mkRndr('gridScaleBar');
  let renderScreenFrame     = mkRndr('screenFrame');

  advRenderer.normRend('screenFrame', drawMap.drawScreenFrame());

  let renderBoxSettings     = mkRndr('boxMainSettings');
  let renderWaypoints       = mkRndr('waypoints');

  makeManyCraft('arrow', 2, 'player', {0: 'Lance'});
  makeManyCraft('bolt', 2, 'player', {0: 'Lance'});
  makeManyCraft('spear', 2, 'player', {0: 'Lance', 1: 'SuperLance'});
  // makeManyCraft('noise', 1, 'player', {});
  makeManyCraft('lobber', 1, 'player', {0: 'MiLa', ammo: {mslBeam: 50}});
  makeManyCraft('naught', 1, 'player', {
    0: 'SuperLance',
    1: 'SuperLance',
    2: 'SuperLance',
    3: 'Lance',
    4: 'Lance',
    5: 'Lance',
    6: 'Lance'
  });



  // makeManyCraft('swarmer', 5, 'enemy', {0: 'MiniLance'});

  makeAStruct('bastion', {x:0, y:0}, 'enemy', {
    0: 'SuperLance',
    1: 'SuperLance',
    2: 'SuperLance',
    3: 'Lance',
    4: 'Lance',
    5: 'Lance',
    6: 'Lance',
    7: 'Lance',
    8: 'Lance',
    9: 'MiLa',
    ammo: {mslBeam: 50}
  });

  const reReRenderScaleBar = (options, mapPan) => {
    renderGridScaleBar(drawMap.drawGridScaleBar(options, mapPan));
  };
  const renderAllResizedStatics = (options, mapPan) => {
    renderGrid(drawMap.drawGrid(mapPan, options, reReRenderScaleBar));
    renderGridEdge(drawMap.drawGridEdge(mapPan, options));
  };

  [
    ...craftList,
    ...structList
  ].forEach(crafto => {
    crafto.renderer();
    crafto.wepsRangeRenderer();
    if (crafto.team !== teams.enemy) {ui.addCraftListeners(crafto, mapPan);}
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
    drawMap.updatePausedSign();
    renderGridEdge(drawMap.drawGridEdge(mapPan, options));
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
  placecheckBoxSettings();

  let renderers = {
    resizeWindow: resizeWindow,
    boxSettings: placecheckBoxSettings
  };

  const reRendScreenFrame = () => {
    renderScreenFrame(drawMap.drawScreenFrame());
    ui.addFrameListeners(mapPan, renderers);
  };

  reRendScreenFrame(mapPan, renderers);

  let listenExportFunctions = {
    makeWaypoint: makeWaypoint,
    removeWaypoint: removeWaypoint
  };

  ui.addListeners(options, mapPan, renderers, listenExportFunctions);

  const loop = () => {

    let time = performance.now();
    let timeDelta = time - clockZero;
    clockZero = time;
    let workTime = (timeDelta * options.rate * simpRate);
    // currentTime += workTime;

    stats.begin(); //Stats FPS tracking

    if (!options.isPaused) {
      [...craftList].forEach(unito => {
        craftAI(unito, workTime);
      });

      [...activeMissiles].forEach(missileo => {
        missileAI(missileo, workTime);
      });

      [...craftList, ...structList].forEach(unito => {
        wepsAI(unito, workTime);
      });

      deadCraftList.forEach(crafto => {
        if (crafto.mobile) {calcMotion(crafto, workTime);}
      });
    }

    if (mapPan.waypointsUpdated) {
      renderWaypoints(drawMap.drawWaypoints(waypointList, mapPan));
      mapPan.waypointsUpdated = false;
    }

    if (updateZoom(mapPan)) {
      mapPan.interceptUpdated = true;
      renderAllResizedStatics(options, mapPan);
      [
        ...craftList,
        ...structList
      ].forEach(e => {
        drawMap.updateWepRanges(e, mapPan);
      });
      drawMap.updateSpawn(spawnPoints['player'], mapPan);
      drawMap.updateSpawn(spawnPoints['enemy'], mapPan);
      drawMap.updateWaypoints(waypointList, mapPan);
      mapPan.someMapUpdate = true;
    }

    if (updatePan(mapPan)) {
      renderGrid(drawMap.drawGrid(mapPan, options, reReRenderScaleBar));
      renderGridEdge(drawMap.drawGridEdge(mapPan, options));
      mapPan.someMapUpdate = true;
    }

    if (!options.isPaused || mapPan.someMapUpdate) {
      activeWepsList.forEach(wep => {
        updateWepLine(wep);
      });

      [
        ...craftList,
        ...structList
      ].forEach(e => {
        changeElementTT(e.mapID, e.loc.x * mapPan.zoom, e.loc.y * mapPan.zoom);
        if (e.selectorsNeedUpdating && e.type) {
          e.updateSelector();
          e.selectorsNeedUpdating = false;
        }
        changeElementTT(e.mapID + '-WEPS-RANGE', e.loc.x * mapPan.zoom, e.loc.y * mapPan.zoom);

        if (e.type === 'craft') {
          if (e.updateHeading) {
            e.updateHeading = false;
            drawMap.updateCraft(e);
          }
          if (e.waypoints.length > 0) {
            unhide(e.mapID + '-PATH');
            drawMap.updateCraftPath(e, mapPan);
          }
        }
      });

      [...deadCraftList, ...deadStructList].forEach(crafto => {
        changeElementTT(crafto.mapID, crafto.loc.x * mapPan.zoom, crafto.loc.y * mapPan.zoom);
      });

      [
        ...activeMissiles
      ].forEach(e => {
        changeElementTT(e.mapID, e.loc.x * mapPan.zoom, e.loc.y * mapPan.zoom);

        if (e.updateHeading) {
          e.updateHeading = false;
          drawMap.updateCraft(e);
        }
        drawMap.updateMissilePath(e, mapPan);

      });

      mapPan.someMapUpdate = false;
    }

    stats.end(); //Stats FPS tracking

    setTimeout(loop, 1000/options.targetFrames);
  };

  loop();
};

window.onload = main;
