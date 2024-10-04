import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Location } from '../interfaces/location';
import { Info } from '../interfaces/info';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private locations: Location[] = [];
  private totalPages: number = 1;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  fetchLocationById(id: number): Observable<Location> {
    return this.http
      .get<Location>(this.configService.apiUrl + '/location/' + id)
      .pipe(catchError(this.configService.handleError));
  }

  fetchLocationsByIds(ids: number[]): Observable<Location[]> {
    return this.http
      .get<Location[]>(this.configService.apiUrl + '/location/' + ids)
      .pipe(catchError(this.configService.handleError));
  }

  fetchLocations(params: {}): Observable<Info<Location[]>> {
    return this.http
      .get<Info<Location[]>>(this.configService.apiUrl + '/location', {
        params,
      })
      .pipe(catchError(this.configService.handleError));
  }

  loadLocations(page: number): Observable<Location[]> {
    const params = new HttpParams().set('page', page.toString());
    return this.fetchLocations(params).pipe(
      tap((response) => {
        response.results.forEach((locationResponse) => {
          const exists = this.locations.some(
            (location) => location.id === locationResponse.id
          );

          if (!exists) {
            this.locations.push(locationResponse);
          }
        });

        this.totalPages = response.info.pages;
      }),
      switchMap(() => {
        if (page < this.totalPages) {
          return this.loadLocations(page + 1);
        }
        return of(this.locations);
      })
    );
  }
}
