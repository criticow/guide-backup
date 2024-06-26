import { Directive, ElementRef, HostListener, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[currencyMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyMaskDirective),
      multi: true
    }
  ]
})
export class CurrencyMaskDirective implements ControlValueAccessor {
  @Input() sufix: string = '';
  @Input() prefix: string = '';
  @Input() keepCharacters: boolean;
  @Input() isNumeric: boolean;

  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
    this.keepCharacters = false;
    this.isNumeric = false;
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.el.value = this.formatCurrency(value);
    this.setCursor();
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

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const initialValue = this.el.value;
    this.el.value = this.formatCurrency(initialValue);

    let realValue: number | string = this.el.value;

    if(!this.keepCharacters) {
      realValue = realValue.replace(/\D/g, '');
    }

    if(this.isNumeric) {
      realValue = realValue.replace(/\D/g, '');
      realValue = !realValue ? 0 : Number(realValue);
    }

    this.onChange(realValue);

    this.setCursor();

    if (initialValue !== this.el.value) {
      event.stopPropagation();
    }
  }

  private setCursor() {
    const position = this.el.value.indexOf(this.sufix);
    if(position)
      this.el.setSelectionRange(position, position);
  }

  private formatCurrency(value: string): string {
    value = String(value);
    value = value.replace(/\D/g, ''); // Remove non-numeric characters

    if(!value) return '';

    const num = parseFloat(value) / 100;

    return `${this.prefix}${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${this.sufix}`;
  }
}
