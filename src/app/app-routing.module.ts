import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from "./product/product.component";
import { LoginComponent } from "./login/login.component";
import { OrderComponent } from "./order/order.component";
import { HomeComponent } from "./home/home.component";
import { RegisterComponent } from "./register/register.component";
import { CartComponent } from "./cart/cart.component";
// 導入您的 AuthGuard
import { AuthGuard } from './auth.guard';
import { ChartComponent } from "./chart/chart.component";

const routes: Routes = [

  // 公開路由：所有人都可以查看產品列表和詳細資訊
  { path: 'products', component: ProductComponent },
  { path: 'products/:id', component: ProductComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chart', component: ChartComponent },

  // 受保護路由：只有登入後才能訪問
  // 使用 canActivate: [AuthGuard] 來保護這些路由
  {
    path: 'carts',
    component: CartComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'orders',
    component: OrderComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },

  // 預設導向登入頁
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // 萬用路由導向登入頁
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
