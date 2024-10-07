import { Component, Input } from '@angular/core';
import { CharacterWithDimension } from '../../../../shared/interfaces/character-with-dimension';

@Component({
  selector: 'app-character-list-item',
  templateUrl: './character-list-item.component.html',
  styleUrls: ['./character-list-item.component.css'],
})
export class CharacterListItemComponent {
  @Input()
  character: CharacterWithDimension;

  @Input()
  clickable: boolean = false;
}
