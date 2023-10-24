import {View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

export default function LoginScreen() {
  const [loggedIn, setloggedIn] = useState(false);
  const [userInfo, setuserInfo] = useState([]);

  const signIn = async () => {
    try {
      console.log('here1');
      await GoogleSignin.hasPlayServices();
      console.log('here2');
      const googleUserInfo = await GoogleSignin.signIn();
      console.log('here3');
      const token = await GoogleSignin.getTokens();
      // console.log('here4');
      setuserInfo({googleUserInfo});
      console.log('here5');
      setloggedIn(true);
      console.log('here6');
      const credential = auth.GoogleAuthProvider.credential(token);
      console.log('here7');
      await auth().signInWithCredential(credential);
      console.log('here8');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log('operation (e.g. sign in) is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log('play services not available or outdated');
      } else {
        // some other error happened
        console.log('some other error happened');
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], // what API you want to access on behalf of the user, default is email and profile
      webClientId:
        '767981484176-ck7sf1iifrvn4u1v4b2rudcb2cdqod8m.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => {
          signIn();
        }}
      />
      {loggedIn && <Text>log in successful</Text>}
    </View>
  );
}
