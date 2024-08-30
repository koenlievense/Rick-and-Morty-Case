import { Component } from '@angular/core';
import { LocationService } from '../../../shared/services/location.service';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../../shared/services/character.service';
import { Character } from '../../../shared/interfaces/character';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
})
export class LocationDetailComponent {
  characters: Character[] = [];
  locationId: number | null = null;

  constructor(
    private locationService: LocationService,
    private characterService: CharacterService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.locationId = idParam !== null ? Number(idParam) : null;

      if (this.locationId !== null) {
        this.locationService
          .fetchLocationById(this.locationId)
          .subscribe((location) => {
            const ids = location.residents.map((c) => {
              const match = c.match(/\d+$/)!;
              return parseInt(match[0], 10);
            });

            if (ids.length > 0) {
              this.characterService
                .fetchCharactersByIds(ids)
                .subscribe((characters) => {
                  if (Array.isArray(characters)) {
                    this.characters = characters;
                  } else if (characters && typeof characters === 'object') {
                    this.characters = [characters];
                  } else {
                    this.characters = [];
                  }
                });
            } else {
              this.characters = [];
            }
          });
      }
    });
  }
}
