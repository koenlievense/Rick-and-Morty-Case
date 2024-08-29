import { Component, Input } from '@angular/core';
import { Location } from '../../../../shared/interfaces/location';

@Component({
  selector: 'location-list-item',
  templateUrl: './location-list-item.component.html',
})
export class LocationListItemComponent {
  @Input()
  location: Location;
}
