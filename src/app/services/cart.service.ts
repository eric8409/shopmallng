import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  product_Id: number;
  product_Name: string;
  price: number;
  image_url: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // 從 localStorage 載入初始值
  private cartItemsSubject = new BehaviorSubject<any[]>(this.getStoredCartItems());
  cartItems$: Observable<any[]> = this.cartItemsSubject.asObservable();

  constructor() { }

  // --- 核心方法實現 ---

  addItem(item: CartItem) {
    const currentItems = [...this.cartItemsSubject.value];
    const existingItem = currentItems.find(i => i.product_Id === item.product_Id);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + (item.quantity || 0);
    } else {
      currentItems.push(item);
    }

    this.cartItemsSubject.next(currentItems);
    this.saveCart(); // <-- 呼叫儲存方法
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    this.saveCart(); // <-- 呼叫儲存方法
  }

  removeItem(productId: number): void {
    const currentItems = this.cartItemsSubject.value;
    const updatedItems = currentItems.filter(item => item.product_Id !== productId);
    this.cartItemsSubject.next(updatedItems);
    this.saveCart(); // <-- 呼叫儲存方法
  }

  /**
   * [同步方法] 獲取當前購物車內容的快照 (解決 getItems 錯誤)
   */
  getItems(): any[] {
    return this.cartItemsSubject.value;
  }

  /**
   * [同步方法] 獲取購物車中商品項目的總數量 (解決 getCartItemCount 錯誤)
   */
  getCartItemCount(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  /**
   * 將當前購物車狀態儲存到瀏覽器的 localStorage (解決 saveCart 錯誤)
   */
  private saveCart(): void {
    const items = this.cartItemsSubject.value;
    localStorage.setItem('cart_items', JSON.stringify(items));
  }

  /**
   * 從 localStorage 載入儲存的購物車項目
   */
  private getStoredCartItems(): any[] {
    const storedCart = localStorage.getItem('cart_items');
    return storedCart ? JSON.parse(storedCart) : [];
  }
}
