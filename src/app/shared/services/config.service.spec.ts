import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { throwError } from 'rxjs';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigService],
    });

    service = TestBed.inject(ConfigService);
  });

  it('should create a service', () => {
    expect(service).toBeTruthy();
  });

  it('should return the correct API URL', () => {
    expect(service.apiUrl).toBe('https://rickandmortyapi.com/api');
  });

  it('should format error correctly in handleError', (done) => {
    const error = { status: 404, message: 'Not Found' };
    const expectedErrorMessage = `Error Code: 404\nMessage: Not Found`;

    service.handleError(error).subscribe({
      error: (error) => {
        expect(error).toBe(expectedErrorMessage);
        done();
      },
    });
  });
});
