import { createStackNavigator } from '@react-navigation/stack';
import  LoginScreen from './LoginScreen';
import CreateNewAccount from './CreateNewAccount';
import RecoverPassword from './RecoverPassword';

const Stack = createStackNavigator();

export const LoginStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                initialRouteName: 'LoginScreen',
                headerShown: false,
                animation: 'none',
                // animation: 'fade',
                // transitionSpec: {
                //     open: { animation: 'timing', config: { duration: 200 } },
                //     close: { animation: 'timing', config: { duration: 200 } },
                // },
            }}
        >
            <Stack.Screen
                name="LoginScreen"
                component={LoginScreen}
                initialParams={{
                    title: 'Acessar sua Conta',
                    search: false,
                }}
            />
            <Stack.Screen
                name="RecoverPassword"
                component={RecoverPassword}
                initialParams={{
                    title: 'Recuperar Senha',
                    search: false,
                }}
            />
            <Stack.Screen
                name="CreateNewAccount"
                component={CreateNewAccount}
                initialParams={{
                    title: 'Criar Nova Conta',
                    search: false,
                }}
            />
        </Stack.Navigator>
    );
};