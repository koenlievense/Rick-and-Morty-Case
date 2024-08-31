import { Component, Input, OnInit } from '@angular/core';
import { LocationService } from '../../../shared/services/location.service';
import { Location } from '../../../shared/interfaces/location';
import { Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
})
export class LocationListComponent implements OnInit {
  locations: Location[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLocations();
  }

  loadLocations(): void {
    let params = new HttpParams().set('page', this.currentPage.toString());
    this.locationService.fetchLocations(params).subscribe((response) => {
      this.locations = response.results;
      this.totalPages = response.info.pages;
    });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadLocations();
  }

  navigate(id: number): void {
    this.router.navigate(['/locations', id]);
  }
}
