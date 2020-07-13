import { User } from './user';

export interface Message {
    id?: number;
    subject?: string;
    text?: string;
    sendetAt?: string;
  
    receivedAt?: string;
    sender: User;
    receiver: User;
   
}

