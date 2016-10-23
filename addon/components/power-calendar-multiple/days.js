import DaysComponent from '../power-calendar/days';

export default DaysComponent.extend({
  // Methods
  dayIsSelected(dayMoment, calendar = this.get('calendar')) {
    let selected = calendar.selected || [];
    return selected.some((d) => dayMoment.isSame(d, 'day'));
  }
});
