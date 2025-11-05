import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { CartService } from '../services/cart.service'; // 導入 CartService
import { Subscription } from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service"; // 導入 Subscription 以管理訂閱



@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})


export class CartComponent implements OnInit, OnDestroy {
  cartItems: any[] = [];
  totalPrice = 0;
  private cartSubscription: Subscription | undefined;
  currentUserId: number | null = null;


  @Input() userId!: string | null;

  constructor(private cartService: CartService, private router: Router,  private authService: AuthService) { }

  displayedColumns: string[] = ['image', 'product_id', 'product_Name', 'price', 'quantity', 'subtotal', 'actions'];


  ngOnInit(): void {
    // *** 核心修改：從 AuthService 獲取使用者 ID ***
    this.currentUserId = this.authService.getCurrentUserId();

    if (this.currentUserId) {
      console.log('CartComponent: 當前使用者 ID:', this.currentUserId);
      // 如果您的 cartService 需要從後端 API 載入購物車，請在這裡呼叫它
      // 例如：this.cartService.loadCartFromBackend(this.currentUserId);
    } else {
      // 理論上 AuthGuard 已經擋住了，但這裡是防禦性檢查
      console.error('CartComponent: 未找到使用者 ID');
    }
    // 訂閱購物車資料的變動
    this.cartSubscription = this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotalPrice();

      });
    }



  ngOnDestroy(): void {
    // 在元件銷毀時取消訂閱，避免記憶體洩漏
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }


  // 計算總價
  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // 移除購物車項目
  removeFromCart(productId: number): void {
    this.cartService.removeItem(productId);
    // 由於您使用的是 BehaviorSubject，畫面會自動更新
  }


  // 清空購物車 (選作)
  clearCart(): void {
    // 實作清空購物車的邏輯
    // 例如：this.cartService.clearCart();
  }
}

