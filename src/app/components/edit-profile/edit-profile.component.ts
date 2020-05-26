import { User } from './../../models/user';
import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  userId = '';
  imgSrc: any;
  uploadedPic: boolean;
  selectedImage: any = null;
  isSubmitted: boolean;
  name: string;
  image: File;
  direccion: string;
  telefono: string;

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
    private activatedRoute: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.userId = params.get('id');
      if(this.userId){
        this.getData(this.userId);
      }
    });
  }

  getData(id) {
    this.authService.getProfileId(id).valueChanges().subscribe(
      res => {
        this.editProfile(res);
      }, err => {
        console.log(err);
      });
  }


  editProfile(res) {
this.imgSrc = res.image;
this.formTemplate.patchValue({
  name: res.name,
  direccion: res.direccion,
  telefono: res.telefono,
  });
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

onSubmitEdit(profileTemplate: User){
  if(this.selectedImage === null) {
    profileTemplate.image = this.imgSrc;
    this.authService.updateProfile(this.formTemplate.value);
  } else if (this.selectedImage !== null) {
    const filePath = `${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          profileTemplate['image'] = url;
          this.authService.updateProfile(this.formTemplate.value);
        });
      })
    ).subscribe();
  } else {
    console.log('something went wrong');
  }
}

navigateBack(){
  this.router.navigate(['/mydashboard']);
}

get formsControls() {
  return this.formTemplate['controls'];
}
}
