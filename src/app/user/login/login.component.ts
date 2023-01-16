import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showAlert = false
  alertColor = 'blue'
  alertMsg = "Please wait! Logging in"
  inSubmission = false
  credentials = {
    email: '',
    password: ''
  }
  constructor(private auth: AngularFireAuth ) { }

  ngOnInit(): void {

  }

  async submitLogin(){
    this.inSubmission = true
    this.showAlert = true
    try{
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password)
      
      this.alertColor = 'green'
      this.alertMsg ="Logged in"
      this.showAlert = true
      this.inSubmission = false
    }catch(e){
      this.alertColor = 'red'
      this.alertMsg ="Unexpected error occured"
      this.showAlert = true
      this.inSubmission = false
    }
  }

}
