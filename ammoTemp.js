module.exports = {
  knockout: () => ({
    class: 'Knockout',
    abr: 'KO',
    type: 'missile',
    cargoCap: 0,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 20,
    home: 'astroDeltaB',
    warhead: 'beam',
    health: 3,
    icon: ['g', {},
            ['path', {
              d: 'M 0, -3 L 1,0 L 0, 3 L -1,0 Z',
              class: 'craftIcon'
            }]
          ]
  }),
};
