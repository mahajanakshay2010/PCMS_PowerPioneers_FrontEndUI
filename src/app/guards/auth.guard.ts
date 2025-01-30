import { CanActivateFn } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate,Router,ActivatedRouteSnapshot,RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{
  constructor(private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
    const token = sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    if(!token){
      this.router.navigate(['/login']);
      return false;
    }

    if(route.data['role'] && route.data['role'] !== role){
      console.log("role: ",role,route.data);
      //this.router.navigate(['/login']);
      window.history.back();
      return false;
    }
    return true;
  }
}/*
export const authGuard: CanActivateFn = (route, state) => {
  return true;
};*/
