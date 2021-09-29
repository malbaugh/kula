import { ItemRequest } from '../Classes/ItemRequest';

export interface IItemRequest {
    Id: number;
    Name: string;
    Photo: string;
    State: string;
    City: string;
    Zipcode: number;
    Description: string;
    CoveredStatus: boolean;
    FilledStatus: boolean;
    RequesterId: number;
    DonorId: number;
    CoveredAt: Date;
    CreatedAt: Date;
    Offers: number;
    Favorites: number;
}