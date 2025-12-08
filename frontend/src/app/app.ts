import { Component } from '@angular/core';
import { WorkitemAnalyzerComponent } from './components/workitem-analyzer/workitem-analyzer.component';

@Component({
  selector: 'app-root',
  imports: [WorkitemAnalyzerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'DevOps Agile Props Filling';
}
