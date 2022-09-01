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
    health: 5
  }),

  bolt: () => ({
    class: 'Bolt',
    abr: 'BLT',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    home: 'astroDeltaB',
    weaponsList: ['Lance'],
    health: 8
  }),

  swarmer: () => ({
    class: 'Swarmer',
    abr: 'SWM',
    type: 'combat',
    cargoCap: 0,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 10,
    home: 'astroDeltaB',
    weaponsList: ['MiniLance'],
    health: 3
  }),

  spear: () => ({
    class: 'Spear',
    abr: 'SPR',
    type: 'combat',
    cargoCap: 1,
    fuelCapacity: 50,
    fuelConsumption: 0.1,
    accel: 5,
    home: 'astroDeltaB',
    weaponsList: ['SuperLance', 'Lance'],
    health: 20
  }),
};
