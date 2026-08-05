import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import {MatStepper, MatStepperModule} from '@angular/material/stepper';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { SnackbarService } from '../../core/services/snackbar.service';
import {MatCheckboxChange, MatCheckboxModule} from '@angular/material/checkbox';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

import { CurrencyPipe, JsonPipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';



@Component({
  selector: 'app-checkoutcomponent',
  imports:[
    MatStepperModule,
    MatButton,
    RouterLink,
    MatCheckboxModule,
    CurrencyPipe,
    JsonPipe,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkoutcomponent.html',
  styleUrl: './checkoutcomponent.scss',
})
export class Checkoutcomponent {}
