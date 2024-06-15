import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ChecklistService } from '../services/checklist.service';
import { checklistHeaderComponent } from '../components/checklist/checklist-header.component';
import { ModalComponent } from '../components/util/modal.component';
import { ChecklistItem } from '../shared/interfaces/checklist-item.model';
import { FormModalComponent } from '../components/util/form-modal.component';
import { ChecklistItemService } from '../services/checklist-item.service';
import { ChecklistItemList } from '../components/checklistItem/checklist-item-list.component';

@Component({
  selector: 'app-checklist-page',
  standalone: true,
  imports: [
    checklistHeaderComponent,
    ModalComponent,
    FormModalComponent,
    ChecklistItemList,
  ],
  template: `
    @if(checklist(); as checklist) {
    <app-checklist-header
      [checklist]="checklist"
      (addItem)="checklistItemBeingEdited.set({})"
      (resetChecklist)="checklistItemService.reset$.next($event)"
    />
    }
    <app-checklist-item-list
      [checklistItems]="checklistItems()"
      (toggle)="checklistItemService.toggle$.next($event)"
      (edit)="checklistItemBeingEdited.set($event)"
      (delete)="checklistItemService.delete$.next($event)"
    />
    <app-modal [isOpen]="!!checklistItemBeingEdited()">
      <ng-template>
        <app-form-modal
          title="Create Item"
          [formGroup]="checklistItemForm"
          (save)="
            checklistItemBeingEdited()?.id
              ? checklistItemService.edit$.next({
                  id: checklistItemBeingEdited()!.id!,
                  data: checklistItemForm.getRawValue(),
                })
              : checklistItemService.add$.next({
                  item: checklistItemForm.getRawValue(),
                  checklistId: checklist()?.id!
                })
          "
          (close)="checklistItemBeingEdited.set(null)"
        />
      </ng-template>
    </app-modal>
  `,
})
export class ChecklistPageComponent {
  route = inject(ActivatedRoute);
  checklistService = inject(ChecklistService);
  checklistItemService = inject(ChecklistItemService);
  formBuilder = inject(FormBuilder);

  params = toSignal(this.route.paramMap);
  checklistItemBeingEdited = signal<Partial<ChecklistItem> | null>(null);

  checklist = computed(() =>
    this.checklistService
      .checklists()
      .find((checklist) => checklist.id === this.params()?.get('id'))
  );

  checklistItems = computed(() =>
    this.checklistItemService
      .checklistItems()
      .filter((item) => item.checklistId === this.params()?.get('id'))
  );

  checklistItemForm = this.formBuilder.nonNullable.group({
    title: [''],
  });

  constructor() {
    effect(() => {
      const checklistItem = this.checklistItemBeingEdited();

      if (!checklistItem) {
        this.checklistItemForm.reset();
      } else {
        this.checklistItemForm.patchValue({ title: checklistItem.title });
      }
    });
  }
}
