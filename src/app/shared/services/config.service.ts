import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private readonly API_URL = 'https://rickandmortyapi.com/api';

  get apiUrl(): string {
    return this.API_URL;
  }

  handleError(error: any) {
    let errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

    return throwError(() => {
      return errorMessage;
    });
  }
}
