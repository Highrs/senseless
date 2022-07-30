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
