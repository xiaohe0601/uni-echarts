export const MOUSE_EVENTS = [
  "click",
  "dblclick",
  "mouseout",
  "mouseover",
  "mouseup",
  "mousedown",
  "mousemove",
  "contextmenu",
  "globalout"
];

export const ELEMENT_EVENTS = [
  ...MOUSE_EVENTS,
  "mousewheel",
  "drag",
  "dragstart",
  "dragend",
  "dragenter",
  "dragleave",
  "dragover",
  "drop"
];

export const ZRENDER_EVENTS = ELEMENT_EVENTS.map((it) => `zr:${it}`);

export const OTHER_EVENTS = [
  "highlight",
  "downplay",
  "selectchanged",
  "legendselectchanged",
  "legendselected",
  "legendunselected",
  "legendselectall",
  "legendinverseselect",
  "legendscroll",
  "datazoom",
  "datarangeselected",
  "graphroam",
  "georoam",
  "treeroam",
  "timelinechanged",
  "timelineplaychanged",
  "restore",
  "dataviewchanged",
  "magictypechanged",
  "geoselectchanged",
  "geoselected",
  "geounselected",
  "axisareaselected",
  "brush",
  "brushEnd",
  "brushselected",
  "globalcursortaken",
  "showtip",
  "hidetip"
];

export const ECHARTS_EVENTS = [
  ...MOUSE_EVENTS,
  ...OTHER_EVENTS,
  "rendered",
  "finished",
  ...ZRENDER_EVENTS
];

export const UNI_EVENTS = [
  "touchstart",
  "touchmove",
  "touchcancel",
  "touchend",
  "tap",
  "longpress",
  "longtap",
  "transitionend",
  "animationstart",
  "animationiteration",
  "animationend",
  "touchforcechange"
];

export const NATIVE_EVENTS = [
  ...ELEMENT_EVENTS,
  ...UNI_EVENTS
].map((it) => `native:${it}`);

export const COMPONENT_EVENTS = [
  "inited"
];

export const EVENTS = [
  ...ECHARTS_EVENTS,
  ...NATIVE_EVENTS,
  ...COMPONENT_EVENTS
];