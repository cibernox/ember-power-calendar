import Controller from '@ember/controller';

export default Controller.extend({
  center: new Date('2016-05-17'),
  range: {
    start: new Date('2016-05-10'),
    end: new Date('2016-05-15')
  }
});
