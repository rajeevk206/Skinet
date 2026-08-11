import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [
    MatIcon,
    MatButton,
    RouterLink
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {}
