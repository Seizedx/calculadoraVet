import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import StatusBarComponent from "./Components/StatusBarComponent";
import { ThemeProvider } from "./Components/ThemeComponent";
import { AuthProvider } from "./Components/AuthComponent";
import MainApp from "./App/MainApp";
import AppLoader from "./Components/AppLoaderComponent";

export default function App() {
    return (
        <AppLoader>
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
        </AppLoader>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
