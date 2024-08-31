import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EpisodeService } from './episode.service';
import { ConfigService } from './config.service';
import { throwError } from 'rxjs';
import { Episode } from '../interfaces/episode';
import { Info } from '../interfaces/info';

describe('EpisodeService', () => {
  let service: EpisodeService;
  let httpMock: HttpTestingController;
  let configService: jasmine.SpyObj<ConfigService>;

  beforeEach(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', [
      'handleError',
      'apiUrl',
    ]);
    configServiceSpy.apiUrl = 'https://rickandmortyapi.com/api';
    configServiceSpy.handleError.and.callFake((error: any) =>
      throwError(() => error)
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        EpisodeService,
        { provide: ConfigService, useValue: configServiceSpy },
      ],
    });

    service = TestBed.inject(EpisodeService);
    httpMock = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(
      ConfigService
    ) as jasmine.SpyObj<ConfigService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a service', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch episode by ID', () => {
    const mockEpisode: Episode = { id: 1, name: 'Pilot' } as Episode;

    service.fetchEpisodeById(1).subscribe((episode) => {
      expect(episode).toEqual(mockEpisode);
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockEpisode);
  });

  it('should fetch episodes by IDs', () => {
    const mockEpisodes: Episode[] = [
      { id: 1, name: 'Pilot' } as Episode,
      { id: 2, name: 'Lawnmower Dog' } as Episode,
    ];

    service.fetchEpisodesByIds([1, 2]).subscribe((episodes) => {
      expect(episodes).toEqual(mockEpisodes);
    });

    const req = httpMock.expectOne(
      'https://rickandmortyapi.com/api/episode/1,2'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockEpisodes);
  });

  it('should fetch episodes with params', () => {
    const mockInfo: Info<Episode[]> = {
      info: {
        count: 2,
        next: null,
        pages: 1,
        prev: null,
      },
      results: [
        { id: 1, name: 'Pilot' } as Episode,
        { id: 2, name: 'Lawnmower Dog' } as Episode,
      ],
    };

    service.fetchEpisodes({ page: 1 }).subscribe((info) => {
      expect(info).toEqual(mockInfo);
    });

    const req = httpMock.expectOne(
      'https://rickandmortyapi.com/api/episode?page=1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockInfo);
  });

  it('should handle errors', () => {
    const errorMessage = 'An error occurred';

    service.fetchEpisodeById(1).subscribe({
      next: () => fail('expected an error, not episodes'),
      error: (error) => expect(error.error).toContain(errorMessage),
    });

    const req = httpMock.expectOne('https://rickandmortyapi.com/api/episode/1');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
