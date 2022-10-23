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
