import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../../shared/services/character.service';
import { HttpParams } from '@angular/common/http';
import { CharacterWithDimension } from '../../../shared/interfaces/character-with-dimension';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
})
export class CharacterListComponent implements OnInit {
  characters: CharacterWithDimension[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    let params = new HttpParams().set('page', this.currentPage.toString());
    this.characterService
      .fetchCharactersWithDimensions(params)
      .subscribe((response) => {
        this.characters = response.results;
        this.totalPages = response.info.pages;
      });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadCharacters();
  }
}
