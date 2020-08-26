import { User } from './user';
import { Message } from './message';

export interface Chat {
    id?: number;
    
    user1: string;
    user2: string;
    messages: Message[];
   
}

