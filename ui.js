'use strict';

const addRateListeners = (options, updateRateCounter) => {
  document.getElementById('buttonStop').addEventListener('click', function () {
    options.rateSetting = 0;
    options.rate = options.simRates[options.rateSetting];
    if (options.rate === 0) {options.isPaused = true;}
    updateRateCounter(options);
  });
  document.getElementById('buttonSlow').addEventListener('click', function () {
    if (options.rateSetting > 0) {options.rateSetting--;}
    options.rate = options.simRates[options.rateSetting];
    if (options.rate === 0) {options.isPaused = true;}
    updateRateCounter(options);
  });
  document.getElementById('buttonFast').addEventListener('click', function () {
    if (options.rateSetting < options.simRates.length - 1) {options.rateSetting++;}
    if (options.isPaused === true) {options.isPaused = false;}
    options.rate = options.simRates[options.rateSetting];
    updateRateCounter(options);
  });
  document.getElementById('buttonMax').addEventListener('click', function () {
    options.rateSetting = options.simRates.length - 1;
    if (options.isPaused === true) {options.isPaused = false;}
    options.rate = options.simRates[options.rateSetting];
    updateRateCounter(options);
  });
};
exports.addRateListeners = addRateListeners;
exports.addBoxSettingsListeners = (mapPan, renderBoxSettings) => {
  let boxSettingsSettings = {
    isDragging: false,
    xTransform: 40,
    yTransform: 10,
    xTransformPast: 0,
    yTransformPast: 0,
  };
  document.getElementById('boxMainSettings').setAttribute(
    'transform', 'translate(' + boxSettingsSettings.xTransform + ', ' + boxSettingsSettings.yTransform + ')'
  );
  document.getElementById('boxSettingsDragger').addEventListener('mousedown', e => {
    if (e.which === 1 || e.which === 3) {
      boxSettingsSettings.xTransformPast = e.offsetX;
      boxSettingsSettings.yTransformPast = e.offsetY;
      boxSettingsSettings.isDragging = true;
    }
  });
  document.getElementById('content').addEventListener('mousemove', e => {
    if (boxSettingsSettings.isDragging) {
      boxSettingsSettings.xTransform += e.offsetX - boxSettingsSettings.xTransformPast;
      boxSettingsSettings.yTransform += e.offsetY - boxSettingsSettings.yTransformPast;
      if (boxSettingsSettings.xTransform > document.body.clientWidth - 160) {boxSettingsSettings.xTransform = document.body.clientWidth - 160;}
      if (boxSettingsSettings.yTransform > document.body.clientHeight - 80) {boxSettingsSettings.yTransform = document.body.clientHeight - 80;}
      if (boxSettingsSettings.xTransform < 0) {boxSettingsSettings.xTransform = 0;}
      if (boxSettingsSettings.yTransform < 0) {boxSettingsSettings.yTransform = 0;}
      boxSettingsSettings.xTransformPast = e.offsetX;
      boxSettingsSettings.yTransformPast = e.offsetY;
      document.getElementById('boxMainSettings').setAttribute(
        'transform', 'translate(' + boxSettingsSettings.xTransform + ', ' + boxSettingsSettings.yTransform + ')'
      );
    }
  });
  window.addEventListener('mouseup', function () {
    boxSettingsSettings.isDragging = false;
  });
  document.getElementById('boxSettingsCloser').addEventListener('click', function () {
    mapPan.boxes.boxSettings = false;
    renderBoxSettings([]);
  });
};
exports.addFrameListeners = (mapPan, renderers) => {
  document.getElementById('buttonSettings').addEventListener('click', function () {
    if (mapPan.boxes.boxSettings === false) {
      mapPan.boxes.boxSettings = true;
      renderers.boxSettings();
    } else {
      mapPan.boxes.boxSettings = false;
      renderers.boxSettings();
    }
  });
};
exports.addCraftListeners = (crafto, mapPan) => {
  document.getElementById(crafto.id + '-SELECTOR').addEventListener('mousedown', event => {
    event.stopPropagation();

    if (mapPan.unitSelected && mapPan.selectedUnit !== crafto) {
      mapPan.selectedUnit.selected = false;
      mapPan.selectedChange = true;
      mapPan.someMapUpdate = true;
      mapPan.selectedUnit.selectorsNeedUpdating = true;
      mapPan.unitSelected = false;
      mapPan.selectedUnit = undefined;
    }
    if (!mapPan.unitSelected) {
      crafto.selected = true;
      mapPan.unitSelected = true;
      mapPan.selectedUnit = crafto;
      mapPan.selectedChange = true;
      mapPan.someMapUpdate = true;
      crafto.selectorsNeedUpdating = true;
    }
  });
};

exports.addListeners = (options, mapPan, renderers, functions) => {
  function pause() {
    options.isPaused = true;
    console.log('|| Unfocused');
  }
  function play() {
    allowed = true;
    if (options.rate !== 0) {options.isPaused = false;}
    console.log('>> Focused');
  }

  window.addEventListener('blur', pause);
  window.addEventListener('focus', play);
  window.addEventListener('resize', function() {renderers.resizeWindow();});

  let allowed = true;

  const checkKeyDown = (e) => {
    // console.log(e.code);
    if (e.repeat != undefined) {
      allowed = !event.repeat;
    }
    if (!allowed) return;
    allowed = false;

    switch (e.code) {
      case 'ArrowUp':
        mapPan.y += options.keyPanStep;
        break;
      case 'ArrowDown':
        mapPan.y -= options.keyPanStep;
        break;
      case 'ArrowLeft':
        mapPan.x += options.keyPanStep;
        break;
      case 'ArrowRight':
        mapPan.x -= options.keyPanStep;
        break;
      case 'ControlLeft':
        if (mapPan.unitSelected) {
          // console.log('Ctrl Key Down');
          mapPan.preppingWaypoint = true;
        }
        break;
    }
  };
  const checkKeyUp = (e) => {
    allowed = true;
    switch (e.code) {
      case 'KeyM':
        if (mapPan.preppingWaypoint) {
          mapPan.preppingWaypoint = false;
        }
        break;
      case 'ControlLeft':
        if (mapPan.preppingWaypoint) {
          mapPan.preppingWaypoint = false;
        }
        break;
    }
  };

  document.onkeydown = checkKeyDown;
  document.onkeyup = checkKeyUp;

  let isPanning = false;
  let pastOffsetX = 0;
  let pastOffsetY = 0;

  //ADD PAUSE ON SPACE

  document.getElementById('content').addEventListener('mousedown', e => {
    if (
      mapPan.selectedUnit &&
      mapPan.selectedUnit.mobile &&
      mapPan.preppingWaypoint &&
      e.which === 1
    ) {
      if ( mapPan.selectedUnit.waypoints.length > 0) {
        functions.removeWaypoint();
      }
      functions.makeWaypoint({
        x: (e.offsetX - mapPan.x) / mapPan.zoom,
        y: (e.offsetY - mapPan.y) / mapPan.zoom
      });
      mapPan.selectedUnit.courseChange = true;
      mapPan.someMapUpdate = true;
      mapPan.selectedUnit.selectorsNeedUpdating = true;

      // console.log(mapPan.waypointList);
    } else if (
      mapPan.unitSelected &&
      !mapPan.preppingWaypoint &&
      e.which !== 3
    ) {
      mapPan.selectedUnit.selected = false;
      mapPan.someMapUpdate = true;
      mapPan.selectedUnit.selectorsNeedUpdating = true;
      mapPan.unitSelected = false;
      mapPan.selectedUnit = undefined;
      // console.log('Unselected 2');
    }
    if (e.which === 3) {
      pastOffsetX = e.offsetX;
      pastOffsetY = e.offsetY;
      isPanning = true;
    }
  });

  document.getElementById('content').addEventListener('mousemove', e => {
    if (isPanning) {
      mapPan.x += e.offsetX - pastOffsetX;
      mapPan.y += e.offsetY - pastOffsetY;
      pastOffsetX = e.offsetX;
      pastOffsetY = e.offsetY;
    }
    mapPan.mousePosX = e.offsetX;
    mapPan.mousePosY = e.offsetY;
  });

  window.addEventListener('mouseup', function () {
    isPanning = false;
  });

  document.getElementById('content').addEventListener('wheel', function (e) {
    event.preventDefault();
    const zoomStep = 10**(0.05*mapPan.zoom)-1;
    mapPan.cursOriginX = e.offsetX - mapPan.x;
    mapPan.cursOriginY = e.offsetY - mapPan.y;
    if (e.deltaY < 0) {
      mapPan.zoomChange += zoomStep;
    }
    if (e.deltaY > 0) {
      mapPan.zoomChange -= zoomStep;
    }
  });
};
