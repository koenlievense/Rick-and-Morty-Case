import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { Dimension } from '../interfaces/dimension';
import { Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DimensionService {
  private dimensions: Dimension[] = [];
  private totalPages: number = 1;

  constructor(private locationService: LocationService) {}

  loadDimensions(page: number): Observable<Dimension[]> {
    const params = new HttpParams().set('page', page.toString());
    return this.locationService.fetchLocations(params).pipe(
      tap((response) => {
        response.results.forEach((location) => {
          let dimension = this.dimensions.find(
            (dimension) => dimension.name === location.dimension
          );

          if (!dimension) {
            dimension = {
              name: location.dimension,
              characters: new Set<number>(),
              locations: [],
            };
            this.dimensions.push(dimension);
          }

          dimension.locations.push(location.name);

          location.residents.forEach((residentUrl) => {
            const characterId = parseInt(
              residentUrl.split('/').pop() ?? '',
              10
            );
            if (!isNaN(characterId)) {
              dimension!.characters.add(characterId);
            }
          });
        });

        this.totalPages = response.info.pages;
      }),
      switchMap(() => {
        if (page < this.totalPages) {
          return this.loadDimensions(page + 1);
        }
        return of(this.dimensions);
      })
    );
  }
}
