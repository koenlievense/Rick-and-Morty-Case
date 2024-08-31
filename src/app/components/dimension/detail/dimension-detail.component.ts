import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../../shared/services/character.service';
import { Dimension } from '../../../shared/interfaces/dimension';
import { DimensionService } from '../../../shared/services/dimension.service';
import { Observable } from 'rxjs';
import { CharacterWithDimension } from '../../../shared/interfaces/character-with-dimension';

@Component({
  selector: 'app-dimension-detail',
  templateUrl: './dimension-detail.component.html',
})
export class DimensionDetailComponent {
  dimensions$: Observable<Dimension[]>;
  dimension: Dimension | undefined;
  characters: CharacterWithDimension[] = [];
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

    this.dimensions$ = this.dimensionService.loadDimensions(this.currentPage);

    this.dimensions$.subscribe((dimensions) => {
      this.route.paramMap.subscribe((params) => {
        const nameParam = params.get('name');
        this.dimension = dimensions.find(
          (dimension) =>
            dimension.name.toLowerCase().replace(' ', '-') === nameParam
        );

        if (this.dimension) {
          this.charactersIdList = Array.from(this.dimension.characters);

          if (this.charactersIdList.length !== 0) {
            this.characterService
              .fetchCharactersByIdsWithDimensions(this.charactersIdList)
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
        } else {
          this.loading = false;
        }
      });
    });
  }
  goBack() {
    this.router.navigate(['/dimensions']);
  }
}
