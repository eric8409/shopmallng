import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';
import { ProductService } from '../services/product.service'; // 確保路徑正確
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnDestroy {
  @ViewChild('stockChartCanvas') private chartRef!: ElementRef;
  private stockChart: Chart | undefined;
  private productsSubscription!: Subscription;
  items: any[] = []; // 用於儲存商品資料

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadAllProductsAndDrawChart();
  }

  loadAllProductsAndDrawChart(): void {
    // 建立 HttpParams，明確設置 limit 為 1000
    let params = new HttpParams()
      .set('orderBy', 'stock')
      .set('sort', 'desc')
      .set('limit', '1000'); // <<<<<< 將限制設置為後端允許的最大值 (1000)

    this.productsSubscription = this.productService.getProductsWithParams(params).subscribe(
      response => {
        // response.results 現在應該包含最多 1000 筆資料
        this.items = response.results;
        console.log('圖表元件取得的商品資料數量：', this.items.length);
        this.drawStockChart();
      },
      error => {
        console.error('獲取商品資料發生錯誤：', error);
      }
    );
  }

  drawStockChart(): void {
    // 如果之前有圖表實例，先銷毀它
    if (this.stockChart) {
      this.stockChart.destroy();
    }

    // 準備圖表所需的數據：標籤（商品名稱）和數據（庫存量）
    const labels = this.items.map(item => item.product_Name);
    const data = this.items.map(item => item.stock);
    const ctx = this.chartRef.nativeElement.getContext('2d');

    this.stockChart = new Chart(ctx, {
      type: 'bar', // 選擇長條圖
      data: {
        labels: labels,
        datasets: [{
          label: '商品庫存數量',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: '庫存量'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: '所有商品庫存總覽'
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    // 在元件銷毀時取消訂閱，防止記憶體洩漏
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
    if (this.stockChart) {
      this.stockChart.destroy();
    }
  }
}
