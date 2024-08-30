import { Component, Input } from '@angular/core';
import { Character } from '../../../../shared/interfaces/character';

@Component({
  selector: 'app-character-list-item',
  templateUrl: './character-list-item.component.html',
})
export class CharacterListItemComponent {
  @Input()
  character: Character;
}
