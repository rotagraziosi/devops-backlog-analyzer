import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AcceptanceCriteriaApiResponse, AcceptanceCriteriaResult } from '../models/acceptance-criteria.model';

@Injectable({
  providedIn: 'root'
})
export class AcceptanceCriteriaService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  generateAcceptanceCriteria(workItemId: number): Observable<AcceptanceCriteriaResult> {
    return this.http.get<AcceptanceCriteriaApiResponse>(`${this.apiUrl}/generate-ac/${workItemId}`)
      .pipe(
        map(response => {
          if (response.success && response.data) {
            return response.data;
          }
          throw new Error(response.error || 'Unknown error occurred');
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error?.error || error.message || errorMessage;
    }

    return throwError(() => new Error(errorMessage));
  }
}
