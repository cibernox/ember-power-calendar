import Ember from 'ember';
import moment from 'moment';

const {
  Controller,
  inject: { controller }
} = Ember;

export default Controller.extend({
  applicationController: controller('application'),
  today: moment()
});