import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogTcComponent } from 'src/app/components/dialog-tc/dialog-tc.component';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  isSubmitted: boolean;
  userSignUp = new FormGroup ({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    cb: new FormControl('', Validators.required)
   })


  constructor(
    private authService: AuthService,
    public dialog: MatDialog,

  ) { }

  ngOnInit() {
  }

  onSubmit(userSignUp){
    this.isSubmitted = true;
    if (this.userSignUp.valid){
      this.authService.signUp(this.userSignUp.value);
    }
  }

openDialog(){
  this.dialog.open(DialogTcComponent, {
    width: 'auto',
    height: 'auto'
  });
}

get formsControls(){
  return this.userSignUp['controls'];
}

}
