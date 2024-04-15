export interface User {
    id?:number;
    name: string;
    email: string;
    isActive?: boolean;
    password: string;
    directionId: number;
    rol?:string;
};

export interface CreateUser {
    name: string;
    email: string;
    password: string;
    directionId: number;
    rol?:string;
};
export interface CreateUserFromDialog {
    name: string;
    email: string;
    password: string;
    selectedItem: number;
    rol?:string;
};

