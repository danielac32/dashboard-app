import { Component,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule/*,FormsModule*/} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router ,NavigationExtras} from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule,CommonModule,
  	MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService]

})
export class LoginComponent implements OnInit {
loginForm: FormGroup;
submitted=false;

public isLoggedIn: boolean = false;
	constructor(private _snackBar: MatSnackBar,private formBuilder: FormBuilder,private authService: AuthService,private router: Router) {
		this.loginForm = this.formBuilder.group({
	      email: ['', [Validators.required, Validators.email]],
	      password: ['', [Validators.required, Validators.minLength(6)]]
	    });
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
	     localStorage.setItem('accessToken','....');
	}

	onSubmit(): void {
		this.submitted=true;
		if(this.loginForm.valid) {
	       const email = this.loginForm.get('email')!.value;
	       const password = this.loginForm.get('password')!.value;
	       //console.log(email,password);
	       this.authService.login(email, password).subscribe(response => {
	          //console.log('Respuesta del servidor:', response.user);

	          console.log("aqui   ",response.status)
	          if (response.status===200) {
	              if(response.user.isActive === false){
	                 console.log("el usuario esta desactivado");
	                 alert("El usuario esta desactivado");
	                 return;
	              }
	              //console.log(response.user);
	              localStorage.setItem('accessToken', response.token);
	              localStorage.setItem('userCurrent', JSON.stringify(response.user));
	              console.log("active   ",response.user.isActive)
	              if(this.authService.isAdmin()){
	              	console.log("admin dashboard")
	              }else{
	              	console.log("dashboard")
	              }
	              
	              /*const parametros: NavigationExtras = {
		              queryParams: {
		                rol: this.authService.getRol(),
		                name: this.authService.getUserName()
		              }
		            };*/
	              this.router.navigate(['/nav']/*,parametros*/);
	          }

	       }, error => {
	          console.error('Error en la solicitud de inicio de sesión:', error);
	          console.log('Error en la solicitud :',error);
	          console.log(error.status)
	          if (error.status===401) {
	          	  this.openSnackBar("El usuario no existe", 'Cerrar');
	          	  return;
	             // alert("Contraseña incorrecta");
	          }
	          //alert('Inicio de sesión fallido. Por favor, verifica tu correo electrónico y contraseña.');
	          // Aquí puedes manejar los errores, como mostrar un mensaje de error al usuario
	       });
       }else return;
	}
	onClick():void {
      console.log("aqui")
  }


}
