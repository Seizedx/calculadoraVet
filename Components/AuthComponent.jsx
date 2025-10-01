import { useState, useEffect, useContext, createContext } from 'react';
import { Alert } from 'react-native';

import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut
} from '@react-native-firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // obtém instância do auth (modular)
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser({
                    email: user.email,
                    uid: user.uid,
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
                {
                    text: 'OK',
                    onPress: () => resolve(true),
                },
            ]);
        });
    };

    const createUser = async (inputEmail, inputPassword) => {
        if (!inputEmail) {
            Alert.alert('E-mail faltando!', 'Por favor, insira seu endereço de e-mail.');
            return false;
        }
        if (!inputPassword) {
            Alert.alert('Senha faltando!', 'Por favor, insira uma senha.');
            return false;
        }
        if (inputPassword.length < 6) {
            Alert.alert('Senha fraca!', 'A senha deve ter pelo menos 6 caracteres.');
            return false;
        }

        try {
            await createUserWithEmailAndPassword(auth, inputEmail, inputPassword);

            // depois de criar, desloga
            await signOut(auth);
            setAuthUser(null);

            await awaitAlert('Usuário registrado.', 'Você agora pode fazer login e gerenciar sua conta.');
            return true;
        } catch (error) {
            console.log('ERRO AO CRIAR USUÁRIO:', error.code, error.message);
            handleAuthErrors(error);
            return false;
        }
    };

    const loginUser = async (inputEmail, inputPassword) => {
        if (!inputEmail) {
            Alert.alert('E-mail faltando.', 'Por favor, insira seu endereço de e-mail.');
            return false;
        }
        if (!inputPassword) {
            Alert.alert('Senha faltando.', 'Por favor, insira sua senha.');
            return false;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, inputEmail, inputPassword);
            const user = userCredential.user;
            setAuthUser({
                email: user.email,
                uid: user.uid,
            });
            await awaitAlert('Usuário conectado!', 'Você agora pode gerenciar sua conta.');
            return true;
        } catch (error) {
            handleAuthErrors(error);
            return false;
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
            Alert.alert('Usuário desconectado.', 'Você foi desconectado com sucesso.');
            return true;
        } catch (error) {
            handleAuthErrors(error);
            return false;
        }
    };

    const forgotPassword = async (inputEmail) => {
        if (!inputEmail) {
            Alert.alert('E-mail inválido.', 'Por favor, insira um endereço de e-mail para redefinir sua senha.');
            return false;
        }

        return new Promise((resolve) => {
            Alert.alert(
                'Redefinir senha.',
                `Deseja redefinir senha do email ${inputEmail}?`,
                [
                    {
                        text: 'Não',
                        style: 'cancel',
                        onPress: () => resolve(false),
                    },
                    {
                        text: 'Sim',
                        onPress: async () => {
                            try {
                                await sendPasswordResetEmail(auth, inputEmail);
                                await awaitAlert(
                                    'E-mail enviado.',
                                    'Enviamos um link de redefinição de senha para o e-mail informado.'
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

    const handleAuthErrors = (error) => {
        switch (error.code) {
            case 'auth/invalid-email':
                Alert.alert('E-mail inválido.', 'Por favor, forneça um endereço de e-mail válido.');
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
                Alert.alert('Operação não permitida.', 'O registro com e-mail/senha está desativado.');
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

    return (
        <AuthContext.Provider
            value={{
                authUser,
                loading,
                createUser,
                loginUser,
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
