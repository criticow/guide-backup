import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'ui-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class LoaderComponent  implements OnInit {
  message$: Observable<string>;
  isLoading$: Observable<boolean>;

  constructor(private loadingService: LoadingService) {
    this.message$ = this.loadingService.message$;
    this.isLoading$ = this.loadingService.isLoading$;
  }

  ngOnInit() {}

}
