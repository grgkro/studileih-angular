// the model is needed to receive the dto from the backend

import { Product } from './product';

export interface User {
    result?: any;
    message?(message: any);
    status?: number;
    id?: number; 
    name?: string;
    email?: string;
    password?: string;
    dormId?: number; 
    room?: number;
    profilePic?: string;
    products?: Product[];
    createdAt?: string;
    updatedAt?: string;  
}
