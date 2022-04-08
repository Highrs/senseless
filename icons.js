// const tt = require('onml/tt.js');

module.exports = {

  hull:         (crafto) => {
    let drawnHull = ['g', {id: crafto.id + '-'}];

    drawnHull.push(
      ['g', {},
        ['circle', {
          r: 5,
          class: 'craftIcon ' + crafto.team.color
        }]
      ]
    );

    return drawnHull;
  }
};
