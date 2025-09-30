import { createStackNavigator } from '@react-navigation/stack';
import CalculatorsHistory from './CalculatorsHistory';
import PlateletCountHistory from './PlateletCountHistory';
import { HistoryList } from './HistoryScreen';

const Stack = createStackNavigator();

export const HistoryStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                initialRouteName: 'HistoryList',
                headerShown: false,
                animation: 'none',
                // transitionSpec: {
                //     open: { animation: 'timing', config: { duration: 200 } },
                //     close: { animation: 'timing', config: { duration: 200 } },
                // },
            }}
        >
            <Stack.Screen
                name="HistoryList"
                component={HistoryList}
                initialParams={{
                    title: 'Históricos',
                    search: false,
                }}
            />
            <Stack.Screen
                name="CalculatorsHistory"
                component={CalculatorsHistory}
                initialParams={{
                    title: 'Histórico de Cálculos',
                    search: false,
                }}
            />
            <Stack.Screen
                name="PlateletCountHistory"
                component={PlateletCountHistory}
                initialParams={{
                    title: 'Histórico de Contagem de Plaquetas',
                    search: false,
                }}
            />
        </Stack.Navigator>
    );
}
