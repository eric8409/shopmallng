import {Component, OnInit} from '@angular/core';
import { OrderService } from '../services/order.service';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import {CartService} from "../services/cart.service";
import { ProductService } from '../services/product.service';
import {AuthService} from "../services/auth.service";


// ... 定義 interfaces (CartItem, OrderPayload, OrderHistoryItem) 參考上一個回覆 ...
interface OrderItem { productId: number; quantity: number; }
interface OrderPayload { buyItemList: OrderItem[]; }
interface OrderHistoryItem { /* ... */ }



@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})



export class OrderComponent implements OnInit {


  serverData: any;
  flattenedData: any[] = [];


  // 1. 定義用來收集單一購物項目的模型
  newOrderItem = {
    productId: null,
    quantity: null
  };

  // 2. 定義用來儲存所有購物項目的陣列
  buyItemList: any[] = [];


  // 在此宣告 displayedColumns 變數
  displayedColumns: string[] = [
    'order_id',
    'user_id',
    'totalAmount',
    'create_date',
  ];

  currentUserId: number | null = null; // 用這個變數來儲存使用者 ID
  currentProductImageUrl: string | null = null;
  currentProductName: string | null = null;


  constructor(private orderService: OrderService, private router: Router, protected cartService: CartService, private productService: ProductService, private authService: AuthService) {
  }


  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();

    if (this.currentUserId) {
      console.log('OrderComponent: 使用者 ID 為', this.currentUserId);
      this.getOrder(); // 使用正確的 ID 獲取訂單
    } else {
      // 如果沒有 ID (雖然 AuthGuard 應該會攔截)，導向登入
      console.error('OrderComponent: 未找到使用者 ID，導向登入');
      this.router.navigate(['/login']);
    }
  }


  // --- 新增的功能：從購物車載入 ---
  loadCartItemsFromService(): void {
    const cartItems = this.cartService.getItems();
    let itemsAddedCount = 0;

    if (cartItems.length > 0) {
      // 迭代購物車項目，逐一附加到現有的 buyItemList 中
      cartItems.forEach((cartItem: any) => {
        // 進行資料轉換，確保屬性名稱統一為 productId
        const formattedItem = {
          productId: cartItem.product_Id, // 從 cartItem 獲取正確的 ID
          quantity: cartItem.quantity,
          product_Name: cartItem.product_Name, // 繼續保留此欄位供列表顯示
          image_url: cartItem.image_url
        };

        // 將格式化後的項目附加到 buyItemList 陣列
        this.buyItemList.push(formattedItem);
        itemsAddedCount++;
      });

      // 清空手動輸入的欄位
      this.newOrderItem = { productId: null!, quantity: null! };

       // *** 核心需求實現：匯入後立即清空購物車服務 ***
      // this.cartService.clearCart();

      // 提示使用者
      alert(`已從購物車累加載入 ${itemsAddedCount} 項商品，並已清空購物車。`);

    } else {
      alert('購物車服務中目前沒有商品。');
    }
  }


  onProductIdChange(productId: number): void {
    // 清除之前的圖片和名稱
    this.currentProductImageUrl = null;
    this.currentProductName = null;

    // 確保只在有有效 ID 時才進行查詢
    if (productId && productId > 0) {
      this.productService.getProductById(productId).subscribe({
        next: (productDetails) => {
          // 假設後端返回的物件有 image_url 和 product_name
          this.currentProductImageUrl = productDetails.image_url;
          this.currentProductName = productDetails.product_Name;
        },
        error: (error) => {
          console.error('無法獲取商品圖片:', error);
          this.currentProductImageUrl = null; // 找不到就清空
          this.currentProductName = null;
        }
      });
    }
  }



   // 4. 新增一個方法來添加項目到購物車清單
    addItemToList() {
      // 確保輸入值有效且圖片資訊已載入
      if (this.newOrderItem.productId && this.newOrderItem.quantity && this.currentProductImageUrl && this.currentProductName) {

        // 建立完整的訂單項目物件
        const fullItem = {
          productId: this.newOrderItem.productId,
          quantity: this.newOrderItem.quantity,
          product_Name: this.currentProductName, // 使用暫存的名稱
          image_url: this.currentProductImageUrl  // 使用暫存的圖片 URL
        };

        this.buyItemList.push(fullItem); // 將完整項目推送到列表

        // 清空輸入欄位和圖片預覽
        this.newOrderItem = { productId: null!, quantity: null! };
        this.currentProductImageUrl = null;
        this.currentProductName = null;

      } else {
        alert('請輸入有效的商品 ID 和數量，並等待圖片資訊載入完成。');
      }
    }


    // 新增一個方法來刪除列表中的指定項目
  removeItemFromOrderList(index: number): void {
    if (index > -1) {
      this.buyItemList.splice(index, 1); // 根據索引刪除一個項目
    }
  }

  // 5. 修改 onSubmit() 方法來發送正確格式的資料
  onSubmit(message?: string) {
    // 檢查是否有購物項目
    if (this.buyItemList.length === 0) {
      alert('請至少加入一個購物項目！');
      return;
    }

    // *** 這是解決問題的關鍵步驟：資料轉換與清洗 ***
    const cleanBuyItemList = this.buyItemList.map((item: any) => {
      return {
        // 使用 || 運算子安全地取出正確的 ID，並確保最終鍵名是 'productId'
        productId: item.productId || item.product_Id,
        quantity: item.quantity
      };
    });

    const payload = {
      buyItemList: cleanBuyItemList
    };

    console.log('發送的 User ID:', this.currentUserId);
    console.log('發送的 Payload:', JSON.stringify(payload)); // 將物件轉為字串方便查看


    // 呼叫服務發送 POST 請求
    this.orderService.postOrder(this.currentUserId, payload).subscribe(
      response => {
        confirm('購買成功!!! 訂單序號：' + response.order_id);
        console.log('訂單建立成功:', response);
        this.buyItemList = []; // 成功後清空購物車
      },
      error => {
        console.error('訂單建立失敗:', error);
      }
    );
  }

  resetForm(myForm: NgForm) {
    myForm.resetForm();
    this.buyItemList = []; // 清空購物車清單
  }



  getOrder() {
    this.orderService.getIOrderById(this.currentUserId).subscribe({
      next: (response) => {
        if (response && response.results) {
          // 在此呼叫扁平化方法
          this.flattenAndDisplay(response.results);
        } else {
          this.flattenedData = [];
          console.warn('API response is missing the "results" array.', response);
        }
      },
      error: (error) => {
        this.flattenedData = [];
        console.error('API call failed:', error);
      }
    });
  }

  flattenAndDisplay(results: any[]) {
    this.flattenedData = [];
    results.forEach(order => {
      // 檢查 orderItemList 是否存在且不為空
      if (order.orderItemList && order.orderItemList.length > 0) {
        order.orderItemList.forEach((item: any) => {
          // 將 order 資訊與 item 資訊合併，形成單一物件
          this.flattenedData.push({
            order_id: order.order_id,
            user_id: order.user_id,
            totalAmount: order.totalAmount,
            create_date: order.create_date,

            // 明確指定 item 的屬性
            item_id: item.order_item_id,
            productName: item.product_Name, // 確保屬性名稱與後端一致
            quantity: item.quantity,
            price: item.amount // 假設 amount 是單價
          });
        });
      } else {
        // 如果沒有 orderItemList，也將訂單資訊加入
        this.flattenedData.push({
          order_id: order.order_id,
          user_id: order.user_id,
          totalAmount: order.totalAmount,
          create_date: order.create_date,
          item_id: 'N/A', // 提供預設值
          productName: 'N/A',
          quantity: 'N/A',
          price: 'N/A'
        });
      }
    });
    console.log(this.flattenedData); // 檢查扁平化後的資料
  }












}






