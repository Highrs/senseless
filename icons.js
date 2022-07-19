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
  }

};
