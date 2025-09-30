import { 
    StyleSheet,
    View,
    StatusBar,
} from 'react-native';
import { useTheme } from '../Components/ThemeComponent';

const StatusBarComponent = () => {
    const { currentTheme } = useTheme();
        return (
            <View style={styles.container}>
                <StatusBar
                barStyle={currentTheme.barStyle}
                // backgroundColor={currentTheme.statusBarBackgroundColor}
                backgroundColor="transparent"
                translucent={true}
                />
            </View>

    );
}

const styles = StyleSheet.create({
    container: {
    },
});

export default StatusBarComponent;