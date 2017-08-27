import CalendarTestService from '../calendar-test-service';

export default function(container) {
  CalendarTestService.setCalendarService(container.lookup('service:power-calendar'));
}
