import * as React from "react";
import { OutsideRoute } from "@/Routes/OutsideRoute";
import { InsideRoute } from "@/Routes/InsideRoute";

export default function TabLayout() {
  const [Authenticate, setAuthenticate] = React.useState<boolean>(true);

  return Authenticate
    ? <InsideRoute/>
    : <OutsideRoute/>
}

