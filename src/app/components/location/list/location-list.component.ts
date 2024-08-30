import { Component, Input, OnInit } from '@angular/core';
import { LocationService } from '../../../shared/services/location.service';
import { Location } from '../../../shared/interfaces/location';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-list',
  templateUrl: './location-list.component.html',
})
export class LocationListComponent implements OnInit {
  @Input()
  locations: Location[];

  constructor(
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    let params = '';
    this.locationService.fetchLocations(params).subscribe((response) => {
      this.locations = response.results;
    });
  }

  navigate(id: number) {
    this.router.navigate(['/episodes', id]);
  }
}
