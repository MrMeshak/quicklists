import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  Checklist,
  DeleteChecklist,
  EditChecklist,
} from '../../shared/interfaces/checklist.model';
import { ChecklistService } from '../../services/checklist.service';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <ul>
      @for(checklist of checklists(); track checklist.id) {
      <li>
        <a routerLink="/checklist/{{ checklist.id }}">{{ checklist.title }}</a>
        <div>
          <button (click)="edit.emit(checklist)">Edit</button>
          <button (click)="delete.emit({ id: checklist.id })">Delete</button>
        </div>
      </li>
      } @empty {
      <p>Click the add button to create your first checklist!</p>
      }
    </ul>
  `,
  styles: [
    `
      ul {
        padding: 0;
        margin: 0;
      }
      li {
        font-size: 1.5em;
        display: flex;
        justify-content: space-between;
        background: var(--color-light);
        list-style-type: none;
        margin-bottom: 1rem;
        padding: 1rem;

        button {
          margin-left: 1rem;
        }
      }
    `,
  ],
})
export class CheckListListComponent {
  checklists = input.required<Checklist[]>();
  edit = output<Checklist>();
  delete = output<DeleteChecklist>();
}
