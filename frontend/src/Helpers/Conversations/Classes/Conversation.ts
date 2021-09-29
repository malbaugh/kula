import { Message } from 'src/Helpers/Messages/Classes/Message';
import { IConversation } from '../Interfaces/IConversation';

export class Conversation implements IConversation {
    private id: number;
    private itemId: number;
    private itemRequestId: number;
    private authUserId: number;
    private disabled: boolean;
    private complete: boolean;
    private purpose: string;
    private title: string;
    private photo: string;
    private blurb: string;
    private read: boolean;
    private createdAt: Date;
    private updatedAt: Date;
    private messages: Message[] = [];

    public get Id(): number {
        return this.id;
    }
    public set Id (value: number) {
        this.id = value;
    }
    public get AuthUserId(): number {
        return this.authUserId;
    }
    public set AuthUserId (value: number) {
        this.authUserId = value;
    }

    public get ItemId(): number {
        return this.itemId;
    }
    public set ItemId (value: number) {
        this.itemId = value;
    }
    public get ItemRequestId(): number {
        return this.itemRequestId;
    }
    public set ItemRequestId (value: number) {
        this.itemRequestId = value;
    }
    public get Blurb(): string {
        return this.blurb;
    }
    public set Blurb (value: string) {
        this.blurb = value;
    }

    public get Title(): string {
        return this.title;
    }
    public set Title (value: string) {
        this.title = value;
    }

    public get Purpose(): string {
        return this.purpose;
    }
    public set Purspose (value: string) {
        this.purpose = value;
    }

    public get Photo(): string {
        return this.photo;
    }
    public set Photo (value: string) {
        this.photo = value;
    }

    public get Read(): boolean {
        return this.read;
    }
    public set Read (value: boolean) {
        this.read = value;
    }
    public get Complete(): boolean {
        return this.complete;
    }
    public set Complete (value: boolean) {
        this.complete = value;
    }
    public get Disabled(): boolean {
        return this.disabled;
    }
    public set Disabled (value: boolean) {
        this.disabled = value;
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

    public get Messages(): Message[] {
        return this.messages;
    }
    public set Messages (value: Message[]) {
        this.messages = value;
    }

    constructor(id:number, authUserId: number, complete: boolean, disabled: boolean, photo:string, title:string, blurb:string, purpose:string, read: boolean, createdAt: Date, updatedAt: Date) {
        this.id = id;
        this.authUserId = authUserId;
        this.complete = complete;
        this.disabled = disabled;
        this.photo = photo;
        this.title = title;
        this.blurb = blurb;
        this.purpose = purpose;
        this.read = read;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.itemId = -1;
        this.itemRequestId = -1;
    }
    
}