import { Item } from '../Classes/Item';

export interface IItem {
    Id: number;
    Name: string;
    Photo: string;
    State: string;
    City: string;
    Zipcode: number;
    Description: string;
    ClaimedStatus: boolean;
    TakenStatus: boolean;
    Sponsored: boolean;
    OwnerId: number;
    ClaimedUserId: number;
    ClaimedAt: Date;
    CreatedAt: Date;
    Instructions: string;
    Favorites: number;
    Claims: number;
}