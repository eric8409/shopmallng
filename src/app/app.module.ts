import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import { RegisterComponent } from './register/register.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// 引入所有必要的 Material 模組 (確保這裡只有 modules)
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { OrderComponent } from './order/order.component';
import { MatInputModule } from '@angular/material/input'
import { MatDialogModule } from '@angular/material/dialog';
// 修正匯入方式：使用完整的模組
import { MatListModule } from "@angular/material/list";
import { HomeComponent } from './home/home.component';
import { MatChipsModule } from "@angular/material/chips";



import { CartComponent } from './cart/cart.component';
import {MatCardModule} from "@angular/material/card";
import { NgChartsModule } from 'ng2-charts';
import { ChartComponent } from './chart/chart.component';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ProductComponent,
    OrderComponent,
    HomeComponent,
    CartComponent,
    ChartComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, // 保留以防其他地方使用響應式表單

    // >>>>> 正確的 imports 列表，只包含 Modules <<<<<
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatListModule,    // 使用 MatListModule
    MatChipsModule,   // 使用 MatChipsModule
    MatCardModule,    // 使用 MatCardModule
    NgChartsModule,
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
