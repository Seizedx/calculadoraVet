import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calculator, FileText, CirclePlus as PlusCircle, ChartBar as BarChart3 } from 'lucide-react-native';
import { useTheme } from '../../../Components/ThemeComponent';
import CompleteBloodCountScreen from './CompleteBloodCountScreen';
import CompleteBloodCountReferences from './References';

const Tab = createBottomTabNavigator();

export const CompleteBloodCountStack = () => {
    const { currentTheme } = useTheme();

    return (
        <Tab.Navigator
            initialRouteName='CompleteBloodCountScreen'
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    height: 60,
                    backgroundColor: currentTheme.gradientB,
                },
                tabBarActiveTintColor: currentTheme.activeTintColor,
                tabBarInactiveTintColor: currentTheme.inactiveTintColor,
            }}
        >
            <Tab.Screen
                name="CompleteBloodCountScreen"
                component={CompleteBloodCountScreen}
                initialParams={{
                    title: 'Hemograma Completo',
                    search: false,
                }}
                options={{
                    title: 'Hemograma Completo',
                    tabBarIcon: ({ size, color }) => (
                        <Calculator size={size} color={color} />
                    ),
                }}

            />
            <Tab.Screen
                name="CompleteBloodCountReferences"
                component={CompleteBloodCountReferences}
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