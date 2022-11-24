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
        class: 'craftIconText'
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
exports.drawPausedSign = () => {
  return (
    ['g',
      {
        id: 'pausedSign',
        visibility: 'hidden',
        transform: 'translate(' + getPageWidth() / 2 + ', ' + (getPageHeight() - 60) + ')'
      },
      ['text', {
        x: 0,
        y: -40,
        class: 'signText',
        'text-anchor': 'middle'
      },
        'PAUSED'
      ],
      ['text', {
        x: 0,
        y: 0,
        class: 'signTextSmall',
        'text-anchor': 'middle'
      },
        'PRESS [SPACE] TO UNPAUSE'
      ]
      ,
      ['text', {
        x: 0,
        y: -10,
        class: 'signTextExtra',
        'text-anchor': 'middle',
        'xml:space': 'preserve'
      },
        '///////////////////////////////////////////////     ///////////////////////////////////////////////'
      ]
    ]
  );
};
exports.updatePausedSign = () => {
  document.getElementById('pausedSign').setAttribute(
    'transform', 'translate(' + getPageWidth() / 2 + ', ' + (getPageHeight() - 60) + ')'
  );
};

exports.drawPage = () => {
  return getSvg({w:getPageWidth(), h:getPageHeight() , i:'allTheStuff'}).concat([
    ['defs'],

    ['g', {id: 'superUI'}],
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
