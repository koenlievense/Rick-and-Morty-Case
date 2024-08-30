import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../../shared/services/character.service';
import { Character } from '../../../shared/interfaces/character';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.loadCharacters();
  }

  loadCharacters(): void {
    let params = new HttpParams().set('page', this.currentPage.toString());
    this.characterService.fetchCharacters(params).subscribe((response) => {
      this.characters = response.results;
      this.totalPages = response.info.pages;
    });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.loadCharacters();
  }
}
