import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CharacterService } from './character.service';
import { ConfigService } from './config.service';
import { throwError } from 'rxjs';
import { Character } from '../interfaces/character';
import { Info } from '../interfaces/info';

describe('CharacterService', () => {
  let service: CharacterService;
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
        CharacterService,
        { provide: ConfigService, useValue: configServiceSpy },
      ],
    });

    service = TestBed.inject(CharacterService);
    httpMock = TestBed.inject(HttpTestingController);
    configService = TestBed.inject(
      ConfigService
    ) as jasmine.SpyObj<ConfigService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
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

  it('should handle errors', () => {
    const errorMessage = 'An error occurred';

    service.fetchCharacterById(1).subscribe({
      next: () => fail('expected an error, not characters'),
      error: (error) => expect(error.error).toContain(errorMessage),
    });

    const req = httpMock.expectOne(
      'https://rickandmortyapi.com/api/character/1'
    );
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
