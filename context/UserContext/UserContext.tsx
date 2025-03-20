// UserContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { AuthenticateContext } from "../AuthenticateContext/AuthenticateContext";
import { AuthLogin } from "@/Models/AuthLogin";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Company } from "@/Models/Company";
import { Branch } from "@/Models/Branch";

interface UserContextProps {
  userData: AuthLogin | undefined;
  token: string | undefined;
  branch: Branch | undefined;
  company: Company | undefined;
  updateUser: (newData: AuthLogin) => void;
  updateCompany: (newData: Company) => void;
  updateBranch: (b: Branch) => void;
  removeUser: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | undefined>(undefined);
  const [branch, setBranch] = useState<Branch | undefined>({});
  const [company, setCompany] = useState<Company | undefined>({});
  const [userData, setUserData] = useState<AuthLogin | undefined>(undefined);
  const { setAuthenticate } = useContext(AuthenticateContext) || {};

  useEffect(() => {
    getUser();
  }, []);

  const updateBranch = (b: Branch) => {
    setBranch(b);
  };
  const updateCompany = (c: Company) => {
    setCompany(c);
  };

  const getUser = () => {
    try {
      AsyncStorage.getItem("TK").then((token) => {
        if (token !== null) {
          const decoded = jwtDecode(token);

          if (isTokenExpired(decoded)) {
            removeUser();
          } else {
            const decodedString = JSON.stringify(decoded);
            const user = JSON.parse(decodedString);
            const { id, username, email, fullname, authCode, Role } = user;

            const dta: AuthLogin = {
              id: id!,
              fullName: fullname,
              username: username,
              email: email,
              roleName: Role,
              authCode: authCode,
              token: token,
            };
            updateUser(dta);
          }

          setToken(token);
        }
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const isTokenExpired = (decoded: JwtPayload) => {
    return decoded.exp! * 1000 < Date.now();
  };

  const updateUser = useCallback(async (newData: AuthLogin) => {
    try {
      setUserData(newData);
      await AsyncStorage.setItem("TK", newData.token!);

      setAuthenticate?.(true);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  }, []);

  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem("Vt-tk");
      setUserData(undefined);
      setToken(undefined);
      setAuthenticate?.(false);
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        updateUser,
        removeUser,
        token,
        branch,
        updateBranch,
        company,
        updateCompany,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(
      "useUserContext debe ser utilizado dentro de un UserProvider"
    );
  }
  return context;
};
