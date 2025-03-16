import { UserAuthModel } from "@/Models/UserAuthModel";

export interface IUserService {
  LogIn(params: UserAuthModel): Promise<any>;
}
