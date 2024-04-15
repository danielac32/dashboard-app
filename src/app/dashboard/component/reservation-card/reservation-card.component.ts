import { Component, Input ,OnInit} from '@angular/core';
import { RouterLink,NavigationExtras } from '@angular/router';
import { Reservation,ReservationUser } from '../interface/reservation.interface';
import { CommonModule } from '@angular/common';
import { ReservationsService } from '../services/reservations.service';
import { ActivatedRoute, Router,ParamMap } from '@angular/router';
import { MatCardModule } from '@angular/material/card'; // Importa MatCardModule
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import {typeMessage} from '../../../auth/interface/message.interface'



@Component({
  selector: 'app-reservation-card',
  standalone: true,
  imports: [RouterLink, CommonModule,MatCardModule,MatTooltipModule,MatIconModule],
  providers: [ReservationsService],
  templateUrl: './reservation-card.component.html',
  styleUrl: './reservation-card.component.css'
})
export class ReservationCardComponent implements OnInit {

    @Input() public reservation?: ReservationUser;//Reservation;
    currentDate: Date = new Date();
    startDate?:Date;
    endDate?:Date;

    constructor(
    private reservationsService: ReservationsService,
    private router: Router,
  ) {}


    ngOnInit(): void {
      if(this.reservation){
        this.startDate=new Date(this.reservation?.startDate);
        this.endDate=new Date(this.reservation?.endDate);
        this.startDate?.setHours(this.startDate.getHours() + 4);
        this.endDate?.setHours(this.endDate.getHours() + 4);
      }
    }
    

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


    

    

}

