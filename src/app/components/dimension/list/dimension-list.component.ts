import { Component, OnInit } from '@angular/core';
import { Dimension } from '../../../shared/interfaces/dimension';
import { Router } from '@angular/router';
import { DimensionService } from '../../../shared/services/dimension.service';

@Component({
  selector: 'app-dimension-list',
  templateUrl: './dimension-list.component.html',
})
export class DimensionListComponent implements OnInit {
  currentPage: number = 1;
  paginatedDimensions: Dimension[] = [];
  totalPages: number = 1;
  loading: boolean;

  private dimensions: Dimension[] = [];
  private itemsPerPage: number = 20;

  constructor(
    private dimensionService: DimensionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dimensions = JSON.parse(
      localStorage.getItem('dimensions') as string
    ) as any as Dimension[];

    if (!this.dimensions) {
      this.loading = true;

      this.dimensionService
        .loadDimensions(this.currentPage)
        .subscribe((dimensions) => {
          this.dimensions = dimensions;
          this.totalPages = Math.ceil(
            this.dimensions.length / this.itemsPerPage
          );
          this.updatePaginatedItems();
          this.loading = false;
        });
    } else {
      this.totalPages = Math.ceil(this.dimensions.length / this.itemsPerPage);
      this.updatePaginatedItems();
    }
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedItems();
  }

  navigate(name: string): void {
    this.router.navigate(['/dimensions', name.toLowerCase().replace(' ', '-')]);
  }

  private updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDimensions = this.dimensions.slice(startIndex, endIndex);
  }
}
