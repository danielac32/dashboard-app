export interface ReservationResponse {
    reservations: Reservation[];
    meta: Meta
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
  meta: Meta
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

export interface ReservationsUserResponse {
  reservations: Reservation[];
  meta:         Meta;
}

export interface Meta {
  total:    number;
  page:     number;
  lastPage: number;
}


export interface InformData {
  nombre: string;
  descripcion: string;
  salon: string;
  fecha: string;
  requerimiento: string;
}

export interface GetReportByUser{
    startDate:        string;
    endDate:          string;
    email:            string;
}


interface Salon {
    id:  number;
    name:string;
}


export interface ExcelReportByUser{
    id:               number;
    startDate:        string;
    endDate:          string;
    requerimiento:    string;
    cantidad_persona: number;
    descripcion:      string;
    state:            string;
    user:             string;
    salon:            string;
    direction:        string;
}

export interface ReportByUser{
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
    salon:Salon;
}
export interface ReportByUserResponse{
    res:ReportByUser[];
}
export interface ReportBySalon{
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
    salon:Salon;
}
export interface ReportBySalonResponse{
    res:ReportBySalon[];
}