import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../../shared/services/character.service';
import { HttpParams } from '@angular/common/http';
import { Character } from '../../../shared/interfaces/character';

@Component({
  selector: 'character-list',
  templateUrl: './character-list.component.html',
})
export class CharacterListComponent implements OnInit {
  characters: Character[];

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    let params = '';
    this.characterService.fetchCharacters(params).subscribe((response) => {
      this.characters = response.results;
    });
  }
}
