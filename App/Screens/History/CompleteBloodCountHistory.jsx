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
import { loadHistory } from '../../../Components/AsyncStorageHistoryComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { CustomAlertCopy } from '../../../Components/CustomAlertCopy';

export default function CompleteBloodCount() {
    const [history, setHistory] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const scrollViewRef = useRef(null);
    const { currentTheme } = useTheme();

    useEffect(() => {
        loadHistory('CompleteBloodCountHistory', setHistory);
    }, []);

    const renderDetails = (item) => {
        let msg = '';
        msg += `Hemograma Completo:\n`;
        msg += `- Hematócrito: ${item.hematocrit}%\n`;
        msg += `- Hemoglobina: ${item.hemoglobin} g/dL\n`;
        msg += `- Hemácias (RBC): ${item.rbc} milhões/μL\n`;
        msg += `- Leucócitos Totais (WBC): ${item.wbc}/μL\n`;
        msg += `- Plaquetas: ${item.platelets}/μL\n`;
        if (item.rdw) msg += `- RDW: ${item.rdw}\n`;
        msg += `\nÍndices Hematológicos:\n`;
        msg += `- VCM: ${item.mcv} fL\n`;
        msg += `- HCM: ${item.mch} pg\n`;
        msg += `- CHCM: ${item.mchc} g/dL\n`;
        msg += `\nFórmula Leucocitária:\n`;
        msg += `- Neutrófilos: ${item.neutrophils.percentage}% (${item.neutrophils.absolute}/μL)\n`;
        msg += `- Linfócitos: ${item.lymphocytes.percentage}% (${item.lymphocytes.absolute}/μL)\n`;
        msg += `- Monócitos: ${item.monocytes.percentage}% (${item.monocytes.absolute}/μL)\n`;
        msg += `- Eosinófilos: ${item.eosinophils.percentage}% (${item.eosinophils.absolute}/μL)\n`;
        msg += `- Basófilos: ${item.basophils.percentage}% (${item.basophils.absolute}/μL)\n`;
        msg += `- Soma das Percentagens: ${item.totalLeukocytePercentage}%\n`;
        msg += `\nRegistrado em: ${item.date}`;
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
                                    {item.patientSpecies === 'dog' && (
                                        <Dog size={28} color={currentTheme.color} strokeWidth={2} />
                                    )}
                                    {item.patientSpecies === 'cat' && (
                                        <Cat size={28} color={currentTheme.color} strokeWidth={2} />
                                    )}
                                    {!item.patientSpecies && (
                                        <AlertCircle size={28} color={currentTheme.color} strokeWidth={2} />
                                    )}
                                </View>
                                {item.patientAge !== '' && (
                                    <Text style={[styles.cardPatientText, { color: currentTheme.color }]}>Idade: {item.patientAge} anos</Text>
                                )}
                                {item.patientWeight !== '' && (
                                    <Text style={[styles.cardPatientText, { color: currentTheme.color }]}>Peso: {item.patientWeight} kg(s)</Text>
                                )}
                            </View>
                            <Text style={[styles.cardSubtitle, { color: currentTheme.color }]}>{item.calculationType}</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Hematócrito: {item.hematocrit}%</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Hemoglobina: {item.hemoglobin} g/dL</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Hemácias: {item.rbc} milhões/μL</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Leucócitos Totais: {item.wbc}/μL</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Plaquetas: {item.platelets}/μL</Text>
                            {item.rdw && (
                                <Text style={[styles.cardText, { color: currentTheme.color }]}>RDW: {item.rdw}</Text>
                            )}
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>VCM: {item.mcv} fL | HCM: {item.mch} pg | CHCM: {item.mchc} g/dL</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Neutrófilos: {item.neutrophils.percentage}% ({item.neutrophils.absolute}/μL)</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Linfócitos: {item.lymphocytes.percentage}% ({item.lymphocytes.absolute}/μL)</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Monócitos: {item.monocytes.percentage}% ({item.monocytes.absolute}/μL)</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Eosinófilos: {item.eosinophils.percentage}% ({item.eosinophils.absolute}/μL)</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Basófilos: {item.basophils.percentage}% ({item.basophils.absolute}/μL)</Text>
                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Soma das Percentagens: {item.totalLeukocytePercentage}%</Text>
                            <Text style={styles.cardNote}>Registrado em: {item.date}</Text>
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
