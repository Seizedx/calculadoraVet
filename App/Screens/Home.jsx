import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert
} from 'react-native';
import {
    Activity,
    Heart,
    Calculator,
    Microscope,
} from 'lucide-react-native';
import { TopBarComponent } from '../../Components/TopBarComponent';
import QuickActionsComponent from '../../Components/QuickActionsComponent';
import { useTheme } from '../../Components/ThemeComponent';
import { useNavigation } from '@react-navigation/native';

export const Home = () => {
    const { currentTheme, actualTheme } = useTheme();
    const navigation = useNavigation();

    // Espera OK do Alert
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

    const handleNavigation = async (route) => {
        try {
            if (typeof route !== 'string' || !route) {
                await awaitAlert('Erro', 'Rota inválida fornecida.');
                navigation.navigate('Home');
                return true;
            }

            if (navigation.getState().routeNames.includes(route)) {
                navigation.navigate(route);
                return false;
            } else {
                await awaitAlert(
                    'Erro ao navegar.',
                    `Rota ${route} não foi encontrada. Retornando à Página Inicial.`
                );
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }], ////////////caso queira ir para outra tela
                });
                return true;
            }
        } catch (error) {
            await awaitAlert('Erro', `Algo deu errado: ${error.message}. Por favor, tente novamente mais tarde.`);
            return false;
        }
    };

    const HomeCards = [
        {
            id: 1,
            title: 'Calculadoras para Doação de Sangue',                        //original
            subtitle: 'CPDA, hematócritos, infusão, proporção peso/volume, etc.',        //original
            icon: Calculator,                                 //original
            iconType: 'icon',
            color: '#ff3737',
            backgroundColor: actualTheme === 'light' ? '#ff373750' : '#ff373730',
            location: 'CalculatorsStack',
        },
        {
            id: 2,
            title: 'Contagem de Plaquetas',                 //original
            subtitle: 'Avaliação da coagulação',            //original
            icon: Heart,                                    //original
            iconType: 'icon',
            color: '#4ECDC4',
            backgroundColor: actualTheme === 'light' ? '#4ECDC450' : '#4ECDC430',
            location: 'PlateletCountStack',
        },
        {
            id: 3,
            title: 'Índices Hematológicos',                 //original
            subtitle: 'VCM, HCM, CHCM',                     //original
            icon: Calculator,                               //original
            iconType: 'icon',
            color: '#45B7D1',
            backgroundColor: actualTheme === 'light' ? '#45B7D150' : '#45B7D130',
            location: 'HematologicalIndices',
        },
        {
            id: 4,
            title: 'Leucograma',
            subtitle: 'Análise de glóbulos brancos',
            icon: Microscope,
            iconType: 'icon',
            color: '#96CEB4',
            backgroundColor: actualTheme === 'light' ? '#96CEB450' : '#96CEB430',
            location: 'WhiteBloodCellCount',
        },
        {
            id: 5,
            title: 'Hemograma Completo',                    //original
            subtitle: 'Análise de células sanguíneas',      //original
            icon: Activity,                                 //original
            iconType: 'icon',
            color: '#FF6B6B',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
            location: 'CompleteBloodCount',
        },
    ];

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <TopBarComponent />
                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Selecione o tipo de análise hematológica ou cálculo que deseja realizar
                    </Text>
                </View>

                <View style={styles.cardsContainer}>
                    {HomeCards.map((card) => {
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
                <QuickActionsComponent />
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: currentTheme.color }]}>Em desenvolvimento.</Text>
                </View>
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
        paddingVertical: 25,
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
    calculationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        marginBottom: 15,
        borderRadius: 16,
    },
    iconContainer: {
        width: 70,//50 pro icon lucide
        height: 70,//50 pro icon lucide
        borderRadius: 15, //25 pro icon lucide
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
    footer: {
        marginTop: 55,
        marginBottom: 15,
    },
    footerText: {
        position: 'absolute',
        bottom: -10,
        left: 30,
    }
});

export default Home;
