import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from "./services/auth.service"; // 導入 AuthService

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  // 在建構函式中注入 AuthService 和 Router
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    // 使用 AuthService 提供的 isLoggedIn 方法來判斷權限
    if (this.authService.isLoggedIn()) {
      return true; // 允許訪問受保護的路由
    } else {
      // 如果未登入，導向登入頁面
      alert('您尚未登入，請先登入。');
      this.router.navigate(['/login']);
      return false; // 拒絕訪問
    }
  }
}
