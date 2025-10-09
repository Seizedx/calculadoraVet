import { createDrawerNavigator } from '@react-navigation/drawer';
import 'react-native-gesture-handler';
import { useTheme } from '../Components/ThemeComponent';
import CustomDrawer from '../Components/CustomDrawerComponent';
import Home from './Screens/Home';
import About from './Screens/About';
import Library from './Screens/Library';

import { LoginStack } from './Screens/Authentication/LoginStack';
import { CalculatorsStack } from './Screens/Calculators/CalculatorStack';
import { PlateletCountStack } from './Screens/PlateletCount/PlateletCountStack';
import { HematologicalIndices } from './Screens/HematologicalIndices/HematologicalIndices';
import { WhiteBloodCellCount } from './Screens/WhiteBloodCellCount/WhiteBloodCellCount';
import { HistoryStack } from './Screens/History/HistoryStack';

import { setNavigator } from '../Components/NavigationComponent';
import TopBarPatientSearchComponent from '../Components/TopBarPatientSearchComponent';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

const MainApp = () => {
    const { currentTheme } = useTheme();

    return (
        <NavigationContainer ref={setNavigator}>
            <Drawer.Navigator
                drawerContent={CustomDrawer}
                initialRouteName="Home"
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
                    name="Home"
                    component={Home}
                    options={{
                        title: 'Início',
                        drawerIcon: () => (
                            <MaterialCommunityIcons
                                name="home-outline"
                                color={currentTheme.color}
                                size={currentTheme.size}
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
                            <MaterialCommunityIcons
                                name="information-outline"
                                color={currentTheme.color}
                                size={currentTheme.size}
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
                            <MaterialCommunityIcons
                                name="notebook-outline"
                                color={currentTheme.color}
                                size={currentTheme.size}
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
                    name="HematologicalIndices"
                    component={HematologicalIndices}
                    options={{
                        //drawerItemStyle: { display: 'none' },
                    }}
                    initialParams={{
                        title: 'Índices Hematológicos',
                        search: false,
                    }}
                />
                <Drawer.Screen
                    name="WhiteBloodCellCount"
                    component={WhiteBloodCellCount}
                    options={{
                        //drawerItemStyle: { display: 'none' },
                    }}
                    initialParams={{
                        title: 'Leucograma',
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