import { Routes } from '@angular/router';
import { WorkitemAnalyzerComponent } from './components/workitem-analyzer/workitem-analyzer.component';
import { AcGeneratorComponent } from './components/ac-generator/ac-generator.component';

export const routes: Routes = [
  { path: '', redirectTo: '/analyze', pathMatch: 'full' },
  { path: 'analyze', component: WorkitemAnalyzerComponent },
  { path: 'generate-ac', component: AcGeneratorComponent }
];
