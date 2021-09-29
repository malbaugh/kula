import { User } from '../Classes/User';

export interface IUser {
  Id: number;
  Token: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Organization: boolean;
  Address: string;
  City: string;
  State: string;
  Zipcode: number;
  Rating: number;
}
