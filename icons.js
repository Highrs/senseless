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
      ['path', {d: 'M -'+corner+',  '+sides+' L  -'+sides+',  '+corner}]
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
