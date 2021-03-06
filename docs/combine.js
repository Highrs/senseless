(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

const stringify = require('onml/stringify.js');

exports.appendRend = (root, ml) => {
  const content = (typeof root === 'string')
    ? document.getElementById(root)
    : root;

  let str;
  try {
    str = stringify(ml);
    content.innerHTML += str;
  } catch (err) {
    console.log(ml);
  }
};

exports.normRend = (root, ml) => {
  const content = (typeof root === 'string')
    ? document.getElementById(root)
    : root;

  let str;
  try {
    str = stringify(ml);
    content.innerHTML = str;
  } catch (err) {
    console.log(ml);
  }
};

},{"onml/stringify.js":8}],2:[function(require,module,exports){
const getSvg = require('./get-svg.js');
const tt = require('onml/tt.js');
const icons = require('./icons.js');

function getPageWidth() {return Math.max(document.body.clientWidth, window.innerWidth);}
function getPageHeight() {return Math.max(document.body.clientHeight, window.innerHeight);}

exports.drawCraft = (crafto) => {
  let drawnCraft = ['g', {id: crafto.id},
    ['line', {
      id: crafto.mapID + '-VECT_LINE',
      x1: 0,
      y1: 0,
      x2: crafto.vec.x,
      y2: crafto.vec.y,
      class: 'vector'
    }],
    ['g', {
      transform: 'translate('+crafto.vec.x+', '+crafto.vec.y+')',
      id: crafto.mapID + '-VECT_DOT'
    }, [
      'circle',
      {r : 2, class: 'vector'}
    ]]
  ];

  drawnCraft.push(
    ['g', {
        transform: 'rotate(' + crafto.heading + ')',
        id: crafto.mapID + '-ROT'
      },
      icons.craft(crafto)
    ]
  );

  if (!crafto.dead) {
    drawnCraft.push(
      ['text', {
        x: 5,
        y: 5,
        class: 'craftIconText ' + crafto.team.color +'Fill'
      },
        crafto.id
      ]
    );
  }

  drawnCraft.push(
    icons.brackets(crafto.id, 2)
  );

  return drawnCraft;
};
exports.updateCraft = (crafto) => {
  document.getElementById(crafto.mapID + '-ROT').setAttribute(
    'transform', 'rotate(' + (crafto.heading) + ')'
  );

  document.getElementById(crafto.mapID + '-VECT_LINE').setAttribute(
    'x2', '' + crafto.vec.x
  );
  document.getElementById(crafto.mapID + '-VECT_LINE').setAttribute(
    'y2', '' + crafto.vec.y
  );

  document.getElementById(crafto.mapID + '-VECT_DOT').setAttribute(
    'transform', 'translate('+crafto.vec.x+', '+crafto.vec.y+')'
  );

};
exports.drawWepRanges = (crafto, mapPan) => {

  let drawnRanges = ['g', {id: crafto.id + '-WEPRANGE'}];
  let i = 0;
  crafto.ranges.forEach(range => {
    drawnRanges.push(['circle', {
      r: range * mapPan.zoom,
      id: crafto.id + '-WEPRANGE-' + i,
      class: 'wepsRangeCircle ' + crafto.team.color + ' ' + crafto.team.color +'Fill'
    }]);
    i++;
  });
  return drawnRanges;
};
exports.updateWepRanges = (crafto, mapPan) => {
  let i = 0;
  crafto.ranges.forEach(range => {
    document.getElementById(crafto.id + '-WEPRANGE-' + i).setAttribute(
      'r', '' + mapPan.zoom * range
    );
    i++;
  });
};

exports.drawWep = (wepo) => {
  let drawnWep = ['g', {}];

  drawnWep.push(
    ['line', {
      id: wepo.mapID + '-LINE',
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      class: wepo.color
    }]
  );

  return drawnWep;
};
exports.drawSpawn = (point, mapPan) => {
  let drawnPoint = ['g', {
    id: 'spawnPoint-' + point.side
  }];

  drawnPoint.push(
    ['circle', {
      r: point.r * mapPan.zoom,
      class:  'spawnPoint ' + point.side,
      id: 'spawnPointRadius-' + point.side
    }]
  );

  return drawnPoint;
};
exports.updateSpawn = (point, mapPan) => {
  document.getElementById('spawnPointRadius-' + point.side).setAttribute(
    'r', '' + mapPan.zoom * point.r
  );
  document.getElementById('spawnPoint-' + point.side).setAttribute(
    'transform', 'translate(' + point.loc.x * mapPan.zoom + ', ' + point.loc.y * mapPan.zoom + ')'
  );
};

exports.drawScreenFrame = () => {
  let frame = ['g', {},
    ['path',
      { d: 'M 40, 2 L 2, 2 L 2, 40',
      class: 'frame' }],
    ['path',
      { d: 'M ' + (getPageWidth() - 40) + ', 2 L ' + (getPageWidth() - 2) + ', 2 L ' + (getPageWidth() - 2) + ', 40',
      class: 'frame' }],
    ['path',
      { d: 'M ' + (getPageWidth() - 40) + ', ' + (getPageHeight() - 2) + ' L ' + (getPageWidth() - 2) + ', ' + (getPageHeight() - 2) + ' L ' + (getPageWidth() - 2) + ', ' + (getPageHeight() - 40) + '',
      class: 'frame' }],
    ['path',
      { d: 'M 40, ' + (getPageHeight() - 2) + ' L 2, ' + (getPageHeight() - 2) + ' L 2, ' + (getPageHeight() - 40) + '',
      class: 'frame' }]
    ];

    // frame.push( ['g', tt(4,4),
    //   ['g', tt(0, 0, {id:'buttonSettings', class: 'standardBoxSelectable'}),
    //     ['rect', {width: 30, height: 30}],
    //     ['g', tt(15,15),
    //       ['path', {d:'M 12 -9 -12 -9', class:'UIcon'}],
    //       ['path', {d:'M 12 0 -12 0', class:'UIcon'}],
    //       ['path', {d:'M 12 9 -12 9', class:'UIcon'}],
    //     ]
    //   ]
    // ]);
    // frame.push( ['g', tt(4,38),
    //   ['g', tt(0, 0, {id:'button', class: 'standardBoxSelectable'}),
    //     ['rect', {width: 30, height: 30}],
    //   ]
    // ]);

  return frame;
};

const drawGrid = (mapPan, options, reReRenderScaleBar) => {
  let grid = ['g', {}];
  let actualGridStep = options.gridStep * mapPan.zoom;
  if (actualGridStep < 100) {actualGridStep *= 10;}

  let gridRectStartX = - mapPan.x + (mapPan.x) % (actualGridStep) - actualGridStep;
  let gridRectStartY = - mapPan.y + (mapPan.y) % (actualGridStep) - actualGridStep;
  let gridRectEndX = gridRectStartX + getPageWidth() + actualGridStep * 2;
  let gridRectEndY = gridRectStartY + getPageHeight() + actualGridStep * 2;

  for (let x = gridRectStartX; x < (gridRectEndX); x += actualGridStep) {
    for (let y = gridRectStartY; y < (gridRectEndY); y += actualGridStep) {
      grid.push(
        icons.gridCross(options.gridCrossSize,  x,  y)
      );
    }
  }

  reReRenderScaleBar(options, mapPan);

  return grid;
};
exports.drawGrid = drawGrid;
exports.drawGridScaleBar = (options, mapPan) => {
  let actualGridStep = options.gridStep * mapPan.zoom;
  let gridStep = actualGridStep;
  let label = "10";
  if (actualGridStep < 100) {
    gridStep = actualGridStep *= 10;
    label = "100";
  }
  let stepTenth = gridStep / 10;
  let bar = ['g', tt(5, (getPageHeight()-30-5))];

  bar.push(['rect', {y: 10, height: 20, width: gridStep + 10, class:'standardBox'}]);


  for (let i = 0; i < 10; i+= 2) {
    bar.push(['g', tt(i * (stepTenth) + 5, 15),
      ['path', {
        d: 'M 0,0 L '+ (stepTenth) + ', 0 L '+ (stepTenth) + ', 7 L 0, 7 Z',
        class:'scaleEmpty',
      }]
    ]);
    bar.push(['g', tt((i + 1) * (stepTenth) + 5, 20),
      ['path', {
        d: 'M 0,-2 L '+ (stepTenth) + ', -2 L '+ (stepTenth) + ', 5 L 0, 5 Z',
        class:'scaleFull',
      }]
    ]);
  }

  bar.push(['g', tt(0,-10),
    ['rect', {height: 20, width: 20, class:'standardBox'}],
    ['text', {y: 15.5, x: 4.5, class:'craftDataText'}, "0"]
  ]);
  bar.push(['g', tt(20,-10),
    ['rect', {height: 20, width: 40, class:'standardBox'}],
    ['text', {y: 15.5, x: 4.5, class:'craftDataText'}, "Mkm"]
  ]);
  bar.push(['g', tt(gridStep - 30, -10),
    ['rect', {height: 20, width: 40, class:'standardBox'}],
    ['text', {y: 15.5, x: 4.5, class:'craftDataText'}, label]
  ]);

  return bar;
};

exports.drawPage = () => {

  return getSvg({w:getPageWidth(), h:getPageHeight() , i:'allTheStuff'}).concat([
    ['defs'],

    ['g', {id: 'gridScaleBar'}],
    ['g', {id: 'screenFrame'}],
    ['g', {id: 'map'},
      ['g', {id: 'grid'}],
      ['g', {id: 'wepsRanges'}],
      ['g', {id: 'spawnPoints'},
        ['g', {id: 'sp-player'}],
        ['g', {id: 'sp-enemy'}]
      ],
      ['g', {id: 'weps'}],
      ['g', {id: 'crafts'}]
    ]
  ]);
};

},{"./get-svg.js":3,"./icons.js":5,"onml/tt.js":9}],3:[function(require,module,exports){
module.exports = cfg => {
  cfg = cfg || {};
  cfg.w = cfg.w || 880;
  cfg.h = cfg.h || 256;
  cfg.i = cfg.i || 'sveg';
  return ['svg', {
   xmlns: 'http://www.w3.org/2000/svg',
    width: cfg.w + 1,
    height: cfg.h + 1,
    id: cfg.i,
    viewBox: [0, 0, cfg.w + 1, cfg.h + 1].join(' '),
    class: 'panel'
  }];
};

},{}],4:[function(require,module,exports){
module.exports = {
  arrow: () => ({
    class: 'Arrow',
    abr: 'ARR',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    home: 'astroDeltaB',
    weaponsList: ['Lance'],
    health: 5
  }),

  bolt: () => ({
    class: 'Bolt',
    abr: 'BLT',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    home: 'astroDeltaB',
    weaponsList: ['Lance'],
    health: 8
  }),

  swarmer: () => ({
    class: 'Swarmer',
    abr: 'SWM',
    type: 'combat',
    cargoCap: 0,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    home: 'astroDeltaB',
    weaponsList: ['MiniLance'],
    health: 3
  }),

  spear: () => ({
    class: 'Spear',
    abr: 'SPR',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    home: 'astroDeltaB',
    weaponsList: ['SuperLance', 'Lance'],
    health: 20
  }),
};

},{}],5:[function(require,module,exports){
const tt = require('onml/tt.js');

module.exports = {
  craft: (crafto) => {
    const icono = {
      Arrow: 'M 0, 0 L  3,-3 L  0, 5 L -3,-3 Z',
      Bolt:  'M 0,-5 L  3,-3 L  0, 5 L -3,-3 Z',
      Spear: 'M 0,-5 L -2,-2 L -6, 0 L -3, 2 L -2, 5 L -1, 8 L 0, 10 L 1,8 L 2, 5 L 3, 2 L 6, 0 L 2,-2 Z'
    };

    let iconString =
      icono[crafto.class] ?
      icono[crafto.class] :
      'M 0,3 L 3,0 L 0,-3 L -3,0 Z';



    let drawnHull = ['g', {}];

    let paint = 'craftIcon ' + crafto.team.color;

    if (crafto.dead) {
      paint = 'craftIcon ' + crafto.team.color + 'Dead';
    }

    drawnHull.push(
      ['path', {
        //transform: 'scale(2, 2)',
        d: iconString,
        class: paint
      }]
    );

    return drawnHull;
  },
  brackets:     (iD, margin = 0, offsetY = 0) => {
    let corner = 10 + margin;
    let sides = corner - 5;
    return ['g', tt(0, offsetY, {class: 'standardSelector', id:iD + '-SELECTOR'}),
      ['rect', {
        x:-corner,
        y:-corner,
        height: corner*2,
        width: corner*2,
        class: 'invisibleBox'
      }],
      ['path', {d: 'M  '+corner+',  '+sides+' L  '+corner+',  '+corner+' L  '+sides+',  '+corner}],
      ['path', {d: 'M -'+corner+', -'+sides+' L -'+corner+', -'+corner+' L -'+sides+', -'+corner}],
      ['path', {d: 'M  '+corner+', -'+sides+' L  '+corner+', -'+corner+' L  '+sides+', -'+corner}],
      ['path', {d: 'M -'+corner+',  '+sides+' L -'+corner+',  '+corner+' L -'+sides+',  '+corner}]
    ];
  },
  gridCross:    (crossSize, x, y) => {
    return ['g', {},
      ['line', {
        x1: x - crossSize, y1: y,
        x2: x + crossSize, y2: y,
        class: 'grid'
      }],
      ['line', {
        x1: x, y1: y + crossSize,
        x2: x, y2: y - crossSize,
        class: 'grid'
      }]
    ];
  }

};

},{"onml/tt.js":9}],6:[function(require,module,exports){
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
  rate: 1,
  targetFrames: 60,

  grid: true,
  gridStep: 10,
  gridCrossSize: 5,
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
teams.enemy.enemy =   teams.player;
const weps = {
  MiniLance:  {damage: 1, range: 50,  reloadTime: 100,  pulseTime: 100,  color: "wepFire0"},
  Lance:      {damage: 2, range: 100, reloadTime: 1000, pulseTime: 1000, color: "wepFire1"},
  SuperLance: {damage: 3, range: 300, reloadTime: 5000, pulseTime: 1000, color: "wepFire2"}
};
let craftList = [];
let deadCraftList = [];
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

      loc: {x: 0, y: 0, z: 0},
      vec: {x: 0, y: 0, z: 0},
      team: teams[owner],

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
      updateHeading: true

      //state: 'stopped'
    }
  );

  newCrafto.renderer = function () {
    advRenderer.normRend(mapID, drawMap.drawCraft(newCrafto));
  };
  newCrafto.wepsRangeRenderer = function () {
    advRenderer.normRend(mapID + '-WEPS-RANGE', drawMap.drawWepRanges(newCrafto, mapPan));
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
const changeElementTT = (id, x, y) => {
  document.getElementById(id).setAttribute(
    'transform', 'translate(' + x + ', ' + y + ')'
  );
};
const calcMotion = (crafto, timeDelta) => {
  ['x', 'y'].forEach(e => {
      crafto.loc[e] += crafto.vec[e] * timeDelta;
    });
};
// const boundsCheck = (x, y, margin = 10) => {
//   if (
//     x + margin > 0 &&
//     x - margin < getPageWidth() &&
//     y + margin > 0 &&
//     y - margin < getPageHeight()
//   ) {
//     return true;
//   } else {
//     return false;
//   }
// };
const calcRange = (pt1, pt2) => {
  const dx = pt1.x - pt2.x;
  const dy = pt1.y - pt2.y;
  return sqrt((dx * dx) + (dy * dy));
};
const updateWepLine = (crafto, enemyo, wep) => {
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

  let renderGrid            = mkRndr('grid');
  let renderGridScaleBar    = mkRndr('gridScaleBar');
  let renderScreenFrame     = mkRndr('screenFrame');

  advRenderer.normRend('screenFrame', drawMap.drawScreenFrame());

  makeManyCraft('arrow', 3, 'player');
  makeManyCraft('bolt', 2, 'player');
  makeManyCraft('spear', 1, 'player');

  makeManyCraft('swarmer', 18, 'enemy');

  function reReRenderScaleBar(options, mapPan) {
    renderGridScaleBar(drawMap.drawGridScaleBar(options, mapPan));
  }
  const renderAllResizedStatics = (options, mapPan) => {
    renderGrid(drawMap.drawGrid(mapPan, options, reReRenderScaleBar));
  };

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

  const resizeWindow = () => {
    document.getElementById('allTheStuff').setAttribute('width', getPageWidth());
    document.getElementById('allTheStuff').setAttribute('height', getPageHeight());
    document.getElementById('allTheStuff').setAttribute('viewBox',
      [0, 0, getPageWidth() + 1, getPageHeight() + 1].join(' ')
    );
    reRendScreenFrame();
  };
  const reRendScreenFrame = () => {
    renderScreenFrame(drawMap.drawScreenFrame());
    //ui.addFrameListeners(mapPan, renderers);
  };


  let renderers = {
    resizeWindow: resizeWindow,
  };

  ui.addListeners(options, mapPan, renderers);

  const loop = () => {

    stats.begin(); //Stats FPS tracking

    let time = performance.now();
    let timeDelta = time - clockZero;
    clockZero = time;
    let workTime = (timeDelta * options.rate * simpRate);
    // currentTime += workTime;

    if (!options.isPaused) {

      if (updateZoom(mapPan)) {
        mapPan.interceptUpdated = true;
        renderAllResizedStatics(options, mapPan);
        craftList.forEach(e => {drawMap.updateWepRanges(e, mapPan);});
        drawMap.updateSpawn(spawnPoints['player'], mapPan);
        drawMap.updateSpawn(spawnPoints['enemy'], mapPan);
      }

      if (updatePan(mapPan)) {
        renderGrid(drawMap.drawGrid(mapPan, options, reReRenderScaleBar));
      }

      craftList.forEach(crafto => {
        craftAI(crafto, workTime);
        calcHeading(crafto);

        //changeElementTT(crafto.mapID, crafto.loc.x, crafto.loc.y);
        //changeElementTT(crafto.mapID + '-WEPS-RANGE', crafto.loc.x, crafto.loc.y);

        return crafto.weapons.find(wep => {
          if (wep.status === 'ready' && crafto.team.enemy.members.length > 0) {
            return crafto.team.enemy.members.find(enemyo => {
              let range = calcRange(crafto.loc, enemyo.loc);
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
        // const inBounds = boundsCheck(e.loc.x * mapPan.zoom + mapPan.x, e.loc.y * mapPan.zoom + mapPan.y, 30);
        //
        // if (!e.render && inBounds) {
        //   e.render = true;
        //   e.renderer();
        // } else if (e.render && !inBounds) {
        //   e.render = false;
        //   e.renderer([]);
        // } else if (e.render && inBounds) {
        //   //make tt changes integrated into crafto object
        //   changeElementTT(e.mapID, e.loc.x * mapPan.zoom, e.loc.y * mapPan.zoom);
        //   if (e.type === 'craft') {
        //     changeElementTT(e.mapID + '-WEPS-RANGE', e.loc.x * mapPan.zoom, e.loc.y * mapPan.zoom);
        //   }
        // } else if (!e.render && !inBounds) {
        //   // do nothing
        // } else {
        //   console.log('Unknown render state for:');
        //   console.log(e);
        // }

        // if (e.type === 'craft' && e.render) {
        //   drawMap.updateCraft(e);
        // }
      });

      deadCraftList.forEach(crafto => {
        calcMotion(crafto, workTime);
        changeElementTT(crafto.mapID, crafto.loc.x * mapPan.zoom, crafto.loc.y * mapPan.zoom);
      });

    }

    stats.end(); //Stats FPS tracking

    setTimeout(loop, 1000/options.targetFrames);
  };

  loop();
};

window.onload = main;

},{"./advRenderer.js":1,"./drawMap.js":2,"./hullTemp.js":4,"./ui.js":11,"onml/renderer.js":7,"stats.js":10}],7:[function(require,module,exports){
'use strict';

const stringify = require('./stringify.js');

const renderer = root => {
  const content = (typeof root === 'string')
    ? document.getElementById(root)
    : root;

  return ml => {
    let str;
    try {
      str = stringify(ml);
      content.innerHTML = str;
    } catch (err) {
      console.log(ml);
    }
  };
};

module.exports = renderer;

/* eslint-env browser */

},{"./stringify.js":8}],8:[function(require,module,exports){
'use strict';

const isObject = o => o && Object.prototype.toString.call(o) === '[object Object]';

function indenter (indentation) {
  if (!(indentation > 0)) {
    return txt => txt;
  }
  var space = ' '.repeat(indentation);
  return txt => {

    if (typeof txt !== 'string') {
      return txt;
    }

    const arr = txt.split('\n');

    if (arr.length === 1) {
      return space + txt;
    }

    return arr
      .map(e => (e.trim() === '') ? e : space + e)
      .join('\n');
  };
}

const clean = txt => txt
  .split('\n')
  .filter(e => e.trim() !== '')
  .join('\n');

function stringify (a, indentation) {
  const cr = (indentation > 0) ? '\n' : '';
  const indent = indenter(indentation);

  function rec(a) {
    let body = '';
    let isFlat = true;

    let res;
    const isEmpty = a.some((e, i, arr) => {
      if (i === 0) {
        res = '<' + e;
        return (arr.length === 1);
      }

      if (i === 1) {
        if (isObject(e)) {
          Object.keys(e).map(key => {
            let val = e[key];
            if (Array.isArray(val)) {
              val = val.join(' ');
            }
            res += ' ' + key + '="' + val + '"';
          });
          if (arr.length === 2) {
            return true;
          }
          res += '>';
          return;
        }
        res += '>';
      }

      switch (typeof e) {
      case 'string':
      case 'number':
      case 'boolean':
      case 'undefined':
        body += e + cr;
        return;
      }

      isFlat = false;
      body += rec(e);
    });

    if (isEmpty) {
      return res + '/>' + cr; // short form
    }

    return isFlat
      ? res + clean(body) + '</' + a[0] + '>' + cr
      : res + cr + indent(body) + '</' + a[0] + '>' + cr;
  }

  return rec(a);
}

module.exports = stringify;

},{}],9:[function(require,module,exports){
'use strict';

module.exports = (x, y, obj) => {
  let objt = {};
  if (x || y) {
    const tt = [x || 0].concat(y ? [y] : []);
    objt = {transform: 'translate(' + tt.join(',') + ')'};
  }
  obj = (typeof obj === 'object') ? obj : {};
  return Object.assign(objt, obj);
};

},{}],10:[function(require,module,exports){
// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){"object"===typeof exports&&"undefined"!==typeof module?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});

},{}],11:[function(require,module,exports){
'use strict';

exports.addListeners = (options, mapPan, renderers) => {
  const checkKey = (e) => {
    if      (e.keyCode == '38') {/* up arrow */     mapPan.y += options.keyPanStep;}
    else if (e.keyCode == '40') {/* down arrow */   mapPan.y -= options.keyPanStep;}
    else if (e.keyCode == '37') {/* left arrow */   mapPan.x += options.keyPanStep;}
    else if (e.keyCode == '39') {/* right arrow */  mapPan.x -= options.keyPanStep;}
  };
  function pause() { options.isPaused = true; console.log('|| Paused');}
  function play() { options.isPaused = false; console.log('>> Unpaused');}

  window.addEventListener('blur', pause);
  window.addEventListener('focus', play);
  window.addEventListener('resize', function() {renderers.resizeWindow();});

  document.onkeydown = checkKey;
  let isPanning = false;
  let pastOffsetX = 0;
  let pastOffsetY = 0;
  document.getElementById('content').addEventListener('mousedown', e => {
    if (e.which === 3) {
      pastOffsetX = e.offsetX;
      pastOffsetY = e.offsetY;
      isPanning = true;
    }
  });
  document.getElementById('content').addEventListener('mousemove', e => {
    if (isPanning) {
      mapPan.x += e.offsetX - pastOffsetX;
      mapPan.y += e.offsetY - pastOffsetY;
      pastOffsetX = e.offsetX;
      pastOffsetY = e.offsetY;
    }
    mapPan.mousePosX = e.offsetX;
    mapPan.mousePosY = e.offsetY;
  });
  window.addEventListener('mouseup', function () {
    isPanning = false;
  });
  document.getElementById('content').addEventListener('wheel', function (e) {
    const zoomStep = 10**(0.05*mapPan.zoom)-1;
    mapPan.cursOriginX = e.offsetX - mapPan.x;
    mapPan.cursOriginY = e.offsetY - mapPan.y;
    if (e.deltaY < 0) {
      mapPan.zoomChange += zoomStep;
    }
    if (e.deltaY > 0) {
      mapPan.zoomChange -= zoomStep;
    }
  }, {passive: true});
  // document.
};

},{}]},{},[6]);
