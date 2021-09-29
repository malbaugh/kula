import { IItem } from '../Interfaces/IItem';

export class Item implements IItem {
    private id: number;
    private name: string;
    private photo: string;
    private description: string;
    private takenStatus: boolean;
    private claimedStatus: boolean;
    private sponsored: boolean;
    private ownerId: number;
    private claimedUserId: number;
    private claimedAt: Date;
    private createdAt: Date;
    private city: string;
    private state: string;
    private zipcode: number;
    private instructions: string;
    private favorites: number;
    private claims: number;

    public get Instructions(): string {
        return this.instructions;
    }
    public set Instructions (value: string) {
        this.instructions = value;
    }

    public get Id(): number {
        return this.id;
    }
    public set Id (value: number) {
        this.id = value;
    }

    public get Name(): string {
        return this.name;
    }
    public set Name (value: string) {
        this.name = value;
    }

    public get Photo(): string {
        return this.photo;
    }
    public set Photo (value: string) {
        this.photo = value;
    }

    public get Description(): string {
        return this.description;
    }
    public set Description (value: string) {
        this.description = value;
    }
    public get ClaimedStatus(): boolean {
        return this.claimedStatus;
    }
    public set ClaimedStatus (value: boolean) {
        this.claimedStatus = value;
    }
    public get TakenStatus(): boolean {
        return this.takenStatus;
    }
    public set TakenStatus (value: boolean) {
        this.takenStatus = value;
    }
    public get Sponsored(): boolean {
        return this.sponsored;
    }
    public set Sponsored (value: boolean) {
        this.sponsored = value;
    }
    public get OwnerId(): number {
        return this.ownerId;
    }
    public set OwnerId (value: number) {
        this.ownerId = value;
    }
    public get ClaimedUserId(): number {
        return this.claimedUserId;
    }
    public set ClaimedUserId (value: number) {
        this.claimedUserId = value;
    }
    public get City(): string {
        return this.city;
    }
    public set City (value: string) {
        this.city = value;
    }
    public get State(): string {
        return this.state;
    }
    public set State (value: string) {
        this.state = value;
    }
    public get Zipcode(): number {
        return this.zipcode;
    }
    public set Zipcode (value: number) {
        this.zipcode = value;
    }

    public get Favorites(): number {
        return this.favorites;
    }
    public set Favorites (value: number) {
        this.favorites = value;
    }
    public get Claims(): number {
        return this.claims;
    }
    public set Claims (value: number) {
        this.claims = value;
    }

    public get CreatedAt(): Date {
        return this.createdAt;
    }
    public set CreatedAt (value: Date) {
        this.createdAt = value;
    }
    public get ClaimedAt(): Date {
        return this.claimedAt;
    }
    public set ClaimedAt (value: Date) {
        this.claimedAt = value;
    }

    constructor(id: number, name:string, photo:string, description:string, ownerId:number, city:string, state:string, zipcode: number, takenStatus: boolean, claimedStatus: boolean, sponsored: boolean, claimedUserId: number, createdAt: Date, claimedAt: Date) {
        this.id = id;
        this.name = name;
        this.photo = photo;
        this.description = description;
        this.ownerId = ownerId;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
        this.sponsored = sponsored;
        this.takenStatus = takenStatus;
        this.claimedStatus = claimedStatus;
        this.claimedUserId = claimedUserId;
        this.createdAt = createdAt;
        this.claimedAt = claimedAt;
        this.instructions = '';
        this.favorites = 0;
        this.claims = 0;
    }
    
}