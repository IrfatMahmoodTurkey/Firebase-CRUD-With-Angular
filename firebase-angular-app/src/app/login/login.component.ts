import { Component, OnInit } from '@angular/core';
import{FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formData:any;
  provider:any = new firebase.auth.GoogleAuthProvider();
  constructor(private router: Router,private route: ActivatedRoute) {
    this.formData = new FormGroup({
      email: new FormControl('info@email.com', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      accountType:new FormControl('New', [Validators.required])
    });

    this.provider = new firebase.auth.GoogleAuthProvider();
  }

  ngOnInit(): void {
  }

  // email signIn
  signIn(credentials:any){
    if (credentials.accountType == 'New') {
      // add user
      firebase.auth().createUserWithEmailAndPassword(credentials.email, credentials.password)
        .then((user) => {
          var returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
          this.router.navigate([returnUrl]);
          localStorage.setItem('userData', JSON.stringify(user));
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          // ..
          console.log(errorMessage);
        });
    }
    else {
      // existing user
      firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password)
        .then((user) => {
          var returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
          this.router.navigate([returnUrl]);
          localStorage.setItem('userData', JSON.stringify(user.user));
        })
        .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;

          console.log(errorMessage);
        });
    }
  }

  //google sign in
  googleSignIn() {
    firebase.auth().signInWithPopup(this.provider).then((result)=> {
      if (result) {
        console.log(result.user);
        var user = result.user;
        var returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
        this.router.navigate([returnUrl]);
        localStorage.setItem('userData', JSON.stringify(user));
      }
    }).catch( (error)=> {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log(error);
    });
  }
}
