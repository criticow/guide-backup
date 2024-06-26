import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  public isShowing$: Observable<boolean>;
  public title$: Observable<string>;
  public message$: Observable<string>;
  public progress$: Observable<number>;
  private isShowingSubject: BehaviorSubject<boolean>;
  private titleSubject: BehaviorSubject<string>;
  private messageSubject: BehaviorSubject<string>;
  private progressSubject: BehaviorSubject<number>;

  totalTime: number = 7;
  currentTime: number = this.totalTime;
  interval: any;

  constructor() {
    this.isShowingSubject = new BehaviorSubject<boolean>(false);
    this.titleSubject = new BehaviorSubject<string>('');
    this.messageSubject = new BehaviorSubject<string>('');
    this.progressSubject = new BehaviorSubject<number>(0);
    this.isShowing$ = this.isShowingSubject.asObservable();
    this.title$ = this.titleSubject.asObservable();
    this.message$ = this.messageSubject.asObservable();
    this.progress$ = this.progressSubject.asObservable();
  }

  present(options: {title: string, message: string}) {
    this.currentTime = this.totalTime;
    this.titleSubject.next(options.title);
    this.messageSubject.next(options.message);
    this.isShowingSubject.next(true);
    this.progressSubject.next(100);

    this.interval = setInterval(() => {

      this.currentTime -= 0.5;
      this.progressSubject.next(this.currentTime / this.totalTime * 100);

      if(this.currentTime === 0) {
        clearInterval(this.interval);
        this.isShowingSubject.next(false);
      }
    }, 500);
  }

  hide() {
    this.isShowingSubject.next(false);
    this.progressSubject.next(100);
    this.currentTime = this.totalTime;
  }
}
