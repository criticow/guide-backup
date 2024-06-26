import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
})
export class LoaderComponent {
  // Dependence Injection
  private loadingService: LoadingService;

  // Class Variables
  public message$: Observable<string>;
  public isLoading$: Observable<boolean>;

  constructor() {
    this.loadingService = inject(LoadingService);
    this.message$ = this.loadingService.message$;
    this.isLoading$ = this.loadingService.isLoading$;
  }
}
