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
  selector: 'app-update-user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    HttpClientModule,
    MatCardModule

    ],
  providers: [AuthService,DirectionsService],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent implements OnInit {
constructor(
    private fb: FormBuilder,
    private directionsService: DirectionsService,
    private router: Router,
    private authService: AuthService,
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  public directions?: Direction[] = []
  submitted=false;

  public myForm: FormGroup = this.fb.group({
    name: [this.data.name, Validators.required],
    email: [this.data.email, Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required, Validators.minLength(6)]],
    directionId: ["", [Validators.required]],
  });


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
      const { name, email, password,password2, directionId} = this.myForm.value;
      this.dialogRef.close({ name, email, password, directionId});
  }
}
