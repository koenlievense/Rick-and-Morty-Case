import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { LocationService } from './location.service';
import { ConfigService } from './config.service';
import { throwError } from 'rxjs';
import { Location } from '../interfaces/location';
import { Info } from '../interfaces/info';

describe('LocationService', () => {
  let service: LocationService;
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
        LocationService,
        { provide: ConfigService, useValue: configServiceSpy },
      ],
    });

    service = TestBed.inject(LocationService);
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

  it('should fetch location by ID', () => {
    const mockLocation: Location = { id: 1, name: 'Earth' } as Location;

    service.fetchLocationById(1).subscribe((location) => {
      expect(location).toEqual(mockLocation);
    });

    const req = httpMock.expectOne(
      'https://rickandmortyapi.com/api/location/1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockLocation);
  });

  it('should fetch locations by IDs', () => {
    const mockLocations: Location[] = [
      { id: 1, name: 'Earth' } as Location,
      { id: 2, name: 'Mars' } as Location,
    ];

    service.fetchLocationsByIds([1, 2]).subscribe((locations) => {
      expect(locations).toEqual(mockLocations);
    });

    const req = httpMock.expectOne(
      'https://rickandmortyapi.com/api/location/1,2'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockLocations);
  });

  it('should fetch locations with params', () => {
    const mockInfo: Info<Location[]> = {
      info: {
        count: 2,
        next: null,
        pages: 1,
        prev: null,
      },
      results: [
        { id: 1, name: 'Earth' } as Location,
        { id: 2, name: 'Mars' } as Location,
      ],
    };

    service.fetchLocations({ page: 1 }).subscribe((info) => {
      expect(info).toEqual(mockInfo);
    });

    const req = httpMock.expectOne(
      'https://rickandmortyapi.com/api/location?page=1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockInfo);
  });

  it('should handle errors', () => {
    const errorMessage = 'An error occurred';

    service.fetchLocationById(1).subscribe({
      next: () => fail('expected an error, not locations'),
      error: (error) => expect(error.error).toContain(errorMessage),
    });

    const req = httpMock.expectOne(
      'https://rickandmortyapi.com/api/location/1'
    );
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });
});
