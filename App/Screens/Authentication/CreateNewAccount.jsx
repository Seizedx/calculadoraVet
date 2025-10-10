import { useState, useRef } from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';
import {
    User,
    UserRoundPlus
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { useAuth } from '../../../Components/AuthComponent';
import { resetToRoute } from '../../../Components/NavigationComponent';

const { width, height } = Dimensions.get('window');

const CreateNewAccount = () => {
    const { currentTheme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);
    const inputEmailRef = useRef(null);
    const inputPasswordRef = useRef(null);
    const inputRepeatPasswordRef = useRef(null);
    const [inputEmail, setInputEmail] = useState('');
    const [inputPassword, setInputPassword] = useState('');
    const [inputRepeatPassword, setInputRepeatPassword] = useState('');
    const navigation = useNavigation();
    const { createUser } = useAuth();

    async function CreateNewAccountButton() {
        if (inputPassword === inputRepeatPassword) {
            try {
                const success = await createUser(inputEmail, inputPassword);
                if (success) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    setTimeout(() => resetToRoute('HomeScreen'), 100);
                } else {
                    Alert.log("Cadastro não foi concluído (validação falhou ou erro ocorreu).");
                }
            } catch (error) {
                Alert.error("Erro inesperado:", error);
            }
        } else {
            Alert.alert('Dados inválidos', 'Senha e confirmação de senha devem ser iguais');
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
                    <Text style={[styles.mainSubtitleText, { color: currentTheme.color }]}>Preencha os dados da realizar o cadastro.</Text>
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
                        <Text style={[styles.textInputText, { color: currentTheme.color }]}>Senha: </Text>
                        <View style={styles.textInputPasswordArea}>
                            <TextInput
                                scrollEnabled={false}
                                multiline={false}
                                textAlign="center"
                                style={[styles.textInput, { color: currentTheme.color }]}
                                ref={inputPasswordRef}
                                placeholder='Digite sua senha'
                                placeholderTextColor={currentTheme.inactiveTintColor}
                                value={inputPassword}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => {
                                    setInputPassword(text)
                                }}
                                keyboardType="text"
                                returnKeyType="next"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onSubmitEditing={() => inputRepeatPasswordRef.current?.focus()}

                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.togglePasswordButton}
                            >
                                <Text style={styles.textShowPass}>{showPassword ? '🙉' : '🙈'}</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.textInputText, { color: currentTheme.color }]}>Repetir Senha: </Text>
                        <View style={styles.textInputPasswordArea}>
                            <TextInput
                                scrollEnabled={false}
                                multiline={false}
                                textAlign="center"
                                style={[styles.textInput, { color: currentTheme.color }]}
                                ref={inputRepeatPasswordRef}
                                placeholder='Insira sua senha novamente'
                                placeholderTextColor={currentTheme.inactiveTintColor}
                                value={inputRepeatPassword}
                                underlineColorAndroid='transparent'
                                onChangeText={(text) => {
                                    setInputRepeatPassword(text)
                                }}
                                keyboardType="text"
                                returnKeyType="done"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.togglePasswordButton}
                            >
                                <Text style={styles.textShowPass}>{showPassword ? '🙉' : '🙈'}</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.buttonZone, { backgroundColor: currentTheme.buttonColor }]}
                            activeOpacity={0.3}
                            onPress={CreateNewAccountButton}
                        >
                            <View style={styles.buttonTextArea}>
                                <UserRoundPlus size={25} color={currentTheme.color} strokeWidth={3} />
                                <Text style={[styles.buttonText, { color: currentTheme.color }]}>Criar Conta</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ marginBottom: 50 }}></View>
                    </View>
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
    textInputPasswordArea: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    togglePasswordButton: {
        position: 'absolute',
        right: 5,
        bottom: 25,
    },
    textShowPass: {
        fontSize: 25,
    },
    buttonZone: {
        marginTop: 20,
        padding: 10,
        width: width * 0.85,
        borderRadius: 10,
        marginBottom: 10,
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
    optionsArea: {
        margin: 10,
    },
    optionsText: {
        fontSize: 13,
    },
});

export default CreateNewAccount;