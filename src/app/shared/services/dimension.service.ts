import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { Dimension } from '../interfaces/dimension';
import { Character } from '../interfaces/character';

@Injectable({
  providedIn: 'root',
})
export class DimensionService {
  dimensions: Dimension[] = [];
  totalPages: number = 1;
  nextDimensionId: number = 1;

  constructor(private locationService: LocationService) {}

  loadDimensions(page: number): Dimension[] {
    const params = new HttpParams().set('page', page.toString());
    this.locationService.fetchLocations(params).subscribe((response) => {
      response.results.forEach((location) => {
        let dimension = this.dimensions.find(
          (d) => d.name === location.dimension
        );

        if (!dimension) {
          // Create a new dimension object if it doesn't exist
          dimension = {
            id: this.nextDimensionId++,
            name: location.dimension,
            characters: new Set<number>(),
            locations: [],
          };
          this.dimensions.push(dimension);
        }

        // Add location name to dimension's locations list
        dimension.locations.push(location.name);

        // Add unique character IDs to dimension's characters set
        location.residents.forEach((residentUrl) => {
          const characterId = parseInt(residentUrl.split('/').pop() ?? '', 10);
          if (!isNaN(characterId)) {
            dimension.characters.add(characterId);
          }
        });
      });

      this.totalPages = response.info.pages;
      if (page < this.totalPages) {
        this.loadDimensions(page + 1);
      }
    });

    return this.dimensions;
  }
}
