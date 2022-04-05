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

},{"onml/stringify.js":6}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
// const tt = require('onml/tt.js');

module.exports = {

  hull:         (crafto) => {
    let drawnHull = ['g', {}];

    drawnHull.push(
      ['g', {},
        ['circle', {
          r: 10,
          class: 'craftIcon ' + crafto.team.color
        }]
      ]
    );

    return drawnHull;
  }
};

},{}],4:[function(require,module,exports){
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

const makeCraft = (teamColor = 'green') => {
  let id = iDGen();
  let mapID = 'C-' + id;
  advRenderer.appendRend('crafts', (['g', {id: mapID}]));

  let crafto = {
    id: id,
    mapID: mapID,
    renderer: undefined,
    location: {x: 0, y: 0},
    vector: {x: 0, y: 0},
    team: teams[teamColor],
    weaponsList: ['lance'],
    weapons: [],
    ranges: [],
    health: 5,
    status: 'normal'
  };

  crafto.renderer = function () {
    advRenderer.normRend(crafto.mapID, drawCraft(crafto));
  };

  makeWeps(crafto);

  const spawnPoint = crafto.team.spawnPoint;

  const genPoint = (point = {x: 0, y: 0}) => {
    point.x = rand(0, spawnPoint.r);
    point.y = rand(0, spawnPoint.r);

    if ( calcRange({x:0, y:0}, point) > spawnPoint.r ) {
      genPoint(point);
    }

    return point;
  };

  let point = genPoint();

  crafto.location.x = point.x + spawnPoint.x;
  crafto.location.y = point.y + spawnPoint.y;

  crafto.vector.x = spawnPoint.vx;
  crafto.vector.y = spawnPoint.vy;

  console.log(crafto);

  craftList.push(crafto);
  teams[teamColor].members.push(crafto);

  return crafto;
};

const spawnPoints = {
  'green': {x: 0, y: 100, r: 100, vx: 0, vy:-10, renderer: undefined},
  'red': {x: 0, y:-100, r: 100, vx: 0, vy: 10, renderer: undefined}
};

const teams = {
  green: {color: 'green', spawnPoint: spawnPoints.green,  members: [], enemy: undefined},
  red:   {color: 'red',   spawnPoint: spawnPoints.red,    members: [], enemy: undefined}
};
teams.green.enemy = teams.red;
teams.red.enemy =   teams.green;

const makeWeps = (crafto) => {
  crafto.weaponsList.forEach(e => {
    crafto.weapons.push(
      {...weps[e], reloadProg: 0, counter: 0, status: 'ready', pulseProg: 0}
    );
    crafto.ranges.push(weps[e].range) ;
  });
};

const weps = {
  lance: {damage: 1, reloadTime: 3000, range: 100, pulseTime: 0.5}
};

const drawCraft = (crafto) => {
  let drawnCraft = ['g', {id: crafto.id}];

  crafto.ranges.forEach(range => {
    drawnCraft.push(['circle', {r: range, class: 'wepsRangeCircle ' + crafto.team.color}]);
  });

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

const wepsFire = (crafto, enemyo, wep, td) => {
  // console.log(td);
  switch (wep.status) {
    case 'ready':
      enemyo.health -= wep.damage;
      wep.status = 'firing';
      wep.counter += 1;
      break;
    case 'firing':
      wep.pulseProg += td;
      if (wep.pulseProg >= wep.pulseTime) {
        wep.status = 'reloading';
        wep.pulseProg = 0;
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

const main = () => {
  console.log('Giant alien spiders are no joke.');

  let renderMain = mkRndr('content');
  renderMain(drawMap());

  makeCraft('green');
  makeCraft('red');
  makeCraft('green');
  makeCraft('red');

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

    // console.log(craftList);

    craftList.forEach(crafto => {
      calcMotion(crafto, workTime);
      changeElementTT(crafto.mapID, crafto.location.x, crafto.location.y);
      crafto.team.enemy.members.forEach(enemyo => {
        crafto.weapons.forEach(wep => {
          if (calcRange(crafto.location, enemyo.location) < wep.range) {
            wepsFire(crafto, enemyo, wep, timeDelta);
          }
        });
      });
    });

    craftList.forEach(crafto => {
      if (crafto.health <= 0) {
        deadCraftList.push(crafto);
        craftList.splice(craftList.indexOf(crafto), 1);
        advRenderer.normRend(crafto.mapID, []);

        console.log(craftList);

        // console.log('Ded');
      }
    });

    setTimeout(loop, 1000/options.targetFrames);
  };
  loop();
};

window.onload = main;

},{"./advRenderer.js":1,"./get-svg.js":2,"./icons.js":3,"onml/renderer.js":5,"onml/tt.js":7}],5:[function(require,module,exports){
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

},{"./stringify.js":6}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}]},{},[4]);
