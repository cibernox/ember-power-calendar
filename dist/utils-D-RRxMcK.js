import { add } from './utils.js';

function publicActionsObject(onSelect, select, onCenterChange, changeCenterTask, currentCenter) {
  const actions = {};
  if (onSelect) {
    actions.select = (...args) => select(...args);
  }
  if (onCenterChange) {
    const changeCenter = (newCenter, calendar, e) => {
      return changeCenterTask.perform(newCenter, calendar, e);
    };
    actions.changeCenter = changeCenter;
    actions.moveCenter = (step, unit, calendar, e) => {
      const newCenter = add(currentCenter, step, unit);
      return changeCenter(newCenter, calendar, e);
    };
  }
  return actions;
}

export { publicActionsObject as p };
//# sourceMappingURL=utils-D-RRxMcK.js.map
