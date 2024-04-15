export interface ReservationResponse {
    reservations: Reservation[];
}

export interface Reservation {
    id:               number;
    startDate:        string;
    endDate:          string;
    requerimiento:    string;
    cantidad_persona: number;
    descripcion:      string;
    state:            string;
    userId:           number;
    salonId:          number;
    user:             User;
}
 


export interface ReservationResponse2 {
  reservation: Reservation
}



export interface ReservationUser {
    id:               number;
    startDate:        string;
    endDate:          string;
    requerimiento:    string;
    cantidad_persona: number;
    descripcion:      string;
    state:            string;
    userId:           number;
    salonId:          number;
    user:User;
}

export interface User {
  id?:number;
  name: string;
  email: string;
  isActive?: boolean;
  password?: string;
  directionId?: number;
  rol?:string
  direction?: {
    id: number;
    address: string;
  };
};

export interface ReservationResponse3 {
  reservations: ReservationUser[]
}

export interface ReservationWithUser {
  id: number;
  cantidad_persona: number;
  descripcion: string;
  endDate: string;
  startDate: string;
  requerimiento: string;
  salonId: number;
  state: string;
  user: {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
    rol: string;
    direction: {
      id: number;
      address: string;
    };
  };
  userId: number;
}

export interface ReservationResponse4 {
  reservations: ReservationWithUser[]
}