import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calculator, CirclePlus as PlusCircle, ChartBar as BarChart3 } from 'lucide-react-native';
import { useTheme } from '../../../Components/ThemeComponent';
import WhiteBloodCellCountScreen from './WhiteBloodCellCountScreen';

import WhiteBloodCellCountReferences from './References';

const Tab = createBottomTabNavigator();

export const WhiteBloodCellCountStack = () => {
    const { currentTheme } = useTheme();

    return (
        <Tab.Navigator
            initialRouteName='WhiteBloodCellCountScreen'
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 50,
                    backgroundColor: currentTheme.gradientB,
                },
                tabBarActiveTintColor: currentTheme.activeTintColor,
                tabBarInactiveTintColor: currentTheme.inactiveTintColor,
            }}
        >
            <Tab.Screen
                name="WhiteBloodCellCountScreen"
                component={WhiteBloodCellCountScreen}
                initialParams={{
                    title: 'Leucograma',
                    search: false,
                }}
                options={{
                    title: 'Leucograma',
                    tabBarIcon: ({ size, color }) => (
                        <Calculator size={size} color={color} />
                    ),
                }}

            />
            <Tab.Screen
                name="WhiteBloodCellCountReferences"
                component={WhiteBloodCellCountReferences}
                initialParams={{
                    title: 'Referências',
                    search: false,
                }}
                options={{
                    unmountOnBlur: true,
                    title: 'Referências',
                    tabBarIcon: ({ size, color }) => (
                        <BarChart3 size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}