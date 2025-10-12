import { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity
} from 'react-native';
import { AlertCircle, Dog, Cat } from 'lucide-react-native';
import { loadHistory } from '../../../Components/AsyncStorageHistoryComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { CustomAlertCopy } from '../../../Components/CustomAlertCopy';

export default function PlateletHistory() {
    const [history, setHistory] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const scrollViewRef = useRef(null);
    const { currentTheme } = useTheme();

    const REFERENCE_VALUES = {
        dog: { min: 200000, max: 500000 },
        cat: { min: 300000, max: 800000 },
    };

    useEffect(() => {
        loadHistory('plateletHistory', setHistory);
    }, []);

    const getPlateletStatus = (count, patientSpecies) => {
        const ref = REFERENCE_VALUES[patientSpecies ?? 'dog'];
        if (count < ref.min) return { status: 'Baixo', color: currentTheme.dangerColor };
        if (count > ref.max) return { status: 'Alto', color: currentTheme.warningColor };
        return { status: 'Normal', color: currentTheme.successColor };
    };

    const plateletCountMessage = (item) => {
        let msg = `Contagem de Plaquetas: ${item.plateletCount?.toLocaleString() ?? 0} /µL\n`;
        msg += `Fator de Conversão: ${item.microLitersNumber} /µL\n`;
        msg += `Status: ${getPlateletStatus(item.plateletCount, item.patientSpecies?.toLowerCase() === 'dog' ? 'dog' : 'cat').status}\n\n`;
        msg += `Registrado em: ${item.date}`;

        return msg;
    };


    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                <TopBarComponent />
                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Histórico de contagens de plaquetas realizados. Clique para mais informações.
                    </Text>
                </View>

                {history.length === 0 ? (
                    <Text style={[styles.emptyText, { color: currentTheme.color }]}>
                        Nenhum cálculo registrado.
                    </Text>
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
                                        {item.patientName || 'Paciente Não Cadastrado'}
                                    </Text>
                                    {item.patientSpecies === 'dog' && <Dog size={28} color={currentTheme.color} />}
                                    {item.patientSpecies === 'cat' && <Cat size={28} color={currentTheme.color} />}
                                    {!item.patientSpecies && <AlertCircle size={28} color={currentTheme.color} />}
                                </View>
                                {item.patientAge && (
                                    <Text style={[styles.cardPatientText, { color: currentTheme.color }]}>
                                        Idade: {item.patientAge} anos
                                    </Text>
                                )}
                                {item.patientWeight && (
                                    <Text style={[styles.cardPatientText, { color: currentTheme.color }]}>
                                        Peso: {item.patientWeight} kg
                                    </Text>
                                )}
                            </View>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                Contagem de Plaquetas: {item.plateletCount?.toLocaleString() ?? 0} /µL
                            </Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                Fator de Conversão: {item.microLitersNumber} /µL
                            </Text>
                            <Text style={[styles.cardNote, { color: currentTheme.color }]}>
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
                    subTitle={'Avaliação de Coagulação:'}
                    patientAge={selectedItem.patientAge}
                    patientWeight={selectedItem.patientWeight}
                    message={plateletCountMessage(selectedItem)}
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
        alignItems: 'center'
    },
    welcomeSubtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center'
    },
    historyCard: {
        padding: 15,
        marginHorizontal: 20,
        borderRadius: 15,
        marginVertical: 8,
        borderWidth: 1
    },
    patientArea: {
        alignItems: 'flex-start'
    },
    cardPatientText: {
        fontSize: 13,
        fontWeight: 'bold'
    },
    patientNameAndIconArea: {
        fontSize: 18,
        fontWeight: 'bold',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    examStatus: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    countText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    countUnit: {
        fontSize: 12,
        marginTop: -2
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    },
    cardNote: {
        marginTop: 8,
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'left'
    }
});