import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../../shared/services/character.service';
import { CharacterWithDimension } from '../../../shared/interfaces/character-with-dimension';
import { Router } from '@angular/router';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
})
export class CharacterListComponent implements OnInit {
  currentPage: number = 1;
  paginatedCharacters: CharacterWithDimension[] = [];
  totalPages: number = 1;
  loading: boolean;

  private characters: CharacterWithDimension[] = [];
  private itemsPerPage: number = 20;

  constructor(
    private characterService: CharacterService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.characterService
      .loadCharacters(this.currentPage)
      .subscribe((characters) => {
        this.characters = characters;
        this.totalPages = Math.ceil(this.characters.length / this.itemsPerPage);
        this.updatePaginatedItems();
        this.loading = false;
      });
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedItems();
  }

  navigate(id: number): void {
    this.router.navigate(['/characters', id]);
  }

  private updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCharacters = this.characters.slice(startIndex, endIndex);
  }
}
