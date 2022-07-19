const getSvg = require('./get-svg.js');
const tt = require('onml/tt.js');
const icons = require('./icons.js');

function getPageWidth() {return Math.max(document.body.clientWidth, window.innerWidth);}
function getPageHeight() {return Math.max(document.body.clientHeight, window.innerHeight);}

exports.drawCraft = (crafto) => {
  let drawnCraft = ['g', {id: crafto.id}];

  drawnCraft.push(
    ['g', {
        transform: 'rotate(' + crafto.course + ')',
        id: crafto.id + '-ROT'
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

exports.drawWepRanges = (crafto) => {
  let drawnRanges = ['g', {id: crafto.id + '-WEPRANGE'}];
  crafto.ranges.forEach(range => {
    drawnRanges.push(['circle', {
      r: range,
      class: 'wepsRangeCircle ' + crafto.team.color + ' ' + crafto.team.color +'Fill'
    }]);
  });
  return drawnRanges;
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
exports.drawSpawn = (x, y, r, color) => {
  let drawnPoint = ['g', tt(x, y)];

  drawnPoint.push(
    ['circle', {
      r: r,
      class:  'spawnPoint ' + color
    }]
  );

  return drawnPoint;
};

exports.drawWindowFrame = () => {
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
    frame.push( ['g', tt(4,38),
      ['g', tt(0, 0, {id:'button', class: 'standardBoxSelectable'}),
        ['rect', {width: 30, height: 30}],
      ]
    ]);

  return frame;
};

exports.drawPage = () => {

  return getSvg({w:getPageWidth(), h:getPageHeight() , i:'allTheStuff'}).concat([
    ['defs'],
    ['g', {id: 'windowFrame'}],
    ['g', {id: 'map'},
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
