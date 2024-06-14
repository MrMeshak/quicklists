import { Component, inject, signal } from '@angular/core';
import { ModalComponent } from '../components/util/modal.component';
import { Checklist } from '../shared/interfaces/checklist.model';
import { FormBuilder } from '@angular/forms';
import { FormModalComponent } from '../components/util/form-modal.component';
import { ChecklistService } from '../services/checklist.service';
import { CheckListListComponent } from '../components/checklist/checklist-list.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [ModalComponent, FormModalComponent, CheckListListComponent],
  template: `
    <header>
      <h1>Quicklists</h1>
      <button (click)="checklistBeingEdited.set({})">Add Checklist</button>
    </header>
    <section>
      <app-checklist-list [checklists]="checklistService.checklists()" />
    </section>
    <app-modal [isOpen]="!!checklistBeingEdited()">
      <ng-template>
        <app-form-modal
          [title]="
            checklistBeingEdited()?.title
              ? checklistBeingEdited()!.title!
              : 'Add Checklist'
          "
          [formGroup]="checklistForm"
          (close)="checklistBeingEdited.set(null)"
          (save)="checklistService.add$.next(checklistForm.getRawValue())"
        />
      </ng-template>
    </app-modal>
  `,
})
export class HomePageComponent {
  formBuilder = inject(FormBuilder);
  checklistService = inject(ChecklistService);
  checklistBeingEdited = signal<Partial<Checklist> | null>(null);

  checklistForm = this.formBuilder.nonNullable.group({
    title: [''],
  });
}
