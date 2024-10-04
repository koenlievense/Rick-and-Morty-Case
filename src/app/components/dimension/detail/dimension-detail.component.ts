import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../../shared/services/character.service';
import { Dimension } from '../../../shared/interfaces/dimension';
import { DimensionService } from '../../../shared/services/dimension.service';
import { CharacterWithDimension } from '../../../shared/interfaces/character-with-dimension';

@Component({
  selector: 'app-dimension-detail',
  templateUrl: './dimension-detail.component.html',
})
export class DimensionDetailComponent {
  dimension: Dimension | undefined;
  currentPage: number = 1;
  paginatedCharacters: CharacterWithDimension[] = [];
  totalPages: number = 1;
  loading: boolean;

  private characters: CharacterWithDimension[] = [];
  private charactersIdList: number[] = [];
  private itemsPerPage: number = 20;

  constructor(
    private dimensionService: DimensionService,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeDimension();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedItems();
  }

  goBack() {
    this.router.navigate(['/dimensions']);
  }

  private initializeDimension() {
    this.loading = true;

    this.dimensionService
      .loadDimensions(this.currentPage)
      .subscribe((dimensions) => {
        this.route.paramMap.subscribe((params) => {
          const nameParam = params.get('name');
          this.dimension = dimensions.find(
            (dimension) =>
              dimension.name.toLowerCase().replace(' ', '-') === nameParam
          );
          this.loadCharacters();
        });
      });
  }

  private loadCharacters(): void {
    if (this.dimension) {
      this.charactersIdList = Array.from(this.dimension.characters);

      if (this.charactersIdList.length !== 0) {
        this.characterService
          .fetchCharactersByIdsWithDimensions(this.charactersIdList)
          .subscribe((characters) => {
            if (Array.isArray(characters)) {
              this.characters = characters;
              this.totalPages = Math.ceil(
                this.characters.length / this.itemsPerPage
              );
              this.updatePaginatedItems();
              this.loading = false;
            } else if (characters && typeof characters === 'object') {
              this.characters = [characters];
            } else {
              this.characters = [];
            }

            this.loading = false;
          });
      } else {
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }

  private updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCharacters = this.characters.slice(startIndex, endIndex);
  }
}
