import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcceptanceCriteriaService } from '../../services/acceptance-criteria.service';
import { AcceptanceCriteriaResult } from '../../models/acceptance-criteria.model';

@Component({
  selector: 'app-ac-generator',
  imports: [CommonModule, FormsModule],
  templateUrl: './ac-generator.component.html',
  styleUrls: ['./ac-generator.component.scss']
})
export class AcGeneratorComponent {
  workItemId: number | null = null;
  result: AcceptanceCriteriaResult | null = null;
  loading = false;
  error: string | null = null;

  constructor(private acService: AcceptanceCriteriaService) {}

  generateAC(): void {
    if (!this.workItemId || this.workItemId <= 0) {
      this.error = 'Please enter a valid work item ID';
      return;
    }

    this.loading = true;
    this.error = null;
    this.result = null;

    this.acService.generateAcceptanceCriteria(this.workItemId).subscribe({
      next: (result) => {
        this.result = result;
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
    this.result = null;
    this.error = null;
  }

  getModeLabel(mode: string): string {
    switch (mode) {
      case 'new':
        return 'Nouveaux critères';
      case 'augment':
        return 'Critères complémentaires';
      case 'improve':
        return 'Améliorations suggérées';
      default:
        return mode;
    }
  }

  getModeClass(mode: string): string {
    switch (mode) {
      case 'new':
        return 'mode-new';
      case 'augment':
        return 'mode-augment';
      case 'improve':
        return 'mode-improve';
      default:
        return '';
    }
  }
}
