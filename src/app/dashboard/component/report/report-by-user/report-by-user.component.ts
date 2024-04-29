import { Component, OnInit  } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Router ,NavigationExtras} from '@angular/router';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../../auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserResponse ,__user,UserUpdateActive} from '../../../../auth/interface/auth-login.interface'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationsService } from '../../services/reservations.service';

import {typeMessage} from '../../../../auth/interface/message.interface'
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import {ExcelReportByUser,ReportByUser,ReportByUserResponse} from '../../interface/reservation.interface'

@Component({
  selector: 'app-report-by-user',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    ],
  templateUrl: './report-by-user.component.html',
  styleUrl: './report-by-user.component.css',
  providers: [AuthService,ReservationsService]
})
export class ReportByUserComponent implements OnInit {
public users: __user[] = [];
startTime?: string; // Aquí almacenarías el valor de inicio de tu formulario
endTime?: string; // Aquí almacenarías el valor de inicio de tu formulario
lista: ExcelReportByUser[]=[];
submitted=false;

public myForm: FormGroup = this.fb.group({
	    startDate: ['', Validators.required],
	    endDate: ['', Validators.required],
	    user: ['', Validators.required]
});

		constructor(
			private fb: FormBuilder,
		    private route: ActivatedRoute,
		    private router: Router,
		    private authService: AuthService,
		    private _snackBar: MatSnackBar,
		    private reservationsService: ReservationsService,
		    ) {}


		openSnackBar(message: string, action: string) {
		    this._snackBar.open(message, action, {
		      duration: 2000, // Duración en milisegundos
		      verticalPosition: 'top', // Posición vertical de la alerta
		      horizontalPosition: 'end', // Posición horizontal de la alerta
		      panelClass: ['green']
		    });
		    this.loadUsers();
		}

    ngOnInit(): void {
    	this.submitted=false;
	    this.route.queryParams.subscribe(params => {
	       const parametro = params['reload'];
	       const status = params['status'];
	       if(status){
	          this.openSnackBar(params['message'], 'Cerrar');
	       }
	       if(parametro){
	         this.loadUsers();
	       }
	    },error=>{
	      this.loadUsers();
	    });
    }

	  loadUsers():void{
	    this.authService.allUser().subscribe(({users}) => {
	        this.users = users
	       // console.log("aquii: ",this.users[0].direction?.address )
	        
	     }, error => {
	        console.error('Error en la solicitud :', error);
	        this.openSnackBar("Error en la solicitud", 'Cerrar');
	     });
	  }


    createReport():void{
    	this.submitted=true;
		    if(!this.myForm.valid) return;
				const startDate = this.myForm?.get('startDate')?.value;
				const endDate = this.myForm?.get('endDate')?.value;
				const user = this.myForm?.get('user')?.value;
				if(endDate < startDate){
					this.openSnackBar("la fecha de inicio no puede ser mayor a la fecha final", 'Cerrar');
				}
				this.reservationsService.reportByUser(user, startDate,endDate)
		        .subscribe(({res}) => {
		        	 //console.log(res.length)

			     	for (let i = 0; i < res.length; i++) {
					        const elemento = res[i];
					        this.lista[i] = {
					        	id:               res[i].id,
							    startDate:        res[i].startDate,
							    endDate:          res[i].endDate,
							    requerimiento:    res[i].requerimiento,
							    cantidad_persona: res[i].cantidad_persona,
							    descripcion:      res[i].descripcion,
							    state:            res[i].state,
							    user:             res[i].user.name,
							    salon:            res[i].salon.name,
							    direction:        res[i].user?.direction?.address?? ''
					        }
					}
		     	  	this.reservationsService.generarExcel(this.lista, `desde(${startDate}) hasta(${endDate})`);
		        },error=>{
		          console.log(error)
		        });
        

		    
    }
}


