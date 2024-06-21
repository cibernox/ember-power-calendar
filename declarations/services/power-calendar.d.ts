import Service from '@ember/service';
export default class extends Service {
    date: Date | null;
    _local?: string;
    get locale(): string;
    set locale(value: string);
    getDate(): Date;
}
//# sourceMappingURL=power-calendar.d.ts.map