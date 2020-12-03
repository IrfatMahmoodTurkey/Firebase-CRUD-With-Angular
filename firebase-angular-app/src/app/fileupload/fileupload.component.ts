import { Component, OnInit } from '@angular/core';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrls: ['./fileupload.component.css']
})
export class FileuploadComponent implements OnInit {
  file: any;
  imgURL: any;
  storageRef: any;
  progressRange: any = 0;
  fileUploadOperationState: boolean = false;
  
  constructor() {
    this.storageRef = firebase.storage().ref();
  }

  ngOnInit(): void {
  }

  uploadFile(files: any) {
    this.file = files[0];

    var reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (event) => {
      this.imgURL = reader.result;
    }
    console.log(this.file);
  }

  upload() {
    // Create file metadata including the content type
    var metadata = {
      contentType: 'image/jpeg',
    };

    // Upload the file and metadata
    var uploadTask = this.storageRef.child('images/'+this.file.name).put(this.file, metadata);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', (snapshot:any) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.fileUploadOperationState = true;
      this.progressRange = ~~progress;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, (error:any) => {
      // Handle unsuccessful uploads
    }, () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL:any) => {
        console.log('File available at', downloadURL);
        this.fileUploadOperationState = false;
      });
    });
  }
}
