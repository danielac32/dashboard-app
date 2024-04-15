import { Injectable } from '@angular/core';
import { CanActivate, Router ,ActivatedRoute,ActivatedRouteSnapshot} from '@angular/router';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  rol?:string;

  constructor(/*private route: ActivatedRoute,*/private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot): boolean {
    // Verificar si el usuario está autenticado
    //console.log("guard: ",next.snapshot.data);
 
    const data = next.data; // Obtener toda la data
    const rol = data['rol'] as string[];

    this.rol=this.authService.getRol();

    if (this.authService.isLoggedIn()) {
      if (rol && this.rol && rol.length > 0 && !rol.includes(this.rol)) {
         alert("no puede entrar aqui")
         this.router.navigate(['/login']);
         return false;
      }
      return true; // Permitir la navegación
    } else {
      // Si el usuario no está autenticado, redirigir al componente de inicio de sesión
      this.router.navigate(['/login']);
      return false; // No permitir la navegación
    }
  }
}
