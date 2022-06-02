// const tt = require('onml/tt.js');

module.exports = {

  hull:         (crafto) => {
    let drawnHull = ['g', {id: crafto.id + '-HULLICON'}];

    let paint = 'craftIcon ' + crafto.team.color;

    if (crafto.dead) {
      paint = 'craftIcon ' + crafto.team.color + 'Dead';
    }

    drawnHull.push(
      ['circle', {
        r: 3,
        class: paint
      }]
    );

    return drawnHull;
  }
};
