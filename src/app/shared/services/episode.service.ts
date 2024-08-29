import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Episode } from '../interfaces/episode';
import { Info } from '../interfaces/info';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class EpisodeService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  fetchEpisodeById(id: number): Observable<Episode> {
    return this.http
      .get<Episode>(this.configService.apiUrl + '/episode/' + id)
      .pipe(catchError(this.configService.handleError));
  }

  fetchEpisodesByIds(ids: number[]): Observable<Episode[]> {
    return this.http
      .get<Episode[]>(this.configService.apiUrl + '/episode/' + ids)
      .pipe(catchError(this.configService.handleError));
  }

  fetchEpisodes(params: {}): Observable<Info<Episode[]>> {
    return this.http
      .get<Info<Episode[]>>(this.configService.apiUrl + '/episode', {
        params,
      })
      .pipe(catchError(this.configService.handleError));
  }
}
