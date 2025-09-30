import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {
    Activity,
    Heart,
    Calculator,
    FileText,
    Microscope,
    TrendingUp,
    Clock,
    User
} from 'lucide-react-native';
import { TopBarComponent } from '../../Components/TopBarComponent';
import { useTheme } from '../../Components/ThemeComponent';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export const Home = () => {
    const { currentTheme, actualTheme } = useTheme();
    const navigation = useNavigation();
    const calculationCards = [
        {
            id: 1,
            title: 'Hemograma Completo',
            subtitle: 'Análise de células sanguíneas',
            icon: Activity,
            color: '#FF6B6B',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
        },
        {
            id: 2,
            title: 'Contagem de Plaquetas',
            subtitle: 'Avaliação da coagulação',
            icon: Heart,
            color: '#4ECDC4',
            backgroundColor: actualTheme === 'light' ? '#4ECDC450' : '#4ECDC430',
        },
        {
            id: 3,
            title: 'Índices Hematológicos',
            subtitle: 'VCM, HCM, CHCM',
            icon: Calculator,
            color: '#45B7D1',
            backgroundColor: actualTheme === 'light' ? '#45B7D150' : '#45B7D130',
        },
        {
            id: 4,
            title: 'Leucograma',
            subtitle: 'Análise de glóbulos brancos',
            icon: Microscope,
            color: '#96CEB4',
            backgroundColor: actualTheme === 'light' ? '#96CEB450' : '#96CEB430',
        },
    ];

    const quickActions = [
        {
            title: 'Histórico',
            icon: Clock,
            color: '#9B59B6',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
        },
        {
            title: 'Relatórios',
            icon: FileText,
            color: '#E67E22',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
        },
        {
            title: 'Pacientes',
            icon: User,
            color: '#3498DB',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
        },
        {
            title: 'Análises',
            icon: TrendingUp,
            color: '#2ECC71',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
        }
    ];

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>


            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <TopBarComponent />
                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeTitle, { color: currentTheme.color }]}>Bem-vindo!</Text>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Selecione o tipo de análise hematológica que deseja realizar
                    </Text>
                </View>

                <View style={styles.cardsContainer}>
                    {calculationCards.map((card) => {
                        const IconComponent = card.icon;
                        return (
                            <TouchableOpacity
                                key={card.id}
                                style={[styles.calculationCard, { backgroundColor: card.backgroundColor }]}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: card.color }]}>
                                    <IconComponent size={28} color={currentTheme.color} strokeWidth={2} />
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

                <View style={styles.quickActionsSection}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>Acesso Rápido</Text>
                    <View style={styles.quickActionsGrid}>
                        {quickActions.map((action, index) => {
                            const IconComponent = action.icon;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.quickActionButton, { backgroundColor: currentTheme.quickAccessBackgroundColor }]}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                                        <IconComponent size={25} color={currentTheme.color} strokeWidth={2} />
                                    </View>
                                    <Text style={[styles.quickActionText, { color: currentTheme.color }]}>{action.title}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

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
    header: {
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    welcomeSection: {
        paddingHorizontal: 20,
        paddingVertical: 25,
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
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
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
    quickActionsSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: 15,
    },
    quickActionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    quickActionButton: {
        width: '48%',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 15,
    },
    quickActionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    quickActionText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
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
