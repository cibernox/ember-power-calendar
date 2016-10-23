import DaysComponent from '../power-calendar/days';
import moment from 'moment';

export default DaysComponent.extend({
  // Methods
  dayIsSelected(dayMoment, calendar = this.get('calendar')) {
    let selected = calendar.selected || [];
    return selected.some((d) => dayMoment.isSame(d, 'day'));
  },

  buildOnChangeValue(day) {
    let selected = this.get('calendar.selected') || [];
    let moments = [];
    for (let i = 0; i < selected.length; i++) {
      if (day.moment.isSame(selected[i], 'day')) {
        selected.forEach((d, index) => {
          if (i !== index) {
            moments[moments.length] = moment(d);
          }
        });
        break;
      }
    }
    if (moments.length === 0) {
      moments = [...selected.map((d) => moment(d)), day.moment];
    }
    return {
      moment: moments,
      date: moments.map((m) => m._d)
    };
  }
});
