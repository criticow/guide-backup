import { DateTime } from "luxon";

const now = () => {
  const now = DateTime.now().setZone("America/Sao_Paulo");
  let nowISO = now.toFormat("yyyy-MM-dd'T'HH:mm':00.000Z'");
  return nowISO;
}

const formatDecimal = (value: number) => {
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2});
}

const formatISODate = (ISODate: string) => {
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

export default {
  now,
  formatDecimal,
  formatISODate
};