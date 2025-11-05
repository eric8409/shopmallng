import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router'; // 導入 Event 並改名 RouterEvent
import { filter, tap } from 'rxjs/operators'; // 確保導入 tap

import { AuthService } from "./services/auth.service";
import { ChartService } from './services/chart.service'; // 確保路徑正確

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'shopmall';
  protected currentUserId: number | null = null;
  shouldHideLogout: boolean = false;


  constructor(private authService: AuthService, private router: Router, private chartService: ChartService) {

    // *** 修正錯誤的區塊 ***
    this.router.events.pipe(
      // 使用 filter 操作符來確保只有 NavigationEnd 事件通過，
      // 並自動將型別收窄為 NavigationEnd
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // 這裡的 event 現在可以確定是 NavigationEnd 型別，錯誤消失
      this.shouldHideLogout = (event.urlAfterRedirects === '/login');
    });

  }

  ngOnInit(): void {
    // 訂閱 AuthService 中的 ID 變化
    this.authService.userId$.subscribe(userId => {
      this.currentUserId = userId;
    });
  }

  // *** 實現登出方法 ***
  logout(): void {
    this.authService.logout(); // 清除 AuthService 中的 ID 和 localStorage
    alert('您已登出。');
    this.router.navigate(['/login']); // 導向登入頁面 (請確保你有 /login 路由)
  }

  // 在 AppComponent 中實現 triggerChart 方法
  triggerChart(): void {
    this.chartService.triggerChartEvent();
  }


}


