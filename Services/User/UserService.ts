import { IUserService } from "@/Interface/User/IUserService";
import Http from "../Http/HttpClient";
import { UserAuthModel } from "@/Models/UserAuthModel";
import { ChangePassword } from "@/Models/ChangePassword";
import { User } from "@/Models/User";

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

  async getMyInfo(userdId:number): Promise<any> {
    
    let login = await new Promise<any>((resolve, reject) => {
      Http.get(`api/Users/${userdId}`)
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
  async ChangePassword(params: ChangePassword): Promise<any> {
    
    let login = await new Promise<any>((resolve, reject) => {
      Http.post("api/Users/changePassword", params)
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
  async UpdateUser(userdId:number,params: User): Promise<any> {
    
    let login = await new Promise<any>((resolve, reject) => {
      Http.put(`api/Users/${userdId}`, params)
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
const UserServ = new UserService();
export default UserServ;
