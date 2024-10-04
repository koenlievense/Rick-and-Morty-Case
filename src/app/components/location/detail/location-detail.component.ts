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
  itemsPerPage: number = 20;
  currentPage: number = 1;
  paginatedCharacters: CharacterWithDimension[] = [];
  totalPages: number = 1;
  loading: boolean;

  constructor(
    private locationService: LocationService,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeLocationId();
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.updatePaginatedItems();
  }

  goBack() {
    this.router.navigate(['/locations']);
  }

  private initializeLocationId(): void {
    this.loading = true;

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
      });
  }

  private updatePaginatedItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCharacters = this.characters.slice(startIndex, endIndex);
  }
}
