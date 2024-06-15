import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../shared/interfaces/checklist.model';
import { ResetChecklistItems } from '../../shared/interfaces/checklist-item.model';

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
        <button (click)="resetChecklist.emit({ checklistId: checklist().id })">
          reset
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      button {
        margin-left: 1rem;
      }
    `,
  ],
})
export class checklistHeaderComponent {
  checklist = input.required<Checklist>();
  addItem = output();
  resetChecklist = output<ResetChecklistItems>();
}
