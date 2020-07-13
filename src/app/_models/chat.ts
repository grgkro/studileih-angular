import { User } from './user';
import { Message } from './message';

export interface Chat {
    id?: number;
    
    user1: User;
    user2: User;
    messages: Message[];
   
}

