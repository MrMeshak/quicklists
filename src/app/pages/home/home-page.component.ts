import { Component, inject, signal } from '@angular/core';
import { ModalComponent } from '../../components/util/modal.component';
import { Checklist } from '../../shared/interfaces/list.model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ModalComponent],
  template: `
    <header>
      <h1>Quicklists</h1>
      <button (click)="checklistBeingEdited.set({})">Add Checklist</button>
    </header>
    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template> you can't see me .... yet</ng-template>
    </app-modal>
  `,
})
export class HomePageComponent {
  formBuilder = inject(FormBuilder);

  checklistBeingEdited = signal<Partial<Checklist> | null>(null);
}
