import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, switchMap, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Episode } from '../interfaces/episode';
import { Info } from '../interfaces/info';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class EpisodeService {
  episodes: Episode[] = [];
  totalPages: number = 1;

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

  loadEpisodes(page: number): Observable<Episode[]> {
    const params = new HttpParams().set('page', page.toString());
    return this.fetchEpisodes(params).pipe(
      tap((response) => {
        response.results.forEach((episodeResponse) => {
          const exists = this.episodes.some(
            (episode) => episode.id === episodeResponse.id
          );

          if (!exists) {
            this.episodes.push(episodeResponse);
          }
        });

        this.totalPages = response.info.pages;
      }),
      switchMap(() => {
        if (page < this.totalPages) {
          return this.loadEpisodes(page + 1);
        }
        return of(this.episodes);
      })
    );
  }
}
