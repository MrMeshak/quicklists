import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  AddChecklistItem,
  ChecklistItem,
  DeleteChecklistItem,
  EditChecklistItem,
  ResetChecklistItems,
  ToggleChecklistItem,
} from '../shared/interfaces/checklist-item.model';
import { Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { StorageService } from './storage.service';
import { ChecklistService } from './checklist.service';

export interface ChecklistItemsState {
  checklistItems: ChecklistItem[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ChecklistItemService {
  private storageService = inject(StorageService);
  private checklistService = inject(ChecklistService);

  private state = signal<ChecklistItemsState>({
    checklistItems: [],
    loaded: false,
    error: null,
  });

  //selectors
  checklistItems = computed(() => this.state().checklistItems);
  loaded = computed(() => this.state().loaded);

  //sources
  add$ = new Subject<AddChecklistItem>();
  toggle$ = new Subject<ToggleChecklistItem>();
  reset$ = new Subject<ResetChecklistItems>();
  edit$ = new Subject<EditChecklistItem>();
  delete$ = new Subject<DeleteChecklistItem>();

  private checklistItemsLoaded$ = this.storageService.loadChecklistItems();

  constructor() {
    //reducers
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

    this.toggle$.pipe(takeUntilDestroyed()).subscribe((payload) => {
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === payload.id ? { ...item, checked: !item.checked } : item
        ),
      }));
    });

    this.reset$.pipe(takeUntilDestroyed()).subscribe((payload) => {
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.checklistId === payload.checklistId
            ? { ...item, checked: false }
            : item
        ),
      }));
    });

    this.edit$.pipe(takeUntilDestroyed()).subscribe((payload) => {
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.map((item) =>
          item.id === payload.id ? { ...item, ...payload.data } : item
        ),
      }));
    });

    this.delete$.pipe(takeUntilDestroyed()).subscribe((payload) => {
      this.state.update((state) => ({
        ...state,
        checklistItems: state.checklistItems.filter(
          (item) => item.id !== payload.id
        ),
      }));
    });

    //effects
    this.checklistItemsLoaded$.pipe(takeUntilDestroyed()).subscribe({
      next: (checklistItems) => {
        this.state.update((state) => ({
          ...state,
          checklistItems,
          loaded: true,
          error: null,
        }));
      },
      error: (error) => {
        this.state.update((state) => ({ ...state, error: error }));
      },
    });

    this.checklistService.delete$
      .pipe(takeUntilDestroyed())
      .subscribe((payload) => {
        this.state.update((state) => ({
          ...state,
          checklistItems: state.checklistItems.filter(
            (item) => item.checklistId !== payload.id
          ),
        }));
      });

    effect(() => {
      if (this.loaded()) {
        this.storageService.saveChecklistItems(this.checklistItems());
      }
    });
  }
}
