import { Component, OnInit } from '@angular/core';
import { Reservation,ReservationUser,ReservationWithUser } from '../interface/reservation.interface';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../services/reservations.service';
import { HttpClientModule } from '@angular/common/http';
import { ReservationCardComponent } from '../reservation-card/reservation-card.component';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute,Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card'; // Importa MatCardModule


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
    MatTooltipModule,
    MatCardModule
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
  public limit: number = 5;
  public limitOptions: number[] = [5, 10, 15, 25, 50];
  public page: number = 1;
  public total?:number;
  public metaPage?: number;
  public metaLastPage?: number;

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
         //console.log("reload: ",parametro)
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

    //console.log("load ",this.rol)
    if(this.rol=== 'ADMIN') {
       this.reservationsService.allReservations(this.statusFilter, this.limit, this.page)
        .subscribe(({ reservations , meta }) => (
          this.reservations = reservations,
          this.metaLastPage = meta.lastPage,
          this.page = meta.page,
          this.total=meta.total
        ));
        console.log("load reservations")
        console.log("limit: ",this.limit)
        console.log("page: ",this.page)
        console.log("last page: ",this.metaLastPage)
        console.log("total: ",this.total)

      return;
    }

    this.reservationsService.allReservationByUser(this.emailUser, this.statusFilter, this.limit, this.page)
    .subscribe(({reservations, meta}) => (
      this.reservations = reservations,
      this.metaLastPage = meta.lastPage,
      this.page = meta.page,
      this.total=meta.total
    )); 

    console.log("load reservations")
    console.log("limit: ",this.limit)
    console.log("page: ",this.page)
    console.log("last page: ",this.metaLastPage)
    console.log("total: ",this.total)
  }

  // Método para cambiar el filtro de estado
  changeStatusFilter(newStatus: string): void {
    this.statusFilter = newStatus;
    this.loadReservations(); // Volver a cargar las reservas con el nuevo filtro
  }

  backReservations() {
    if(this.page <= 1) return;
    this.page--;
    this.loadReservations()
  }
  
  otherReservations() {
    if(this.page === this.metaLastPage) return;
    this.page++
    this.loadReservations();
  }

  changeLimit(event: any) {
    const value = event.target.value;
    this.limit = +value;
    this.loadReservations();
    // this.limit = value;
  }
}
