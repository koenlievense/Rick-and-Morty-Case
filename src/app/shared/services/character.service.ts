import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Character } from '../interfaces/character';
import { Info } from '../interfaces/info';
import { ConfigService } from './config.service';
import { LocationService } from './location.service';
import { CharacterWithDimension } from '../interfaces/character-with-dimension';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private locationService: LocationService
  ) {}

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

  fetchCharactersWithDimensions(params: {}): Observable<
    Info<CharacterWithDimension[]>
  > {
    return this.fetchCharacters(params).pipe(
      mergeMap((info) => {
        return this.addDimensionsToCharacters(info.results).pipe(
          map((charactersWithDimensions) => ({
            ...info,
            results: charactersWithDimensions,
          }))
        );
      })
    );
  }

  fetchCharactersByIdsWithDimensions(
    ids: number[]
  ): Observable<CharacterWithDimension[]> {
    return this.fetchCharactersByIds(ids).pipe(
      mergeMap((characters) => this.addDimensionsToCharacters(characters))
    );
  }

  private addDimensionsToCharacters(
    characters: Character[]
  ): Observable<CharacterWithDimension[]> {
    const characterRequests = characters.map((character) =>
      this.locationService
        .fetchLocationById(this.extractIdFromUrl(character.location.url))
        .pipe(
          map((location) => ({
            ...character,
            dimension: location.dimension,
          }))
        )
    );
    return forkJoin(characterRequests);
  }

  private extractIdFromUrl(url: string): number {
    const id = url.split('/').pop();
    return id ? parseInt(id, 10) : 0;
  }
}
