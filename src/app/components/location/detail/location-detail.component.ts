import { Component } from '@angular/core';
import { LocationService } from '../../../shared/services/location.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../../../shared/services/character.service';
import { Location } from '../../../shared/interfaces/location';
import { CharacterWithDimension } from '../../../shared/interfaces/character-with-dimension';

@Component({
  selector: 'app-location-detail',
  templateUrl: './location-detail.component.html',
})
export class LocationDetailComponent {
  characters: CharacterWithDimension[] = [];
  location: Location;
  locationId: number | null = null;

  constructor(
    private locationService: LocationService,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeLocationId();
  }

  private initializeLocationId(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.locationId = idParam !== null ? Number(idParam) : null;

      if (this.locationId !== null) {
        this.loadLocationData();
      }
    });
  }

  private loadLocationData(): void {
    if (this.locationId === null) return;

    this.locationService
      .fetchLocationById(this.locationId)
      .subscribe((location) => {
        this.location = location;
        const ids = this.characterService.extractCharacterIds(
          location.residents
        );

        if (ids.length > 0) {
          this.loadCharacters(ids);
        } else {
          this.characters = [];
        }
      });
  }

  private loadCharacters(ids: number[]): void {
    this.characterService
      .fetchCharactersByIdsWithDimensions(ids)
      .subscribe((characters) => {
        if (Array.isArray(characters)) {
          this.characters = characters;
        } else if (characters && typeof characters === 'object') {
          this.characters = [characters];
        } else {
          this.characters = [];
        }
      });
  }

  goBack() {
    this.router.navigate(['/locations']);
  }
}
