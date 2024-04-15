import { Component, OnInit,Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
//import { DirectionsService } from '../../../directions/directions.service';
import  {UserUpdate,UserProfile,UserResponse} from '../../interface/auth-login.interface';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';

import { DirectionResponse } from '../../../directions/directions.interface';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 import { NgModule } from '@angular/core';

 import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    MatCardModule],
  providers: [AuthService],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {
  selectedItem: any;
  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              public dialogRef: MatDialogRef<EditComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any
              ) {}

  idUser?:string;

  public updateForm: FormGroup = this.fb.group({
    rol: ["", Validators.required]
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const parametro = params['parametro'];
      if(params['parametro2']==='delete'){
         console.log("eliminar: ",parametro)

      }
      this.idUser=parametro;
      //console.log('Parámetro recibido:', parametro);
    });
  }
  


  onAceptar(): void {
    this.dialogRef.close(this.selectedItem);
  }

  onCancelar(): void {
    this.dialogRef.close(); // No necesitas pasar ningún valor de vuelta al cerrar el diálogo
  }

  onSubmit(): void {
        if(this.updateForm.valid && this.idUser !== undefined){
           const rol = this.updateForm.get('rol')!.value;
           

           console.log("editar: ",rol)
           this.authService.updateRol(this.idUser,rol).subscribe(response => {

           }, error => {
              console.error('Error en la solicitud :', error);
              alert('Error en la solicitud :');
           });

           this.router.navigate(['/dashboard/users'],{ queryParams: { reload: true } });
        }
  }

  handleClick() {
     this.router.navigate(['/dashboard/users'],{ queryParams: { reload: true } });
  }
}

