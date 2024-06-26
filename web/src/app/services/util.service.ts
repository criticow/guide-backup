import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

  constructor() { }

  getRemainingTime(endDateISO: string) {
    const now = DateTime.now().setZone("America/Sao_Paulo");
    let nowISO = now.toFormat("yyyy-MM-dd'T'HH:mm':00.000Z'");
    const startDate = new Date(nowISO);
    const endDate = new Date(endDateISO);
    const diff = endDate.getTime() - startDate.getTime();
    const minutesRemaining = Math.floor((diff / (1000 * 60)) % 60);
    const hoursRemaining = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const daysRemaining = Math.floor(diff / (1000 * 60 * 60 * 24))

    return minutesRemaining < 0 ? "Vencido" : daysRemaining + "d " + hoursRemaining + "H " + minutesRemaining + "m";
  }

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
