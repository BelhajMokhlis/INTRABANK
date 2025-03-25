import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { reducers } from './store/reducers';
import { AuthEffects } from './store/effects/auth.effects';
import { DocumentEffects } from './store/effects/document.effects';
import { UserEffects } from './store/effects/user.effects';
import { CategoryEffects } from './store/effects/category.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideStore(reducers),
    provideHttpClient(),
    provideEffects([
      AuthEffects,
      DocumentEffects,
      UserEffects,
      CategoryEffects,
    ]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    })
  ]
};
