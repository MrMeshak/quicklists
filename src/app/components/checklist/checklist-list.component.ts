import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Checklist } from '../../shared/interfaces/checklist.model';

@Component({
  selector: 'app-checklist-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <ul>
      @for(checklist of checklists(); track checklist.id) {
      <li>
        <a routerLink="/checklist/{{ checklist.id }}">{{ checklist.title }}</a>
      </li>
      } @empty {
      <p>Click the add button to create your first checklist!</p>
      }
    </ul>
  `,
})
export class CheckListListComponent {
  checklists = input.required<Checklist[]>();
}