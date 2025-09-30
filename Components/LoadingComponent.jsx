import { 
    StyleSheet,
    View,
    ActivityIndicator,
} from 'react-native';

const LoadingComponent = () => {
    return (
        <View style={styles.loadingView}>
            <ActivityIndicator
                color='#ffffff'
                backgroundColor='transparent'
                size={'large'}
                style={styles.loading}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    loadingView: {
      backgroundColor: '#000000',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loading: {
        transform: 'scale(5)',
    },
});

export default LoadingComponent;