import { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';
import {
    User,
    LogIn,
    LogOut,
} from 'lucide-react-native';
import {
    DrawerItemList,
} from "@react-navigation/drawer";
import { useTheme, ThemeSwitch } from '../Components/ThemeComponent';
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');
import { useAuth } from './AuthComponent';
import { LinearGradient } from 'expo-linear-gradient';
const CustomDrawer = (props) => {
    const { currentTheme, toggleTheme, actualTheme } = useTheme();
    const { authUser, logoutUser } = useAuth();
    const navigation = useNavigation();

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}
        >
            <LinearGradient
                colors={[currentTheme.gradientA, currentTheme.gradientB]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.drawerLogin}>
                    <View style={[styles.iconContainer, {
                        backgroundColor: currentTheme.gradientB,
                        borderColor: currentTheme.color,
                    }]}>
                        <User size={80} color={currentTheme.color} strokeWidth={2} />
                    </View>
                    {authUser === null ? (
                        <View style={styles.drawerLoginButtons}>
                            <Text style={[styles.drawerLoginText, { color: currentTheme.color }]}>Usuário Atual:</Text>
                            <Text style={[styles.drawerLoginText1, { color: currentTheme.color }]}>Anônimo</Text>
                            <TouchableOpacity
                                style={[styles.buttonZone, { backgroundColor: currentTheme.buttonColor }]}
                                activeOpacity={0.3}
                                onPress={() => navigation.navigate('LoginStack')}
                            >
                                <View style={styles.buttonTextArea}>
                                    <LogIn size={25} color={currentTheme.color} strokeWidth={3} />
                                    <Text style={[styles.buttonText, { color: currentTheme.color }]}>Entrar</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.drawerLoginButtons}>
                            <Text style={[styles.drawerLoginText, { color: currentTheme.color }]}>Usuário Atual:</Text>
                            <Text style={[styles.drawerLoginText1, { color: currentTheme.color }]}>{authUser?.email && authUser?.displayName ? authUser?.displayName : authUser?.email}</Text>
                            <TouchableOpacity
                                style={[styles.buttonZone, { backgroundColor: currentTheme.buttonColor }]}
                                activeOpacity={0.3}
                                onPress={logoutUser}
                            >
                                <View style={styles.buttonTextArea}>
                                    <LogOut size={25} color={currentTheme.color} strokeWidth={3} />
                                    <Text style={[styles.buttonText, { color: currentTheme.color }]}>Sair</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={styles.themeButtonArea}>
                    <ThemeSwitch />
                </View>
                <DrawerItemList {...props} />
            </LinearGradient>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
    header: {
        flex: 1,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
    },
    drawerLogin: {
        marginTop: 60,
        alignItems: 'center',
        height: width * 0.6,
    },
    iconContainer: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 4,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    drawerLoginButtons: {
        alignItems: 'center',
    },
    drawerLoginText: {
        marginTop: 10,
        fontSize: 18,
    },
    drawerLoginText1: {
        marginBottom: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },
        buttonZone: {
        marginTop: 10,
        padding: 10,
        width: width * 0.55,
        borderRadius: 10,
        marginBottom: 15,
    },
    buttonTextArea: {
        marginLeft: -35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 27,
        fontWeight: 'bold',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: 'bold',
    },
    themeButtonArea: {
        alignItems: 'flex-end',
        marginTop: 20,
        marginBottom: 10,
        paddingRight: 10,
    },
});


export default CustomDrawer;