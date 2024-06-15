export interface ChecklistItem {
  id: string;
  checklistId: string;
  title: string;
  checked: boolean;
}

export type AddChecklistItem = {
  item: Omit<ChecklistItem, 'id' | 'checklistId' | 'checked'>;
  checklistId: ChecklistItem['checklistId'];
};

export type ToggleChecklistItem = {
  id: ChecklistItem['id'];
};

export type ResetChecklistItems = {
  checklistId: ChecklistItem['checklistId'];
};

export type EditChecklistItem = {
  id: ChecklistItem['id'];
  data: AddChecklistItem['item'];
};

export type DeleteChecklistItem = { id: ChecklistItem['id'] };
