import React, { useCallback } from "react";
import User from "../Services/User/UserService";
import { useUserContext } from "../context/UserContext/UserContext";
// import { useImageBankContext } from "../context/ImageBankContext/ImageBankContext";

const getUserDataHook = () => {
  const { updateUser } = useUserContext();
  // const { searchImage } = useImageBankContext();

  const getUserData = useCallback(
    async (id: string) => {
      try {
        // const e = await User.GetUserByID(id!);
        // if (e.status === 200) {
        //   // const profileImage = await searchImage(
        //   //   e.data.perfilData.idMediaDataProfile
        //   // );
        //   updateUser({
        //       id: e.data.id,
        //       fullName: e.data.name,
        //       username: e.data.username,
        //       email: e.data.email,
        //       token: e.data.token,
        //   });
        // }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    },
    [updateUser]
    // searchImage
  );
  return getUserData;
};

export default getUserDataHook;
