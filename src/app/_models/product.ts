// the model is needed to receive the dto from the backend
export interface Product {
    message?(message: any);
    status?: number;
    result?: { [key: string]: any; };
    id?: number;   // id? means that that field can be empty
    userId?: number;
    description?: string;
    title?: string;
    price?: number;
    isBeerOk?: boolean;
    views?: number;
    available?: boolean;
    createdAt?: string;
    updatedAt?: string;
    picPaths?: string[];  

    // the next two properties are used to display the city and dorm of the products from the other dorms on the main page (products component) -> extra loading the dorm and city with the userId of the product is too complicated here.
    dorm?: string;
    city?: string;
}
