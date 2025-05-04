import { IUserService } from "@/Interface/User/IUserService";
import Http from "../Http/HttpClient";
import { UserAuthModel } from "@/Models/UserAuthModel";

export class UserService implements IUserService {
  async LogIn(params: UserAuthModel): Promise<any> {
    let login = await new Promise<any>((resolve, reject) => {
      Http.post("/api/Auth", params)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err)
          reject(err);
        });
    });
    return login;
  }
}
const User = new UserService();
export default User;
