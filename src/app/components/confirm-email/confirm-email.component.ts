import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

successful: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private activatedRoute: ActivatedRoute,
  ) { }

ngOnInit(): void {
    const code = this.activatedRoute.snapshot.queryParams['oobCode'];
    this.afAuth.auth
      .applyActionCode(code)
      .then(() => {
      })
      .catch(err => {
      });
 }
}
