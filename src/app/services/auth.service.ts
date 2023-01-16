import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import IUser from '../models/user.model';
import { Observable, of } from 'rxjs'
import { map, delay, filter, switchMap } from 'rxjs/operators'
import { Router } from '@angular/router';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { off } from 'process';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>
  public isAuthenticated$: Observable<boolean> | undefined
  public isAuthenticatedWithDelay$: Observable<boolean> |  undefined
  private redirect =  false

  constructor(
    private auth:AngularFireAuth, 
    private db: AngularFirestore, 
    private router: Router,
    private route: ActivatedRoute) { 

    this.usersCollection = db.collection('users')

    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    )

    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )
    
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe(data => {
      this.redirect = data.authOnly ?? false
    })

  }

  public async createUser(userData: IUser){
    if(!userData.password) {
      throw new Error("Password not provided!")
    }

    const userCred = await this.auth.createUserWithEmailAndPassword( userData.email as string, userData.password as string)
    
    if(!userCred.user){
      throw new Error("User cant be found!")
    }

    await this.usersCollection.doc(userCred.user?.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phone_number:  userData.phone_number
    })

    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }

  public async logout(e?: Event){
    if(e){
      e.preventDefault()
    }
    await this.auth.signOut()
    if(this.redirect){
      await this.router.navigateByUrl('/')
    }
  }
}
