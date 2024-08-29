import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Location } from '../interfaces/location';
import { Info } from '../interfaces/info';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
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
}
