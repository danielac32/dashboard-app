import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { ReservationCardComponent } from '../component/reservation-card/reservation-card.component'
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    CommonModule,
    RouterModule,
    HttpClientModule,
    RouterLink,
    RouterOutlet,
    ReservationCardComponent,
    MatTooltipModule
  ],
  providers: [AuthService]
})
export class NavigationComponent implements OnInit {
  isHandset$: Observable<boolean>;
  user?:string;
  rol?:string;
  admin?:boolean;
  constructor(private breakpointObserver: BreakpointObserver,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );
  }
  
 
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      //this.rol = params['rol'];
      //this.user = params['name'];
    });
    this.user=this.authService.getUserName()
    this.admin=this.authService.isAdmin();
  }

  logout(): void {
      this.authService.logout();
      this.router.navigate(['/auth/login']);
    }


}
