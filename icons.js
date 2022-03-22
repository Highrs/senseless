// const tt = require('onml/tt.js');

module.exports = {

  hull:         (crafto) => {
    let drawnHull = ['g', {}];

    drawnHull.push(
      ['g', {},
        ['circle', {
          r: 10,
          class: 'craftIcon ' + crafto.color
        }]
      ]
    );

    return drawnHull;
  }
};
