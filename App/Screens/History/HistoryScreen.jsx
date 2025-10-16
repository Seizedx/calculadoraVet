import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import {
    FileText,
} from 'lucide-react-native';

import { TopBarComponent } from '../../../Components/TopBarComponent';
import QuickActionsComponent from '../../../Components/QuickActionsComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import { useNavigation } from '@react-navigation/native';
import { resetToRoute } from '../../../Components/NavigationComponent';

export const HistoryList = () => {
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
            title: 'Histórico de Cálculos',
            subtitle: 'Proporção e Dimensionamento entre Sangue e CPDA, Volume de Transfusão e Taxa de Infusão',
            icon: FileText,
            iconType: 'icon',
            color: '#d46d00ff',
            backgroundColor: actualTheme === 'light' ? '#d46d0050' : '#d46d0030',
            location: 'CalculatorsHistory',
        },
        {
            id: 2,
            title: 'Histórico de Contagem de Plaquetas',
            subtitle: 'Informações referentes a contagem de plaquetas',
            icon: FileText,
            iconType: 'icon',
            color: '#91d400ff',
            backgroundColor: actualTheme === 'light' ? '#91d40050' : '#91d40030',
            location: 'PlateletCountHistory',
        },
        {
            id: 3,
            title: 'Histórico de Índices Hematológicos',
            subtitle: 'VCM, HCM e CHCM baseado nos valores do hemograma',
            icon: FileText,
            iconType: 'icon',
            color: '#00d451ff',
            backgroundColor: actualTheme === 'light' ? '#00d45150' : '#00d45130',
            location: 'HematologicalIndicesHistory',
        },
                {
            id: 4,
            title: 'Histórico de Leucogramas',
            subtitle: 'Valores absolutos e percentuais dos leucócitos',
            icon: FileText,
            iconType: 'icon',
            color: '#014562ff',
            backgroundColor: actualTheme === 'light' ? '#01456250' : '#01456230',
            location: 'WhiteBloodCellCountHistory',
        },
                {
            id: 5,
            title: 'Histórico de Hemograma Completos',
            subtitle: 'Análise de hemograma completo',
            icon: FileText,
            iconType: 'icon',
            color: '#9400d4ff',
            backgroundColor: actualTheme === 'light' ? '#9400d450' : '#9400d430',
            location: 'CompleteBloodCountHistory',
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
                        Selecionar o histórico desejado
                    </Text>
                </View>
                <View style={styles.cardsContainer}>
                    {calculatorCards.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <TouchableOpacity
                                key={card.id}
                                style={[styles.historyCard, { backgroundColor: card.backgroundColor }]}
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
                <QuickActionsComponent ignore={['Histórico']} />
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
    welcomeSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
    },
    cardsContainer: {
        paddingHorizontal: 20,
    },
    historyCard: {
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
