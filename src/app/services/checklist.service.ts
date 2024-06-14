import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddChecklist, Checklist } from '../shared/interfaces/checklist.model';
import { Subject } from 'rxjs';

interface ChecklistState {
  checklists: Checklist[];
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private state = signal<ChecklistState>({
    checklists: [],
  });

  //selectors
  checklists = computed(() => this.state().checklists);

  //sources
  add$ = new Subject<AddChecklist>();

  constructor() {
    //reducers
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      this.state.update((state) => ({
        ...state,
        checklists: [...state.checklists, this.addIdToCheckList(checklist)],
      }))
    );
  }

  private addIdToCheckList(checklist: AddChecklist) {
    return {
      ...checklist,
      id: this.generateSlug(checklist.title),
    };
  }

  private generateSlug(title: string) {
    let slug = title.toLowerCase().replace(/\s+/g, '-');

    const matchingSlugs = this.checklists().find(
      (checklist) => checklist.id === slug
    );

    if (matchingSlugs) {
      slug = slug + Date.now().toString();
    }

    return slug;
  }
}
