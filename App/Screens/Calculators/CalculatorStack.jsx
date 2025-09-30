import { createStackNavigator } from '@react-navigation/stack';
import CPDAVolumeCalculator from './CPDAVolumeCalculator';
import TransfusionVolumeCalculator from './TransfusionVolumeCalculator';
import DropRateCalculator from './DropRateCalculator';
import VolumeOfBloodDonated from './VolumeOfBloodDonated';
import { CalculatorList } from './CalculatorScreen';
import { HistoryStack } from '../History/HistoryStack';


const Stack = createStackNavigator();

export const CalculatorsStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                initialRouteName: 'CalculatorList',
                headerShown: false,
                animation: 'none',
                // transitionSpec: {
                //     open: { animation: 'timing', config: { duration: 200 } },
                //     close: { animation: 'timing', config: { duration: 200 } },
                // },
            }}
        >
            <Stack.Screen
                name="CalculatorList"
                component={CalculatorList}
                initialParams={{
                    title: 'Cálculos Hematológicos',
                    search: false,
                }}
            />
            <Stack.Screen
                name="DonatedBlood"
                component={VolumeOfBloodDonated}
                initialParams={{
                    title: 'Volume de Sangue Doado + CPDA',
                    search: false,
                }}
            />
            <Stack.Screen
                name="CPDAVolume"
                component={CPDAVolumeCalculator}
                initialParams={{
                    title: 'Volume de Sangue e CPDA Doado',
                    search: false,
                }}
            />
            <Stack.Screen
                name="TransfusionVolume"
                component={TransfusionVolumeCalculator}
                initialParams={{
                    title: 'Volume de Transfusão',
                    search: false,
                }}
            />
            <Stack.Screen
                name="DropRate"
                component={DropRateCalculator}
                initialParams={{
                    title: 'Taxa de Infusão',
                    search: false,
                }}
            />
            <Stack.Screen
                name="HistoryStack"
                component={HistoryStack}
                initialParams={{
                    title: 'Históricos',
                    search: false,
                }}
            />
        </Stack.Navigator>
    );
}
