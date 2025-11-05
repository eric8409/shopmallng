import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from "../services/auth.service";


// @ts-ignore
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  order: { id: number | null } = { id: null }; // 初始化為 null
  private currentUserId: number | null | undefined;

  constructor(private router: Router, private authService: AuthService) { }


  ngOnInit(): void {
    // *** 核心修改：從 AuthService 獲取 ID ***
    this.currentUserId = this.authService.getCurrentUserId();
    this.order.id = this.currentUserId;

    if (this.currentUserId) {
      console.log('歡迎回來，當前使用者 ID:', this.currentUserId);
      // 在這裡載入使用者儀表板資料
    } else {
      // AuthGuard 應該已經攔截了，但這裡做個防禦性檢查
      console.error('未偵測到登入 ID，導向登入頁面');
      this.router.navigate(['/login']);
    }
  }


  onLogout(): void {
    // 使用瀏覽器內建的 confirm 彈窗
    const confirmation = window.confirm('確定要登出嗎？');

    // 如果使用者點擊「確定」
    if (confirmation) {
      console.log('使用者確認登出，執行登出邏輯...');

      // 實際的登出操作，例如：
      localStorage.removeItem('userToken');

      // 導航到登入頁面
      this.router.navigate(['/login']);

    } else {
      // 如果使用者點擊「取消」
      console.log('使用者取消登出。');
    }
  }
}
