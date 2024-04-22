import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,ParamMap ,NavigationExtras} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { ReservationsService } from '../services/reservations.service';
import { Reservation ,InformData} from '../interface/reservation.interface';
import { StatusReserveTypes } from '../interface/status-reserve.interface';
import { CommonModule } from '@angular/common';
import { SalonService } from '../../../salon/salon.service';
import { SalonResponse,Salon } from '../../../salon/salon.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import {typeMessage} from '../../../auth/interface/message.interface'
import { InformComponent } from '../inform/inform.component'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-reservation-screen',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    InformComponent
    ],
  providers: [ReservationsService,SalonService,AuthService],
  templateUrl: './reservation-screen.component.html',
  styleUrl: './reservation-screen.component.css'
})


 


export class ReservationScreenComponent implements OnInit{
 reservation!: Reservation;
 reservationId?:any;
 
 salon!:string;
 public salons?: Salon[] = []
 currentDate: Date = new Date();
 startDate?:Date;
 endDate?:Date;
 rol?:string;
 



  constructor(
    private reservationsServices: ReservationsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private salonService: SalonService,
    private authService: AuthService,
    public dialog: MatDialog,
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
     

     

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.reservationId = params.get('id');
      console.log(this.reservationId);
      this.reservationsServices.reservationById(this.reservationId).subscribe( ({ reservation }) => {
      this.reservation = reservation;
      console.log(this.reservation)

      
      this.startDate=new Date(this.reservation.startDate);
      this.endDate=new Date(this.reservation.endDate);

      this.startDate?.setHours(this.startDate.getHours() + 4);
      this.endDate?.setHours(this.endDate.getHours() + 4);

      //console.log(this.startDate);
      //console.log(this.endDate);

      this.salonService.findAll().subscribe(({ salones }) => {
            this.salons = salones;
            //console.log("aquii: ",this.salons[0].name )
            if(this.reservation){
                const found = this.salons.find((salon:Salon) => salon.id === this.reservation?.salonId);
                if(found){
                   console.log(found)
                   this.salon=found.name;
                }
            }
      }, error => {
            console.error('Error en la solicitud :', error);
            this.handleMessage('/nav/reservations',{
               status: 'error',
               message: 'Error cargando salon',
               reload:true
            });
      });
     }, error => {
        console.error('Error en la solicitud :', error);
        alert('Error en la solicitud :reservationById');
        this.handleMessage('/nav/reservations',{
           status: 'error',
           message: 'Error cargando reservationById',
           reload:true
        });
     });
    });
    this.rol=this.authService.getRol();
 
  /*
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.reservationsServices.reservationById(id))
      )
      .subscribe(reservation => {
        if(!reservation) return this.router.navigate(['/dashboard/reservations']);

        this.reservation = reservation;
        console.log(reservation)
        return;
      })*/
  }

 

  delete(id?: number):void {
        if (id !== undefined) {
            this.reservationsServices.deleteReservation(id).subscribe(response => {
              console.log("eliminado: ",id)
              this.handleMessage('/nav/reservations',{
                 status: 'ok',
                 message: 'Reservacion eliminada',
                 reload:true
              });
            }, error => {
                console.error('Error en la solicitud :', error);
                this.handleMessage('/nav/reservations',{
                 status: 'error',
                 message: error.error,
                 reload:true
              });
            });
        }
    }

  inform(data: InformData){
        const dialogRef = this.dialog.open(InformComponent, {
            width: '300px',
            height:'350px',
            data: {
               title: 'Solicitud aceptada',
               report:data
            }
        });
        dialogRef.afterClosed().subscribe(response => {
              console.log('La respuesta recibida del diálogo es:', response);
        }, error => {
              console.log("error")
        });
  }
  changeStatusInReservation(id: number, status: string) {
    this.reservationsServices.changeStatusInReservation(id, status)
      .subscribe(response => {
        if(status==="ACCEPTED"){
            this.inform({
                      nombre:this.reservation.user.name,
                      descripcion:this.reservation.descripcion,
                      salon:this.salon,
                      fecha:this.reservation.startDate,
                      requerimiento:this.reservation.requerimiento
            });
        }
        this.handleMessage('/nav/reservations',{
           status: 'ok',
           message: 'Estatus cambiado',
           reload:true
        });
      },error=>{
          this.handleMessage('/nav/reservations',{
           status: 'error',
           message: 'Error cambiando el estatus',
           reload:true
        });
      });
  }

  goBack() {
    this.handleMessage('/nav/reservations',{
       reload:true
    });
  }
}
