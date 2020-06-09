import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-get-qr',
  templateUrl: './get-qr.component.html',
  styleUrls: ['./get-qr.component.css']
})
export class GetQrComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<GetQrComponent>
  ) { }

  ngOnInit() {
  }

}
