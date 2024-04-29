import { Component, OnInit,Inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router,NavigationExtras } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { DirectionsService } from '../../../directions/directions.service';
import { User,CreateUser } from '../../interface/create-user.interface';

import { Direction } from '../../../directions/directions.interface';
import { DirectionResponse } from '../../../directions/directions.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 import { NgModule } from '@angular/core';

 import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { MatCardModule } from '@angular/material/card';





@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    HttpClientModule,
    MatCardModule

    ],
  providers: [AuthService,DirectionsService],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent  implements OnInit {
 constructor(
    private fb: FormBuilder,
    private directionsService: DirectionsService,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  public directions?: Direction[] = []


  public myForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    selectedItem: ["", [Validators.required]],
    rol: ['', Validators.required],
  });
  submitted=false;

  ngOnInit(): void {
     this.submitted=false;
     this.directionsService.findAll().subscribe(({ directions }) => {
        this.directions = directions;
     }, error => {
        console.error('Error en la solicitud :', error);
        alert('Error en la solicitud :');
     });


  }


  onSubmit():void{
    this.submitted=true;
      if(!this.myForm.valid) return;
      const { name, email, password, selectedItem,rol} = this.myForm.value;
      /*const { name, email, password, selectedItem,rol} = this.myForm.value;
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('Selected item:', selectedItem);
      console.log('Rol:', rol);
      this.authService.createUser({
                                                  name,
                                                  email,
                                                  password,
                                                  directionId:Number(selectedItem),
                                                  rol
                                              })
      .subscribe(esponse => {
          const parametros: NavigationExtras = {
          queryParams: {
            status: 'ok',
            message: 'Usuario Creado'
          }
        };
        this.router.navigate(['/dashboard'],parametros);
      }, error => {
          console.error('Error en la solicitud :', error);
          alert('Error en la solicitud :');
      });*/

      this.dialogRef.close({ name, email, password, selectedItem,rol});

  }
}
