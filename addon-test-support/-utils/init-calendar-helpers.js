import CalendarTestService from '../calendar-test-service';

export default function(application) {
  CalendarTestService.setCalendarService(application.__container__.lookup('service:power-calendar'));
}
