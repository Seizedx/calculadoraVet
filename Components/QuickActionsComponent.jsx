import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {
    FileText,
    TrendingUp,
    Clock,
    User
} from 'lucide-react-native';
import { useTheme } from './ThemeComponent';
import { useNavigation } from '@react-navigation/native';

export default function QuickActionsComponent({ ignore = [] }) {
    const { currentTheme, actualTheme } = useTheme();
    const navigation = useNavigation();

    const awaitAlert = (title, message) => {
        return new Promise((resolve) => {
            Alert.alert(title, message, [
                { text: 'OK', onPress: () => resolve(true) },
            ]);
        });
    };

    const handleNavigation = async (route) => {
        if (navigation.getState().routeNames.includes(route)) {
            navigation.navigate(route);
        } else {
            await awaitAlert(`Rota ${route} não encontrada.`, 'Retornando a Página Inicial');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        }
    };

    const quickActions = [
        {
            title: 'Histórico',
            icon: Clock,
            color: '#9B59B6',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
            location: 'HistoryStack',
        },
        {
            title: 'Relatórios',
            icon: FileText,
            color: '#E67E22',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
            location: 'Report',
        },
        {
            title: 'Pacientes',
            icon: User,
            color: '#3498DB',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
            location: 'Patient',
        },
        {
            title: 'Análises',
            icon: TrendingUp,
            color: '#2ECC71',
            backgroundColor: actualTheme === 'light' ? '#ff6b6b50' : '#ff6b6b30',
            location: 'Analisis',
        }
    ];

    return (
        <View style={styles.quickActionsSection}>
            <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>Acesso Rápido</Text>
            <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    const isIgnored = ignore.includes(action.title);

                    return (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.quickActionButton,
                                { backgroundColor: currentTheme.quickAccessBackgroundColor },
                                isIgnored && styles.ignoredButton
                            ]}
                            activeOpacity={isIgnored ? 1 : 0.7}
                            onPress={() => !isIgnored && handleNavigation(action.location)}
                            disabled={isIgnored}
                        >
                            <View style={[
                                styles.quickActionIcon,
                                { backgroundColor: action.color },
                                isIgnored && styles.ignoredIcon
                            ]}>
                                <IconComponent
                                    size={25}
                                    color={isIgnored ? '#999' : currentTheme.color}
                                    strokeWidth={2}
                                />
                            </View>
                            <Text
                                style={[
                                    styles.quickActionText,
                                    { color: isIgnored ? '#999' : currentTheme.color }
                                ]}
                            >
                                {action.title}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    quickActionsSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
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
    ignoredButton: {
        opacity: 0.4,
    },
    ignoredIcon: {
        backgroundColor: '#ccc',
    }
});
