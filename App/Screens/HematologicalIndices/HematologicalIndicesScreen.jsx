import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Alert,
    Keyboard,
} from 'react-native';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../../../Components/CustomTextInput';
import { useState, useRef } from 'react';
import { Calculator, Info, RotateCcw } from 'lucide-react-native';

export const HematologicalIndicesScreen = () => {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();

    const [hematocrit, setHematocrit] = useState('');
    const [hemoglobin, setHemoglobin] = useState('');
    const [rbcCount, setRbcCount] = useState('');
    const [results, setResults] = useState(null);

    // Refs para inputs e scroll
    const hematocritRef = useRef(null);
    const hemoglobinRef = useRef(null);
    const rbcCountRef = useRef(null);
    const scrollViewRef = useRef(null);

    // Dados fictícios para log (substitua por dados reais se necessário)
    const patientName = '';
    const patientAge = '';
    const patientRace = '';
    const patientWeight = '';
    const formattedDate = new Date().toLocaleDateString();
    const formattedTime = new Date().toLocaleTimeString();

    const saveToHistory = async (indices) => {
        try {
            const historyEntry = {
                patientName: patientName || 'Paciente Não Cadastrado',
                patientAge: patientAge || '',
                patientSpecies: patientRace || '',
                patientWeight: patientWeight || '',
                date: `${formattedDate}, ${formattedTime}`,
                calculationType: 'Índices Hematológicos',
                hematocrit,
                hemoglobin,
                rbcCount,
                mcv: indices.mcv,
                mch: indices.mch,
                mchc: indices.mchc,
            };

            const existingHistory = await AsyncStorage.getItem('HematologicalIndicesHistory');
            let historyArray;
            try {
                historyArray = existingHistory ? JSON.parse(existingHistory) : [];
                if (!Array.isArray(historyArray)) {
                    historyArray = [historyArray];
                }
            } catch (err) {
                historyArray = [];
            }

            historyArray.push(historyEntry);
            await AsyncStorage.setItem('HematologicalIndicesHistory', JSON.stringify(historyArray));
        } catch (error) {
            console.error('Erro ao salvar o objeto:', error);
        }
    };

    const calculateIndices = async () => {
        if (!hematocrit.trim() || !hemoglobin.trim() || !rbcCount.trim()) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const hct = parseFloat(hematocrit);
        const hgb = parseFloat(hemoglobin);
        const rbc = parseFloat(rbcCount) * 1000000; // Converter para células/μL

        if (isNaN(hct) || isNaN(hgb) || isNaN(rbc) || hct <= 0 || hgb <= 0 || rbc <= 0) {
            Alert.alert('Erro', 'Os valores devem ser maiores que zero e numéricos.');
            return;
        }

        // Cálculos dos índices hematológicos
        const mcv = (hct / rbc) * 10; // Volume Corpuscular Médio (fL)
        const mch = (hgb / rbc) * 10; // Hemoglobina Corpuscular Média (pg)
        const mchc = (hgb / hct) * 100; // Concentração de Hemoglobina Corpuscular Média (g/dL)

        const indices = {
            mcv: mcv.toFixed(2),
            mch: mch.toFixed(2),
            mchc: mchc.toFixed(2),
        };

        setResults(indices);

        Keyboard.dismiss();
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 200);

        await saveToHistory(indices);
    };

    const resetForm = () => {
        setHematocrit('');
        setHemoglobin('');
        setRbcCount('');
        setResults(null);
        hematocritRef.current?.focus();
    };

    const showInfo = (index) => {
        const infoText = {
            mcv: 'VCM (Volume Corpuscular Médio): Mede o tamanho médio das hemácias. Valores normais: 80-100 fL.',
            mch: 'HCM (Hemoglobina Corpuscular Média): Quantidade média de hemoglobina por hemácia. Valores normais: 27-32 pg.',
            mchc: 'CHCM (Concentração de Hemoglobina Corpuscular Média): Concentração média de hemoglobina nas hemácias. Valores normais: 32-36 g/dL.'
        };
        Alert.alert('Informação', infoText[index]);
    };

    const getIndexStatus = (value, type) => {
        if (type === 'mcv') {
            if (value < 80) return { status: 'Baixo', color: '#f59e0b' };
            if (value > 100) return { status: 'Alto', color: '#ef4444' };
            return { status: 'Normal', color: '#10b981' };
        }
        if (type === 'mch') {
            if (value < 27) return { status: 'Baixo', color: '#f59e0b' };
            if (value > 32) return { status: 'Alto', color: '#ef4444' };
            return { status: 'Normal', color: '#10b981' };
        }
        if (type === 'mchc') {
            if (value < 32) return { status: 'Baixo', color: '#f59e0b' };
            if (value > 36) return { status: 'Alto', color: '#ef4444' };
            return { status: 'Normal', color: '#10b981' };
        }
        return { status: 'Normal', color: '#10b981' };
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef}>
                <TopBarComponent />
                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Cálculo dos índices hematológicos (VCM, HCM, CHCM) baseado nos valores do hemograma.
                    </Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Hematócrito (%):
                    </Text>
                    <CustomTextInput
                        ref={hematocritRef}
                        value={hematocrit}
                        onChangeText={setHematocrit}
                        placeholder="Valor em %"
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => hemoglobinRef.current?.focus()}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Hemoglobina (g/dL):
                    </Text>
                    <CustomTextInput
                        ref={hemoglobinRef}
                        value={hemoglobin}
                        onChangeText={setHemoglobin}
                        placeholder="Valor em g/dL"
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => rbcCountRef.current?.focus()}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Contagem de Hemácias (milhões/μL):
                    </Text>
                    <CustomTextInput
                        ref={rbcCountRef}
                        value={rbcCount}
                        onChangeText={setRbcCount}
                        placeholder="Valor em milhões/μL"
                        keyboardType="numeric"
                        returnKeyType="done"
                        onSubmitEditing={Keyboard.dismiss}
                        style={styles.input}
                    />
                </View>

                <View style={styles.buttonZone}>
                    <TouchableOpacity
                        style={[styles.calculateButton, { backgroundColor: currentTheme.buttonColor }]}
                        onPress={calculateIndices}
                        activeOpacity={0.8}
                    >
                        <Calculator size={25} color={currentTheme.color} strokeWidth={3} />
                        <Text style={[styles.buttonText, { color: currentTheme.color }]}>
                            Calcular Índices
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.resetButton, { backgroundColor: currentTheme.unselectedButtonColor }]}
                        onPress={resetForm}
                        activeOpacity={0.8}
                    >
                        <RotateCcw size={25} color={currentTheme.color} strokeWidth={3} />
                        <Text style={[styles.buttonText, { color: currentTheme.color }]}>
                            Limpar
                        </Text>
                    </TouchableOpacity>
                </View>

                {results && (
                    <View style={[styles.resultContainer, { backgroundColor: currentTheme.resultBackgroundColor }]}>
                        <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                            Resultados dos Índices
                        </Text>
                        <View style={styles.resultItem}>
                            <View style={styles.resultHeader}>
                                <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                    VCM (Volume Corpuscular Médio)
                                </Text>
                                <TouchableOpacity onPress={() => showInfo('mcv')}>
                                    <Info size={20} color={currentTheme.color} strokeWidth={2} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                {results.mcv} fL
                            </Text>
                            <Text style={[styles.resultStatus, {
                                color: getIndexStatus(parseFloat(results.mcv), 'mcv').color
                            }]}>
                                {getIndexStatus(parseFloat(results.mcv), 'mcv').status}
                            </Text>
                        </View>
                        <View style={styles.resultItem}>
                            <View style={styles.resultHeader}>
                                <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                    HCM (Hemoglobina Corpuscular Média)
                                </Text>
                                <TouchableOpacity onPress={() => showInfo('mch')}>
                                    <Info size={20} color={currentTheme.color} strokeWidth={2} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                {results.mch} pg
                            </Text>
                            <Text style={[styles.resultStatus, {
                                color: getIndexStatus(parseFloat(results.mch), 'mch').color
                            }]}>
                                {getIndexStatus(parseFloat(results.mch), 'mch').status}
                            </Text>
                        </View>
                        <View style={styles.resultItem}>
                            <View style={styles.resultHeader}>
                                <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                    CHCM (Concentração de Hemoglobina Corpuscular Média)
                                </Text>
                                <TouchableOpacity onPress={() => showInfo('mchc')}>
                                    <Info size={20} color={currentTheme.color} strokeWidth={2} />
                                </TouchableOpacity>
                            </View>
                            <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                {results.mchc} g/dL
                            </Text>
                            <Text style={[styles.resultStatus, {
                                color: getIndexStatus(parseFloat(results.mchc), 'mchc').color
                            }]}>
                                {getIndexStatus(parseFloat(results.mchc), 'mchc').status}
                            </Text>
                        </View>
                        <Text style={styles.resultNote}>
                            Valores de referência podem variar conforme espécie e laboratório.
                        </Text>
                    </View>
                )}
                {!results && (
                    <View style={{ marginBottom: 50 }}></View>
                )}
            </ScrollView>
        </View>
    );
};

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
    inputGroup: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    centeredLabel: {
        textAlign: 'center',
    },
    input: {
        fontSize: 16,
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 10,
        marginBottom: 5,
    },
    buttonZone: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 20,
        padding: 10,
        width: '85%',
        borderRadius: 10,
        marginBottom: 10,
        gap: 10,
    },
    calculateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        gap: 10,
    },
    resetButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 10,
        gap: 10,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    resultContainer: {
        marginTop: 20,
        padding: 15,
        borderRadius: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    resultItem: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    resultLabel: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    resultValue: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    resultStatus: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    resultNote: {
        paddingHorizontal: 20,
        color: '#919191ff',
        fontSize: 14,
        marginTop: 15,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

export default HematologicalIndicesScreen;