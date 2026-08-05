import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import 'zone.js';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptor/error-interceptor';
import { loadingInterceptor } from './core/interceptor/loading-interceptor';
import { InitService } from './core/services/init.service';
import { lastValueFrom } from 'rxjs';



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideZoneChangeDetection(),
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor])),
    provideAppInitializer(async () => {
  const initService = inject(InitService);

  try {
    await lastValueFrom(initService.init());
  } finally {
    document.getElementById('initial-splash')?.remove();
  }
}),

    
  ]
};
