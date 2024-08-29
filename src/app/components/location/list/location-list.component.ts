import { Component, Input, OnInit } from '@angular/core';
import { LocationService } from '../../../shared/services/location.service';
import { HttpParams } from '@angular/common/http';
import { Location } from '../../../shared/interfaces/location';

@Component({
  selector: 'location-list',
  templateUrl: './location-list.component.html',
})
export class LocationListComponent implements OnInit {
  @Input()
  locations: Location[];

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    let params = '';
    this.locationService.fetchLocations(params).subscribe((response) => {
      this.locations = response.results;
    });
  }
}
