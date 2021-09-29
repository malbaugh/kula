import { IUser } from '../Interfaces/IUser';

export class User implements IUser {

  // TODO --> see about making common fields protected
  private id: number;
  private token!: string;
  private firstName: string;
  private lastName: string;
  private email: string;
  private organization: boolean;
  private address: string;
  private city: string;
  private state: string;
  private zipcode: number;
  private rating: number;

  public get Email(): string {
    return this.email;
  }
  public set Email (value: string) {
    this.email = value;
  }

  public get Organization(): boolean {
    return this.organization;
  }
  public set Organization (value: boolean) {
    this.organization = value;
  }

  public get FirstName(): string {
    return this.firstName;
  }
  public set FirstName (value: string) {
    this.firstName = value;
  }

  public get LastName(): string {
    return this.lastName;
  }
  public set LastName (value: string) {
    this.lastName = value;
  }

  public get Id(): number {
    return this.id;
  }
  public set Id (value: number) {
    this.id = value;
  }

  public get Token(): string {
    return this.token;
  }
  public set Token (value: string) {
    this.token = value;
  }

  public get Address(): string {
    return this.address;
  }
  public set Address (value: string) {
    this.address = value;
  }
  public get State(): string {
    return this.state;
  }
  public set State (value: string) {
    this.state = value;
  }
  public get City(): string {
    return this.city;
  }
  public set City (value: string) {
    this.city = value;
  }
  public get Zipcode(): number {
    return this.zipcode;
  }
  public set Zipcode (value: number) {
    this.zipcode = value;
  }
  public get Rating(): number {
    return this.rating;
  }
  public set Rating (value: number) {
    this.rating = value;
  }

  constructor(id: number, name:string, email:string, organization:boolean, address:string, city:string, state:string, zipcode:number, rating: number) {
    this.id = id;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipcode = zipcode;
    this.email = email;
    this.organization = organization;
    this.firstName = name.substr(0,name.indexOf(' '));
    this.lastName = name.substr(name.indexOf(' ')+1);
    this.rating = rating;
  }
}
