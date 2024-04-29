import { Component, OnInit ,ViewChild} from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Router ,NavigationExtras} from '@angular/router';
import { CommonModule } from '@angular/common';
//import { provideHttpClient } from '@angular/common/http';
//import { provideClientHydration } from '@angular/platform-browser';
//import { DataService } from '../shared/service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { UserResponse ,__user,UserUpdateActive} from '../../interface/auth-login.interface'
import {CreateUserFromDialog} from '../../interface/create-user.interface';
import {typeMessage} from '../../interface/message.interface'
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { EditComponent } from '../../components/edit/edit.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateUserComponent } from '../../components/create-user/create-user.component'


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    HttpClientModule,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatTooltipModule
    ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  providers: [AuthService]
})

export class UsersComponent implements OnInit {
public users: __user[] = [];
dataSource!: MatTableDataSource<__user>;
displayedColumns: string[] = ['name', 'email','rol' ,'isActive', 'address', 'actions'];
@ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
selectedValue: any;

constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
    ) {

}
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000, // Duración en milisegundos
      verticalPosition: 'top', // Posición vertical de la alerta
      horizontalPosition: 'end', // Posición horizontal de la alerta
      panelClass: ['green']
    });
    this.loadUsers();
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
  
  ngOnInit(): void {

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



    /*this.route.queryParams.subscribe(params => {
       const parametro = params['reload'];
       if(parametro==='true'){
         this.loadUsers();
       }
    });*/
    

    /*const dialogRef = this.dialog.open(EditComponent, {
      width: '300px',
      data: {
        title: 'Rol',
        items: ['ADMIN', 'USER'] // Tu lista de elementos
      }
    });

    dialogRef.afterClosed().subscribe((respuesta: string) => {
      console.log('La respuesta recibida del diálogo es:', respuesta);
      // Aquí puedes hacer lo que necesites con la respuesta
    });*/
  }


  loadUsers():void{
    this.authService.allUser().subscribe(({users}) => {
        this.users = users
       // console.log("aquii: ",this.users[0].direction?.address )
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
     }, error => {
        console.error('Error en la solicitud :', error);
        /*this.handleMessage('/nav/users',{
           status: 'error',
           message: 'Error cargando los usuarios',
           reload:true
        });*/
        this.openSnackBar("Error en la solicitud", 'Cerrar');
     });
  }

  createUser():void{
        const dialogRef = this.dialog.open(CreateUserComponent, {
            width: '500px',
            height:'500px',
            data: {
              title: 'Crear Usuario'
            }
        });
        dialogRef.afterClosed().subscribe((respuesta:CreateUserFromDialog) => {
          //console.log('La respuesta recibida del diálogo es:', respuesta);
            if(respuesta!==undefined){
                  this.authService.createUser({name:respuesta?.name,email:respuesta?.email,password:respuesta?.password,directionId:Number(respuesta?.selectedItem),rol:respuesta?.rol})
                  .subscribe(esponse => {
                    this.openSnackBar('Usuario Creado', 'Cerrar');
                    //this.loadUsers();
                  }, error => {
                     console.error('Error en la solicitud :', error.error);
                     this.openSnackBar(error.error, 'Cerrar');
                    //this.loadUsers();
                  });
            }else{
                console.error('salio del formulario');
                this.openSnackBar('No se creo el Usuario, salio del formulario', 'Cerrar');
            }
        }, error => {
              this.openSnackBar('error recibiendo la respuesta del dialog', 'Cerrar');
              //this.loadUsers();
        });
        //this.loadUsers();
  }

  editar(id?:string){
      if (id !== undefined) {
         const dialogRef = this.dialog.open(EditComponent, {
            width: '300px',
            
            data: {
              title: 'Rol',
              items: ['ADMIN', 'USER'] // Tu lista de elementos
            }
          });

          dialogRef.afterClosed().subscribe((respuesta: string) => {
            //console.log('La respuesta recibida del diálogo es:', respuesta);
              if(respuesta!==undefined){
                 this.authService.updateRol(id,respuesta).subscribe(response => {
                    this.openSnackBar('Rol cambiado', 'Cerrar');
                    //this.loadUsers();
                 }, error => {
                    console.error('Error en la solicitud :', error);
                    this.openSnackBar('No se actualizo el rol', 'Cerrar');
                    //this.loadUsers();
                 });
              }else{
                this.openSnackBar('Debe selecionar un rol', 'Cerrar');
                //this.loadUsers();
              }
          }, error => {
              this.openSnackBar('error recibiendo la respuesta del dialog', 'Cerrar');
              //this.loadUsers();
          });
      }else{
        this.openSnackBar('Ocurrio un error al acceder al usuario', 'Cerrar');
        //this.loadUsers();
      }
      //this.loadUsers();
      return;
  }

  eliminar(id?:string){
      if (id !== undefined) {
           this.authService.deleteUser(id).subscribe(response => {
              console.log("usuario eliminado ")
              this.openSnackBar("Usuario eliminado", 'Cerrar');
              //this.loadUsers();
           }, error => {
              console.error('Error en la solicitud :', error);
              this.openSnackBar("Error eliminando usuario", 'Cerrar');
              //this.loadUsers();
              //alert('Error en la solicitud :');
           });
      }else{
        this.openSnackBar('Ocurrio un error al acceder al usuario', 'Cerrar');
        //this.loadUsers();
      }   
      //this.loadUsers();
      return;
  }


  resetPass(id?:string){
    if (id !== undefined) {
          this.authService.resetPassword(id).subscribe(response => {
              console.log("clave cambiada ")
              this.openSnackBar("Clave cambiada", 'Cerrar');
              //this.loadUsers();
           }, error => {
              console.error('Error en la solicitud :', error);
              this.openSnackBar("Error cambiando contraseña", 'Cerrar');
              //this.loadUsers();
              //alert('Error en la solicitud :');
           });
    }else{
        this.openSnackBar('Ocurrio un error al acceder al usuario', 'Cerrar');
    }   
    //this.loadUsers();
    return;
  }


  activar(id?: string) {
    if (id !== undefined) {
      // Aquí puedes usar el ID como necesites
      console.log('ID a desactivar:', id);
      this.authService.updateUserActive(id,{isActive:true}).subscribe(response => {
         // console.log("aquii: ",this.users[0].direction?.address )
        //this.router.navigate(['/users']);
        //this.loadUsers();
         this.openSnackBar("Usuario activado", 'Cerrar');
      }, error => {
          console.error('Error en la solicitud :', error);
          this.openSnackBar("Error", 'Cerrar');
          //this.loadUsers();
      });
      // Llamar a una función o realizar cualquier otra acción con el ID
    } else {
      console.error('El ID es undefined');
      this.openSnackBar("Error", 'Cerrar');
      //this.loadUsers();
    }
  }

  desactivar(id?: string) {
    if (id !== undefined) {
      // Aquí puedes usar el ID como necesites
      console.log('ID a desactivar:', id);
      this.authService.updateUserActive(id,{isActive:false}).subscribe(response => {
         // console.log("aquii: ",this.users[0].direction?.address )
        //this.router.navigate(['/users']);
        //this.loadUsers();
         this.openSnackBar("Usuario desactivado", 'Cerrar');
      }, error => {
          console.error('Error en la solicitud :', error);
          this.openSnackBar("Error", 'Cerrar');
          //this.loadUsers();
      });
      // Llamar a una función o realizar cualquier otra acción con el ID
    } else {
      console.error('El ID es undefined');
      this.openSnackBar("Error", 'Cerrar');
      //this.loadUsers();
    }
  }
}

