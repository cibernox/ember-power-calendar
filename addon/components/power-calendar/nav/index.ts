import Component from '@glimmer/component';

interface IArgs {
  unit: string;
  format: string;
}
export default class PowerCalendarNav extends Component<IArgs> {
  get unit() {
    return this.args.unit ?? "month";
  }

  get format() {
    return this.args.format ?? "MMMM YYYY";
  }
}
