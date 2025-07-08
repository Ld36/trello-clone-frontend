export interface Card {
  id: string;
  title: string;
  description?: string;
  position: number;
  listId: string;
  label?: string;
  labelColor?: string;
  dueDate?: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCardDto {
  title: string;
  description?: string;
  listId: string;
  label?: string;
  labelColor?: string;
  position: number;
  dueDate?: Date;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
  label?: string;
  labelColor?: string;
  dueDate?: Date;
  isCompleted?: boolean;
}

export interface MoveCardDto {
  cardId: string;
  targetListId: string;
  newPosition: number;
}

export interface ReorderCardDto {
  cardId: string;
  newPosition: number;
}
