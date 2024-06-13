import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { Link, router } from "expo-router";
import Loginpage from "./components/Loginpage/Loginpage";

import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
WebBrowser.maybeCompleteAuthSession();
interface iUser{
  [key:string]:any
}
const index = () => {
  const [userInfo, setUserInfo] = React.useState<iUser>();
  const [loading, setLoading] = React.useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      "77892197521-ti1oh26rj4ananapr9aa4p0sf6duvmdl.apps.googleusercontent.com",
    androidClientId:
      "77892197521-dte0fpb0klofoa9heae81knj8srh7p8c.apps.googleusercontent.com",
  });

  const checkLocalUser = async () => {
    try{
      setLoading(true);
      const userJSON = await AsyncStorage.getItem("@user");
      const userData = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch(e:any){
      alert(e.message);
    } finally{
      setLoading(false);
    }
  }
  React.useEffect(() => {
    if (response?.type == "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log("yes");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [response]);

  React.useEffect(() => {
    checkLocalUser();
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(JSON.stringify(user, null, 2));
        setUserInfo(user);
        await AsyncStorage.setItem("@user", JSON.stringify(user));
      } else {
        console.log("else");
      }
    });
    return () => unsub();
  }, []);
  // return true ? <Loginpage promptAsync={promptAsync} /> : <Text>Sorry</Text>;
  // <View style={styles.container}>
  //   {1 > 2 ? <Text>Hi</Text> : <Loginpage promptAsync={promptAsync} />}
  //   {/* <Link href="./components/Loginpage/Loginpage">Hi</Link> */}
  // </View>
  if(loading){
    return(
      <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }
  if(userInfo){
    return(
      <View style={{flex:1 }}>
        <Text>Hello</Text>
      </View>
    );
  }
  else{
    return (
      <View style={{ flex:1 }}>
        <Loginpage promptAsync={promptAsync} />
      </View>
    );
  }
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  login: {
    flex: 1,
  },
});
