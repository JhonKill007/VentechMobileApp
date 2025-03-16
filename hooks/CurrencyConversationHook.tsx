import React from "react";
import Chat_S from "../Services/Chat/ChatService";

const CurrencyConversationHook = () => {
  const GetCurrencyConversation = (id: string, section: number) => {
    Chat_S.GetCurrencyConversation(id, section)
      .then((res: any) => {
        return(res.data);
      })
      .catch((e: any) => {
        console.log(e);
      });
  };
  return {GetCurrencyConversation};
};

export default CurrencyConversationHook;
