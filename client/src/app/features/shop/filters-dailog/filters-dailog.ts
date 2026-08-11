import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDivider, MatListOption, MatSelectionList } from '@angular/material/list';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ShopService } from '../../../core/services/shop.service';

@Component({
  selector: 'app-filters-dailog',
  imports: [
    MatDivider,
    MatSelectionList,
    MatListOption,
    MatButton,
    FormsModule],
  templateUrl: './filters-dailog.html',
  styleUrl: './filters-dailog.scss',
})
export class FiltersDailog {
  shopService = inject(ShopService);

  private dialogRef = inject(MatDialogRef<FiltersDailog>);
  data = inject(MAT_DIALOG_DATA);
  selectedBrands: string[] = this.data?.selectedBrands ?? [];
  selectedTypes: string[] = this.data?.selectedTypes ?? [];

  applyFilters() {
    this.dialogRef.close({
      selectedBrands: this.selectedBrands,
      selectedTypes: this.selectedTypes
    });
  }
}
