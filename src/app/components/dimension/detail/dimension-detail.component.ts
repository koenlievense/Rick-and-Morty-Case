import { Component } from '@angular/core';
import { LocationService } from '../../../shared/services/location.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../../shared/services/character.service';
import { Character } from '../../../shared/interfaces/character';
import { HttpParams } from '@angular/common/http';
import { Dimension } from '../../../shared/interfaces/dimension';
import { DimensionService } from '../../../shared/services/dimension.service';

@Component({
  selector: 'app-dimension-detail',
  templateUrl: './dimension-detail.component.html',
})
export class DimensionDetailComponent {
  dimensions: Dimension[] = [];
  dimension: Dimension | undefined;
  characters: Character[] = [];
  charactersIdList: number[] = [];
  currentPage: number = 1;
  loading: boolean;

  constructor(
    private dimensionService: DimensionService,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.dimensions = this.dimensionService.loadDimensions(this.currentPage);

    if (this.dimensions) {
      this.route.paramMap.subscribe((params) => {
        const nameParam = params.get('name');
        this.dimension = this.dimensions.find(
          (dimension) =>
            dimension.name.toLowerCase().replace(/ /g, '-') === nameParam
        );

        if (this.dimension) {
          for (let id of this.dimension?.characters.values()) {
            this.charactersIdList.push(id);
          }
        }

        if (this.dimension && this.charactersIdList.length !== 0) {
          this.characterService
            .fetchCharactersByIds(this.charactersIdList)
            .subscribe((characters) => {
              if (Array.isArray(characters)) {
                this.characters = characters;
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
      });
    }
  }

  goBack() {
    this.router.navigate(['/dimensions']);
  }
}
