import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { HttpClient } from '@angular/common/http';
import { Product } from './shared/models/product';
import { Pagination } from './shared/models/pagination';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit{
  baseUrl = 'https://localhost:5001/api/'
  private http = inject(HttpClient)
  title = 'Skinet';
  products: Product[] = [];

 
  ngOnInit(): void {
  this.http.get<Pagination<Product>>(this.baseUrl + 'products').subscribe({
    next: response => { console.log(response);
      this.products = response.data;
    },
    error: (error: any) => console.log(error),
    complete: () => console.log('Request completed')
  });
}
}
