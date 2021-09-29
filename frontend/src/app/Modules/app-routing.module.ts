import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfirmDeleteFormComponent } from '../Components/confirm-delete-form/confirm-delete-form.component';
import { ConfirmRoutineActionComponent } from '../Components/confirm-routine-action/confirm-routine-action.component';
import { CreateDonationOfferComponent } from '../Components/create-donation-offer/create-donation-offer.component';
import { CreateItemClaimComponent } from '../Components/create-item-claim/create-item-claim.component';
import { CreateItemListingComponent } from '../Components/create-item-listing/create-item-listing.component';
import { CreateRequestListingComponent } from '../Components/create-request-listing/create-request-listing.component';
import { EditAccountComponent } from '../Components/edit-account/edit-account.component';
import { EditItemComponent } from '../Components/edit-item/edit-item.component';
import { EditRequestComponent } from '../Components/edit-request/edit-request.component';
import { ImageUploaderComponent } from '../Components/image-uploader/image-uploader.component';
import { InboxComponent } from '../Components/inbox/inbox.component';
import { LandingComponent } from '../Components/landing/landing.component';
import { LoginComponent } from '../Components/login/login.component';
import { MyItemsComponent } from '../Components/my-items/my-items.component';
import { MyRequestsComponent } from '../Components/my-requests/my-requests.component';
import { RegistrationComponent } from '../Components/registration/registration.component';
import { ReportComponent } from '../Components/report/report.component';
import { SearchComponent } from '../Components/search/search.component';
import { StartHereComponent } from '../Components/start-here/start-here.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'inbox', component: InboxComponent }, 
  { path: 'login', component: LoginComponent }, 
  { path: 'registration', component: RegistrationComponent },
  { path: 'upload-image', component: ImageUploaderComponent },
  { path: 'profile/:id/account', component: EditAccountComponent },
  { path: 'item/edit/:id', component: EditItemComponent },
  { path: 'request/edit/:id', component: EditRequestComponent },
  { path: 'confirm-delete', component: ConfirmDeleteFormComponent },
  { path: 'confirm-action', component: ConfirmRoutineActionComponent },
  { path: 'report', component: ReportComponent },
  { path: 'search', component: SearchComponent },
  { path: 'my-items/:id', component: MyItemsComponent },
  { path: 'my-requests/:id', component: MyRequestsComponent },
  { path: 'list-item', component: CreateItemListingComponent },
  { path: 'request-item', component: CreateRequestListingComponent },
  { path: 'claim-item', component: CreateItemClaimComponent },
  { path: 'offer-donation', component: CreateDonationOfferComponent },
  { path: 'welcome', component: StartHereComponent },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
