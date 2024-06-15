import { Component, input, output } from '@angular/core';
import {
  ChecklistItem,
  DeleteChecklistItem,
  ToggleChecklistItem,
} from '../../shared/interfaces/checklist-item.model';

@Component({
  selector: 'app-checklist-item-list',
  standalone: true,
  template: `
    <section>
      <ul>
        @for(item of checklistItems(); track item.id){
        <li>
          @if(item.checked){
          <span>✅</span>
          }
          <div>
            {{ item.title }}
          </div>
          <div>
            <button (click)="toggle.emit({ id: item.id })">Toggle</button>
            <button (click)="edit.emit(item)">Edit</button>
            <button (click)="delete.emit({ id: item.id })">Delete</button>
          </div>
        </li>
        } @empty {
        <div>
          <h2>Add an item</h2>
          <p>Click the add button to add your first item to this quicklist</p>
        </div>
        }
      </ul>
    </section>
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
export class ChecklistItemList {
  checklistItems = input.required<ChecklistItem[]>();
  toggle = output<ToggleChecklistItem>();
  edit = output<ChecklistItem>();
  delete = output<DeleteChecklistItem>();
}
