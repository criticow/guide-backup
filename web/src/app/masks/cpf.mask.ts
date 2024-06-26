import { Directive, ElementRef, HostListener, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CurrencyMaskDirective } from "./currency.mask";

@Directive({
  selector: '[cpfMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CpfMaskDirective),
      multi: true
    }
  ]
})
export class CpfMaskDirective implements ControlValueAccessor {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const initialValue = this.el.value;
    this.el.value = this.format(initialValue);
    const onlyNumbers = this.el.value.replace(/\D/g, '');

    if (initialValue !== this.el.value) {
      event.stopPropagation();
    }
  }

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.el.value = this.format(value);
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

    return value
      .replace(/\D/g, '')                   // Remove tudo que nao for numeros
      .replace(/(\d{3})(\d)/, '$1.$2')      // Busca a primeira ocorrencia de 000 0 e substitui por 000.0
      .replace(/(\d{3})(\d)/, '$1.$2')      // Busca a primeira ocorrencia de 000 0 e substitui por 000.0
      .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Busca a primeira ocorrencia de 000 0/000 00 e substitui por 000-0/000-00
      .replace(/(-\d{2})\d+?$/, '$1');      // Busca a primeira ocorrencia de -00 0 e substitui por -00 (somente CPF)
  }
}