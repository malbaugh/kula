import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { API_URL } from 'src/Data/Information/Enviroment';
import { User } from 'src/Helpers/Users/Classes/User';
import { UsersService } from '../Users/users.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  
  private currUserSubject: BehaviorSubject<any>;
  private currentUrl: string = "";
  private currentQuery: string = "";
  private user!: User;
  public unreadCount: number = 0;

  constructor(
    private http: HttpClient,
    private userService: UsersService
  ) { 
      this.currUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUserService') || 'null'));
    }

  public RecordEvent(action: string, description: string, story: string) {
    return this.http.post(`${API_URL}/event`, JSON.stringify({"action": action, "description":description, "story": story}));
  }

  public get CurrentUserValue(): any {
    if (this.currUserSubject.value == null) {
      return false;
    }
    return this.StoredUserToCurrentUser(this.currUserSubject.value);
  }
  
  public SetCurrentUser(user: any): void {
    this.Logout();
    localStorage.setItem('currentUserService',JSON.stringify(user));
    this.currUserSubject.next(user);
  }

  public Login(email: string, password: string) {
    return this.http.post<any>(`${API_URL}/login`, {"email": email, "password": password})
      .pipe(
        map(response => {
          this.user = this.userService.HttpResponseToUser([response[1]])[0];
          this.user.Token = response[0]['token'];
          this.SetCurrentUser(this.user);
          return this.userService.HttpResponseToUser([response[1]])[0];
      }));
  }

  public Logout(): void {
    localStorage.removeItem('currentUserService');
    this.currUserSubject.next(null);
  }

  public set UnreadCount(value: number) {
    this.unreadCount = value;
  }

  public get UnreadCount(): number {
    return this.unreadCount;
  }

  public set UserLocation(url: string) {
    this.currentUrl = url;
  }

  public get UserLocation(): string {
    return this.currentUrl;
  }

  public set UserSearch(query: string) {
    this.currentQuery = query;
  }
  public get UserSearch(): string {
    return this.currentQuery;
  }

  public StoredUserToCurrentUser(object: any): any {
    this.user = new User(
      object.id, 
      object.firstName.concat(" ").concat(object.lastName),
      object.email,
      object.organization,
      object.address,
      object.city,
      object.state,
      object.zipcode,
      object.rating
    );

    this.user.Token = object.token;

    return this.user;
  }
}
