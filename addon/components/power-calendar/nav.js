import Component from '@glimmer/component';

export default class extends Component {
  get unit() {
    return this.args.unit || 'month';
  }

  get format() {
    return this.args.format || 'MMMM YYYY';
  }
}
