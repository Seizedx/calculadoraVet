import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import {
    House,
    Menu,
    Search
} from 'lucide-react-native';
import { useTheme } from './ThemeComponent';
import { useNavigation, DrawerActions, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export const getFormattedDateTime = () => {
  const now = new Date();
  const formattedDate = now.toLocaleDateString('pt-BR');
  const formattedTime = now.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return { formattedDate, formattedTime };
};

export const TopBarComponent = () => {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const screenTitle = route.params?.title ?? route.name;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[currentTheme.gradientA, currentTheme.gradientB]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.buttonArea}>
                    <TouchableOpacity
                        style={styles.menuButton1}
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    >
                        <Menu size={40} color={currentTheme.color} strokeWidth={3} />

                    </TouchableOpacity>
                    {route.params.search ? (
                        <TouchableOpacity
                            style={styles.menuButton1}
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        >
                            <Search size={40} color={currentTheme.color} strokeWidth={3} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.menuButton1}
                            onPress={() => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Home' }], ////////////caso queira ir para outra tela
                                });
                            }
                            }
                        >
                            <House size={40} color={currentTheme.color} strokeWidth={3} />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={[styles.headerTitle, { color: currentTheme.color }]}>{screenTitle}</Text>
            </LinearGradient >
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    buttonArea: {
        marginTop: 40,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        marginBottom: 5,
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
});
