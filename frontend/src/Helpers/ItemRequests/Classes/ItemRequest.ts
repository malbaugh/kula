import { IItemRequest } from "../Interfaces/IItemRequest";


export class ItemRequest implements IItemRequest {
    private id: number;
    private name: string;
    private photo: string;
    private description: string;
    private filledStatus: boolean;
    private coveredStatus: boolean;
    private requesterId: number;
    private donorId: number;
    private coveredAt: Date;
    private createdAt: Date;
    private city: string;
    private state: string;
    private zipcode: number;
    private favorites: number;
    private offers: number;

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
    public get CoveredStatus(): boolean {
        return this.coveredStatus;
    }
    public set CoveredStatus (value: boolean) {
        this.coveredStatus = value;
    }
    public get FilledStatus(): boolean {
        return this.filledStatus;
    }
    public set FilledStatus (value: boolean) {
        this.filledStatus = value;
    }
    public get RequesterId(): number {
        return this.requesterId;
    }
    public set RequesterId (value: number) {
        this.requesterId = value;
    }
    public get DonorId(): number {
        return this.donorId;
    }
    public set DonorId (value: number) {
        this.donorId = value;
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

    public get Offers(): number {
        return this.offers;
    }
    public set Offers (value: number) {
        this.offers = value;
    }
    public get Favorites(): number {
        return this.favorites;
    }
    public set Favorites (value: number) {
        this.favorites = value;
    }

    public get CreatedAt(): Date {
        return this.createdAt;
    }
    public set CreatedAt (value: Date) {
        this.createdAt = value;
    }
    public get CoveredAt(): Date {
        return this.coveredAt;
    }
    public set CoveredAt (value: Date) {
        this.coveredAt = value;
    }

    constructor(id: number, name:string, photo:string, description:string, requesterId:number, city:string, state:string, zipcode: number, filledStatus: boolean, coveredStatus: boolean, donorId: number, createdAt: Date, coveredAt: Date) {
        this.id = id;
        this.name = name;
        this.photo = photo;
        this.description = description;
        this.requesterId = requesterId;
        this.city = city;
        this.state = state;
        this.zipcode = zipcode;
        this.filledStatus = filledStatus;
        this.coveredStatus = coveredStatus;
        this.donorId = donorId;
        this.createdAt = createdAt;
        this.coveredAt = coveredAt;
        this.favorites = 0;
        this.offers = 0;
    }
}