import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


interface AuthResponse {
  access_token: string;
  user_id: number;
  email: String;
  token: string;
  // Other user data
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // 取得 API URL 的方法，請參考環境設定
  private postUrl = 'http://localhost:8080/users/register';
  private getUrl = 'http://localhost:8080/users/login'

  constructor(private http: HttpClient) {
  }

  postData(data: any): Observable<any> {
    return this.http.post(this.postUrl, data);
  }

  loginData(data: any): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(this.getUrl, data).pipe(
      tap(response => {
        // You can store the ID and other user data securely here.
        // For demonstration, we will just use the response directly in the component.
        console.log('User logged in ID:', response.user_id);

      })
    );
  }


}
