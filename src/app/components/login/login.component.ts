import { AuthService } from './../../service/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GetQrComponent } from './../get-qr/get-qr.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public dialog: MatDialog,

    ) { }

  ngOnInit() {
  }

  openDialog(){
    this.dialog.open(GetQrComponent, {
      width: 'auto',
      height: 'auto'
    });
  }

}
