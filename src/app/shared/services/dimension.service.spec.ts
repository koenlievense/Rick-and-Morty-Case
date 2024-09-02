import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DimensionService } from './dimension.service';
import { LocationService } from './location.service';
import { of } from 'rxjs';
import { Location } from '../interfaces/location';
import { Info } from '../interfaces/info';

describe('DimensionService', () => {
  let service: DimensionService;
  let httpMock: HttpTestingController;
  let locationService: jasmine.SpyObj<LocationService>;

  beforeEach(() => {
    const locationServiceSpy = jasmine.createSpyObj('LocationService', [
      'fetchLocations',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DimensionService,
        { provide: LocationService, useValue: locationServiceSpy },
      ],
    });

    service = TestBed.inject(DimensionService);
    httpMock = TestBed.inject(HttpTestingController);
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

  it('should load dimensions correctly and handle pagination', () => {
    // Mock data
    const response1: Info<Location[]> = {
      info: {
        count: 2,
        next: 'http://api.example.com/locations?page=2',
        pages: 2,
        prev: null,
      },
      results: [
        {
          dimension: 'Dimension 1',
          name: 'Location 1',
          residents: [
            'http://api.example.com/character/1',
            'http://api.example.com/character/2',
          ],
        } as Location,
        {
          dimension: 'Dimension 2',
          name: 'Location 2',
          residents: ['http://api.example.com/character/3'],
        } as Location,
      ],
    };

    const response2: Info<Location[]> = {
      info: {
        count: 2,
        next: null,
        pages: 2,
        prev: 'http://api.example.com/locations?page=1',
      },
      results: [
        {
          dimension: 'Dimension 1',
          name: 'Location 3',
          residents: ['http://api.example.com/character/4'],
        } as Location,
      ],
    };

    locationService.fetchLocations.and.callFake((params: { updates: any }) => {
      let page = params.updates[0].value!;

      if (page === '1') {
        return of(response1);
      } else if (page === '2') {
        return of(response2);
      }
      return of(response1);
    });

    service.loadDimensions(1).subscribe((dimensions) => {
      expect(dimensions.length).toBe(2);

      const dimension1 = dimensions.find((d) => d.name === 'Dimension 1');
      expect(dimension1).toBeDefined();
      expect(dimension1?.locations).toContain('Location 1');
      expect(dimension1?.locations).toContain('Location 3');
      expect(dimension1?.characters).toContain(1);
      expect(dimension1?.characters).toContain(2);
      expect(dimension1?.characters).toContain(4);

      const dimension2 = dimensions.find((d) => d.name === 'Dimension 2');
      expect(dimension2).toBeDefined();
      expect(dimension2?.locations).toContain('Location 2');
      expect(dimension2?.characters).toContain(3);
    });
  });
});
