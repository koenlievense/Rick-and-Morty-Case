import { Component, OnInit } from '@angular/core';
import { Dimension } from '../../../shared/interfaces/dimension';
import { Router } from '@angular/router';
import { DimensionService } from '../../../shared/services/dimension.service';

@Component({
  selector: 'app-dimension-list',
  templateUrl: './dimension-list.component.html',
})
export class DimensionListComponent implements OnInit {
  dimensions: Dimension[] = [];
  itemsPerPage: number = 20;
  currentPage: number = 1;
  paginatedDimensions: any[] = [];
  totalPages: number = 1;
  loading: boolean;

  constructor(
    private dimensionService: DimensionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.dimensionService
      .loadDimensions(this.currentPage)
      .subscribe((dimensions) => {
        this.dimensions = dimensions;
        this.totalPages = Math.ceil(this.dimensions.length / this.itemsPerPage);
        this.updatePaginatedItems();
        this.loading = false;
      });
  }

  updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedDimensions = this.dimensions.slice(startIndex, endIndex);
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedItems();
  }

  navigate(name: string): void {
    this.router.navigate(['/dimensions', name.toLowerCase().replace(' ', '-')]);
  }
}
