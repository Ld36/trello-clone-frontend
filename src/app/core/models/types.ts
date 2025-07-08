// Interfaces de tipos básicos para evitar importações circulares

export interface BasicUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BasicBoard {
  id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  isPublic: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BasicList {
  id: string;
  title: string;
  position: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BasicCard {
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
