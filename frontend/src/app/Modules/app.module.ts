
// ANGULAR
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// MODULES
import { MaterialModule } from './material/material.module';
import { AppRoutingModule } from './app-routing.module';
import { ImageCropperModule } from 'ngx-image-cropper';

// COMPONENTS
import { AppComponent } from '../Components/app/app.component';
import { ConfirmDeleteFormComponent } from '../Components/confirm-delete-form/confirm-delete-form.component';
import { CreateItemListingComponent } from '../Components/create-item-listing/create-item-listing.component';
import { EditAccountComponent } from '../Components/edit-account/edit-account.component';
import { ImageUploaderComponent } from '../Components/image-uploader/image-uploader.component';
import { LandingComponent } from '../Components/landing/landing.component';
import { LoginComponent } from '../Components/login/login.component';
import { MyItemsComponent } from '../Components/my-items/my-items.component';
import { RegistrationComponent } from '../Components/registration/registration.component';
import { ReportComponent } from '../Components/report/report.component';
import { StartHereComponent } from '../Components/start-here/start-here.component';
import { CreateRequestListingComponent } from '../Components/create-request-listing/create-request-listing.component';
import { MyRequestsComponent } from '../Components/my-requests/my-requests.component';
import { CreateDonationOfferComponent } from '../Components/create-donation-offer/create-donation-offer.component';
import { EditRequestComponent } from '../Components/edit-request/edit-request.component';
import { CreateItemClaimComponent } from '../Components/create-item-claim/create-item-claim.component';
import { InboxComponent } from '../Components/inbox/inbox.component';

// SERVICES
import { JwtInterceptor } from 'src/app/Services/Interceptors/jwt.interceptor';
import { ErrorInterceptor } from 'src/app/Services/Interceptors/error.interceptor';
import { UsersService } from '../Services/Users/users.service';
import { CurrentUserService } from '../Services/CurrentUser/current-user.service';
import { EditItemComponent } from '../Components/edit-item/edit-item.component';
import { YOUR_GTM_ID } from 'src/Data/Information/Enviroment';
import { GoogleTagManagerModule } from 'angular-google-tag-manager';
import { SearchComponent } from '../Components/search/search.component';
import { ItemsService } from '../Services/Items/items.service';
import { RequestsService } from '../Services/Requests/requests.service';
import { MatStepperScrollerDirective } from 'src/Helpers/Directives/MatStepperScroller/mat-stepper-scroller.directive';
import { MessagesService } from '../Services/Messages/messages.service';
import { AutosizeModule } from 'ngx-autosize';
import { ConfirmRoutineActionComponent } from '../Components/confirm-routine-action/confirm-routine-action.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmDeleteFormComponent,
    ConfirmRoutineActionComponent,
    CreateItemClaimComponent,
    CreateDonationOfferComponent,
    CreateItemListingComponent,
    CreateRequestListingComponent,
    EditAccountComponent,
    EditItemComponent,
    EditRequestComponent,
    ImageUploaderComponent,
    InboxComponent,
    LandingComponent,
    LoginComponent,
    MyItemsComponent,
    MyRequestsComponent,
    RegistrationComponent,
    ReportComponent,
    SearchComponent,
    StartHereComponent,
    MatStepperScrollerDirective
  ],
  imports: [
    AutosizeModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    GoogleTagManagerModule.forRoot({
      id: YOUR_GTM_ID,
      // gtm_auth: YOUR_GTM_AUTH,
      // gtm_preview: YOUR_GTM_ENV
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },   
    CurrentUserService,
    UsersService,
    ItemsService,
    RequestsService,
    MessagesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
