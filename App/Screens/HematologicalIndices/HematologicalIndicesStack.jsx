import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calculator, FileText, CirclePlus as PlusCircle, ChartBar as BarChart3 } from 'lucide-react-native';
import { useTheme } from '../../../Components/ThemeComponent';
import HematologicalIndicesScreen from './HematologicalIndicesScreen';

import HematologicalIndicesReferences from './References';

const Tab = createBottomTabNavigator();

export const HematologicalIndicesStack = () => {
    const { currentTheme } = useTheme();

    return (
        <Tab.Navigator
            initialRouteName='HematologicalIndicesScreen'
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
                name="HematologicalIndicesScreen"
                component={HematologicalIndicesScreen}
                initialParams={{
                    title: 'Índices Hematológicos',
                    search: false,
                }}
                options={{
                    title: 'Índices Hematológicos',
                    tabBarIcon: ({ size, color }) => (
                        <Calculator size={size} color={color} />
                    ),
                }}

            />
            <Tab.Screen
                name="HematologicalIndicesReferences"
                component={HematologicalIndicesReferences}
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