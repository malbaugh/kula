import { IMessage } from '../Interfaces/IMessage';

export class Message implements IMessage {
    private id: number;
    private conversationId: number;
    private senderId: number;
    private body: string;
    private read: boolean;
    private createdAt: Date;
    private updatedAt: Date;

    public get Body(): string {
        return this.body;
    }
    public set Body (value: string) {
        this.body = value;
    }

    public get Id(): number {
        return this.id;
    }
    public set Id (value: number) {
        this.id = value;
    }
    public get ConversationId(): number {
        return this.conversationId;
    }
    public set ConversationId (value: number) {
        this.conversationId = value;
    }
    public get SenderId(): number {
        return this.senderId;
    }
    public set SenderId (value: number) {
        this.senderId = value;
    }

    public get Read(): boolean {
        return this.read;
    }
    public set Read (value: boolean) {
        this.read = value;
    }

    public get CreatedAt(): Date {
        return this.createdAt;
    }
    public set CreatedAt (value: Date) {
        this.createdAt = value;
    }
    public get UpdatedAt(): Date {
        return this.updatedAt;
    }
    public set UpdatedAt (value: Date) {
        this.updatedAt = value;
    }

    constructor(id: number, conversationId:number, senderId:number, body:string, read: boolean, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.body = body;
        this.read = read;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
}