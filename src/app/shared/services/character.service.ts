import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Character } from '../interfaces/character';
import { Info } from '../interfaces/info';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  fetchCharacterById(id: number): Observable<Character> {
    return this.http
      .get<Character>(this.configService.apiUrl + '/character/' + id)
      .pipe(catchError(this.configService.handleError));
  }

  fetchCharactersByIds(ids: number[]): Observable<Character[]> {
    return this.http
      .get<Character[]>(this.configService.apiUrl + '/character/' + ids)
      .pipe(catchError(this.configService.handleError));
  }

  fetchCharacters(params: {}): Observable<Info<Character[]>> {
    return this.http
      .get<Info<Character[]>>(this.configService.apiUrl + '/character', {
        params,
      })
      .pipe(catchError(this.configService.handleError));
  }
}
