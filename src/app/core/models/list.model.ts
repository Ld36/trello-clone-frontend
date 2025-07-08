import { BasicCard } from './types';

export interface List {
  id: string;
  title: string;
  position: number;
  boardId: string;
  cards?: BasicCard[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateListDto {
  title: string;
  boardId: string;
  position: number;
}

export interface UpdateListDto {
  title?: string;
  position?: number;
}

export interface ReorderListDto {
  listId: string;
  newPosition: number;
}
