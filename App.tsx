import { SafeAreaProvider } from "react-native-safe-area-context";
import MainRoute from "./Routes/MainRoute";
import { AuthenticateProvider } from "./context/AuthenticateContext/AuthenticateContext";
import { UserProvider } from "./context/UserContext/UserContext";
// import { UploadProvider } from "./context/UploadContext/UploadContext";
// import { ImageBankProvider } from "./context/ImageBankContext/ImageBankContext";
// import { NotifyProvider } from "./context/NotifyContext/NotifyContext";

export default function App() {
  return (
    <SafeAreaProvider>
      <Authenticated>
        <UserData>
          {/* <UploadMedia> */}
          {/* <Notify> */}
            {/* <ImageBank> */}
            <MainRoute />
            {/* </ImageBank> */}
          {/* </Notify> */}
          {/* </UploadMedia> */}
        </UserData>
      </Authenticated>
    </SafeAreaProvider>
  );
}

const Authenticated = ({ children }: any) => {
  return <AuthenticateProvider>{children}</AuthenticateProvider>;
};

const UserData = ({ children }: any) => {
  return <UserProvider>{children}</UserProvider>;
};

// const UploadMedia = ({ children }: any) => {
//   return <UploadProvider>{children}</UploadProvider>;
// };

// const ImageBank = ({ children }: any) => {
//   return <ImageBankProvider>{children}</ImageBankProvider>;
// };

// const Notify = ({ children }: any) => {
//   return <NotifyProvider>{children}</NotifyProvider>;
// };
