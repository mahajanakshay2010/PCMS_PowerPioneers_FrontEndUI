import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/userservice/user-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { CustomSnackbarComponent } from '../custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  showProfileIcon: boolean = true;
  dropdownVisible: boolean = false;
  userName: string | null = '';
  showLogoutDialog: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => { this.checkRoute(); });
    this.checkRoute();
  }

  checkRoute(): void {
    const currRoute = this.router.url;
    this.showProfileIcon = !(currRoute.includes('login') || currRoute.includes('register'));
  }

  toggleDropdown(): void {
    this.userName = sessionStorage.getItem('userName');
    this.dropdownVisible = !this.dropdownVisible;
  }

  openLogoutDialog(): void {
    this.showLogoutDialog = true;
    this.dropdownVisible = false;
  }

  closeLogoutDialog(): void {
    this.showLogoutDialog = false;
  }

  confirmLogout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('role');
    this.router.navigate(['/login']);
    this.snackbar.openFromComponent(CustomSnackbarComponent, {
      data: {
        message: `Logged out Successfully!`,
        action: 'X',
        icon: 'check_circle',
        iconColor: 'green'
      },
      duration: 3000
    });
    this.closeLogoutDialog();
  }
}
