// the model is needed to receive the dto from the backend

import { Product } from './product';

export interface User {
    result: any;
    message(message: any);
    status: number;
    id?: number; 
    name?: number;
    email?: string;
    password?: string;
    dorm?: string; 
    room?: number;
    profilePic?: string;
    products?: Product[];
    createdAt?: string;
    updatedAt?: string;  
}
