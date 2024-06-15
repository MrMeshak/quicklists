import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AddChecklist,
  Checklist,
  DeleteChecklist,
  EditChecklist,
} from '../shared/interfaces/checklist.model';
import { Subject } from 'rxjs';
import { StorageService } from './storage.service';

interface ChecklistState {
  checklists: Checklist[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private storageService = inject(StorageService);
  private state = signal<ChecklistState>({
    checklists: [],
    loaded: false,
    error: null,
  });

  //selectors
  checklists = computed(() => this.state().checklists);
  loaded = computed(() => this.state().loaded);

  //sources
  add$ = new Subject<AddChecklist>();
  delete$ = new Subject<DeleteChecklist>();
  edit$ = new Subject<EditChecklist>();

  private checklistsLoaded$ = this.storageService.loadChecklists();

  constructor() {
    //reducers
    this.add$.pipe(takeUntilDestroyed()).subscribe((checklist) =>
      this.state.update((state) => ({
        ...state,
        checklists: [...state.checklists, this.addIdToCheckList(checklist)],
      }))
    );

    this.delete$.pipe(takeUntilDestroyed()).subscribe((payload) => {
      this.state.update((state) => ({
        ...state,
        checklists: state.checklists.filter((list) => list.id !== payload.id),
      }));
    });

    this.edit$.pipe(takeUntilDestroyed()).subscribe((payload) => {
      this.state.update((state) => ({
        ...state,
        checklists: state.checklists.map((list) =>
          list.id === payload.id ? { ...list, ...payload.data } : list
        ),
      }));
    });

    this.checklistsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklists) =>
        this.state.update((state) => ({
          ...state,
          checklists,
          loaded: true,
          error: null,
        })),
      error: (error) =>
        this.state.update((state) => ({ ...state, error: error })),
    });

    //effect
    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklists(this.checklists());
      }
    });
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
