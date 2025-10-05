import { useState, useEffect, useContext, createContext } from 'react';
import { Alert } from 'react-native';
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    GoogleAuthProvider,
    signInWithCredential,
} from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { resetToRoute } from './NavigationComponent';

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    offlineAccess: true,
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser({
                    uid: user.uid,
                    email: user.email,
                    name: user.displayName || '',
                });
            } else {
                setAuthUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [auth]);

    const awaitAlert = (title, message) => {
        return new Promise((resolve) => {
            Alert.alert(title, message, [
                { text: 'OK', onPress: () => resolve(true) },
            ]);
        });
    };

    const handleAuthErrors = (error) => {
        switch (error.code) {
            case 'auth/invalid-email':
                Alert.alert('E-mail inválido.', 'Forneça um endereço de e-mail válido.');
                break;
            case 'auth/email-already-in-use':
                Alert.alert('E-mail em uso.', 'Este e-mail já está registrado. Tente outro.');
                break;
            case 'auth/weak-password':
                Alert.alert('Senha fraca.', 'A senha deve ter pelo menos 6 caracteres.');
                break;
            case 'auth/too-many-requests':
                Alert.alert('Muitas tentativas.', 'Tente novamente mais tarde.');
                break;
            case 'auth/network-request-failed':
                Alert.alert('Erro de rede.', 'Verifique sua conexão com a internet.');
                break;
            case 'auth/operation-not-allowed':
                Alert.alert('Operação não permitida.', 'Registro com e-mail/senha desativado.');
                break;
            case 'auth/invalid-credential':
                Alert.alert('Credenciais inválidas.', 'As credenciais fornecidas estão incorretas.');
                break;
            case 'auth/account-exists-with-different-credential':
                Alert.alert('Conflito de conta.', 'Este e-mail está vinculado a outro método de login.');
                break;
            case 'auth/user-not-found':
                Alert.alert('Usuário não encontrado.', 'Não existe uma conta com este e-mail.');
                break;
            case 'auth/wrong-password':
            case 'auth/missing-password':
                Alert.alert('Senha incorreta.', 'O e-mail ou a senha estão incorretos.');
                break;
            case 'auth/user-disabled':
                Alert.alert('Conta desativada.', 'Esta conta foi desativada. Contate o suporte.');
                break;
            default:
                Alert.alert('Erro.', 'Algo deu errado. Por favor, tente novamente mais tarde.');
                break;
        }
    };

    const createUser = async (email, password) => {
        if (!email) {
            Alert.alert('E-mail faltando!', 'Insira seu endereço de e-mail.');
            return false;
        }
        if (!password) {
            Alert.alert('Senha faltando!', 'Insira sua senha.');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Senha fraca!', 'A senha deve ter pelo menos 6 caracteres.');
            return false;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await signOut(auth);
            setAuthUser(null);
            await awaitAlert('Usuário registrado.', 'Você agora pode fazer login e gerenciar sua conta.');
            return true;
        } catch (error) {
            console.log('Erro criar usuário:', error);
            handleAuthErrors(error);
            return false;
        }
    };

    const loginUser = async (email, password) => {
        if (!email) {
            Alert.alert('E-mail faltando.', 'Insira seu endereço de e-mail.');
            return false;
        }
        if (!password) {
            Alert.alert('Senha faltando.', 'Insira sua senha.');
            return false;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            setAuthUser({
                uid: user.uid,
                email: user.email,
                name: user.displayName || '',
            });

            await awaitAlert('Usuário conectado!', 'Você agora pode gerenciar sua conta.');
            setTimeout(() => resetToRoute('Home'), 100);
            return true;

        } catch (error) {
            handleAuthErrors(error);
            return false;

        } finally {
            console.log('Login Auth Funcionou');
        }
    };

    const loginWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
            const response = await GoogleSignin.signIn();

            if (!response?.data?.idToken) {
                console.error('Falha ao obter ID Token do Google', response);
                return false;
            }

            const credential = GoogleAuthProvider.credential(response.data.idToken);
            const userCredential = await signInWithCredential(auth, credential);
            const user = userCredential.user;

            setAuthUser({
                uid: user.uid,
                email: user.email,
                name: user.displayName || '',
            });

            await awaitAlert('Usuário conectado!', 'Você agora pode gerenciar sua conta.');
            setTimeout(() => resetToRoute('Home'), 100);
            return true;

        } catch (error) {
            switch (error.code) {
                case 'SIGN_IN_CANCELLED':
                    Alert.alert('Login cancelado pelo usuário.');
                    break;
                case 'IN_PROGRESS':
                    Alert.alert('Login já em andamento.');
                    break;
                case 'PLAY_SERVICES_NOT_AVAILABLE':
                    Alert.alert('Google Play Services não disponível ou desatualizado.');
                    break;
                case 'DEVELOPER_ERROR':
                    Alert.alert('Erro de configuração.', 'Verifique Web Client ID e SHA-1 no Firebase.');
                    break;
                default:
                    console.log('Erro login Google:', error);
                    Alert.alert('Erro no login com Google', error.message || 'Algo deu errado.');
                    break;
            }
            return false;
        } finally {
            console.log('Login Google Funcionou');
        }
    };

    const logoutUser = async () => {
        if (!auth.currentUser) {
            Alert.alert('Nenhum usuário conectado.', 'Você já está desconectado.');
            return false;
        }
        try {
            await signOut(auth);
            setAuthUser(null);

            await GoogleSignin.signOut();

            Alert.alert('Usuário desconectado.', 'Você foi desconectado com sucesso.');
            return true;
        } catch (error) {
            handleAuthErrors(error);
            return false;
        }
    };

    const forgotPassword = async (email) => {
        if (!email) {
            Alert.alert('E-mail inválido.', 'Insira um endereço de e-mail para redefinir sua senha.');
            return false;
        }

        return new Promise((resolve) => {
            Alert.alert(
                'Redefinir senha.',
                `Deseja redefinir senha do email ${email}?`,
                [
                    { text: 'Não', style: 'cancel', onPress: () => resolve(false) },
                    {
                        text: 'Sim',
                        onPress: async () => {
                            try {
                                await sendPasswordResetEmail(auth, email);
                                await awaitAlert(
                                    'E-mail enviado.',
                                    'Um link de redefinição de senha foi enviado para o e-mail informado.'
                                );
                                resolve(true);
                            } catch (error) {
                                handleAuthErrors(error);
                                resolve(false);
                            }
                        },
                    },
                ]
            );
        });
    };

    return (
        <AuthContext.Provider
            value={{
                authUser,
                loading,
                createUser,
                loginUser,
                loginWithGoogle,
                logoutUser,
                forgotPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export const useAuthState = () => {
    const { authUser, loading } = useContext(AuthContext);
    return { authUser, loading };
};
