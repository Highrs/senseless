module.exports = {
  arrow: () => ({
    class: 'Arrow',
    abr: 'ARR',
    designation: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 10,
    home: 'astroDeltaB',
    health: 5,
    weaponsHardpoints: [
      {
        size: 2,
        hx: 0,
        hy: 2
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0, -2 L  6,-6 L  0, 10 L -6,-6 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  bolt: () => ({
    class: 'Bolt',
    abr: 'BLT',
    designation: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 8,
    weaponsHardpoints: [
      {
        size: 2,
        hx: 0,
        hy: -4
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0,-10 L  6,-6 L  0, 10 L -6,-6 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  spear: () => ({
    class: 'Spear',
    abr: 'SPR',
    designation: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 20,
    weaponsHardpoints: [
      {
        size: 2,
        hx: 0,
        hy: 8
      },
      {
        size: 3,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0,-10 L -4,-4 L -12, 0 L -6, 4 L -2, 16 L 0, 20 L 2,16 L 6, 4 L 12, 0 L 4,-4 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  naught: () => ({
    class: 'Naught',
    abr: 'NGT',
    designation: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 40,
    weaponsHardpoints: [
      {
        size: 3,
        hx: 0,
        hy: 0
      },
      {
        size: 3,
        hx: 0,
        hy: 8
      },
      {
        size: 3,
        hx: 0,
        hy: 16
      },
      {
        size: 2,
        hx: 8,
        hy: 4
      },
      {
        size: 2,
        hx: -8,
        hy: 4
      },
      {
        size: 2,
        hx: 7,
        hy: 23
      },
      {
        size: 2,
        hx: -7,
        hy: 23
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0, -13 L 4, -17 L 7, -14 L 7, -11 L 5, -9 L 5, -6 L 7, -4 L 7, 23 L -7, 23 L -7, -4 L -5, -6 L -5, -9 L -7, -11 L -7, -14 L -4, -17 Z',
              class: 'craftIcon'
            }],
            ['path', {
              d: 'M 4,2 L 7,-1 L 9, -1 L 12, 2 L 12, 6 L 9, 9 L 8, 9 L 4, 6 Z',
              class: 'craftIcon'
            }],
            ['path', {
              d: 'M -4,2 L -7,-1 L -9, -1 L -12, 2 L -12, 6 L -9, 9 L -8, 9 L -4, 6 Z',
              class: 'craftIcon'
            }],
            ['path', {
              d: 'M 7,18 L 8,18 L 10,20 L 10, 25 L 9, 26 L 4, 26 L 2, 24 L 2, 23 Z',
              class: 'craftIcon'
            }],
            ['path', {
              d: 'M -7,18 L -8,18 L -10,20 L -10, 25 L -9, 26 L -4, 26 L -2, 24 L -2, 23 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  noise: () => ({
    class: 'Noise',
    abr: 'NIS',
    designation: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 5,
    weaponsHardpoints: [],
    icon: ['g', {},
            ['path', {
              d: 'M 0, -10 L 4, -4 L 12, 0 L 4, 4 L -4, 4 L -12, 0 L -4, -4 Z',
              class: 'craftIcon'
            }],
            [
              'circle',
              {r : 4, cx:0, cy: 4, class: 'craftIcon'}
            ]
          ]
  }),

  swarmer: () => ({
    class: 'Swarmer',
    abr: 'SWM',
    designation: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 10,
    health: 3,
    weaponsHardpoints: [
      {
        size: 1,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0,10 L 4,0 L 0,-8 L -4,0 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  lobber: () => ({
    class: 'Lobber',
    abr: 'LOB',
    designation: 'combat',
    cargoCap: 50,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 5,
    weaponsHardpoints: [
      {
        size: 3,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0, -10 L 4, -6 L 4, 11 L 0, 13 L -5, 13 L -5, 5 L -5, -5 Z',
              class: 'craftIcon'
            }],
            // ['path', {
            //   d: 'M 2, 0 L 2, -4 L 4,-6 L 8,-2 L 7,1 L 4,2 Z',
            //   class: 'craftIcon'
            // }],
            // ['path', {
            //   transform: 'translate(0,8)',
            //   d: 'M 2, 0 L 2, -4 L 4,-6 L 8,-2 L 7,1 L 4,2 Z',
            //   class: 'craftIcon'
            // }],
            // ['path', {
            //   transform: 'translate(-1,11)',
            //   d: 'M -2, 0 L -2, -4 L -4,-6 L -8,-2 L -7,1 L -4,2 Z',
            //   class: 'craftIcon'
            // }],
            [
              'circle',
              {r : 5, cx:-5, cy: 0, class: 'craftIcon'}
            ],
            [
              'circle',
              {r : 2, cx:2, cy: 12, class: 'craftIcon'}
            ]
          ]
  }),

  bastion: () => ({
    class: 'Bastion',
    abr: 'BST',
    designation: 'combat',
    cargoCap: 100,
    fuelCapacity: 0,
    fuelConsumption: 0,
    accel: 0,
    health: 100,
    weaponsHardpoints: [
      {
        size: 3,
        hx: 2,
        hy: 3
      },
      {
        size: 3,
        hx: 9,
        hy: 3
      },
      {
        size: 3,
        hx: 5,
        hy: 9
      },
      {
        size: 2,
        hx: 0,
        hy: 25
      },
      {
        size: 2,
        hx: 5,
        hy: 22
      },
      {
        size: 2,
        hx: -5,
        hy: 22
      },
      {
        size: 2,
        hx: 0,
        hy: -25
      },
      {
        size: 2,
        hx: 5,
        hy: -22
      },
      {
        size: 2,
        hx: -5,
        hy: -22
      },
      {
        size: 2,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['circle', {
              r: 20,
              class: 'craftIcon'
            }],
            ['circle', {
              cx: 5,
              cy: 5,
              r: 10,
              class: 'craftIconDetail'
            }],
            ['g', {transform: 'rotate(0)'},
              ['path', {
                d: 'M -10, 17 L 10, 17 L 10, 25 L 5, 30 L -5, 30 L -10, 25 Z',
                class: 'craftIconDetail'
              }]
            ],
            ['g', {transform: 'rotate(180)'},
              ['path', {
                d: 'M -10, 17 L 10, 17 L 10, 25 L 5, 30 L -5, 30 L -10, 25 Z',
                class: 'craftIconDetail'
              }]
            ],
            ['g', {transform: 'rotate(80)'},
              ['circle', {
                r: 10,
                cx: 0,
                cy: 30,
                class: 'craftIconDetail'
              }],
              ['path', {
                d: 'M -10, 17 L 10, 17 L 10, 30 L -10, 30 Z',
                class: 'craftIconDetail'
              }],
              ['path', {
                d: 'M -5, 20 L 15, 20 L 15, 28 L -5, 28 Z',
                class: 'craftIconDetail'
              }]
            ],
            ['g', {transform: 'rotate(260)'},
              ['circle', {
                r: 5,
                cx: -5,
                cy: 25,
                class: 'craftIconDetail'
              }],
              ['path', {
                d: 'M -10, 17 L 10, 17 L 10, 25 L -10, 25 Z',
                class: 'craftIconDetail'
              }],
              ['path', {
                d: 'M 5, 25 L 8, 25 L 8, 85 L 5, 85 Z',
                class: 'craftIconDetail'
              }]
            ]
          ]
  })
};
