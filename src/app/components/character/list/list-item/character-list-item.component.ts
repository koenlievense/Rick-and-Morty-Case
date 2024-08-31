import { Component, Input } from '@angular/core';
import { CharacterWithDimension } from '../../../../shared/interfaces/character-with-dimension';

@Component({
  selector: 'app-character-list-item',
  templateUrl: './character-list-item.component.html',
})
export class CharacterListItemComponent {
  @Input()
  character: CharacterWithDimension;
}
