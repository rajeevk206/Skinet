import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  standalone: true,
  imports: [
    MatCard
  ],
  templateUrl: './server-error.html',
  styleUrl: './server-error.scss',
})
export class ServerError {
  error?: any;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    this.error = navigation?.extras.state?.['error'];
  }
}
