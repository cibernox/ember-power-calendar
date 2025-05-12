import Application from 'test-app/app';
import config from 'test-app/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { loadTests } from 'ember-qunit/test-loader';
import { start, setupEmberOnerrorValidation } from 'ember-qunit';
import isCalendar from './assertions/is-calendar';
import isDay from './assertions/is-day';

setApplication(Application.create(config.APP));

// @ts-expect-error Property 'isCalendar' does not exist on type 'Assert'
QUnit.assert.isCalendar = isCalendar;
// @ts-expect-error Property 'isDay' does not exist on type 'Assert'
QUnit.assert.isDay = isDay;

setup(QUnit.assert);
setupEmberOnerrorValidation();
loadTests();
start();
