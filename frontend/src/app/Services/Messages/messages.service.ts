import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URL } from 'src/Data/Information/Enviroment';
import { Conversation } from 'src/Helpers/Conversations/Classes/Conversation';
import { Message } from 'src/Helpers/Messages/Classes/Message';
import { CurrentUserService } from '../CurrentUser/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private params!: HttpParams;
  private message!: Message;
  private messages: Message[] = [];
  private conversation!: Conversation;
  private conversations: Conversation[] = [];

  constructor(
    private http: HttpClient,
    public currentUserService: CurrentUserService
  ) { }
  
  public MarkMessageRead(message: Message) {
    return this.http.put<any>(`${API_URL}/message/read`, JSON.stringify({'id': message.Id}));
  }

  public SendMessage(conversation: Conversation, body: string) {
    return this.http.post(`${API_URL}/message/send`, JSON.stringify({"id": conversation.Id, "body":body}));
  }

  public UnreadMessageCount() {
    return this.http.get<any>(`${API_URL}/message/unread`)
    .pipe(
      map(response => {
        return response;
    }));
  }

  public SearchMessages(
    query?: string) 
  {
    
    this.params = new HttpParams();

    if (query) { this.params = this.params.append('query', query); }
    // if (read != undefined) { this.params = this.params.append('read', read.toString()); }
    
    return this.http.get<any>(`${API_URL}/messages/search`, { params: this.params })
    .pipe(
      map(response => {
        return this.HttpResponseToConversations(response);
    }));
  }

  public HttpResponseToConversations(data: any): Conversation[] {
    this.conversations = [];
    for (var i = 0; i != (Object.keys(data['conversations']).length); i++) {
      this.conversation = new Conversation(
        data['conversations'][i].id,
        data['conversations'][i].auth_user_id,
        data['conversations'][i].complete,
        data['conversations'][i].disabled,
        data['conversations'][i].photo,
        data['conversations'][i].title,
        data['conversations'][i].blurb,
        data['conversations'][i].purpose,
        data['conversations'][i].read,
        new Date(data['conversations'][i].created_at),
        new Date(data['conversations'][i].updated_at)
      );
      this.conversation.ItemId = data['conversations'][i].item_id;
      this.conversation.ItemRequestId = data['conversations'][i].item_request_id;
      
      this.messages = [];
      for (var j = 0; j != (Object.keys(data['messages'][i]).length); j++) {
        this.message = new Message(
          data['messages'][i][j].id,
          data['messages'][i][j].conversation_id,
          data['messages'][i][j].sender_id,
          data['messages'][i][j].body,
          data['messages'][i][j].read,
          new Date(data['messages'][i][j].created_at),
          new Date(data['messages'][i][j].updated_at)
        );

        this.messages[j] = this.message;
      }

      if (this.message.SenderId == this.currentUserService.CurrentUserValue.Id) {
        this.conversation.Read = true;
      } else if (this.message.Read) {
        this.conversation.Read = true;
      } else {
        this.conversation.Read = false;
      }
      
      this.conversation.Messages = this.messages;

      this.conversations[i] = this.conversation;
    }
    return this.conversations;
  }
}
