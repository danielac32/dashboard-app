import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,ParamMap ,NavigationExtras} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import {typeMessage} from '../../interface/message.interface'
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule/*,FormsModule*/} from '@angular/forms';

import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';

import { DirectionsService } from '../../../directions/directions.service';
import { DirectionResponse,Direction } from '../../../directions/directions.interface';
import  {UserUpdate} from '../../interface/auth-login.interface';
import  {UserProfile} from '../../interface/auth-login.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateUserComponent } from '../../components/update-user/update-user.component'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule
    ],
  providers: [AuthService],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  updateForm!: FormGroup;
  person: UserUpdate | null = null;
  view !:boolean;
  newUser !:UserUpdate;
  direction!:string;
  public directions?: Direction[] = []
submitted=false;

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private authService: AuthService,
      private directionsService: DirectionsService,
      private _snackBar: MatSnackBar,
      public dialog: MatDialog,
      ) {


  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Duración en milisegundos
      verticalPosition: 'top', // Posición vertical de la alerta
      horizontalPosition: 'end', // Posición horizontal de la alerta
      panelClass: ['green']
    });
  }


  ngOnInit(): void {
    this.submitted=false;
     this.person = this.authService.getUser()
     this.directionsService.findAll().subscribe(({ directions }) => {
     this.directions = directions;
        if(this.person){
           const direction = this.directions.find((direction:Direction) => direction.id === this.person?.directionId);
            if (direction) {
              this.direction = direction.address; // Suponiendo que 'address' es la propiedad que deseas asignar a 'this.direction'
            } else {
              console.log('No se encontró ninguna dirección con el ID proporcionado.');
              this.openSnackBar('No se encontró ninguna dirección con el ID proporcionado.', 'Cerrar');
            }
        }
        //\console.log("aquii: ",this.directions[0].address )
     }, error => {
        console.error('Error en la solicitud :', error);
        this.openSnackBar(error.error, 'Cerrar');
     });

  }

  createUser():void{
        const dialogRef = this.dialog.open(UpdateUserComponent, {
            width: '400px',
            height:'450px',
            data: {
              title: 'Actualizar Usuario',
              name:this.person?.name,
              email:this.person?.email,
              direccion:this.direction
            }
        });
        dialogRef.afterClosed().subscribe((respuesta:UserUpdate) => {
          //console.log('La respuesta recibida del diálogo es:', respuesta);
          if(respuesta!==undefined && this.person){
              //console.log('La respuesta recibida del diálogo es:', respuesta);
             this.newUser={
                  name:respuesta.name,
                  email:respuesta.email,
                  password:respuesta.password,
                  directionId:Number(respuesta.directionId),
             };
             this.authService.updateUser(this.person?.email,this.newUser).subscribe(response => {
                 console.log(response)
                 this.router.navigate(['auth/login']);
             }, error => {
                console.error('Error en la solicitud ', error);
                this.openSnackBar('Error al actualizar', 'Cerrar');
             });

          }else{

          }
        }, error => {
              this.openSnackBar('error recibiendo la respuesta del dialog', 'Cerrar');
              return;
        });

  }
}
