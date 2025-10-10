import { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity
} from 'react-native';
import {
    AlertCircle,
    Dog,
    Cat
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { CustomAlertCopy } from '../../../Components/CustomAlertCopy';

export default function HematologicalIndicesHistory() {
    const [history, setHistory] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const scrollViewRef = useRef(null);
    const { currentTheme } = useTheme();

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const storedHistory = await AsyncStorage.getItem('HematologicalIndicesHistory');
                if (storedHistory) {
                    const parsedHistory = JSON.parse(storedHistory);
                    const limitedHistory = parsedHistory.slice(-30);
                    setHistory(limitedHistory);

                    if (parsedHistory.length > 30) {
                        await AsyncStorage.setItem('HematologicalIndicesHistory', JSON.stringify(limitedHistory));
                    }
                }
            } catch (error) {
                Alert.alert('Erro ao carregar histórico:', error.message);
            }
        };
        loadHistory();
    }, []);

    const renderDetails = (item) => {
        let msg = '';
        msg += `Hemograma:\n`;
        msg += `- Hematócrito: ${item.hematocrit} %\n`;
        msg += `- Hemoglobina: ${item.hemoglobin} g/dL\n`;
        msg += `- Hemácias: ${item.rbcCount} milhões/μL\n\n`;
        msg += `Índices Calculados:\n`;
        msg += `- VCM: ${item.mcv} fL\n`;
        msg += `- HCM: ${item.mch} pg\n`;
        msg += `- CHCM: ${item.mchc} g/dL\n\n`;
        msg += `Registrado em: ${item.date}`;
        return msg;
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}
            >
                <TopBarComponent />
                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Histórico dos cálculos de índices hematológicos realizados. Clique para mais detalhes.
                    </Text>
                </View>

                {history.length === 0 ? (
                    <Text style={[styles.emptyText, { color: currentTheme.color }]}>Nenhum cálculo registrado.</Text>
                ) : (
                    [...history].reverse().map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.3}
                            style={[
                                styles.historyCard,
                                { backgroundColor: currentTheme.quickAccessBackgroundColor, borderColor: currentTheme.color }
                            ]}
                            onPress={() => setSelectedItem(item)}
                        >
                            <View style={styles.patientArea}>
                                <View style={styles.patientNameAndIconArea}>
                                    <Text style={[styles.cardTitle, { color: currentTheme.color }]}>
                                        {item.patientName}
                                    </Text>
                                    {item.patientSpecies === 'Cachorro' && (
                                        <Dog size={28} color={currentTheme.color} strokeWidth={2} />
                                    )}
                                    {item.patientSpecies === 'Gato' && (
                                        <Cat size={28} color={currentTheme.color} strokeWidth={2} />
                                    )}
                                    {!item.patientSpecies && (
                                        <AlertCircle size={28} color={currentTheme.color} strokeWidth={2} />
                                    )}
                                </View>
                                {item.patientAge !== '' && (
                                    <Text style={[styles.cardPatientText, { color: currentTheme.color }]}>
                                        Idade: {item.patientAge} anos
                                    </Text>
                                )}
                                {item.patientWeight !== '' && (
                                    <Text style={[styles.cardPatientText, { color: currentTheme.color }]}>
                                        Peso: {item.patientWeight} kg(s)
                                    </Text>
                                )}
                            </View>
                            <Text style={[styles.cardSubtitle, { color: currentTheme.color }]}>
                                {item.calculationType}
                            </Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                Hematócrito: {item.hematocrit} %
                            </Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                Hemoglobina: {item.hemoglobin} g/dL
                            </Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                Hemácias: {item.rbcCount} milhões/μL
                            </Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                VCM: {item.mcv} fL | HCM: {item.mch} pg | CHCM: {item.mchc} g/dL
                            </Text>
                            <Text style={styles.cardNote}>
                                Registrado em: {item.date}
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
                <View style={{ marginBottom: 50 }}></View>
            </ScrollView>

            {selectedItem && (
                <CustomAlertCopy
                    visible={!!selectedItem}
                    title={selectedItem.patientName}
                    subTitle={selectedItem.calculationType}
                    patientAge={selectedItem.patientAge}
                    patientWeight={selectedItem.patientWeight}
                    message={renderDetails(selectedItem)}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    historyCard: {
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 15,
        marginVertical: 8,
        borderWidth: 1,
    },
    patientArea: {
        alignItems: 'flex-start',
    },
    cardPatientText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    patientNameAndIconArea: {
        fontSize: 18,
        fontWeight: 'bold',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: 14,
        lineHeight: 20,
    },
    cardNote: {
        marginTop: 8,
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'right',
    },
});
