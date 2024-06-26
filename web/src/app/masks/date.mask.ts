import { Directive, ElementRef, HostListener, Input, forwardRef } from "@angular/core";
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from "@angular/forms";
import { DateTime } from "luxon";

@Directive({
  selector: '[dateMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateMaskDirective),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DateMaskDirective),
      multi: true
    }
  ]
})
export class DateMaskDirective implements ControlValueAccessor, Validator {
  private el: HTMLInputElement;
  @Input() keepCharacters: boolean;
  @Input() useBRFormat: boolean;
  @Input() onlyGreaterDates: boolean;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
    this.keepCharacters = false;
    this.useBRFormat = false;
    this.onlyGreaterDates = false;
  }

  public validate(control: AbstractControl<any, any>): ValidationErrors | null {
    const value = control.value;

    let isValid = false;

    if(DateTime.fromFormat(this.toUSFormat(), 'yyyy-MM-dd').setZone('America/Sao_Paulo').isValid) {
      isValid = true;
    }

    if(isValid && this.onlyGreaterDates) {
      const {day, month, year} = DateTime.now().setZone('America/Sao_Paulo');
      const {day: day2, month: month2, year: year2} = DateTime.fromFormat(this.toUSFormat(), 'yyyy-MM-dd').setZone('America/Sao_Paulo');

      isValid = false;

      if(year2 >= year) {
        isValid = true;

        if(month2 < month) {
          isValid = false;
        }

        if(month >= month) {
          if(day2 < day) {
            isValid = false;
          }
        }
      }
    }

    return isValid ? null : { 'dateInvalid': { value }};
  }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const initialValue = this.el.value;
    // formats the value
    this.el.value = this.format(initialValue);
    // this is the end value that will be stored in the bound variable
    let realValue = this.el.value;

    if(!this.useBRFormat) {
      realValue = this.toUSFormat();
    }

    if(!this.keepCharacters) {
      realValue = realValue.replace(/\D/g, '');
    }

    this.onChange(realValue);

    if (initialValue !== this.el.value) {
      event.stopPropagation();
    }
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.el.value = this.format(value);

    let realValue = this.el.value;

    if(!this.useBRFormat) {
      realValue = this.toUSFormat();
    }

    if(!this.keepCharacters) {
      realValue = realValue.replace(/\D/g, '');
    }

    this.onChange(realValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.el.disabled = isDisabled;
  }

  public format(value: string) {
    if(!value) return '';

    // Replace everything but numbers
    value = value.replace(/\D/g, '');

    if(value === '00') {
      value = '0';
    }

    // replaces days starting with 4+ with 0+d
    // or replaces days greater than 31 with 0+d
    if(value.length === 1 && Number(value) > 3 || value.length === 2 && Number(value) > 31) {
      value = ('0' + value).replace(/(\d{2})(\d)/, '$1/$2');
    } else {
      // Gets 2 groups the first group of 2 sequential digits and the second the rest of digits
      // and replace the 2 groups with 1group + / + 2group
      // results can be 0 or 00 or 00/0n
      value = value.replace(/(\d{2})(\d)/, '$1/$2');
    }

    let [day, month] = value.split('/');

    if(month === '00') {
      value = day + '/' + '0';
    }

    // replaces months starting with 2+ with 0+m
    // or replaces months greather than 12 with 0+m
    if(month && (month.length === 1 && Number(month) > 1 || month.length === 2 && Number(month) > 12)) {
      value = day + '/' + 0 + month;
    }

    // Gets 2 groups, the first group of 2 sequential digits and the second a group of digits with range [1, 4]
    // and replace the 2 groups with 1group + - + 2group
    // results can be 0 or 00 or 00/0[1, 4]
    // using - instead of / since the next step doesnt work with / for some reason
    value = value.replace(/(\d{2})(\d{1,4})/, '$1-$2');

    // Gets 2 groups, the first group of -0000 and the second everything else
    // and keeps only the first group
    value = value.replace(/(-\d{4})\d+?$/, '$1');

    // replaces the - with / to finish the date
    value = value.replace('-', '/');

    return value;
  }

  public toUSFormat() {
    return this.el.value.split('/').reverse().join('-');
  }
}