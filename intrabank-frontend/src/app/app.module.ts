import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { StoreModule } from "@ngrx/store"
import { EffectsModule } from "@ngrx/effects"
import { StoreDevtoolsModule } from "@ngrx/store-devtools"
import { environment } from "../environments/environment"
import { RouterModule } from "@angular/router"
import { AppComponent } from "./app.component"
import { routes } from "./app.routes"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"

import { authReducer } from "./store/reducers/auth.reducer"
import { userReducer } from "./store/reducers/user.reducer"
import { categoryReducer } from "./store/reducers/category.reducer"
import { documentReducer } from "./store/reducers/document.reducer"

import { AuthEffects } from "./store/effects/auth.effects"
import { UserEffects } from "./store/effects/user.effects"
import { CategoryEffects } from "./store/effects/category.effects"
import { DocumentEffects } from "./store/effects/document.effects"
import { AuthInterceptor } from "./core/interceptors/auth.interceptor"

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      useHash: false,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled'
    }),
    StoreModule.forRoot({
      auth: authReducer,
      user: userReducer,
      category: categoryReducer,
      documents: documentReducer
    }),
    EffectsModule.forRoot([
      AuthEffects,
      UserEffects,
      CategoryEffects,
      DocumentEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

