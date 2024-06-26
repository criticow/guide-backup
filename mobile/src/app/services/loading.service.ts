import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public isLoading$: Observable<boolean>;
  public message$: Observable<string>;
  private isLoadingSubject: BehaviorSubject<boolean>;
  private messageSubject: BehaviorSubject<string>;

  constructor() {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
    this.messageSubject = new BehaviorSubject<string>('');
    this.message$ = this.messageSubject.asObservable();
  }

  present(message: string){
    this.messageSubject.next(message);
    this.isLoadingSubject.next(true);
  }

  hide(){
    this.messageSubject.next('');
    this.isLoadingSubject.next(false);
  }
}
