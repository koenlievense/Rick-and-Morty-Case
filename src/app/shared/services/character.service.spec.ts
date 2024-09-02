import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CharacterService } from './character.service';
import { ConfigService } from './config.service';
import { LocationService } from './location.service';
import { throwError, of } from 'rxjs';
import { Character } from '../interfaces/character';
import { Info } from '../interfaces/info';
import { CharacterWithDimension } from '../interfaces/character-with-dimension';
import { Location } from '../interfaces/location';

describe('CharacterService', () => {
  let service: CharacterService;
  let httpMock: HttpTestingController;
  let configService: jasmine.SpyObj<ConfigService>;
  let locationService: jasmine.SpyObj<LocationService>;

  beforeEach(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', [
      'handleError',
      'apiUrl',
    ]);
    const locationServiceSpy = jasmine.createSpyObj('LocationService', [
      'fetchLocationById',
    ]);

    configServiceSpy.apiUrl = 'https://rickandmortyapi.com/api';
    configServiceSpy.handleError.and.callFake((error: any) =>
      throwError(() => error)
    );

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CharacterService,
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: LocationService, useValue: locationServiceSpy },
      ],
    });

    service = TestBed.inject(CharacterService);
    httpMock = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(
      ConfigService
    ) as jasmine.SpyObj<ConfigService>;
    locationService = TestBed.inject(
      LocationService
    ) as jasmine.SpyObj<LocationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create a service', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch character by ID', () => {
    const mockCharacter: Character = {
      id: 1,
      name: 'Rick Sanchez',
    } as Character;

    service.fetchCharacterById(1).subscribe((character) => {
      expect(character).toEqual(mockCharacter);
    });

    const req = httpMock.expectOne(
      'https://rickandmortyapi.com/api/character/1'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockCharacter);
  });

  it('should fetch characters by IDs', () => {
    const mockCharacters: Character[] = [
      { id: 1, name: 'Rick Sanchez' } as Character,
      { id: 2, name: 'Morty Smith' } as Character,
    ];

    service.fetchCharactersByIds([1, 2]).subscribe((characters) => {
      expect(characters).toEqual(mockCharacters);
    });

    const req = httpMock.expectOne(
      'https://rickandmortyapi.com/api/character/1,2'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCharacters);
  });

  it('should fetch characters with params', () => {
    const mockInfo: Info<Character[]> = {
      info: {
        count: 2,
        next: null,
        pages: 1,
        prev: null,
      },
      results: [
        { id: 1, name: 'Rick Sanchez' } as Character,
        { id: 2, name: 'Morty Smith' } as Character,
      ],
    };

    service.fetchCharacters({ page: 1 }).subscribe((info) => {
      expect(info).toEqual(mockInfo);
    });

    const req = httpMock.expectOne(
      'https://rickandmortyapi.com/api/character?page=1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockInfo);
  });

  it('should extract character IDs from URLs', () => {
    const characterUrls = [
      'https://rickandmortyapi.com/api/character/1',
      'https://rickandmortyapi.com/api/character/2',
    ];
    const ids = service.extractCharacterIds(characterUrls);
    expect(ids).toEqual([1, 2]);
  });

  it('should fetch characters by IDs with dimensions', () => {
    const mockCharacters: Character[] = [
      {
        id: 1,
        name: 'Rick Sanchez',
        location: { url: 'https://rickandmortyapi.com/api/location/1' },
      } as Character,
    ];

    const mockLocation: Location = {
      id: 1,
      name: 'Earth',
      dimension: 'Dimension C-137',
    } as Location;

    const mockCharacterWithDimension: CharacterWithDimension = {
      ...mockCharacters[0],
      dimension: 'Dimension C-137',
    };

    spyOn(service, 'fetchCharactersByIds').and.returnValue(of(mockCharacters));
    locationService.fetchLocationById.and.returnValue(of(mockLocation));

    service.fetchCharactersByIdsWithDimensions([1]).subscribe((characters) => {
      expect(characters).toEqual([mockCharacterWithDimension]);
    });
  });

  it('should fetch characters with dimensions', () => {
    const mockInfo: Info<Character[]> = {
      info: {
        count: 2,
        next: null,
        pages: 1,
        prev: null,
      },
      results: [
        {
          id: 1,
          name: 'Rick Sanchez',
          location: { url: 'https://rickandmortyapi.com/api/location/1' },
        } as Character,
        {
          id: 2,
          name: 'Morty Smith',
          location: { url: 'https://rickandmortyapi.com/api/location/2' },
        } as Character,
      ],
    };

    const mockLocations: Location[] = [
      { id: 1, name: 'Earth', dimension: 'Dimension C-137' } as Location,
      { id: 2, name: 'Gazorpazorp', dimension: 'Dimension Z-123' } as Location,
    ];

    const mockCharactersWithDimensions: CharacterWithDimension[] = [
      {
        id: 1,
        name: 'Rick Sanchez',
        location: { url: 'https://rickandmortyapi.com/api/location/1' },
        dimension: 'Dimension C-137',
      } as CharacterWithDimension,
      {
        id: 2,
        name: 'Morty Smith',
        location: { url: 'https://rickandmortyapi.com/api/location/2' },
        dimension: 'Dimension Z-123',
      } as CharacterWithDimension,
    ];

    spyOn(service, 'fetchCharacters').and.returnValue(of(mockInfo));
    locationService.fetchLocationById.and.callFake((id: number) => {
      if (id === 1) return of(mockLocations[0]);
      if (id === 2) return of(mockLocations[1]);
      return throwError(() => new Error('Location not found'));
    });

    service.fetchCharactersWithDimensions({ page: 1 }).subscribe((result) => {
      expect(result.results).toEqual(mockCharactersWithDimensions);
    });
  });
});
