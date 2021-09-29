import { Message } from '../Classes/Message';

export interface IMessage {
    Id: number;
    ConversationId: number;
    SenderId: number;
    Body: string;
    Read: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}