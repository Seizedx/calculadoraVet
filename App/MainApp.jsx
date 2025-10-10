import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { useTheme } from '../Components/ThemeComponent';
import CustomDrawer from '../Components/CustomDrawerComponent';
import HomeScreen from './Screens/HomeScreen';
import About from './Screens/About';
import Library from './Screens/Library';

import { LoginStack } from './Screens/Authentication/LoginStack';
import { CalculatorsStack } from './Screens/Calculators/CalculatorStack';
import { PlateletCountStack } from './Screens/PlateletCount/PlateletCountStack';
import { HematologicalIndicesStack } from './Screens/HematologicalIndices/HematologicalIndicesStack';
import { WhiteBloodCellCountStack } from './Screens/WhiteBloodCellCount/WhiteBloodCellCountStack';
import { CompleteBloodCountStack } from './Screens/CompleteBloodCount/CompleteBloodCountStack';
import { HistoryStack } from './Screens/History/HistoryStack';

import { setNavigator } from '../Components/NavigationComponent';
import TopBarPatientSearchComponent from '../Components/TopBarPatientSearchComponent';
import { Home, Info, BookOpen } from 'lucide-react-native';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const MainApp = () => {
    const { currentTheme } = useTheme();

    return (
        <NavigationContainer ref={setNavigator}>
            <Drawer.Navigator
                drawerContent={CustomDrawer}
                initialRouteName="HomeScreen"
                screenOptions={{
                    headerShown: false,
                    drawerStyle: {
                        width: '70%',
                        backgroundColor: 'transparent',
                    },
                    drawerActiveBackgroundColor: 'rgba(0, 0, 0, 0.1)',
                    drawerActiveTintColor: currentTheme.activeTintColor,
                    drawerInactiveTintColor: currentTheme.inactiveTintColor,
                    drawerLabelStyle: {
                        fontSize: 20,
                    },
                    drawerItemStyle: {
                        borderRadius: 10,
                        marginHorizontal: 10,
                        marginVertical: 1,
                    },
                }}
            >
                <Drawer.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{
                        title: 'Início',
                        drawerIcon: () => (
                            <Home
                                color={currentTheme.color}
                                size={currentTheme.size}
                                strokeWidth={2}
                            />
                        ),
                    }}
                    initialParams={{
                        title: 'Bem-vindo!',
                        search: false,
                    }}
                />
                <Drawer.Screen
                    name="About"
                    component={About}
                    options={{
                        title: 'Sobre',
                        drawerIcon: () => (
                            <Info
                                color={currentTheme.color}
                                size={currentTheme.size}
                                strokeWidth={2}
                            />
                        ),
                    }}
                    initialParams={{
                        title: 'Sobre',
                        search: false,
                    }}
                />
                <Drawer.Screen
                    name="Library"
                    component={Library}
                    options={{
                        title: 'Biblioteca',
                        drawerIcon: () => (
                            <BookOpen
                                color={currentTheme.color}
                                size={currentTheme.size}
                                strokeWidth={2}
                            />
                        ),
                    }}
                    initialParams={{
                        title: 'Biblioteca de Hematologia Veterinária',
                        search: true,
                    }}
                />
                <Drawer.Screen
                    name="LoginStack"
                    component={LoginStack}
                    options={{
                        drawerItemStyle: { display: 'none' },
                    }}
                    initialParams={{
                        title: 'Login',
                        search: false,
                    }}
                />
                <Drawer.Screen
                    name="CalculatorsStack"
                    component={CalculatorsStack}
                    options={{
                        drawerItemStyle: { display: 'none' },
                    }}
                    initialParams={{
                        title: 'Login',
                        search: false,
                    }}
                />
                <Drawer.Screen
                    name="PlateletCountStack"
                    component={PlateletCountStack}
                    options={{
                        drawerItemStyle: { display: 'none' },
                    }}
                    initialParams={{
                        title: 'Contagem de Plaquetas',
                        search: false,
                    }}
                />
                <Drawer.Screen
                    name="HematologicalIndicesStack"
                    component={HematologicalIndicesStack}
                    options={{
                        drawerItemStyle: { display: 'none' },
                    }}
                    initialParams={{
                        title: 'Índices Hematológicos',
                        search: false,
                    }}
                />
                <Drawer.Screen
                    name="WhiteBloodCellCountStack"
                    component={WhiteBloodCellCountStack}
                    options={{
                        drawerItemStyle: { display: 'none' },
                    }}
                    initialParams={{
                        title: 'Leucograma',
                        search: false,
                    }}
                />
                <Drawer.Screen
                    name="CompleteBloodCountStack"
                    component={CompleteBloodCountStack}
                    options={{
                        drawerItemStyle: { display: 'none' },
                    }}
                    initialParams={{
                        title: 'Hemograma Completo',
                        search: false,
                    }}
                />
                <Drawer.Screen
                    name="HistoryStack"
                    component={HistoryStack}
                    options={{
                        drawerItemStyle: { display: 'none' },
                    }}
                    initialParams={{
                        title: 'Histórico',
                        search: false,
                    }}
                />
                <Drawer.Screen
                    name="TopBarPatientSearchComponent"
                    component={TopBarPatientSearchComponent}
                    options={{
                        drawerItemStyle: { display: 'none' },
                    }}
                    initialParams={{
                        title: 'Pesquisar',
                        search: false,
                    }}
                />
            </Drawer.Navigator>
        </NavigationContainer >
    );
};

export default MainApp;