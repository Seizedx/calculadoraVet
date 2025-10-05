import { CommonActions } from '@react-navigation/native';

let navigatorRef;

export const setNavigator = (ref) => {
    navigatorRef = ref;
};

export const goToRoute = (routeName, params = {}) => {
    if (!navigatorRef) {
        console.warn('⚠️ Navegador ainda não inicializado');
        return;
    }

    navigatorRef.dispatch(
        CommonActions.navigate({
            name: routeName,
            params,
        })
    );
};

export const resetToRoute = (routeName, params = {}) => {
    if (!navigatorRef) {
        console.warn('⚠️ Navegador ainda não inicializado');
        return;
    }

    navigatorRef.dispatch(
        CommonActions.reset({
            index: 0,
            routes: [{ name: routeName, params }],
        })
    );
};
