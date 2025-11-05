import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // 匯入 map 運算子


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }



  private getUrl = 'http://localhost:8080/products';



  getProductsWithParams(params: HttpParams): Observable<any> {
    return this.http.get('http://localhost:8080/products', { params });
  }

  getProductById(id: number): Observable<any> {
    const url = `${this.getUrl}/${id}`;
    return this.http.get(url);
  }



}
