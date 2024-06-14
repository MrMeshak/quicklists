import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../shared/interfaces/checklist.model';

@Component({
  selector: 'app-checklist-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header>
      <a routerLink="/home">Back</a>
      <h2>{{ checklist().title }}</h2>
      <div>
        <button (click)="addItem.emit()">Add item</button>
      </div>
    </header>
  `,
})
export class checklistHeaderComponent {
  checklist = input.required<Checklist>();
  addItem = output();
}
