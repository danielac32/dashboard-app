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
public isLoggedIn: boolean = false;
	constructor(private formBuilder: FormBuilder,private authService: AuthService,private router: Router) {
		this.loginForm = this.formBuilder.group({
	      email: ['', [Validators.required, Validators.email]],
	      password: ['', [Validators.required, Validators.minLength(6)]]
	    });
	}
	ngOnInit(): void {
	     localStorage.setItem('accessToken','....');
	}

	onSubmit(): void {
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
	              
	              const parametros: NavigationExtras = {
		              queryParams: {
		                rol: this.authService.getRol(),
		                name: this.authService.getUserName()
		              }
		            };
	              this.router.navigate(['/nav'],parametros);
	          }

	       }, error => {
	          console.error('Error en la solicitud de inicio de sesión:', error);
	          alert('Error en la solicitud :');
	          if (error.status===401) {
	              alert("Contraseña incorrecta");
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