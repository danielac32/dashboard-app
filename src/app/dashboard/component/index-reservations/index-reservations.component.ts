import { Component, OnInit } from '@angular/core';
import { Reservation,ReservationUser,ReservationWithUser } from '../interface/reservation.interface';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../services/reservations.service';
import { HttpClientModule } from '@angular/common/http';
import { ReservationCardComponent } from '../reservation-card/reservation-card.component';
import { SalonService } from '../../../salon/salon.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute,Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';



@Component({
  selector: 'app-index-reservations',
  standalone: true,
  imports: [
    CommonModule, 
    HttpClientModule, 
    ReservationCardComponent,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatTooltipModule
    ],
  providers: [ReservationsService,AuthService],
  templateUrl: './index-reservations.component.html',
  styleUrl: './index-reservations.component.css'
})
export class IndexReservationsComponent implements OnInit {
  public reservations: Reservation[] = [];
  public statusFilter: string = 'PENDING'; // Variable para almacenar el estado de filtro
  public emailUser? :string;
  public rol? :string;

  constructor(
    private reservationsService: ReservationsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {}
  

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Duración en milisegundos
      verticalPosition: 'top', // Posición vertical de la alerta
      horizontalPosition: 'end', // Posición horizontal de la alerta
      panelClass: ['green']
    });
  }

  ngOnInit(): void {
    this.rol = this.authService.getRol();
    this.emailUser = this.authService.getUserEmail();

    this.route.queryParams.subscribe(params => {
       const parametro = params['reload'];
       const status = params['status'];
       
       if(status){
          this.openSnackBar(params['message'], 'Cerrar');
       }
       if(parametro){
         console.log("reload: ",parametro)
         this.loadReservations();
       }
//       window.history.replaceState(null, '', this.router.url);
    },error=>{
      this.loadReservations();
    });
 
  }

  loadReservations(): void {
    // Usar la variable statusFilter como argumento para allReservations
    if(!this.rol || !this.emailUser) return;

    console.log("load ",this.rol)
    if(this.rol=== 'ADMIN') {
      this.reservationsService.allReservations(this.statusFilter)
        .subscribe(({ reservations}) => (this.reservations = reservations));
      return;
    }

    this.reservationsService.allReservationByUser(this.emailUser,this.statusFilter)
    .subscribe(({reservations}) => (
        this.reservations = reservations
    )); 
    console.log(this.reservations)
  }

  // Método para cambiar el filtro de estado
  changeStatusFilter(newStatus: string): void {
    this.statusFilter = newStatus;
    this.loadReservations(); // Volver a cargar las reservas con el nuevo filtro
  }
  
}
