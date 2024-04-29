import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationsService } from '../services/reservations.service';
import { Router,NavigationExtras } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SalonService } from '../../../salon/salon.service';
import {typeMessage} from '../../../auth/interface/message.interface'
import { AuthService } from '../../../auth/services/auth.service';
import  {UserResponse} from '../../../auth/interface/auth-login.interface';
import { CreateReservation } from '../interface/create-reservation.interface';
//import { format } from 'date-fns';
import { SalonResponse,Salon } from '../../../salon/salon.interface';
import {Reservation,ReservationResponse} from '../interface/reservation.interface';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';



@Component({
  selector: 'app-create-reservations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    HttpClientModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    ],
  providers: [AuthService,ReservationsService,SalonService],
  templateUrl: './create-reservations.component.html',
  styleUrl: './create-reservations.component.css'
})



export class CreateReservationsComponent implements OnInit {

public myForm: FormGroup = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    requerimiento: ['', Validators.required],
    cantidad_persona: [1, [Validators.required]],
    descripcion: ['', Validators.required],
    ///userId: [1, Validators.required],
    //salonId: [1, Validators.required],
    selectedItem: ["", Validators.required]
  });
 
  user!:UserResponse;
  userId!:number;
  //create!:CreateReservation;
  salonId!:number;
  public salons?: Salon[] = []
  public reservations?: Reservation[] = []
  public statusFilter: string = 'ACCEPTED';

 startTime?: string; // Aquí almacenarías el valor de inicio de tu formulario
 endTime?: string; // Aquí almacenarías el valor de inicio de tu formulario
 submitted=false;

  constructor(
    private fb: FormBuilder,
    private reservationsService: ReservationsService,
    private salonService: SalonService,
    private router: Router,
    private authService: AuthService,
  
  ) {}


    handleMessage(urlBase:string,mg:typeMessage):void{
        const parametros: NavigationExtras = {
              queryParams: {
                status: mg.status,
                message: mg.message,
                reload:mg.reload
              }
        };
        this.router.navigate([urlBase],parametros);
    }

  ngOnInit(): void {
   this.submitted=false;
    this.salonService.findAll().subscribe(({ salones }) => {
        this.salons = salones
        //console.log("aquii: ",this.salons[0].id )
    }, error => {
        console.error('Error en la solicitud :', error);
        this.handleMessage('/nav/reservations',{
           status: 'error',
           message: 'Error cargando los salon',
           reload:true
        });
    });

    this.reservationsService.allReservations(this.statusFilter).subscribe(({ reservations }) => {
        this.reservations = reservations
        //console.log("aquii: ",this.reservations )
    }, error => {
        console.error('Error en la solicitud :', error);
        this.handleMessage('/nav/reservations',{
           status: 'error',
           message: 'Error cargando las reservaciones',
           reload:true
        });
    });
  }


 

convertTo12HourFormat(dateTime: string): string {
  const [date, time] = dateTime.split('T'); // Separamos la fecha y la hora
  const [hours, minutes] = time.split(':'); // Separamos las horas y los minutos
  const [day, month, year] = date.split('-'); // Separamos el día, el mes y el año

  let hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';

  if (hour === 0) {
    hour = 12;
  } else if (hour > 12) {
    hour -= 12;
  }

  // Devolvemos la hora en formato de 12 horas con el sufijo AM o PM
  return `${hour}:${minutes} ${suffix}`;
}



convertTimeStart(): void {
  this.startTime = this.convertTo12HourFormat(this.myForm.get('startDate')?.value);
  //console.log("start: ",this.startTime)
}

convertTimeEnd(): void {
  this.endTime = this.convertTo12HourFormat(this.myForm.get('endDate')?.value);
  //console.log("end: ",this.endTime)
}




 isReservationOverlap(reservations: Reservation[], newStartDate: string, newEndDate: string): boolean {
    // Convertir las fechas de inicio y fin a objetos Date
    const startDate = new Date(newStartDate);
    const endDate = new Date(newEndDate);

    // Iterar sobre cada reserva existente
    for (const reservation of reservations) {
        // Convertir las fechas de inicio y fin de la reserva existente a objetos Date

        const existingStartDate = new Date(reservation.startDate);
        const existingEndDate = new Date(reservation.endDate);
        existingStartDate?.setHours(existingStartDate.getHours() + 4);
        existingEndDate?.setHours(existingEndDate.getHours() + 4);
        

        // Comprobar si las fechas y horas se superponen
        if (
            (startDate >= existingStartDate && startDate < existingEndDate) || // Comienza durante la reserva existente
            (endDate > existingStartDate && endDate <= existingEndDate) ||   // Termina durante la reserva existente
            (startDate <= existingStartDate && endDate >= existingEndDate)   // Contiene completamente la reserva existente
        ) {
            // Se ha encontrado una superposición, devolver verdadero
            //console.log("reservacion existente:")
            //console.log(existingStartDate)
            //console.log(existingEndDate)
            //console.log(reservation.user)
            return true;
        }
    }

    // No se encontraron superposiciones, devolver falso
    return false;
}


 
  createReservation() {
    this.submitted=true;
   if(!this.myForm.valid) return;
   const newStartDate = this.myForm?.get('startDate')?.value;
   const newEndDate = this.myForm?.get('endDate')?.value;

    if(this.reservations){
       if (this.isReservationOverlap(this.reservations, newStartDate, newEndDate)) {
          console.log('Hay una reserva existente.');
          this.handleMessage('/nav/reservations',{
           status: 'error',
           message: 'Hay una reserva existente',
           reload:true
        });
      } else {
           this.user = this.authService.getUser();
           const { startDate, endDate, requerimiento, cantidad_persona, descripcion , selectedItem} = this.myForm.value;
           this.reservationsService.createReservation({
                                                      startDate, 
                                                      endDate, 
                                                      requerimiento, 
                                                      cantidad_persona, 
                                                      descripcion ,
                                                      userId:Number(this.user.id),
                                                      salonId:Number(selectedItem)// se le suma uno porque en la base de datos comienza de 1 
                                                    })
            .subscribe(esponse => {

              this.handleMessage('/nav/reservations',{
                   status: 'ok',
                   message: 'Reservacion creada',
                   reload:true
              });
           }, error => {
              console.error('Error en la solicitud :', error);
              this.handleMessage('/nav/reservations',{
                   status: 'error',
                   message: 'Error creando la reservacion',
                   reload:true
              });
           });
      }
    }
   





    /*if(!this.myForm.valid) return;
     this.user = this.authService.getUser();
 
     const { startDate, endDate, requerimiento, cantidad_persona, descripcion , selectedItem} = this.myForm.value;
     //this.salonId = this.buscarStringEnLista(this.items,this.myForm.get('selectedItem')!.value);

     this.reservationsService.createReservation({
                                                startDate, 
                                                endDate, 
                                                requerimiento, 
                                                cantidad_persona, 
                                                descripcion ,
                                                userId:Number(this.user.id),
                                                salonId:Number(selectedItem)// se le suma uno porque en la base de datos comienza de 1 
                                              })
      .subscribe(esponse => {
        const parametros: NavigationExtras = {
        queryParams: {
          status: 'ok',
          message: 'Reservacion creada'
        }
      };
      this.router.navigate(['/dashboard/reservations'],parametros);
     }, error => {
        console.error('Error en la solicitud :', error);
        alert('Error en la solicitud :');
     });*/
  }
}
