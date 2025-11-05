import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  // 使用 Subject 作為事件發射器
  private triggerChartSubject = new Subject<void>();

  // 作為 Observable 供其他元件訂閱
  triggerChart$ = this.triggerChartSubject.asObservable();

  constructor() { }

  // 供 AppComponent 呼叫以發射事件
  triggerChartEvent(): void {
    this.triggerChartSubject.next();
  }
}
