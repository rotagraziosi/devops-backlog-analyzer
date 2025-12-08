import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, AnalysisResult } from '../models/analysis.model';

@Injectable({
  providedIn: 'root'
})
export class WorkitemAnalysisService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) { }

  analyzeWorkItem(workItemId: number): Observable<AnalysisResult> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/analyze/${workItemId}`)
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
