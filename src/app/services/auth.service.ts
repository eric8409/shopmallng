import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import { Router } from '@angular/router'; // 導入 Router 服務
import { CartService } from './cart.service'; // 導入 CartService

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userIdSubject = new BehaviorSubject<number | null>(null);
  public readonly userId$ = this.userIdSubject.asObservable();
  private readonly USER_ID_KEY = 'user_id'; // 使用常數鍵名

  // 注入 Router 服務
  constructor(private router: Router,  private cartService: CartService) {
    // *** 恢復 ID 的關鍵邏輯 ***
    const storedId = localStorage.getItem(this.USER_ID_KEY);
    if (storedId) {
      this.userIdSubject.next(+storedId);
    }
  }

  setUserId(id: number): void {
    this.userIdSubject.next(id);
    localStorage.setItem(this.USER_ID_KEY, id.toString());
  }

  // 新增：獲取當前使用者 ID 的快照值
  getCurrentUserId(): number | null {
    return this.userIdSubject.value;
  }

  // 新增：檢查使用者是否登入 (是否有 ID)
  isLoggedIn(): boolean {
    return this.userIdSubject.value !== null;
  }

  // 完善 logout 方法
  logout(): void {
    // 從 BehaviorSubject 清除 ID
    this.userIdSubject.next(null);

    // 從 localStorage 清除 ID
    localStorage.removeItem(this.USER_ID_KEY);

    // 導向登入頁面
    localStorage.removeItem('access_token');

    // *** 呼叫 CartService 清空購物車 ***
    this.cartService.clearCart();

    this.router.navigate(['/login']);
  }
}
