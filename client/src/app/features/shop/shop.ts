import { Component, inject, signal, OnInit } from '@angular/core';
import { ShopService } from '../../core/services/shop.service';
import { Product } from '../../shared/models/product';
import { Pagination } from '../../shared/models/pagination';
import { ShopParams } from '../../shared/models/shopParams';
import { MatCard } from '@angular/material/card';
import { ProductItem } from "./product-item/product-item";
import { MatDialog } from '@angular/material/dialog';
import { FiltersDailog } from './filters-dailog/filters-dailog';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatListOption, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  imports: [
    MatCard,
    ProductItem,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginator,
    FormsModule,
],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
})
export class Shop implements OnInit{
   private shopService = inject(ShopService);
   private dialogService = inject(MatDialog);
    //products = signal<Product[]>([]);
    products = signal<Pagination<Product> | null>(null);
    //products?: Pagination<Product>;
  
  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price: Low-High', value: 'priceAsc'},
    {name: 'Price: High-Low', value: 'priceDesc'},
  ]
   shopParams = new ShopParams();
   pageSizeOptions = [5,10,15,20]

  ngOnInit(): void {
    debugger;
    this.initializeShop();
  }

  initializeShop(){
    debugger;
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  handlePageEvent(event: PageEvent) {
    debugger;
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }
  
  getProducts() {
    debugger;
  this.shopService.getProducts(this.shopParams).subscribe({
    next: response => {
      this.products.set(response);
    }
  });
}

onSearchChange() {
    debugger;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange) {
    debugger;
    const selectedOption = event.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.getProducts();
    }
  }

   openFiltersDialog() {
    debugger;
  const dialogRef = this.dialogService.open(FiltersDailog, {
    minWidth: '500px',
    data: {
      selectedBrands: this.shopParams.brands,
      selectedTypes: this.shopParams.types
    }
  });

  dialogRef.afterClosed().subscribe({
    next: result => {
      if (result) {
        this.shopParams.brands = result.selectedBrands;
        this.shopParams.types = result.selectedTypes;
        this.getProducts();
      }
    }
  });
}
    
}
