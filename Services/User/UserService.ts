import Http from "../Http/HttpClient";
import { UserModel } from "../../Models/User/UserModel";
import { IUserService } from "../../Interface/User/IUserService";
import { UserLoginModel } from "../../Models/User/UserLoginModel";
import { UserUpdateModel } from "../../Models/User/UserUpdateModel";
import Auth from "../Auth/AuthService";
import { UserCreateModel } from "../../Models/User/UserCreateModel";
import { UserPerfilModel } from "../../Models/User/UserPerfilModel";

export class UserService implements IUserService {
  async GetExplorerUsers(section: number): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/User/GetUserExplorer?section=${section}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return result;
  }
  
  async GetUserByID(id: string | undefined): Promise<any> {
    let result = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/User/${id}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          console.log(err);
          
          reject(err);
        });
    });
    return result;
  }
  
  async SearchUser(key: string, section: number): Promise<any> {
    let search = await new Promise<any>((resolve, reject) => {
      Http.get(`/api/User/Search?keyword=${key}&section=${section}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return search;
  }
  async GetUserByUsername(username: string, userLog: string): Promise<any> {
    let getUser = await new Promise<any>((resolve, reject) => {
      Http.get(`api/User/GetUserByUsername?username=${username}&idUserLog=${userLog}`)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return getUser;
  }
  async Create(user: UserCreateModel): Promise<any> {
    let create = await new Promise<any>((resolve, reject) => {
      Http.post("/api/User", user)
        .then((res: any) => {
          if (res.status === 200) {
            let user_result: UserPerfilModel = {
              user: {
                id: res.data.id,
                name: res.data.name,
                username: res.data.username,
                email: res.data.email,
                password: undefined,
                phone: res.data.phone,
                birthday: res.data.birthday,
                gender: res.data.gender,
                status: res.data.status,
                verify: res.data.verify,
                perfilData: {
                  presentation: res.data.presentation,
                  idMediaDataProfile: res.data.idMediaDataProfile,
                  // idMediaDataCover: res.data.idMediaDataCover
                },
                createDate: new Date(res.data.createDate)
              },
              isFollow: res.data.isFollow,
              profilePhoto: res.data.profilePhoto,
              // coverPhoto: res.data.coverPhoto,
              seguidos: res.data.seguidos,
              seguidores: res.data.seguidores
            };
            Auth.Authenticate(res.data.token, user_result);
          }
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return create;
  }
  Update(user: UserUpdateModel): Promise<any> {
    throw new Error("Method not implemented.");
  }
  ChangeStatus(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  async LogIn(user: UserLoginModel): Promise<any> {
    let login = await new Promise<any>((resolve, reject) => {
      Http.post("/api/Login", user)
        .then((res: any) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
    return login;
  }
  RecoverCount(user: UserModel): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
const User = new UserService();
export default User;
