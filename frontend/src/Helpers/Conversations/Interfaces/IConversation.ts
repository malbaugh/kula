import { Message } from 'src/Helpers/Messages/Classes/Message';
import { Conversation } from '../Classes/Conversation';

export interface IConversation {
    Id: number;
    AuthUserId: number;
    Disabled: boolean;
    Complete: boolean;
    ItemId: number;
    ItemRequestId: number;
    Purpose: string;
    Title: string;
    Photo: string;
    Blurb: string;
    Read: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
    Messages: Message[];
}