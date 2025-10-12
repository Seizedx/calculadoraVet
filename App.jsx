import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from "./Components/StatusBarComponent";
import { ThemeProvider } from "./Components/ThemeComponent";
import { AuthProvider } from "./Components/AuthComponent";
import MainApp from "./App/MainApp";
import AppLoader from "./Components/AppLoaderComponent";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function App() {
    return (
        <AppLoader>
            <KeyboardAwareScrollView
                style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0)' }]}
                contentContainerStyle={{ flexGrow: 1 }}
                enableOnAndroid={true}
                extraScrollHeight={-50}
                keyboardShouldPersistTaps="handled"
            >
                <SafeAreaView
                    style={styles.container}
                    edges={['right', 'bottom', 'left']}
                >
                    <AuthProvider>
                        <ThemeProvider>
                            <StatusBarComponent />
                            <MainApp />
                        </ThemeProvider>
                    </AuthProvider>
                </SafeAreaView>
            </KeyboardAwareScrollView>
        </AppLoader>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
