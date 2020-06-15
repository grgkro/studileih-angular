import { Product } from './product';

export interface User {
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
