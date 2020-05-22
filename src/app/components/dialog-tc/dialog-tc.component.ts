import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-dialog-tc',
  templateUrl: './dialog-tc.component.html',
  styleUrls: ['./dialog-tc.component.css']
})
export class DialogTcComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DialogTcComponent>,
  ) { }

  ngOnInit() {

  }

}
