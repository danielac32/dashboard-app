import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { UsersComponent } from './auth/pages/users/users.component'
import {ProfileComponent} from './auth/pages/profile/profile.component'
import { AuthGuard } from './auth/services/auth.guard';
import { guardCheckGuard } from './auth/services/guard-check.guard';
import { EditComponent } from './auth/components/edit/edit.component';
import { AuthLayoutComponent } from './auth/layout/auth-layout.component'
import { NavigationComponent } from './dashboard/navigation/navigation.component';
import { IndexReservationsComponent } from './dashboard/component/index-reservations/index-reservations.component'
import { CreateReservationsComponent } from './dashboard/component/create-reservations/create-reservations.component'
import { ReservationScreenComponent } from './dashboard/component/reservation-screen/reservation-screen.component'
import { ReportBySalonComponent } from './dashboard/component/report/report-by-salon/report-by-salon.component'
import { ReportByUserComponent } from './dashboard/component/report/report-by-user/report-by-user.component'

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
            component: IndexReservationsComponent,
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
            component: UsersComponent,data: { rol:'ADMIN' },canActivate:[guardCheckGuard],
        },
        {
            path: 'user',
            title: 'user',
            component: ProfileComponent,
        },
        {
            path: 'ReportBySalon',
            title: 'report',
            component: ReportBySalonComponent,data: { rol:'ADMIN' },canActivate:[guardCheckGuard],
        },
        {
            path: 'ReportByUser',
            title: 'report',
            component: ReportByUserComponent,data: { rol:'ADMIN' },canActivate:[guardCheckGuard],
        },
  ]

},

{ path: '', redirectTo: 'auth/login', pathMatch: 'full' }



];
