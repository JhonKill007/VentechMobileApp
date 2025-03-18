import { Branch } from "./Branch";

export class Company  {
    id?: number;
    userid?: number;
    name?: string;
    rnc?: string;
    address?: string | null;
    telefono?: string | null;
    photo?: string | null ;
    isActive?:boolean;
    branches?: Branch[];
    companyTypeId?:number;
}