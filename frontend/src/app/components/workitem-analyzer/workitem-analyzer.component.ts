import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { WorkitemAnalysisService } from '../../services/workitem-analysis.service';
import { AnalysisResult } from '../../models/analysis.model';

@Component({
  selector: 'app-workitem-analyzer',
  imports: [CommonModule, FormsModule],
  templateUrl: './workitem-analyzer.component.html',
  styleUrls: ['./workitem-analyzer.component.scss']
})
export class WorkitemAnalyzerComponent {
  workItemId: number | null = null;
  analysisResult: AnalysisResult | null = null;
  loading = false;
  error: string | null = null;

  constructor(private analysisService: WorkitemAnalysisService) {}

  analyzeWorkItem(): void {
    if (!this.workItemId || this.workItemId <= 0) {
      this.error = 'Please enter a valid work item ID';
      return;
    }

    this.loading = true;
    this.error = null;
    this.analysisResult = null;

    this.analysisService.analyzeWorkItem(this.workItemId).subscribe({
      next: (result) => {
        this.analysisResult = result;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
      }
    });
  }

  reset(): void {
    this.workItemId = null;
    this.analysisResult = null;
    this.error = null;
  }
}
