import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import QuickActionsContainer from '../../../Components/QuickActionsComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import { useNavigation } from '@react-navigation/native';
import { resetToRoute } from '../../../Components/NavigationComponent';



export const CalculatorList = () => {
    const { currentTheme, actualTheme } = useTheme();
    const navigation = useNavigation();

    const handleNavigation = (route) => {
        if (navigation.getState().routeNames.includes(route)) {
            navigation.navigate(route);
        } else {
            Alert.alert(`Rota ${route} não encontrada!`);
            setTimeout(() => resetToRoute('HomeScreen'), 100);
        }
    };

    const calculatorCards = [
        {
            id: 1,
            title: 'Volume de Sangue que Deve Ser Doado',
            subtitle: 'Cálculo de volume de sangue que pode ser doado proporcional ao peso + CPDA',
            icon: require('../../../src/images/dogIcon.png'),
            iconType: 'image',
            color: '#FF6B6B',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
            location: 'DonatedBlood',
        },
        {
            id: 2,
            title: 'Dimensionamento de sangue e CPDA',
            subtitle: 'Cálculo de volume de sangue e CPDA dimensionado em bolsa ou seringa especíifica',
            icon: require('../../../src/images/bloodIcon.png'),
            iconType: 'image',
            color: '#4ECDC4',
            backgroundColor: actualTheme === 'light' ? '#4ECDC450' : '#4ECDC430',
            location: 'CPDAVolume',
        },
        {
            id: 3,
            title: 'Volume de Transfusão',
            subtitle: 'Cálculo de volume sangue + CPDA necessário para alcançar determinado hematócrito',
            icon: require('../../../src/images/catIcon.png'),
            iconType: 'image',
            color: '#45B7D1',
            backgroundColor: actualTheme === 'light' ? '#45B7D150' : '#45B7D130',
            location: 'TransfusionVolume',
        },
        {
            id: 4,
            title: 'Taxa de Infusão em Gota',
            subtitle: 'Cálculo para determinar taxa de infusão em gota por tempo ou volume personalizado',
            icon: require('../../../src/images/dropIcon.png'),
            iconType: 'image',
            color: '#96CEB4',
            backgroundColor: actualTheme === 'light' ? '#96CEB450' : '#96CEB430',
            location: 'DropRate',
        },
    ]
    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <TopBarComponent />
                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Selecione o tipo de cálculo que deseja realizar
                    </Text>
                </View>
                <View style={styles.cardsContainer}>
                    {calculatorCards.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <TouchableOpacity
                                key={card.id}
                                style={[styles.calculationCard, { backgroundColor: card.backgroundColor }]}
                                activeOpacity={0.7}
                                onPress={() => handleNavigation(card.location)}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
                                    {card.iconType === 'image' ?
                                        <Image style={styles.iconImage} source={card.icon} />
                                        :
                                        <IconComponent size={28} color={currentTheme.color} strokeWidth={2} />
                                    }
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={[styles.cardTitle, { color: currentTheme.color }]}>{card.title}</Text>
                                    <Text style={[styles.cardSubtitle, { color: currentTheme.color }]}>{card.subtitle}</Text>
                                </View>
                                <View style={styles.cardArrow}>
                                    <Text style={[styles.arrowText, { color: card.color }]}>›</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
                <QuickActionsContainer />
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcomeSection: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    welcomeSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    cardsContainer: {
        paddingHorizontal: 20,
    },
    calculationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginBottom: 15,
        borderRadius: 16,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    iconImage: {
        height: 50,
        width: 50,
        resizeMode: 'contain',
    },
    icon: {
        height: 50,
        width: 50,
        resizeMode: 'contain',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#7F8C8D',
    },
    cardArrow: {
        marginLeft: 10,
    },
    arrowText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
