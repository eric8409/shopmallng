import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";



@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient,  private authService: AuthService) { }

  private postUrl = 'http://localhost:8080/users';
  private getUrl = 'http://localhost:8080/users'


  // *** 新增一個方法來獲取標準的驗證 Headers ***
  private getAuthHeaders(): HttpHeaders {
    // 從 localStorage 或 AuthService 中獲取您的 JWT Token
    // 請將 'access_token' 替換為您實際儲存 Token 的鍵名
    const token = localStorage.getItem('access_token');

    if (token) {
      // 如果有 Token，就創建一個帶有 'Authorization: Bearer <token>' 的 Headers 物件
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      // 如果沒有 Token，只返回 Content-Type
      return new HttpHeaders({
        'Content-Type': 'application/json'
      });
    }
  }

  // *** 修改 postOrder 方法，加入 Headers ***
  postOrder(userId: number | null, data: any): Observable<any> {
    // 將 headers 物件作為第三個參數傳遞給 post() 方法
    return this.http.post(
      `${this.postUrl}/${userId}/orders`,
      data,
      { headers: this.getAuthHeaders() } // <-- 加入 Headers
    );
  }

  // *** 修改 getIOrderById 方法，加入 Headers ***
  getIOrderById(userId: number | null): Observable<any> {
    // 將 headers 物件作為第二個參數傳遞給 get() 方法
    return this.http.get<any>(
      `${this.getUrl}/${userId}/orders`,
      { headers: this.getAuthHeaders() } // <-- 加入 Headers
    );
  }
}
