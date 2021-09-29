import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_URL } from '../../../Data/Information/Enviroment';
import { User } from 'src/Helpers/Users/Classes/User';
import { Item } from 'src/Helpers/Items/Classes/Item';
import { catchError, map, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private user!: User;
  private users: User[] = [];

  constructor(private http: HttpClient) { }

  // DELETE
  public Delete(id: number) {
    return this.http.delete(`${API_URL}/users/${id}`);
  }


  // GET
  public HasUserClaimedItem(itemId: number, userId: number) {
    return this.http.get(`${API_URL}/user-${userId}/claimed/item-${itemId}`)
    .pipe(
      map(response => {
        return response;
    }))
  }

  public HasUserTakenItem(itemId: number, userId: number) {
    return this.http.get(`${API_URL}/user-${userId}/taken/item-${itemId}`)
    .pipe(
      map(response => {
        return response;
    }))
  }


  // PUT
  public UpdateUser(user: User) {
    return this.http.put<any>(`${API_URL}/users/update`, JSON.stringify(user));
  }
  
  public UpdateUserPassword(oldPassword:string, newPassword:string, userId:number) {
    return this.http.put<any>(`${API_URL}/users/update-password`, JSON.stringify({"old_password": oldPassword, "new_password": newPassword, "id": userId}))
    .pipe(
      map(response => { 
        return response['token'];
    }));
  }

  // POST
  
  public ClaimItem(itemId: number, userId: number) {
    return this.http.post(`${API_URL}/claim/item-${itemId}`,JSON.stringify({"user_id": userId}));
  }

  public TakeItem(itemId: number, userId: number) {
    return this.http.post(`${API_URL}/take/item-${itemId}`,JSON.stringify({"user_id": userId}));
  }

  public ReportIssue(issue: string, email: string) {
    if (email == undefined) {
      email = "User was not logged in."
    }
    return this.http.post(`${API_URL}/report`, JSON.stringify({'issue':issue, 'email':email}));
  }

  public RegisterUser(user: User, password: string) {
    return this.http.post(`${API_URL}/users/register`,JSON.stringify({"user": user, "password": password}));
  }

  // Gets a user response from the backend and turns it into a user object
  public HttpResponseToUser(data: any): User[] {
    this.users = [];
    for (var i = 0; i != (Object.keys(data).length); i++) {
      this.user = new User(
        data[i].id,
        data[i].first_name.concat(" ").concat(data[i].last_name),
        data[i].email,
        data[i].organization,
        data[i].address,
        data[i].city,
        data[i].state,
        data[i].zipcode,
        data[i].rating
      );
      
      this.users[i] = this.user;
    }
    return this.users;
  }

  
}
