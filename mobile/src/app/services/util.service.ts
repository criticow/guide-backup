import { Injectable } from '@angular/core';
import { Corrida } from '../definitions';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

  constructor() { }

  formatDecimal(value: number) {
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2});
  }

  formatISODate(ISODate: string) {
    // ['yyyy-MM-dd', 'HH:mm:ss.000Z']
    const [date, fullTime] = ISODate.split("T");
    // ['yyyy', 'MM', 'dd']
    const [year, month, day] = date.split('-');
    // ['HH:mm:ss', '000Z']
    const [time, _zone] = fullTime.split('.');
    // ['HH', 'mm', 'ss']
    const [hours, minutes, _seconds] = time.split(":");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
}
