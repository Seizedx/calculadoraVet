import { useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import { FileText, Dog, Cat, Calendar, User, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent }from '../../../Components/TopBarComponent';
import { analyzePlateletCount, PlateletCount } from '../PlateletCount/Platelet';

// Dados de exemplo - em uma aplicação real, viriam do storage/banco
const MOCK_EXAMS: PlateletCount[] = [
    {
        id: '1',
        animalName: 'Rex',
        species: 'dog',
        age: 5,
        weight: 25.5,
        plateletCount: 450000,
        date: new Date('2024-01-15'),
        notes: 'Animal saudável, exame de rotina',
    },
    {
        id: '2',
        animalName: 'Mimi',
        species: 'cat',
        age: 3,
        weight: 4.2,
        plateletCount: 150000,
        date: new Date('2024-01-14'),
        notes: 'Apresentando sinais de letargia',
    },
    {
        id: '3',
        animalName: 'Bobby',
        species: 'dog',
        age: 8,
        weight: 30.0,
        plateletCount: 750000,
        date: new Date('2024-01-13'),
    },
];

export default function PlateletCountHistory() {
    const { currentTheme } = useTheme();
    const [exams] = useState<PlateletCount[]>(MOCK_EXAMS);

    const showExamDetails = (exam: PlateletCount) => {
        const analysis = analyzePlateletCount(exam.plateletCount, exam.species);

        Alert.alert(
            `Detalhes - ${exam.animalName}`,
            `Espécie: ${exam.species === 'dog' ? 'Cão' : 'Gato'}\n` +
            `Idade: ${exam.age} anos\n` +
            `Peso: ${exam.weight} kg\n` +
            `Contagem: ${exam.plateletCount.toLocaleString()}/µL\n` +
            `Status: ${analysis.interpretation}\n\n` +
            `Data: ${exam.date.toLocaleDateString('pt-BR')}\n` +
            `${exam.notes ? `\nObservações: ${exam.notes}` : ''}`,
            [{ text: 'OK' }]
        );
    };

    const getStatusColor = (count: number, species: 'dog' | 'cat') => {
        const analysis = analyzePlateletCount(count, species);
        switch (analysis.status) {
            case 'low':
                return currentTheme.dangerColor;
            case 'high':
                return currentTheme.warningColor;
            case 'normal':
                return currentTheme.successColor;
            default:
                return currentTheme.inactiveTintColor;
        }
    };

    const getStatusText = (count: number, species: 'dog' | 'cat') => {
        const analysis = analyzePlateletCount(count, species);
        switch (analysis.status) {
            case 'low':
                return 'Baixo';
            case 'high':
                return 'Alto';
            case 'normal':
                return 'Normal';
            default:
                return 'Indefinido';
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TopBarComponent />

                <View style={styles.content}>
                    <View style={[
                        styles.iconContainer,
                        { backgroundColor: currentTheme.gradientB, borderColor: currentTheme.color }
                    ]}>
                        <FileText size={80} color={currentTheme.color} strokeWidth={2} />
                    </View>
                    {exams.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={[styles.emptyText, { color: currentTheme.inactiveTintColor }]}>
                                Nenhum exame registrado ainda.
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.examsList}>
                            {exams.map((exam) => (
                                <TouchableOpacity
                                    key={exam.id}
                                    style={[
                                        styles.examCard,
                                        { backgroundColor: currentTheme.quickAccessBackgroundColor, borderColor: currentTheme.color }
                                    ]}
                                    onPress={() => showExamDetails(exam)}
                                >
                                    <View style={styles.examHeader}>
                                        <View style={styles.examInfo}>
                                            <View style={styles.examTitleRow}>
                                                {exam.species === 'dog' ? (
                                                    <Dog size={24} color={currentTheme.color} />
                                                ) : (
                                                    <Cat size={24} color={currentTheme.color} />
                                                )}
                                                <Text style={[styles.examName, { color: currentTheme.color }]}>
                                                    {exam.animalName}
                                                </Text>
                                            </View>

                                            <View style={styles.examDetails}>
                                                <View style={styles.examDetailRow}>
                                                    <Calendar size={16} color={currentTheme.inactiveTintColor} />
                                                    <Text style={[styles.examDate, { color: currentTheme.inactiveTintColor }]}>
                                                        {exam.date.toLocaleDateString('pt-BR')}
                                                    </Text>
                                                </View>

                                                <Text style={[styles.examSpecies, { color: currentTheme.inactiveTintColor }]}>
                                                    {exam.species === 'dog' ? 'Cão' : 'Gato'} • {exam.age} anos • {exam.weight} kg
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.examStatus}>
                                            <Text style={[styles.countText, { color: currentTheme.color }]}>
                                                {exam.plateletCount.toLocaleString()}
                                            </Text>
                                            <Text style={[styles.countUnit, { color: currentTheme.inactiveTintColor }]}>
                                                /µL
                                            </Text>
                                            <View style={[
                                                styles.statusBadge,
                                                { backgroundColor: getStatusColor(exam.plateletCount, exam.species) }
                                            ]}>
                                                <Text style={styles.statusText}>
                                                    {getStatusText(exam.plateletCount, exam.species)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {exam.notes && (
                                        <Text style={[styles.examNotes, { color: currentTheme.inactiveTintColor }]}>
                                            {exam.notes}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    iconContainer: {
        marginTop: 20,
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 8,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    examsList: {
        gap: 15,
    },
    examCard: {
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
    },
    examHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    examInfo: {
        flex: 1,
    },
    examTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    examName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    examDetails: {
        gap: 4,
    },
    examDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    examDate: {
        fontSize: 14,
    },
    examSpecies: {
        fontSize: 14,
    },
    examStatus: {
        alignItems: 'flex-end',
    },
    countText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    countUnit: {
        fontSize: 12,
        marginTop: -2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    examNotes: {
        marginTop: 12,
        fontSize: 14,
        fontStyle: 'italic',
    },
});