import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Class Variables
  public isLoading$: Observable<boolean>;
  private isLoadingSubject: BehaviorSubject<boolean>;
  public message$: Observable<string>;
  private messageSubject: BehaviorSubject<string>;

  // Initialization
  constructor() { 
    this.messageSubject = new BehaviorSubject<string>('');
    this.message$ = this.messageSubject.asObservable();
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  // Methods
  public present(message: string) {
    this.messageSubject.next(message);
    this.isLoadingSubject.next(true);
  }

  public hide() {
    this.messageSubject.next('');
    this.isLoadingSubject.next(false);
  }
}
