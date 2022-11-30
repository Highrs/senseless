module.exports = {
  mslBeam: () => ({
    warhead: 'beam',
    damage: 10,
    range: 90,
    pulseTime: 0.100,
    color: "wepFire0",
    abr: 'MSL-B',
    accel: 20,
    health: 1,
    icon: ['g', {},
            ['path', {
              d: 'M 0,0 L 3,-6 L 3,0 L 0,6 L -3,0 L -3,-6 Z',
              class: 'craftIcon'
            }],
            ['path', {
              d: 'M 3,0 L 6,6',
              class: 'craftIcon'
            }]
            ,
            ['path', {
              d: 'M -3,0 L -6,6',
              class: 'craftIcon'
            }]
          ]
  }),
  mslAoe: () => ({
    warhead: 'aoe',
    damage: 10,
    range: 10,
    pulseTime: 0.100,
    color: "wepFire0",
    abr: 'MSL-A',
    accel: 20,
    health: 1,
    icon: ['g', {},
            ['path', {
              d: 'M 0,0 L 2,-4 L 2,4 L -2,4 L -2,-4 Z',
              class: 'craftIcon'
            }]
          ]
  }),
};
