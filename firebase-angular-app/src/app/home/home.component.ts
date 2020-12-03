import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userData:any;
  userForm:any;
  userList:any = [];
  dataFound:boolean = false;

  constructor(private router: Router,private route: ActivatedRoute) {
    this.userForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getData();
    var localStorageData = localStorage.getItem('userData');
    this.userData = JSON.parse(localStorageData != null ? localStorageData: '');
    console.log(this.userData);
  }

  logout(){
    firebase.auth().signOut().then(()=> {
      localStorage.removeItem('userData');
      var returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/login';
      this.router.navigate([returnUrl]);
    }).catch((error)=> {
      // An error happened.
      console.log(error);
    });
  }

  writeUserData(userValue: any) {
    if(userValue.id == ''){
      firebase.database().ref('users/' + this.newGuid()).set({
        username: userValue.name,
        email: userValue.email,
        phone: userValue.phone
      });
    }
    else{
      firebase.database().ref('users/' + userValue.id).update({
        username: userValue.name,
        email: userValue.email,
        phone: userValue.phone
      });
    }
  }

  initForm(id:any, name:any, email:any, phone:any){
    this.userForm = new FormGroup({
      id: new FormControl(id, [Validators.required]),
      name: new FormControl(name, [Validators.required]),
      email: new FormControl(email, [Validators.required]),
      phone: new FormControl(phone, [Validators.required]),
    });
  }

  getData() {
    return firebase.database().ref('/users').on('value', (snapshot) => {
      this.userList = [];
      snapshot.forEach((childSnapshot) => {
        var json = {
          'key': childSnapshot.key,
          'username': childSnapshot.val().username,
          'email': childSnapshot.val().email,
          'phone': childSnapshot.val().phone,
        }

        this.userList.push(json);
      });

      this.dataFound = true;
    });
  }

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  update_initialize(key:string, username:string, email:string, phone:string){
    // console.log(key+' '+username+' '+email+' '+phone);
    this.initForm(key, username, email, phone);
  }

  reset_form(){
    this.userForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required]),
    });
  }

  delete(key:string){
    firebase.database().ref('users/' + key).remove();
  }
}
