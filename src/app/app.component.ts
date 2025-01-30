import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  showNavbar: boolean = true;
  title = 'PCMS-1';
  constructor(private router: Router){}
  ngOnInit(): void {
    this.router.events.subscribe((event)=>{
      const currentRoute = this.router.url;
      this.showNavbar = !(currentRoute.includes('/login') || currentRoute.includes('/register') || currentRoute.includes('/search-plan') || currentRoute.includes('/usage-Details'));
    });
  }
}
