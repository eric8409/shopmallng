import { HttpClient, HttpParams } from '@angular/common/http';
import {Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/order.service';
import { ActivatedRoute, Router } from "@angular/router";
import { CartItem, CartService } from '../services/cart.service';
import Chart from 'chart.js/auto';
import { ChartService } from '../services/chart.service'; // 確保路徑正確
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {


  items: any[] = [];
  selectedCategory: string | undefined;
  selectedSelect: string | undefined;
  selectedSort: string | undefined;

  categories = [{cate: 'FOOD', name: '水果'}];
  selects = [{sort: 'price', name: '價格'}, {sort: 'stock', name: '庫存'}, {sort: 'product_id', name: '商品ID'}];
  sorts = [{sort: 'asc', name: '升序'}, {sort: 'desc', name: '降序'}];

  displayedColumns: string[] = ['product_Id', 'image_url', 'product_Name', 'category', 'price', 'stock', 'create_date', 'actions'];
  selectedRow: any;


  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private http: HttpClient,
  ) {}



  ngOnInit(): void {
    this.selectedCategory = 'FOOD';
    this.selectedSelect = 'price';
    this.selectedSort = 'desc';

    this.onSubmit();
  }




  onSubmit(): void {


    let params = new HttpParams();
    if (this.selectedCategory) {
      params = params.set('category', this.selectedCategory);
    }
    if (this.selectedSelect) {
      params = params.set('orderBy', this.selectedSelect);
    }
    if (this.selectedSort) {
      params = params.set('sort', this.selectedSort);
    }


    // >>> 加入這一行，請求後端返回最多 1000 筆資料 <<<
    params = params.set('limit', '1000');


    this.productService.getProductsWithParams(params).subscribe(
      response => {
        this.items = response.results.map((item: any) => ({
          ...item,
          quantity: 1
        }));
        console.log('取得的商品資料（已初始化）：', this.items);
      },
      error => {
        console.error('發生錯誤：', error);
      }
    );
  }




  selectRow(row: any): void {
    this.selectedRow = (this.selectedRow === row) ? null : row;
    console.log('選中的列:', this.selectedRow);
  }

  public addToCart(item: any, quantity: number | undefined): void {
    if (quantity && quantity > 0 && quantity <= item.stock) {
      const itemToAdd: CartItem = {
        product_Id: item.product_Id,
        product_Name: item.product_Name,
        price: item.price,
        image_url: item.image_url,
        quantity: quantity
      };
      this.cartService.addItem(itemToAdd);
      alert(`${item.product_Name} 已成功加入購物車！`);
    } else if (!quantity || quantity <= 0) {
      alert('請輸入有效的商品數量！');
    } else if (quantity > item.stock) {
      alert('庫存不足！');
    }
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }
}
