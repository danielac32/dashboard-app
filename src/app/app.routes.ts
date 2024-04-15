import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { UsersComponent } from './auth/pages/users/users.component'
import {ProfileComponent} from './auth/pages/profile/profile.component'
import { AuthGuard } from './auth/services/auth.guard';
import { EditComponent } from './auth/components/edit/edit.component';
import { AuthLayoutComponent } from './auth/layout/auth-layout.component'
import { NavigationComponent } from './dashboard/navigation/navigation.component';
import { IndexReservationsComponent } from './dashboard/component/index-reservations/index-reservations.component'
import { CreateReservationsComponent } from './dashboard/component/create-reservations/create-reservations.component'
import { ReservationScreenComponent } from './dashboard/component/reservation-screen/reservation-screen.component'



export const routes: Routes = [

{ 
    path: 'auth', component: AuthLayoutComponent, 
    children: [
        {
            path: 'login',
            title: 'login',
            // loadComponent: () => import('./dashboard/pages/reservations-page/reservations-page.component'),
            component: LoginComponent
        },
    ]
}, 
{ path: 'nav', component: NavigationComponent,canActivate: [AuthGuard],  
  children: [
        {
            path: 'reservations',
            title: 'reservations',
            // loadComponent: () => import('./dashboard/pages/reservations-page/reservations-page.component'),
            component: IndexReservationsComponent
        },
        {
            path: 'create-reservation',
            title: 'create-reservation',
            component: CreateReservationsComponent,
        },
        {
            path: 'reservation/:id',
            title: 'reservation',
            component: ReservationScreenComponent,
        },
        {
            path: 'users',
            title: 'users',
            component: UsersComponent,
        },
        {
            path: 'user',
            title: 'user',
            component: ProfileComponent,
        },
        
  ]

},

{ path: '', redirectTo: 'auth/login', pathMatch: 'full' }



];
