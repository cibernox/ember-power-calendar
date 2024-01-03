import Application from 'test-app/app';
import config from 'test-app/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';
import isCalendar from './assertions/is-calendar';
import isDay from './assertions/is-day';

setApplication(Application.create(config.APP));

QUnit.assert.isCalendar = isCalendar;
QUnit.assert.isDay = isDay;

setup(QUnit.assert);

start();
