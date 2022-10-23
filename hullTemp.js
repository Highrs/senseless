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
    weaponsList: ['Lance'],
    health: 5,
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
    weaponsList: ['Lance'],
    health: 8,
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
    weaponsList: ['SuperLance', 'Lance'],
    health: 20,
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
    weaponsList: [],
    health: 20,
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
    cargoCap: 0,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 10,
    weaponsList: ['MiniLance'],
    health: 3,
    icon: ['g', {},
            ['path', {
              d: 'M 0,3 L 3,0 L 0,-3 L -3,0 Z',
              class: 'craftIcon'
            }]
          ]
  }),

  bastion: () => ({
    class: 'Bastion',
    abr: 'BST',
    type: 'combat',
    cargoCap: 0,
    fuelCapacity: 0,
    fuelConsumption: 0,
    accel: 0,
    weaponsList: ['SuperLance'],
    health: 100,
    icon: ['g', {},
            ['circle', {
              r: 20,
              class: 'craftIcon'
            }]
          ]
  })
};
