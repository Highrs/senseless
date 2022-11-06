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

},{"onml/stringify.js":9}],2:[function(require,module,exports){
const getSvg = require('./get-svg.js');
const tt = require('onml/tt.js');
const icons = require('./icons.js');
const lists = require('./lists.js');

function getPageWidth() {return Math.max(document.body.clientWidth, window.innerWidth);}
function getPageHeight() {return Math.max(document.body.clientHeight, window.innerHeight);}

exports.drawCraft = (crafto) => {
  let drawnCraft = ['g', {id: crafto.id},
    ['line', {
      id: crafto.mapID + '-VECT_LINE',
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      class: 'vector'
    }],
    ['g', {
      transform: 'translate('+0+', '+0+')',
      id: crafto.mapID + '-VECT_DOT'
    }, [
      'circle',
      {r : 2, class: 'vector'}
    ]]
  ];

  if (crafto.icon === undefined) {
    throw 'No drawing instructions in hellTemp for ' + crafto.class;
  }

  drawnCraft.push(
    ['g', {
        transform: 'rotate(' + crafto.heading + ')',
        id: crafto.mapID + '-ROT',
        class: crafto.dead ? crafto.team.color + 'Dead' : crafto.team.color
      },
      crafto.icon
    ]
  );

  if (!crafto.dead) {
    drawnCraft.push(
      ['text', {
        x: 5,
        y: 5,
        // class: 'craftIconText ' + crafto.team.color +'Fill'
        class: 'craftIconText'
      },
        crafto.id
      ]
    );
  }

  drawnCraft.push(
    icons.bracketSelected(crafto.id + '-SELECTED', 2),
    icons.brackets(crafto.id + '-SELECTOR', 4)
  );

  return drawnCraft;
};
exports.updateCraft = (crafto) => {
  document.getElementById(crafto.mapID + '-ROT').setAttribute(
    'transform', 'rotate(' + (crafto.heading) + ')'
  );

  document.getElementById(crafto.mapID + '-VECT_LINE').setAttribute(
    'x2', '' + crafto.vec.x * 5
  );
  document.getElementById(crafto.mapID + '-VECT_LINE').setAttribute(
    'y2', '' + crafto.vec.y * 5
  );

  document.getElementById(crafto.mapID + '-VECT_DOT').setAttribute(
    'transform', 'translate('+crafto.vec.x * 5+', '+crafto.vec.y * 5+')'
  );
};
exports.drawStruct = (structo) => {
  let drawnStruct = ['g', {id: structo.id}];

  if (structo.icon === undefined) {
    throw 'No drawing instructions in hellTemp for ' + structo.class;
  }

  drawnStruct.push(
    ['g', {
        transform: 'rotate(' + structo.heading + ')',
        id: structo.mapID + '-ROT',
        class: structo.dead ? structo.team.color + 'Dead' : structo.team.color
      },
      structo.icon
    ]
  );

  if (!structo.dead) {
    drawnStruct.push(
      ['text', {
        x: 5,
        y: 5,
        class: 'craftIconText ' + structo.team.color +'Fill'
      },
        structo.id
      ]
    );
  }

  drawnStruct.push(
    icons.bracketSelected(structo.id + '-SELECTED', 2),
    icons.brackets(structo.id + '-SELECTOR', 4)
  );

  return drawnStruct;
};

exports.updateSelector = (crafto) => {
  if (crafto.selected) {
    document.getElementById(crafto.id + '-SELECTED').style.visibility = "visible";
  } else {
    document.getElementById(crafto.id + '-SELECTED').style.visibility = "hidden";
  }
  crafto.selectedChange = false;
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
exports.drawCraftPath = (crafto) => {
  let drawnPath = ['g', {}];

  drawnPath.push(
    ['line', {
      id: crafto.mapID + '-PATH',
      x1: 0,
      y1: 0,
      x2: 100,
      y2: 100,
      class: 'pathLine'
    }]
  );

  return drawnPath;
};
exports.updateCraftPath = (crafto, mapPan) => {
  let waypointo = crafto.waypoints[0];
  let path = document.getElementById(crafto.mapID + '-PATH');
  path.setAttribute('x1', crafto.loc.x * mapPan.zoom);
  path.setAttribute('y1', crafto.loc.y * mapPan.zoom);
  path.setAttribute('x2', waypointo.loc.x * mapPan.zoom);
  path.setAttribute('y2', waypointo.loc.y * mapPan.zoom);
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

    frame.push( ['g', tt(4,4),
      ['g', tt(0, 0, {id:'buttonSettings', class: 'standardBoxSelectable'}),
        ['rect', {width: 30, height: 30}],
        ['g', tt(15,15),
          ['path', {d:'M 12 -9 -12 -9', class:'UIcon'}],
          ['path', {d:'M 12 0 -12 0', class:'UIcon'}],
          ['path', {d:'M 12 9 -12 9', class:'UIcon'}],
        ]
      ]
    ]);
    // frame.push( ['g', tt(4,38),
    //   ['g', tt(0, 0, {id:'button', class: 'standardBoxSelectable'}),
    //     ['rect', {width: 30, height: 30}],
    //   ]
    // ]);

  return frame;
};
const drawSimRateModule = (x, y) => {
  let btSz = 30;
  let mrgn = 3;
  return ['g', {id: 'simRateModule'},
    // ['rect', {width: 10, height: 2, class: 'standardBox'}],
    ['g', tt(x,y),
      ['rect', {width: btSz*6+mrgn*4+8, height: btSz+24, class: 'standardBox'}],
      ['text', {class: 'dataText', x: 4, y:15}, 'Simulation rate:']
    ],
    ['g', tt(x+4,y+20),
      ['g', tt(0, 0, {id:'buttonStop', class: 'standardBoxSelectable'}),
        ['rect', {width: btSz, height: btSz}],
        ['path', { d: 'M 11, 4 L 11, 26', class: 'UIcon'}],
        ['path', { d: 'M 19, 4 L 19, 26', class: 'UIcon'}],
        // icons.arrow(2, true),
      ],
      ['g', tt(btSz+mrgn,0, {id:'buttonSlow', class: 'standardBoxSelectable'}),
        ['rect', {width: btSz, height: btSz}],
        icons.arrow(0, true)
      ],
      ['g', tt((btSz+mrgn)*2,0, {id:'simRateDisplay', class: 'standardBox'}),
        ['rect', {width: btSz*2, height: btSz}],
        ['g', {id: 'rateCounter'}]
      ],
      ['g', tt((btSz*4)+(mrgn*3),0, {id:'buttonFast', class: 'standardBoxSelectable'}),
        ['rect', {width: btSz, height: btSz}],
        icons.arrow(0, false)
      ],
      ['g', tt((btSz*5)+(mrgn*4),0, {id:'buttonMax', class: 'standardBoxSelectable'}),
        ['rect', {width: btSz, height: btSz}],
        icons.arrow(4, false),
        icons.arrow(-4, false),
      ]
    ]
  ];
};
exports.drawSimRateModule = drawSimRateModule;
exports.drawRateCounter = (options) => {
  return ['text', {x: 4, y: 19,class: 'dataText bold'}, 'X ' + options.rate];
  //options.rate.toString().length
};
exports.drawBoxSettings = () => {
  let box = ['g', {}];

  let keys = ['g', tt(4, 24)];
  let keysHeight = lists.keys().length * 15 + 4;
  keys.push(['rect', {width: 30*6+3*4+8, height: keysHeight, class: 'standardBox'}]);

  box.push(['rect', {height: keysHeight + 90, width: 238, class:'standardBox'}]);
  box.push(['rect', {height: 20, width: 208, class:'standardBoxSelectable', id:'boxSettingsDragger'}]);
  box.push(['g', tt(208, 0, {id: 'boxSettingsCloser', class:'standardBoxSelectable'}),
    ['rect', {height: 30, width: 30}],
    ['path', {d: 'M 4, 4 L 26, 26', class: 'UIcon'}],
    ['path', {d: 'M 4, 26 L 26, 4', class: 'UIcon'}]
  ]);


  for (let i = 0; i < lists.keys().length; i++) {
    keys.push(['g', tt(2,  15 * i + 14), [ 'text', {class: 'dataText'}, lists.keys()[i] ]],);
  }
  box.push(keys);

  box.push(drawSimRateModule(4, 24 + keysHeight + 4));

  return box;
};

const gridGeoCalc = (mapPan, options) => {
  let actualGridStep = options.gridStep * mapPan.zoom;
  if (actualGridStep < 100) {actualGridStep *= 10;}

  let gridRectStartX = - mapPan.x + (mapPan.x) % (actualGridStep) - actualGridStep;
  let gridRectStartY = - mapPan.y + (mapPan.y) % (actualGridStep) - actualGridStep;
  let gridRectEndX = gridRectStartX + getPageWidth() + actualGridStep * 2;
  let gridRectEndY = gridRectStartY + getPageHeight() + actualGridStep * 2;

  return {
    gridRectStartX: gridRectStartX,
    gridRectStartY: gridRectStartY,
    gridRectEndX: gridRectEndX,
    gridRectEndY: gridRectEndY,
    actualGridStep: actualGridStep
  };
};
exports.drawGrid = (mapPan, options, reReRenderScaleBar) => {
  let grid = ['g', {}];

  const gridGeo = gridGeoCalc(mapPan, options);

  for (let x = gridGeo.gridRectStartX; x < (gridGeo.gridRectEndX); x += gridGeo.actualGridStep) {
    for (let y = gridGeo.gridRectStartY; y < (gridGeo.gridRectEndY); y += gridGeo.actualGridStep) {
      grid.push(
        icons.gridCross(options.gridCrossSize,  x,  y)
      );
    }
  }

  reReRenderScaleBar(options, mapPan);

  return grid;
};
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
exports.drawGridEdge = (mapPan, options) => {
  let gridFrame = ['g', {}];

  const gridGeo = gridGeoCalc(mapPan, options);

  for (let x = gridGeo.gridRectStartX; x < (gridGeo.gridRectEndX); x += gridGeo.actualGridStep) {
    gridFrame.push(
      icons.gridEdgeIndicator(x, - mapPan.y),
      icons.gridEdgeIndicator(x, getPageHeight() - mapPan.y, 180)
    );
  }

  for (let y = gridGeo.gridRectStartY; y < (gridGeo.gridRectEndY); y += gridGeo.actualGridStep) {
    gridFrame.push(
      icons.gridEdgeIndicator(- mapPan.x, y, -90),
      icons.gridEdgeIndicator(getPageWidth() - mapPan.x, y, 90)
    );
  }

  return gridFrame;
};

exports.drawWaypoints = (waypointList, mapPan) => {
  let drawnWaypoints = ['g', {}];

  waypointList.forEach(point => {
    let id = point.craft.mapID + '-WAY'; //NEED TO ACCOUNT FOR MULTIPLE WAYPOINTS LATER
    drawnWaypoints.push(
      ['g',
        tt(
          point.loc.x * mapPan.zoom,
          point.loc.y * mapPan.zoom,
          {
            class: 'standardBox',
            id: id
          }
        ),
        icons.waypoint(point)
      ]
    );
  });

  return drawnWaypoints;
};
exports.updateWaypoints = (waypointList, mapPan) => {
  waypointList.forEach(point => {
    //NEED TO ACCOUNT FOR MULTIPLE WAYPOINTS
    document.getElementById(point.craft.mapID + '-WAY').setAttribute(
      'transform', 'translate(' + point.loc.x * mapPan.zoom + ', ' + point.loc.y * mapPan.zoom + ')'
    );
  });
};

exports.drawPage = () => {
  return getSvg({w:getPageWidth(), h:getPageHeight() , i:'allTheStuff'}).concat([
    ['defs'],

    ['g', {id: 'map'},
      ['g', {id: 'grid'}],
      ['g', {id: 'gridEdge'}],
      ['g', {id: 'wepsRanges'}],
      ['g', {id: 'spawnPoints'},
        ['g', {id: 'sp-player'}],
        ['g', {id: 'sp-enemy'}]
      ],
      ['g', {id: 'craftPaths'}],
      ['g', {id: 'waypoints'}],
      ['g', {id: 'weps'}],
      ['g', {id: 'structures'}],
      ['g', {id: 'crafts'}]
    ],
    ['g', {id: 'gridScaleBar'}],
    ['g', {id: 'screenFrame'}],
    ['g', {id: 'boxes'},
      ['g', {id: 'boxMainSettings'}]
    ]
  ]);
};

},{"./get-svg.js":3,"./icons.js":5,"./lists.js":6,"onml/tt.js":10}],3:[function(require,module,exports){
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
    health: 5,
    weaponsHardpoints: [
      {
        size: 2,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0, 0 L  3,-3 L  0, 5 L -3,-3 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  bolt: () => ({
    class: 'Bolt',
    abr: 'BLT',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 8,
    weaponsHardpoints: [
      {
        size: 2,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0,-5 L  3,-3 L  0, 5 L -3,-3 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  spear: () => ({
    class: 'Spear',
    abr: 'SPR',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 20,
    weaponsHardpoints: [
      {
        size: 2,
        hx: 5,
        hy: 0
      },
      {
        size: 3,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0,-5 L -2,-2 L -6, 0 L -3, 2 L -2, 5 L -1, 8 L 0, 10 L 1,8 L 2, 5 L 3, 2 L 6, 0 L 2,-2 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  noise: () => ({
    class: 'Noise',
    abr: 'NIS',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 5,
    weaponsHardpoints: [],
    icon: ['g', {},
            ['path', {
              d: 'M 0, -5 L 2, -2 L 6, 0 L 2, 2 L -2, 2 L -6, 0 L -2, -2 Z',
              class: 'craftIcon'
            }],
            [
              'circle',
              {r : 2, cx:0, cy: 2, class: 'craftIcon'}
            ]
          ]
  }),

  swarmer: () => ({
    class: 'Swarmer',
    abr: 'SWM',
    type: 'combat',
    cargoCap: 0,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 10,
    health: 3,
    weaponsHardpoints: [
      {
        size: 1,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0,3 L 3,0 L 0,-3 L -3,0 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  bastion: () => ({
    class: 'Bastion',
    abr: 'BST',
    type: 'combat',
    cargoCap: 0,
    fuelCapacity: 0,
    fuelConsumption: 0,
    accel: 0,
    health: 100,
    weaponsHardpoints: [
      {
        size: 3,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['circle', {
              r: 20,
              class: 'craftIcon'
            }]
          ]
  })
};

},{}],5:[function(require,module,exports){
const tt = require('onml/tt.js');

module.exports = {
  brackets: (iD, margin = 0, offsetY = 0) => {
    let corner = 10 + margin;
    let sides = corner - 5;
    return ['g', tt(0, offsetY, {class: 'standardSelector', id:iD}),
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
  bracketSelected: (iD, margin = 0, offsetY = 0) => {
    let corner = 10 + margin;
    let sides = corner - 5;
    return ['g', tt(0, offsetY, {class: 'standardBracket', id:iD, visibility:'hidden'}),
      ['path', {d: 'M  '+corner+',  '+sides+' L   '+sides+',  '+corner}],
      ['path', {d: 'M -'+corner+', -'+sides+' L  -'+sides+', -'+corner}],
      ['path', {d: 'M  '+corner+', -'+sides+' L   '+sides+', -'+corner}],
      ['path', {d: 'M -'+corner+',  '+sides+' L  -'+sides+',  '+corner}],
      // ['rect', {
      //   x:corner,
      //   y:corner,
      //   height: corner*2,
      //   width: 105,
      //   class: 'standardBox'
      // }],
      ['text', {
        x: corner,
        y: corner+5,
        class: 'craftIconText'
      },
        'CTRL+LMB to move'
      ]

    ];
  },
  gridCross: (crossSize, x, y) => {
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
  },
  gridEdgeIndicator: (x, y, angle = 0) => {
    return ['g', {},
      ['path', {
        transform: 'translate(' + x + ',' + y + ') rotate(' + angle + ')',
        d: 'M 0, 20 L 5,15 L 5, 5 L -5,5 L -5,15 Z',
        class:'grid'
      }]
    ];
  },
  arrow: (hOffset = 0, mirror = false) => {
    return ['path', tt(15 + hOffset, 15, {d: ('M '+(mirror?'+':'-')+'5, 10 L '+(mirror?'-':'+')+'5, 0 L '+(mirror?'+':'-')+'5, -10'), class: 'UIcon'})];
  },
  waypoint: () => {
    return ['g', {},
      // ['rect', {
      //   x:-corner,
      //   y:-corner,
      //   height: corner*2,
      //   width: corner*2,
      //   class: 'invisibleBox'
      // }],
      ['path', {d: 'M  6,  8 L  2,  2 L  8,  6 Z'}],
      ['path', {d: 'M -6, -8 L -2, -2 L -8, -6 Z'}],
      ['path', {d: 'M  6, -8 L  2, -2 L  8, -6 Z'}],
      ['path', {d: 'M -6,  8 L -2,  2 L -8,  6 Z'}]
    ];
  },
};

},{"onml/tt.js":10}],6:[function(require,module,exports){
module.exports = {

  keys: () => {
    return [
      ".Senseless V1.2a",
      ".RMB + Drag to pan.",
      ".Scroll to zoom.",
      ".Ctrl + LMB to place",
      "waypoint for selected."
    ];
  },

};

},{}],7:[function(require,module,exports){
'use strict';
const renderer    = require('onml/renderer.js');
const Stats       = require('stats.js');
const advRenderer = require('./advRenderer.js');
const hullTemps   = require('./hullTemp.js');
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

Window.options = {
  rate: 1,
  targetFrames: 60,

  rateSetting: 3,
  simRates: [0, 0.1, 0.5, 1, 2, 3, 4],

  grid: true,
  gridStep: 10,
  gridCrossSize: 5,

  keyPanStep: 50,
};
const options = Window.options;

let craftList = [];
let structList = [];
let deadCraftList = [];
let activeWepsList = [];
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
    boxSettings: false,
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
    loc: {x: 150, y: 150, z: 0},
    r: 50,
    vec: {x:0, y:0},
    heading: 135,
    renderer: undefined},
  'enemy':    {
    side: 'enemy',
    loc: {x: -150, y: -150, z: 0},
    r: 100,
    vec:{x:0, y:0,},
    heading: -135,
    renderer: undefined}
};
const teams = {
  player: {color: 'player', spawnPoint: spawnPoints.player,  members: [], enemy: undefined, kills: 0, losses: 0},
  enemy:   {color: 'enemy',   spawnPoint: spawnPoints.enemy,    members: [], enemy: undefined, kills: 0, losses: 0}
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
      visible: true,

      state: 'normal'
    }
  );

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

  makeWeps(newCrafto, kit);

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

      owner: owner,
      waitCycle: 0 + initWait,
      render: false,
      visible: true,

      state: 'normal'
    }
  );

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

  makeWeps(newStructo, kit);

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
      let id = iDWepGen();
      let mapID = id;

      let wepo = {
        ...socket,
        id: id,
        mapID: mapID,
        ...wepTemps[kit[idx]](),
        reloadProg: 0,
        counter: 0,
        status: 'ready',
        pulseProg: 0,
        renderer: undefined,
        host: crafto,
        target: {},
        empty: false
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
  });
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
const hide = (id) => {
  document.getElementById(id).style.visibility = "hidden";
};
const unhide = (id) => {
  document.getElementById(id).style.visibility = "visible";
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
      hide(wep.mapID);
      hide(crafto.id + '-WEPRANGE');
    });
    crafto.renderer();

    console.log(crafto.id + ' destroyed');
};
const craftAI = (crafto, workTime) => {
  calcMotion(crafto, workTime);
};
const wepsUI = (unito, workTime) => {
  return unito.weapons.find(wep => {
    if (wep.status === 'ready' && unito.team.enemy.members.length > 0) {
      return unito.team.enemy.members.find(enemyo => {
        let range = calcRange(unito.loc, enemyo.loc);
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

  let renderRateCounter     = undefined;
  const initRateRenderer    = () => {
    renderRateCounter       = mkRndr('rateCounter');
  };

  let renderGrid            = mkRndr('grid');
  let renderGridEdge            = mkRndr('gridEdge');
  let renderGridScaleBar    = mkRndr('gridScaleBar');
  let renderScreenFrame     = mkRndr('screenFrame');

  advRenderer.normRend('screenFrame', drawMap.drawScreenFrame());

  let renderBoxSettings     = mkRndr('boxMainSettings');
  let renderWaypoints       = mkRndr('waypoints');

  makeManyCraft('arrow', 3, 'player', {0: 'Lance'});
  makeManyCraft('bolt', 2, 'player', {0: 'Lance'});
  makeManyCraft('spear', 1, 'player', {0: 'SuperLance', 1:'Lance'});
  makeManyCraft('noise', 1, 'player', {});

  // makeManyCraft('swarmer', 15, 'enemy');

  makeAStruct('bastion', {x: 0, y:0}, 'enemy', {0: 'SuperLance'});

  const reReRenderScaleBar = (options, mapPan) => {
    renderGridScaleBar(drawMap.drawGridScaleBar(options, mapPan));
  };
  const renderAllResizedStatics = (options, mapPan) => {
    renderGrid(drawMap.drawGrid(mapPan, options, reReRenderScaleBar));
    renderGridEdge(drawMap.drawGridEdge(mapPan, options));
  };

  [...craftList, ...structList].forEach(crafto => {
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

      [...craftList, ...structList].forEach(unito => {
        wepsUI(unito, workTime);
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
        if (e.selectorsNeedUpdating) {
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

      deadCraftList.forEach(crafto => {
        changeElementTT(crafto.mapID, crafto.loc.x * mapPan.zoom, crafto.loc.y * mapPan.zoom);
      });

      mapPan.someMapUpdate = false;
    }

    stats.end(); //Stats FPS tracking

    setTimeout(loop, 1000/options.targetFrames);
  };

  loop();
};

window.onload = main;

},{"./advRenderer.js":1,"./drawMap.js":2,"./hullTemp.js":4,"./ui.js":12,"./wepTemp.js":13,"onml/renderer.js":8,"stats.js":11}],8:[function(require,module,exports){
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

},{"./stringify.js":9}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){"object"===typeof exports&&"undefined"!==typeof module?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});

},{}],12:[function(require,module,exports){
'use strict';

const addRateListeners = (options, updateRateCounter) => {
  document.getElementById('buttonStop').addEventListener('click', function () {
    options.rateSetting = 0;
    options.rate = options.simRates[options.rateSetting];
    if (options.rate === 0) {options.isPaused = true;}
    updateRateCounter(options);
  });
  document.getElementById('buttonSlow').addEventListener('click', function () {
    if (options.rateSetting > 0) {options.rateSetting--;}
    options.rate = options.simRates[options.rateSetting];
    if (options.rate === 0) {options.isPaused = true;}
    updateRateCounter(options);
  });
  document.getElementById('buttonFast').addEventListener('click', function () {
    if (options.rateSetting < options.simRates.length - 1) {options.rateSetting++;}
    if (options.isPaused === true) {options.isPaused = false;}
    options.rate = options.simRates[options.rateSetting];
    updateRateCounter(options);
  });
  document.getElementById('buttonMax').addEventListener('click', function () {
    options.rateSetting = options.simRates.length - 1;
    if (options.isPaused === true) {options.isPaused = false;}
    options.rate = options.simRates[options.rateSetting];
    updateRateCounter(options);
  });
};
exports.addRateListeners = addRateListeners;
exports.addBoxSettingsListeners = (mapPan, renderBoxSettings) => {
  let boxSettingsSettings = {
    isDragging: false,
    xTransform: 40,
    yTransform: 10,
    xTransformPast: 0,
    yTransformPast: 0,
  };
  document.getElementById('boxMainSettings').setAttribute(
    'transform', 'translate(' + boxSettingsSettings.xTransform + ', ' + boxSettingsSettings.yTransform + ')'
  );
  document.getElementById('boxSettingsDragger').addEventListener('mousedown', e => {
    if (e.which === 1 || e.which === 3) {
      boxSettingsSettings.xTransformPast = e.offsetX;
      boxSettingsSettings.yTransformPast = e.offsetY;
      boxSettingsSettings.isDragging = true;
    }
  });
  document.getElementById('content').addEventListener('mousemove', e => {
    if (boxSettingsSettings.isDragging) {
      boxSettingsSettings.xTransform += e.offsetX - boxSettingsSettings.xTransformPast;
      boxSettingsSettings.yTransform += e.offsetY - boxSettingsSettings.yTransformPast;
      if (boxSettingsSettings.xTransform > document.body.clientWidth - 160) {boxSettingsSettings.xTransform = document.body.clientWidth - 160;}
      if (boxSettingsSettings.yTransform > document.body.clientHeight - 80) {boxSettingsSettings.yTransform = document.body.clientHeight - 80;}
      if (boxSettingsSettings.xTransform < 0) {boxSettingsSettings.xTransform = 0;}
      if (boxSettingsSettings.yTransform < 0) {boxSettingsSettings.yTransform = 0;}
      boxSettingsSettings.xTransformPast = e.offsetX;
      boxSettingsSettings.yTransformPast = e.offsetY;
      document.getElementById('boxMainSettings').setAttribute(
        'transform', 'translate(' + boxSettingsSettings.xTransform + ', ' + boxSettingsSettings.yTransform + ')'
      );
    }
  });
  window.addEventListener('mouseup', function () {
    boxSettingsSettings.isDragging = false;
  });
  document.getElementById('boxSettingsCloser').addEventListener('click', function () {
    mapPan.boxes.boxSettings = false;
    renderBoxSettings([]);
  });
};
exports.addFrameListeners = (mapPan, renderers) => {
  document.getElementById('buttonSettings').addEventListener('click', function () {
    if (mapPan.boxes.boxSettings === false) {
      mapPan.boxes.boxSettings = true;
      renderers.boxSettings();
    } else {
      mapPan.boxes.boxSettings = false;
      renderers.boxSettings();
    }
  });
};
exports.addCraftListeners = (crafto, mapPan) => {
  document.getElementById(crafto.id + '-SELECTOR').addEventListener('mousedown', event => {
    event.stopPropagation();

    if (mapPan.unitSelected && mapPan.selectedUnit !== crafto) {
      mapPan.selectedUnit.selected = false;
      mapPan.selectedChange = true;
      mapPan.someMapUpdate = true;
      mapPan.selectedUnit.selectorsNeedUpdating = true;
      mapPan.unitSelected = false;
      mapPan.selectedUnit = undefined;
    }
    if (!mapPan.unitSelected) {
      crafto.selected = true;
      mapPan.unitSelected = true;
      mapPan.selectedUnit = crafto;
      mapPan.selectedChange = true;
      mapPan.someMapUpdate = true;
      crafto.selectorsNeedUpdating = true;
    }
  });
};

exports.addListeners = (options, mapPan, renderers, functions) => {
  function pause() {
    options.isPaused = true;
    console.log('|| Unfocused');
  }
  function play() {
    allowed = true;
    if (options.rate !== 0) {options.isPaused = false;}
    console.log('>> Focused');
  }

  window.addEventListener('blur', pause);
  window.addEventListener('focus', play);
  window.addEventListener('resize', function() {renderers.resizeWindow();});

  let allowed = true;

  const checkKeyDown = (e) => {
    // console.log(e.code);
    if (e.repeat != undefined) {
      allowed = !event.repeat;
    }
    if (!allowed) return;
    allowed = false;

    switch (e.code) {
      case 'ArrowUp':
        mapPan.y += options.keyPanStep;
        break;
      case 'ArrowDown':
        mapPan.y -= options.keyPanStep;
        break;
      case 'ArrowLeft':
        mapPan.x += options.keyPanStep;
        break;
      case 'ArrowRight':
        mapPan.x -= options.keyPanStep;
        break;
      case 'ControlLeft':
        if (mapPan.unitSelected) {
          // console.log('Ctrl Key Down');
          mapPan.preppingWaypoint = true;
        }
        break;
    }
  };
  const checkKeyUp = (e) => {
    allowed = true;
    switch (e.code) {
      case 'KeyM':
        if (mapPan.preppingWaypoint) {
          mapPan.preppingWaypoint = false;
        }
        break;
      case 'ControlLeft':
        if (mapPan.preppingWaypoint) {
          mapPan.preppingWaypoint = false;
        }
        break;
    }
  };

  document.onkeydown = checkKeyDown;
  document.onkeyup = checkKeyUp;

  let isPanning = false;
  let pastOffsetX = 0;
  let pastOffsetY = 0;

  //ADD PAUSE ON SPACE

  document.getElementById('content').addEventListener('mousedown', e => {
    if (
      mapPan.selectedUnit &&
      mapPan.selectedUnit.mobile &&
      mapPan.preppingWaypoint &&
      e.which === 1
    ) {
      if ( mapPan.selectedUnit.waypoints.length > 0) {
        functions.removeWaypoint();
      }
      functions.makeWaypoint({
        x: (e.offsetX - mapPan.x) / mapPan.zoom,
        y: (e.offsetY - mapPan.y) / mapPan.zoom
      });
      mapPan.selectedUnit.courseChange = true;
      mapPan.someMapUpdate = true;
      mapPan.selectedUnit.selectorsNeedUpdating = true;

      // console.log(mapPan.waypointList);
    } else if (
      mapPan.unitSelected &&
      !mapPan.preppingWaypoint &&
      e.which !== 3
    ) {
      mapPan.selectedUnit.selected = false;
      mapPan.someMapUpdate = true;
      mapPan.selectedUnit.selectorsNeedUpdating = true;
      mapPan.unitSelected = false;
      mapPan.selectedUnit = undefined;
      // console.log('Unselected 2');
    }
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
    event.preventDefault();
    const zoomStep = 10**(0.05*mapPan.zoom)-1;
    mapPan.cursOriginX = e.offsetX - mapPan.x;
    mapPan.cursOriginY = e.offsetY - mapPan.y;
    if (e.deltaY < 0) {
      mapPan.zoomChange += zoomStep;
    }
    if (e.deltaY > 0) {
      mapPan.zoomChange -= zoomStep;
    }
  }, {passive: false});
};

},{}],13:[function(require,module,exports){
module.exports = {
  MiniLance: () => ({
    damage: 1,
    range: 50,
    reloadTime: 0.100,
    pulseTime: 0.100,
    color: "wepFire0"
  }),

  Lance: () => ({
    damage: 2,
    range: 100,
    reloadTime: 1.000,
    pulseTime: 1.000,
    color: "wepFire1"
  }),

  SuperLance: () => ({
    damage: 3,
    range: 300,
    reloadTime: 5.000,
    pulseTime: 1.000,
    color: "wepFire2"
  }),
};

},{}]},{},[7]);
