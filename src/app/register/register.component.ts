import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router'; // <<-- 1. 匯入 Router

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  formData = { email: '', password: '' };

  // <<-- 2. 注入 Router 服務
  constructor(private dataService: DataService, private router: Router) {}

  onSubmit() {
    this.dataService.postData(this.formData).subscribe(
      response => {
        alert('註冊成功！即將導向登入頁面。'); // 使用 alert 代替 confirm
        console.log('Data posted successfully', response);
        this.router.navigate(['/login']); // <<-- 3. 註冊成功後導向登入頁
      },
      error => {
        // 優化錯誤訊息顯示，可以根據 error.status 進一步判斷
        alert('註冊失敗：此 Email 可能已被註冊。');
        console.error('Error posting data', error);
      }
    );
  }

  // <<-- 4. 優化 resetForm 方法
  resetForm(form: NgForm): void {
    // 使用 resetForm() 可以完全重置表單值和驗證狀態
    form.resetForm({
      email: '',
      password: ''
    });
  }

}
