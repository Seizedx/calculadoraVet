import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import QuickActionsContainer from '../../../Components/QuickActionsComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../../../Components/CustomTextInput';
import { useState } from 'react';
import { Calculator, Info, RotateCcw } from 'lucide-react-native';

export const HematologicalIndices = () => {
    const { currentTheme, actualTheme } = useTheme();
    const navigation = useNavigation();

    const [hematocrit, setHematocrit] = useState('');
    const [hemoglobin, setHemoglobin] = useState('');
    const [rbcCount, setRbcCount] = useState('');
    const [results, setResults] = useState(null);

    const calculateIndices = () => {
        if (!hematocrit || !hemoglobin || !rbcCount) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const hct = parseFloat(hematocrit);
        const hgb = parseFloat(hemoglobin);
        const rbc = parseFloat(rbcCount) * 1000000; // Converter para células/μL

        if (hct <= 0 || hgb <= 0 || rbc <= 0) {
            Alert.alert('Erro', 'Os valores devem ser maiores que zero.');
            return;
        }

        // Cálculos dos índices hematológicos
        const mcv = (hct / rbc) * 10; // Volume Corpuscular Médio (fL)
        const mch = (hgb / rbc) * 10; // Hemoglobina Corpuscular Média (pg)
        const mchc = (hgb / hct) * 100; // Concentração de Hemoglobina Corpuscular Média (g/dL)

        setResults({
            mcv: mcv.toFixed(2),
            mch: mch.toFixed(2),
            mchc: mchc.toFixed(2),
        });
    };

    const resetForm = () => {
        setHematocrit('');
        setHemoglobin('');
        setRbcCount('');
        setResults(null);
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
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <TopBarComponent />
                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeTitle, { color: currentTheme.color }]}>
                        Índices Hematológicos
                    </Text>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Calcule VCM, HCM e CHCM baseado nos valores do hemograma
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={[styles.inputSection, { backgroundColor: currentTheme.surfaceColor }]}>
                        <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                            Valores do Hemograma
                        </Text>
                        
                        <CustomTextInput
                            value={hematocrit}
                            onChangeText={setHematocrit}
                            placeholder="Hematócrito (%)"
                            keyboardType="numeric"
                        />
                        
                        <CustomTextInput
                            value={hemoglobin}
                            onChangeText={setHemoglobin}
                            placeholder="Hemoglobina (g/dL)"
                            keyboardType="numeric"
                        />
                        
                        <CustomTextInput
                            value={rbcCount}
                            onChangeText={setRbcCount}
                            placeholder="Contagem de Hemácias (milhões/μL)"
                            keyboardType="numeric"
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.calculateButton, { backgroundColor: currentTheme.buttonColor }]}
                                onPress={calculateIndices}
                                activeOpacity={0.8}
                            >
                                <Calculator size={24} color={currentTheme.buttonTheme} strokeWidth={2} />
                                <Text style={[styles.buttonText, { color: currentTheme.buttonTheme }]}>
                                    Calcular Índices
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.resetButton, { backgroundColor: currentTheme.inactiveTintColor }]}
                                onPress={resetForm}
                                activeOpacity={0.8}
                            >
                                <RotateCcw size={24} color={currentTheme.buttonTheme} strokeWidth={2} />
                                <Text style={[styles.buttonText, { color: currentTheme.buttonTheme }]}>
                                    Limpar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {results && (
                        <View style={[styles.resultsSection, { backgroundColor: currentTheme.resultBackgroundColor }]}>
                            <Text style={[styles.resultsTitle, { color: currentTheme.color }]}>
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
                        </View>
                    )}
                </View>

                <QuickActionsContainer />
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
    formContainer: {
        paddingHorizontal: 20,
    },
    inputSection: {
        padding: 20,
        marginBottom: 20,
        borderRadius: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        gap: 12,
    },
    calculateButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    resetButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultsSection: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
    },
    resultsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
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
    },
    resultStatus: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default HematologicalIndices;