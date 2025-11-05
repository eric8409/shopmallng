import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  formData = { email: '', password: '' };



  constructor(private dataService: DataService,  private router: Router, private authService: AuthService) {}

  onSubmit() {
    this.dataService.loginData(this.formData).subscribe(
      response => {
        confirm('登入成功!!!');
        // 假設後端返回的物件中，JWT Token 欄位名稱是 access_token
        localStorage.setItem('access_token', response.access_token);
        // 儲存使用者 ID 到 AuthService
        this.authService.setUserId(response.user_id);
        this.router.navigate(['/home']); // 推薦導向首頁
        console.log('Data posted successfully', response);

      },
      error => {
        confirm('登入失敗');
        console.error('Error posting data', error);
      }
    );
  }

  resetForm(form: NgForm): void {
    form.reset(); // Resets the form fields and state
  }


}
