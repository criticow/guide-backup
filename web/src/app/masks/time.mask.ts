import { Directive, ElementRef, HostListener, Input, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CpfMaskDirective } from "./cpf.mask";

@Directive({
  selector: '[timeMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeMaskDirective),
      multi: true
    }
  ]
})
export class TimeMaskDirective implements ControlValueAccessor {
  private el: HTMLInputElement;
  @Input() keepCharacters: boolean;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
    this.keepCharacters = false;
  }

  
  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const initialValue = this.el.value;
    // formats the value
    this.el.value = this.format(initialValue);
    // this is the end value that will be stored in the bound variable
    let realValue = this.el.value;

    if(!this.keepCharacters) {
      realValue = realValue.replace(/\D/g, '');
    }

    this.onChange(this.el.value);

    if (initialValue !== this.el.value) {
      event.stopPropagation();
    }
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    // this is for pasting or when the value changes programatically instead of by user input
    this.el.value = this.format(value);
  
    let realValue = this.el.value;

    if(!this.keepCharacters) {
      realValue = realValue.replace(/\D/g, '');
    }

    this.onChange(this.el.value);
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

    // replaces hours starting with 3+ since there are no hours greater than 23
    // and replaces hours greater than 23 since hours range betwee [0, 23]
    // and add the : if there are 2 groups
    if(value.length === 1 && Number(value) > 2 || value.length === 2 && Number(value) > 23) {
      value = ("0" + value).replace(/(\d{2})(\d)/g, '$1:$2');
    } else {
      // gets 2 groups of digits the first one is the first sequence of 2 digits and the second is the remaining
      // and replace the 2 groups with 1group + : + 2group
      value = value.replace(/(\d{2})(\d)/g, '$1:$2');
    }

    const [hour, minute] = value.split(':');

    // replaces minutes starting with 6+ and minutes greater than 59 since minutes range between [0, 59]
    if(minute && (minute.length === 1 && Number(minute) > 5 || minute.length === 2 && Number(minute) > 59)) {
      value = hour + ":" + "0" + minute;
    }

    // gets 2 groups on digits, the first one starting with :00 and the second the remaining digits
    // and keeps only the first group
    value = value.replace(/(:\d{2})\d+?$/, '$1');

    return value;
  }
}