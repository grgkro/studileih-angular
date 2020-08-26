import { User } from './user';

export interface Message {
    id?: number;
    chatId?: number;
    subject?: string;
    text?: string;
    sendetAt?: string;
  
    receivedAt?: string;
    sender?: string;
    receiver?: string;
   
}

