import { User } from './../../models/user';
import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireObject } from 'angularfire2/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-establecimiento',
  templateUrl: './establecimiento.component.html',
  styleUrls: ['./establecimiento.component.css']
})
export class EstablecimientoComponent implements OnInit {
  ProfileDetailList: AngularFireObject<User>;
  imgSrc: any = './assets/images/logo.png';
  uploadedPic: boolean;
  selectedImage: any = null;
  isSubmitted: boolean;

  formTemplate = new FormGroup({
    name: new FormControl('', Validators.required),
    direccion: new FormControl('', Validators.required),
    telefono: new FormControl('', Validators.required),
    image: new FormControl('')
  });

  constructor(
    public authService: AuthService,
    private storage: AngularFireStorage,
    private router: Router,
  ) {

   }

  ngOnInit() {
  }


  showPreview(event){
    if(event.target.files && event.target.files[0]){
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (e: any) => {
        this.imgSrc = e.target.result;
        this.uploadedPic = true;
      }
      this.selectedImage = event.target.files[0];
    } else {
      this.selectedImage = null;
    }
  }

  onSubmit(formTemplate: any): void {
    this.isSubmitted = true;
    if(this.uploadedPic === true){
    if (this.formTemplate.valid) {
      const filePath = `${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              formTemplate['image'] = url;
              this.authService.updateProfile(this.formTemplate.value);
              this.router.navigate(['/mydashboard']);
            });
          })
        ).subscribe();
      } else {
        console.log('formTemplate is not valid');
      }
    } else {
    }
  }

get formsControls() {
  return this.formTemplate['controls'];
}

}
