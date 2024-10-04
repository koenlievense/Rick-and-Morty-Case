import { Component, OnInit } from '@angular/core';
import { LocationService } from '../../../shared/services/location.service';
import { Location } from '../../../shared/interfaces/location';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
})
export class LocationListComponent implements OnInit {
  locations: Location[] = [];
  itemsPerPage: number = 20;
  currentPage: number = 1;
  paginatedLocations: Location[] = [];
  totalPages: number = 1;
  loading: boolean;

  constructor(
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.locationService
      .loadLocations(this.currentPage)
      .subscribe((locations) => {
        this.locations = locations;
        this.totalPages = Math.ceil(this.locations.length / this.itemsPerPage);
        this.updatePaginatedItems();
        this.loading = false;
      });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedItems();
  }

  navigate(id: number): void {
    this.router.navigate(['/locations', id]);
  }

  private updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedLocations = this.locations.slice(startIndex, endIndex);
  }
}
