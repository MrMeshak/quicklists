import { Injectable, computed, signal } from '@angular/core';
import {
  AddChecklistItem,
  ChecklistItem,
  EditCheckListItem,
  RemoveChecklistItem,
} from '../shared/interfaces/checklist-item.model';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private state = signal<ChecklistItemsState>({
    checklistItems: [],
  });

  //selectors
  checklistItems = computed(() => this.state().checklistItems);

  //sources
  add$ = new Subject<AddChecklistItem>();
  edit$ = new Subject<EditCheckListItem>();
  remove$ = new Subject<RemoveChecklistItem>();

  //reducers
  constructor() {
    this.add$.pipe(takeUntilDestroyed()).subscribe((payload) =>
      this.state.update((state) => ({
        ...state,
        checklistItems: [
          ...state.checklistItems,
          {
            ...payload.item,
            id: Date.now().toString(),
            checklistId: payload.checklistId,
            checked: false,
          },
        ],
      }))
    );

    this.edit$.pipe(takeUntilDestroyed()).subscribe();

    this.remove$.pipe(takeUntilDestroyed()).subscribe();
  }
}
