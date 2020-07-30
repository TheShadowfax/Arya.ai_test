import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginService } from './shared/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from './shared/user.service';

declare const Buffer
declare const BufferEncoding;

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // CommonModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    // SharedModule,
  ],
  providers: [LoginService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    library: FaIconLibrary
  ) {
    library.addIconPacks(fas, far)
  }
}
