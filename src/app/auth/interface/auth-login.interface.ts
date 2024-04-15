

export interface User {
    email: string;
    password: string;
};


export interface UserUpdateActive {
    isActive?: boolean;
};
export interface UserUpdate {
    name: string;
    email: string;
    isActive?: boolean;
    password: string;
    password2?: string;
    directionId: number;
    rol?:string
};

export interface UserProfile {
	name: string;
    email: string;
    direction: string;
};

export interface UserResponse {
    id?:number;
    name: string;
    email: string;
    isActive?: boolean;
    password: string;
    directionId: number;
    rol?:string
};

export interface __user {
    id?:number;
    name: string;
    email: string;
    isActive?: boolean;
    password: string;
    rol?:string;
    direction?: {
        id: number;
        address: string;
    };
};


export interface UserResponse2 {
    status?:any;
    user?:__user;
};
export interface loginUser{
    user:__user;
    token:string;
    status?:any;
}
export interface UserResponse{
    users:__user[];
}
