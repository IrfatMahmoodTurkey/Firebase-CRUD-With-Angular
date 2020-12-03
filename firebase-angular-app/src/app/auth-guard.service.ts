import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) { }

  canActivate(){
    let token = localStorage.getItem('userData');
    
    if(token){
      console.log('True');
      return true;
    }
    else{
      console.log('false');
      this.router.navigate(['login'])
      return false;
    }
  }
}
