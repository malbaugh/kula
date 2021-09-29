import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CurrentUserService } from '../CurrentUser/current-user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private currentUserService: CurrentUserService,
        public router: Router,
        private snackBar: MatSnackBar
        ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status == 401) {
                this.snackBar.open("Sorry for the inconvenience - please log back in.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                this.currentUserService.Logout();
                this.router.navigate(['/']);
            }
            else if (err.status == 403) {
                this.snackBar.open("Verify your email before doing this.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                // window.location.reload();
            }
            else if (err.status == 409) {
                this.snackBar.open("The email you provided are already taken.", "Close", {duration: 3000,panelClass: ['snackbar-color']});
                // window.location.reload();
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}