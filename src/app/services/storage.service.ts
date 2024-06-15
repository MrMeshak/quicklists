import { Injectable, InjectionToken, PLATFORM_ID, inject } from '@angular/core';
import { Checklist } from '../shared/interfaces/checklist.model';
import { ChecklistItem } from '../shared/interfaces/checklist-item.model';
import { of } from 'rxjs';

export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage);
    },
  }
);

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  storage = inject(LOCAL_STORAGE);

  loadChecklists() {
    const checklists = this.storage.getItem('checklists');
    return of(checklists ? (JSON.parse(checklists) as Checklist[]) : []);
  }

  loadChecklistItems() {
    const checklistItems = this.storage.getItem('checklistItems');
    return of(
      checklistItems ? (JSON.parse(checklistItems) as ChecklistItem[]) : []
    );
  }

  saveChecklists(checklists: Checklist[]) {
    this.storage.setItem('checklists', JSON.stringify(checklists));
  }

  saveChecklistItems(checklistItems: ChecklistItem[]) {
    this.storage.setItem('checklistItems', JSON.stringify(checklistItems));
  }
}
