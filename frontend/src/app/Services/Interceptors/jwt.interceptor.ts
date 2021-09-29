import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../Helpers/Users/Classes/User';
import { CurrentUserService } from '../CurrentUser/current-user.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private currentUserService: CurrentUserService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currUser = this.currentUserService.CurrentUserValue
        if (currUser && currUser.Token) {
            request = request.clone({
                setHeaders: { 
                    'Content-Type': 'application/json',
                    'Authorization': `${currUser.Token}`
                }
            });
        } else {
            request = request.clone({
                setHeaders: { 
                    'Content-Type': 'application/json'
                }
            });
        }
        return next.handle(request);
    }
}