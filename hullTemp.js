module.exports = {
  arrow: () => ({
    class: 'Arrow',
    abr: 'ARR',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    home: 'astroDeltaB',
    health: 5,
    weaponsHardpoints: [
      {
        size: 2,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0, 0 L  3,-3 L  0, 5 L -3,-3 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  bolt: () => ({
    class: 'Bolt',
    abr: 'BLT',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 8,
    weaponsHardpoints: [
      {
        size: 2,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0,-5 L  3,-3 L  0, 5 L -3,-3 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  spear: () => ({
    class: 'Spear',
    abr: 'SPR',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 20,
    weaponsHardpoints: [
      {
        size: 2,
        hx: 0,
        hy: 5
      },
      {
        size: 3,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['path', {
              d: 'M 0,-5 L -2,-2 L -6, 0 L -3, 2 L -2, 5 L -1, 8 L 0, 10 L 1,8 L 2, 5 L 3, 2 L 6, 0 L 2,-2 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  noise: () => ({
    class: 'Noise',
    abr: 'NIS',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    health: 5,
    weaponsHardpoints: [],
    icon: ['g', {},
            ['path', {
              d: 'M 0, -5 L 2, -2 L 6, 0 L 2, 2 L -2, 2 L -6, 0 L -2, -2 Z',
              class: 'craftIcon'
            }],
            [
              'circle',
              {r : 2, cx:0, cy: 2, class: 'craftIcon'}
            ]
          ]
  }),

  swarmer: () => ({
    class: 'Swarmer',
    abr: 'SWM',
    type: 'combat',
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
              d: 'M 0,3 L 3,0 L 0,-3 L -3,0 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  lobber: () => ({
    class: 'Lobber',
    abr: 'LOB',
    type: 'combat',
    cargoCap: 10,
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
              d: 'M 0, -5 L 3, -1 L 3, 1 L 0, 5 L -3, 1 L -3, -1 Z',
              class: 'craftIcon'
            }],
            [
              'circle',
              {r : 2, cx:-3, cy: 0, class: 'craftIcon'}
            ],
            [
              'circle',
              {r : 2, cx:3, cy: 0, class: 'craftIcon'}
            ]
          ]
  }),

  bastion: () => ({
    class: 'Bastion',
    abr: 'BST',
    type: 'combat',
    cargoCap: 100,
    fuelCapacity: 0,
    fuelConsumption: 0,
    accel: 0,
    health: 100,
    weaponsHardpoints: [
      {
        size: 3,
        hx: 0,
        hy: 0
      },
      {
        size: 1,
        hx: 0,
        hy: 0
      }
    ],
    icon: ['g', {},
            ['circle', {
              r: 20,
              class: 'craftIcon'
            }]
          ]
  })
};
