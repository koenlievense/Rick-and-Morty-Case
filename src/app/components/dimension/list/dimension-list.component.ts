import { Component } from '@angular/core';
import { LocationService } from '../../../shared/services/location.service';
import { HttpParams } from '@angular/common/http';
import { Dimension } from '../../../shared/interfaces/dimension';
import { Router } from '@angular/router';
import { DimensionService } from '../../../shared/services/dimension.service';

@Component({
  selector: 'app-dimension-list',
  templateUrl: './dimension-list.component.html',
})
export class DimensionListComponent {
  dimensions: Dimension[] = []; // Map of dimensions to sets of unique character IDs
  currentPage: number = 1;

  constructor(
    private dimensionService: DimensionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.dimensions = this.dimensionService.loadDimensions(this.currentPage);
  }

  navigate(name: string): void {
    this.router.navigate([
      '/dimensions',
      name.toLowerCase().replace(/ /g, '-'),
    ]);
  }
}
