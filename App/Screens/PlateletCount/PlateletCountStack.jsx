import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calculator, FileText, CirclePlus as PlusCircle, ChartBar as BarChart3 } from 'lucide-react-native';
import { useTheme } from '../../../Components/ThemeComponent';
import PlateletCountScreen from './PlateletCountScreen';
import PlateletCountAddExam from './AddExam';
import PlateletCountHistory from '../History/PlateletCountHistory';
import PlateletCountReferences from './References';

const Tab = createBottomTabNavigator();

export const PlateletCountStack = () => {
    const { currentTheme } = useTheme();

    return (
        <Tab.Navigator
            initialRouteName='PlateletCountScreen'
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
                name="PlateletCountScreen"
                component={PlateletCountScreen}
                initialParams={{
                    title: 'Contagem de Plaquetas',
                    search: false,
                }}
                options={{
                    title: 'Contagem',
                    tabBarIcon: ({ size, color }) => (
                        <Calculator size={size} color={color} />
                    ),
                }}

            />
            <Tab.Screen
                name="PlateletCountAddExam"
                component={PlateletCountAddExam}
                initialParams={{
                    title: 'Novo Exame de Plaquetas',
                    search: false,
                }}
                options={{
                    title: 'Novo Exame',
                    tabBarIcon: ({ size, color }) => (
                        <PlusCircle size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="PlateletCountHistory"
                component={PlateletCountHistory}
                initialParams={{
                    title: 'Histórico de Exames',
                    search: false,
                }}
                options={{
                    title: 'Históricos',
                    tabBarIcon: ({ size, color }) => (
                        <FileText size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="PlateletCountReferences"
                component={PlateletCountReferences}
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