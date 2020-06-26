// the model is needed to receive the dto from the backend
export interface Product {
    message(message: any);
    status: number;
    result: { [key: string]: any; };
    id?: number;   // id? means that that field can be empty
    userId?: number;
    name?: string;
    title?: string;
    price?: number;
    views?: number;
    available?: boolean;
    createdAt?: string;
    updatedAt?: string;
    picPaths?: string[];  
}
