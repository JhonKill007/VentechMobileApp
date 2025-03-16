import { Colors } from "@/constants/Colors";
import { NotifyType } from "@/constants/Types";
import React from "react";
import { Text, useColorScheme } from "react-native";

const getNotifyMessageHook = () => {
  const theme = useColorScheme();

  function getDescriptionNotify(type: string, descripcion: string) {
    switch (type) {
      case NotifyType.PUBLICATION_LIKE:
        return "ha indicado que le gusta tu publicación.";

      case NotifyType.HISTORY_LIKE:
        return "ha indicado que le gusta tu historia.";

      case NotifyType.COMENT_LIKE:
        return "ha indicado que le gusta tu comentario.";

      case NotifyType.FOLLOW:
        return "ha comenzado a seguirte.";

      case NotifyType.COMENT:
        return "ha comentado en tu publicación.";

      case NotifyType.PUBLICATION_MENTION:
        return "te ha mencionado en su publicación.";

      case NotifyType.HISTORY_MENTION:
        return "te ha mencionado en su historia.";

      case NotifyType.COMENT_MENTION:
        return "te ha mencionado en un comentario.";

      case NotifyType.MESSAGE:
        if (!descripcion) return "te envio un mensaje";
        return descripcion;

      default:
        return "Tienes una nueva notificación.";
    }
  }

  function getNotify(user: string, type: string, descripcion: string) {
    switch (type) {
      case NotifyType.PUBLICATION_LIKE:
        return (
          <Text
            style={{
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            }}
          >
            A <Text style={{ fontWeight: "bold" }}>{user}</Text> le gusto tu
            publicación.
          </Text>
        );

      case NotifyType.HISTORY_LIKE:
        return (
          <Text
            style={{
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            }}
          >
            A <Text style={{ fontWeight: "bold" }}>{user}</Text> le gusto tu
            historia.
          </Text>
        );

      case NotifyType.COMENT_LIKE:
        return (
          <Text
            style={{
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            }}
          >
            A <Text style={{ fontWeight: "bold" }}>{user}</Text> le gusto tu
            comentario.
          </Text>
        );

      case NotifyType.FOLLOW:
        return (
          <Text
            style={{
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{user}</Text> ha comenzado a
            seguirte.
          </Text>
        );

      case NotifyType.COMENT:
        return (
          <Text
            style={{
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{user}</Text> ha comentado tu
            publicación.
          </Text>
        );

      case NotifyType.PUBLICATION_MENTION:
        return (
          <Text
            style={{
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{user}</Text> te menciono en un
            publicación.
          </Text>
        );

      case NotifyType.HISTORY_MENTION:
        return (
          <Text
            style={{
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{user}</Text> te menciono en un
            historia.
          </Text>
        );

      case NotifyType.COMENT_MENTION:
        return (
          <Text
            style={{
              color:
                theme === "light"
                  ? Colors.light.colors.text
                  : Colors.dark.colors.text,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>{user}</Text> te menciono en un
            comentario.
          </Text>
        );
    }
  }

  return { getDescriptionNotify, getNotify };
};

export default getNotifyMessageHook;
