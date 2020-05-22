import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-resend-email',
  templateUrl: './resend-email.component.html',
  styleUrls: ['./resend-email.component.css']
})



export class ResendEmailComponent implements OnInit {

  isClicked: boolean;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  resend(){
    this.isClicked = true;
    this.authService.SendVerificationMail();
  }

  disconnect(){
    this.authService.SignOut();
  }

}
