import { Roles } from "./Roles";

export class User {
    id?: number;
    fullName?: string;
    email?: string;
    cellphone?:string;
    password?:string;
    username?:string;
    planId?:number;
    roleId?:number;
    rol?:Roles
    companyId?:number;
    branchIds?:number[];
    code?:string;
  }