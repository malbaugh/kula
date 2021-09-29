import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, retry } from 'rxjs/operators';
import { API_URL } from 'src/Data/Information/Enviroment';
import { ItemRequest } from 'src/Helpers/ItemRequests/Classes/ItemRequest';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  private params!: HttpParams;
  private itemRequest!: ItemRequest;
  private requests: ItemRequest[] = [];

  constructor(
    private http: HttpClient
  ) { }

  public DeleteRequest(itemRequest: ItemRequest) {
    return this.http.delete(`${API_URL}/request-${itemRequest.Id}/delete`);
  }

  public UpdateRequest(itemRequest: ItemRequest) {
    return this.http.put<any>(`${API_URL}/request/update`, JSON.stringify(itemRequest));
  }

  public MarkRequestFilled(itemRequest: ItemRequest) {
    return this.http.put<any>(`${API_URL}/request/filled`, JSON.stringify(itemRequest));
  }

  public SelectUserDonation(itemRequestId: number, conversationId: number) {
    return this.http.put<any>(`${API_URL}/requests/select-user`, JSON.stringify({"item_request_id": itemRequestId, "conversation_id": conversationId}));
  }

  public MakeRequestAvailableAgain(itemRequest: ItemRequest) {
    return this.http.put<any>(`${API_URL}/request/repost`, JSON.stringify(itemRequest));
  }

  public OfferDonation(itemRequest: ItemRequest, description: string, photo: string) {
    return this.http.post<any>(`${API_URL}/offer-donation`, JSON.stringify({"item_request_id":itemRequest.Id, "description": description, "photo": photo}));
  } 

  public CreateRequest(itemRequest: ItemRequest) {
    return this.http.post(`${API_URL}/request-item`, JSON.stringify({"requested_item": itemRequest}));
  }

  public SearchRequests(
    query?: string, 
    filled?: boolean,
    covered?: boolean,
    requesterId?: number, 
    city?: string, 
    state?: string, 
    zipcode?: number,
    datePosted?: Date) 
  {
    
    this.params = new HttpParams();
    
    if (query) { this.params = this.params.append('query', query); }
    if (requesterId) { this.params = this.params.append('requesterId', requesterId.toString()); }
    if (city) { this.params = this.params.append('city', city); }
    if (state) { this.params = this.params.append('state', state); }
    if (zipcode) { this.params = this.params.append('zipcode', zipcode.toString()); }
    if (datePosted) { this.params = this.params.append('datePosted', datePosted.toUTCString()); }
    if (filled != undefined) { this.params = this.params.append('filled', filled.toString()); }
    if (covered != undefined) { this.params = this.params.append('covered', covered.toString()); }
    
    return this.http.get(`${API_URL}/requests/search`, { params: this.params })
    .pipe(
      map(response => {
        return this.HttpResponseToItem(response);
    }));
  }

  public HttpResponseToItem(data: any): ItemRequest[] {
    this.requests = [];
    for (var i = 0; i != (Object.keys(data).length); i++) {
      this.itemRequest = new ItemRequest(
        data[i].id,
        data[i].name,
        data[i].photo,
        data[i].description,
        data[i].requester_id,
        data[i].city,
        data[i].state,
        data[i].zipcode,
        data[i].filled_status,
        data[i].covered_status,
        data[i].donor_id,
        new Date(data[i].created_at),
        new Date(data[i].covered_at)
      );
      this.itemRequest.Offers = data[i].offers;
      this.itemRequest.Favorites = data[i].favorites;

      this.requests[i] = this.itemRequest; 
    }
    return this.requests;
  }
}
