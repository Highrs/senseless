module.exports = {
  MiniLance: () => ({
    type: 'pulse',
    damage: 1,
    range: 50,
    reloadTime: 0.100,
    pulseTime: 0.100,
    color: "wepFire0"
  }),

  Lance: () => ({
    type: 'pulse',
    damage: 2,
    range: 100,
    reloadTime: 1.000,
    pulseTime: 1.000,
    color: "wepFire1"
  }),

  SuperLance: () => ({
    type: 'pulse',
    damage: 3,
    range: 300,
    reloadTime: 5.000,
    pulseTime: 3.000,
    color: "wepFire2"
  }),

  MiLa: () => ({
    type: 'launcher',
    range: 500,
    burst: 3,
    recycleTime: 0.5,
    reloadTime: 5.000
  }),
};
