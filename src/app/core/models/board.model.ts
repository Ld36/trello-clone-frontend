import { User } from './user.model';
import { BasicList } from './types';

export interface Board {
  id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  isPublic: boolean;
  ownerId: string;
  owner?: User;
  lists?: BasicList[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBoardDto {
  title: string;
  description?: string;
  backgroundColor?: string;
  isPublic: boolean;
}

export interface UpdateBoardDto {
  title?: string;
  description?: string;
  backgroundColor?: string;
  isPublic?: boolean;
}
