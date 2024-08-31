import { Component, Input } from '@angular/core';
import { Dimension } from '../../../../shared/interfaces/dimension';

@Component({
  selector: 'app-dimension-list-item',
  templateUrl: './dimension-list-item.component.html',
})
export class DimensionListItemComponent {
  @Input()
  dimension: Dimension;
}
