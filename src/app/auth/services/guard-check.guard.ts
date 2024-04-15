
import { Injectable } from '@angular/core';
import { CanActivate, Router ,RouterStateSnapshot,ActivatedRoute,ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class guardCheckGuard implements CanActivate {

rol?:string;

  constructor(/*private route: ActivatedRoute,*/private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    // Verificar si el usuario está autenticado
    //console.log("guard: ",next.snapshot.data);
 
    const data = next.data; // Obtener toda la data
    const rol = data['rol'] as string[];
    //console.log("rol necesario: ",data[0]);
    this.rol=this.authService.getRol();

    if (this.authService.isLoggedIn()) {
      // console.log("rol: ",this.rol);
      if (rol && this.rol && rol.length > 0 && !rol.includes(this.rol)) {
         alert("no puede entrar aqui")
         this.router.navigate(['/auth/login']);
         return false;
      }
      return true; // Permitir la navegación
    } else {
      // Si el usuario no está autenticado, redirigir al componente de inicio de sesión
      this.router.navigate(['/auth/login']);
      return false; // No permitir la navegación
    }
  }
}
