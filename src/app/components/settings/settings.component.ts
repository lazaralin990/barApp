import { AuthService } from './../../service/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  navigateBack(){
    this.router.navigate(['/mydashboard']);
  }

  onDeleteAccount(){
    if (confirm('¿Estas seguro de borrar tu cuenta? Todos tus datos y productos creados se perderán para siempre.')) {
      this.authService.deleteProfile();
    }
  }
}
