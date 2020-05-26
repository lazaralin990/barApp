import { User } from './../models/user';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { database } from 'firebase/app';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any; //Save logged in user data
  isLoggedIn: boolean;
  userId: string;
  userEmail: string;
  isVerified: boolean;
  profileObj: AngularFireObject<User>;
  name: string;
  direccion: string;
  telefono: string;
  image: File;


  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone, //NgZone to remove outside scope warning
    public af: AngularFireDatabase

  ) {

      /* Saving user data in localstorage when
      logged in and setting up null when logged out */
      this.afAuth.authState.subscribe(user => {
        if(user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user'));
        } else {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
        }
      });
   }

   getAuth() {
    return this.afAuth.auth;
  }

  signUp(signUpForm){
    return this.afAuth.auth.createUserWithEmailAndPassword(signUpForm.email, signUpForm.password)
      .then((result) => {
        this.SendVerificationMail();
        const message = `Acabamos de enviar un email con el link de activación. Verifica tu bandeja de entrada y Spam`;
        alert(message);
        this.setUserData(result);
        this.router.navigate(['login']);
      }).catch((error) => {
        const errorCode = error.code;
        if(errorCode === 'auth/invalid-email'){
          alert('El correo electronico no es válido');
        } else if(errorCode === 'auth/weak-password'){
          alert('La contraseña no es suficientemente segura');
        } else if(errorCode === 'auth/email-already-in-use') {
          alert('Ya hay alguien registrado con este correo electronico');
        } else if(errorCode === 'auth/operation-not-allowed'){
          alert('Algo ha ido mal. Contacta con team@ritadivision.com');
        } else {
          alert('Algo ha ido mal. Intentalo de nuevo mas tarde');
        }
      });
  }


  setUserData(result){
    database().ref('users/' + result.user.uid).set({
      uid: result.user.uid,
      email: result.user.email
    });
  }

  SendVerificationMail(){
    return this.afAuth.auth.currentUser.sendEmailVerification();
  }


  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(
      email,
      {url: 'http://localhost:4200/userMgmt'}
    );
  }


  SignIn(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
     .then((result) => {
      firebase.auth().currentUser.reload();
      if (result.user.emailVerified === true){
          this.isLoggedIn = true;
          this.ngZone.run(() => {
          this.userId = result.user.uid;
          this.userEmail = result.user.email;
          this.isVerified = result.user.emailVerified;
          this.getProfile(this.userId);
          });
        } else {
          this.router.navigate(['resend']);
      }
      })
      .catch((error) => {
        const errorCode = error.code;
        if(errorCode === 'auth/invalid-email'){
          alert('El correo electronico no es válido!');
        } else if(errorCode === 'auth/wrong-password') {
          alert('La contraseña es incorrecta!');
        } else if(errorCode === 'auth/user-not-found') {
          alert('No hay ningún usuario con este correo electronico o la cuenta ha sido eliminada');
        } else if(errorCode === 'auth/user-disabled'){
          alert('Esta cuenta ha sido suspendida. Para reactivarla, contacte team@ritadivision.com')
        } else {
          alert('Algo ha ido mal. Intentalo de nuevo mas tarde');
        }
      });
  }


  editMyProfile() {
    this.router.navigate(['editar/', this.userId]);
  }

  deleteProfile(){
    const profile = firebase.auth().currentUser;
    profile.delete();
    this.SignOut();
    return this.profileObj.remove();
  }


  getProfile(id: string) {
      this.profileObj = this.af.object('users/' + id);
      this.profileObj.snapshotChanges().subscribe(action => {
        this.name = action.payload.val().name;
        if (this.name != null ) {
          this.router.navigate(['mydashboard']);
        } else {
          this.router.navigate(['establecimiento']);
        }
  });
      return this.profileObj;
  }


  getProfileForMyDashboard() {
    this.profileObj = this.af.object('users/' + this.userId);
    return this.profileObj.snapshotChanges();
  }

  getProfileRestaurant(id) {
    this.profileObj = this.af.object('users/' + id);
    return this.profileObj.snapshotChanges();
  }

  getProfileId(id: string){
    this.profileObj = this.af.object('users/' + id);
    return this.profileObj;
  }



updateProfile(profile: User) {
  this.profileObj.update({
    name: profile.name,
    direccion: profile.direccion,
    telefono: profile.telefono,
    image: profile.image
  });
  this.router.navigate(['mydashboard'])
  .catch(error => {
    this.errorMgmt(error);
  });
}

SignOut(){
  return this.afAuth.auth.signOut().then(() => {
    localStorage.removeItem('user');
    this.isLoggedIn = false;
    this.name = null;
    this.direccion = null;
    this.router.navigate(['login']);
    });
  }

private errorMgmt(error) {
  console.log(error);
}
}
