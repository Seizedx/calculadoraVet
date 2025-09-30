import { useState, useRef } from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert
} from 'react-native';
import {
    User,
    RotateCcwKey
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { useAuth, authUser } from '../../../Components/AuthComponent';
const { width, height } = Dimensions.get('window');

const RecoverPassword = () => {
    const { currentTheme } = useTheme();
    const inputEmailRef = useRef(null);
    const inputPasswordRef = useRef(null);
    const [inputEmail, setInputEmail] = useState('');
    const navigation = useNavigation();
    const { forgotPassword } = useAuth();

    async function RecoverPasswordButton() {
        try {
            const success = await forgotPassword(inputEmail);
            if (success) {
                await new Promise(resolve => setTimeout(resolve, 200));
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }], ////////////caso queira ir para outra tela
                });
            } else {
                Alert.error("Email não enviado, tente novamente.");
            }
        } catch (error) {
            Alert.error("Erro inesperado: ", error);
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsHorizontalScrollIndicator={false}>
                <TopBarComponent />
                <View style={[styles.mainView, { backgroundColor: currentTheme.backgroundColor }]}>
                    <View style={[styles.iconContainer, {
                        backgroundColor: currentTheme.gradientB,
                        borderColor: currentTheme.color,
                    }]}>
                        <User size={180} color={currentTheme.color} strokeWidth={2} />
                    </View>

                    <Text style={[styles.mainSubtitleText, { color: currentTheme.color }]}>Insira o Email da conta que deseja recuperar a senha.</Text>
                </View>
                <View style={styles.textInputArea}>
                    <Text style={[styles.textInputText, { color: currentTheme.color }]}>Email:</Text>
                    <TextInput
                        scrollEnabled={false}
                        multiline={false}
                        textAlign="center"
                        style={[styles.textInput, { color: currentTheme.color }]}
                        ref={inputEmailRef}
                        placeholder='Digite seu@email.com'
                        placeholderTextColor={currentTheme.inactiveTintColor}
                        value={inputEmail}
                        underlineColorAndroid='transparent'
                        onChangeText={(text) => {
                            setInputEmail(text)
                        }}
                        keyboardType="text"
                        returnKeyType="next"
                        onSubmitEditing={() => inputPasswordRef.current?.focus()}
                    />
                    <TouchableOpacity
                        style={[styles.buttonZone, { backgroundColor: currentTheme.buttonColor }]}
                        activeOpacity={0.3}
                        onPress={RecoverPasswordButton}
                    >
                        <View style={styles.buttonTextArea}>
                            <RotateCcwKey size={35} color={currentTheme.color} strokeWidth={2} />
                            <Text style={[styles.buttonText, { color: currentTheme.color }]}>Recuperar Senha</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainView: {
        flex: 1,
        marginBottom: 50,
    },
    iconContainer: {
        marginTop: 30,
        width: 250,
        height: 250,
        borderRadius: 250,
        borderWidth: 15,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    mainSubtitleText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    textInputArea: {
        alignItems: 'center',
    },
    textInput: {
        marginBottom: 20,
        paddingHorizontal: 50,
        width: width * 0.8,
        textAlign: 'center',
        borderWidth: 1,
        borderColor: '#676767',
        borderRadius: 10,
    },
    textInputText: {
        marginBottom: 10,
        fontSize: 18,
        alignSelf: 'flex-start',
        paddingLeft: 50,
    },
    buttonZone: {
        marginTop: 20,
        padding: 10,
        width: width * 0.85,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonTextArea: {
        marginLeft: -40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 15
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 27,
        fontWeight: 'bold',
    },
});

export default RecoverPassword;