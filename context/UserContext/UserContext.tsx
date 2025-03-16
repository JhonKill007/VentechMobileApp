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

interface UserContextProps {
  userData: AuthLogin | undefined;
  userID: string | undefined;
  updateUser: (newData: AuthLogin) => void;
  removeUser: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userID, setUserID] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<AuthLogin | undefined>(undefined);
  const { setAuthenticate } = useContext(AuthenticateContext) || {};

  useEffect(() => {
    getUserID();
  }, []);

  const getUserID = () => {
    try {
      AsyncStorage.getItem("Us-Ac").then((id) => {
        if (id !== null) {
          setUserID(id);
        }
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const updateUser = useCallback(async (newData: AuthLogin) => {
    try {
      // await AsyncStorage.setItem("Us-Ac", newData.id?.toString()!);
      // console.log("Data en context: ", newData);

      setUserData(newData);
      setAuthenticate?.(true);
    } catch (err) {
      console.error("Error saving user:", err);
    }
  }, []);

  const removeUser = async () => {
    try {
      await AsyncStorage.removeItem("Us-Ac");
      setUserData(undefined);
      setUserID(undefined);
    } catch (err) {
      console.error("Error removing user:", err);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUser, removeUser, userID }}>
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
