import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { API_URL } from 'src/Data/Information/Enviroment';
import { Item } from 'src/Helpers/Items/Classes/Item';
import { UsersService } from '../Users/users.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private params!: HttpParams;
  private item!: Item;
  private items: Item[] = [];

  constructor(
    private http: HttpClient
  ) { }
  
  public DeleteItem(item: Item) {
    return this.http.delete(`${API_URL}/item-${item.Id}/delete`);
  }

  public UpdateItem(item: Item) {
    return this.http.put<any>(`${API_URL}/item/update`, JSON.stringify(item));
  }

  public MarkItemTaken(item: Item) {
    return this.http.put<any>(`${API_URL}/item/taken`, JSON.stringify(item));
  }

  public MakeItemAvailableAgain(item: Item) {
    return this.http.put<any>(`${API_URL}/item/repost`, JSON.stringify(item));
  }

  public SelectUserClaim(itemId: number, conversationId: number) {
    return this.http.put<any>(`${API_URL}/item/select-user`, JSON.stringify({"item_id": itemId, "conversation_id": conversationId}));
  }

  public CreateItem(item: Item, photo: string) {
    return this.http.post(`${API_URL}/list-item`, JSON.stringify({"item": item, "photo":photo}));
  }

  public SubmitClaim(item: Item, description: string) {
    return this.http.post(`${API_URL}/claim-item`, JSON.stringify({"item_id": item.Id, "description":description}));
  }

  public SearchItems(
    query?: string, 
    taken?: boolean,
    claimed?: boolean,
    ownerId?: number, 
    city?: string, 
    state?: string, 
    zipcode?: number,
    datePosted?: Date) 
  {
    
    this.params = new HttpParams();

    if (query) { this.params = this.params.append('query', query); }
    if (ownerId) { this.params = this.params.append('ownerId', ownerId.toString()); }
    if (city) { this.params = this.params.append('city', city); }
    if (state) { this.params = this.params.append('state', state); }
    if (zipcode) { this.params = this.params.append('zipcode', zipcode.toString()); }
    if (datePosted) { this.params = this.params.append('datePosted', datePosted.toUTCString()); }
    if (taken != undefined) { this.params = this.params.append('taken', taken.toString()); }
    if (claimed != undefined) { this.params = this.params.append('claimed', claimed.toString()); }
    
    return this.http.get(`${API_URL}/items/search`, { params: this.params })
    .pipe(
      map(response => {
        return this.HttpResponseToItem(response);
    }));
  }

  public HttpResponseToItem(data: any): Item[] {
    this.items = [];
    for (var i = 0; i != (Object.keys(data).length); i++) {
      this.item = new Item(
        data[i].id,
        data[i].name,
        data[i].photo,
        data[i].description,
        data[i].owner_id,
        data[i].city,
        data[i].state,
        data[i].zipcode,
        data[i].taken_status,
        data[i].claimed_status,
        data[i].sponsored,
        data[i].selected_user_id,
        new Date(data[i].created_at),
        new Date(data[i].claimed_at)
      );
      this.item.Instructions = data[i].instructions;
      this.item.Favorites = data[i].favorites;
      this.item.Claims = data[i].claims;

      this.items[i] = this.item;
    }
    return this.items;
  }
}
