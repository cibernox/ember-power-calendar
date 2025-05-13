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
    actions.moveCenter = async (step, unit, calendar, e) => {
      const newCenter = add(currentCenter, step, unit);
      return await changeCenter(newCenter, calendar, e);
    };
  }
  return actions;
}

export { publicActionsObject as p };
//# sourceMappingURL=utils-y7Wx9c84.js.map
