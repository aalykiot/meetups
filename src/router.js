import { createStackNavigator } from "react-navigation";

import SignInScreen from './screens/SignIn';
import SignUpScreen from './screens/SignUp';

const SignInNavigator = createStackNavigator({
  SignIn: {
    screen: SignInScreen,
  },
  SignUp: {
    screen: SignUpScreen
  }
});

export {
  SignInNavigator
};
