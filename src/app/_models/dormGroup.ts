import { Dorm } from './dorm';

export interface DormGroup {
    disabled?: boolean;
    name?: string;
    dorms?: Dorm[];
  }