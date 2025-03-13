import { PostModel } from "../../Models/Post/PostModel";
import { UserPerfilModel } from "../../Models/User/UserPerfilModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Http from "../Http/HttpClient";

class AuthService {
  _Token: string | undefined;
  _ID: string | undefined;
  _User?: UserPerfilModel;
  _Authenticated: boolean = false;
  _My_Posts?: PostModel[];

  constructor() {
    this.GetTokenFromAsyncStorage("TK")
      .then((token: any) => {
        this._Token = token;
        if (this._Token) {
          this._Authenticated = !this._Authenticated;
          // this._ID = JSON.parse(localStorage.getItem("Us-Ac") ?? "");
        }
      })
      .catch((err: any) => {
        console.error("Error al cargar el valor:", err);
      });
  }

  setUser(u: UserPerfilModel) {
    this._User = u;
  }

  GetToken() {
    return this._Token;
  }

  async GetTokenFromAsyncStorage(tk: string) {
    try {
      const token = await AsyncStorage.getItem(tk);
      if (token !== null) {
        return token;
      }
    } catch (err: any) {
      console.error("Error al cargar el valor:", err);
    }
  }

  GetUser() {
    if (this._User !== undefined) {
      return this._User;
    }
  }

  Authenticate(tk: any, user: UserPerfilModel) {
    this.setTokenStorage(tk, user);
    return true;
  }

  async setTokenStorage(tk: any, u: UserPerfilModel) {
    // localStorage.setItem("TK", tk);
    // // localStorage.setItem("tk-init-date", `${new Date().getTime}`);
    // localStorage.setItem("Us-Ac", JSON.stringify(u.Id));

    try {
      await AsyncStorage.setItem("TK", tk);
      await AsyncStorage.setItem("Us-Ac", u.user?.id!);
    } catch (error) {
      console.error("Error al guardar el token y el iD:", error);
    }
    this._Token = tk;
    this._ID = u.user?.id;
    this._User = u;
    this._Authenticated = !this._Authenticated;
  }

  removeTokenStorage() {
    // localStorage.removeItem("TK");
    // localStorage.removeItem("tk-init-date");
    // localStorage.removeItem("Us-Ac");
    this._Authenticated = !this._Authenticated;
    this._Token = undefined;
    this._User = undefined;
  }

  ChangeProfilePhoto(ProfilePhoto: string) {
    if (!this._User?.user) {
      console.error("User is not defined");
      return;
    }

    const updatedUserLogged: UserPerfilModel = {
      ...this._User,
      profilePhoto: ProfilePhoto,
    };

    this._User = updatedUserLogged;
  }

  // ChangeCoverPhoto(CoverPhoto: string) {
  //   if (!this._User?.user) {
  //     console.error("User is not defined");
  //     return;
  //   }
  //   const updatedUserLogged: UserPerfilModel = {
  //     ...this._User,
  //     coverPhoto: CoverPhoto,
  //   };

  //   this._User = updatedUserLogged;
  // }

  TokenPayload(tk: any) {
    let config = {
      headers: {
        Authorization: "Bearer " + tk(),
      },
    };
    Http.post("http://localhost:8000/api/v1/get_token_payloads", config);
  }
}

const Auth = new AuthService();
export default Auth;
