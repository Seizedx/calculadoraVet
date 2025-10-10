import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../../../Components/CustomTextInput';
import { useState } from 'react';
import { Calculator, Info, RotateCcw, TrendingUp } from 'lucide-react-native';

export const WhiteBloodCellCountScreen = () => {
    const { currentTheme, actualTheme } = useTheme();
    const navigation = useNavigation();

    const [totalWBC, setTotalWBC] = useState('');
    const [neutrophils, setNeutrophils] = useState('');
    const [lymphocytes, setLymphocytes] = useState('');
    const [monocytes, setMonocytes] = useState('');
    const [eosinophils, setEosinophils] = useState('');
    const [basophils, setBasophils] = useState('');
    const [results, setResults] = useState(null);

    const calculateLeukogram = () => {
        if (!totalWBC) {
            Alert.alert('Erro', 'Por favor, preencha o campo de Leucócitos Totais.');
            return;
        }

        const total = parseFloat(totalWBC);
        if (total <= 0) {
            Alert.alert('Erro', 'O valor de leucócitos totais deve ser maior que zero.');
            return;
        }

        const values = {
            neutrophils: parseFloat(neutrophils) || 0,
            lymphocytes: parseFloat(lymphocytes) || 0,
            monocytes: parseFloat(monocytes) || 0,
            eosinophils: parseFloat(eosinophils) || 0,
            basophils: parseFloat(basophils) || 0,
        };

        // Cálculos dos valores absolutos e percentuais
        const neutrophilsAbs = (values.neutrophils / 100) * total;
        const lymphocytesAbs = (values.lymphocytes / 100) * total;
        const monocytesAbs = (values.monocytes / 100) * total;
        const eosinophilsAbs = (values.eosinophils / 100) * total;
        const basophilsAbs = (values.basophils / 100) * total;

        const totalPercentage = values.neutrophils + values.lymphocytes + values.monocytes + values.eosinophils + values.basophils;

        if (totalPercentage > 100) {
            Alert.alert('Aviso', 'A soma das porcentagens não pode ser maior que 100%.');
            return;
        }

        setResults({
            totalWBC: total.toFixed(2),
            neutrophils: {
                percentage: values.neutrophils.toFixed(1),
                absolute: neutrophilsAbs.toFixed(0),
            },
            lymphocytes: {
                percentage: values.lymphocytes.toFixed(1),
                absolute: lymphocytesAbs.toFixed(0),
            },
            monocytes: {
                percentage: values.monocytes.toFixed(1),
                absolute: monocytesAbs.toFixed(0),
            },
            eosinophils: {
                percentage: values.eosinophils.toFixed(1),
                absolute: eosinophilsAbs.toFixed(0),
            },
            basophils: {
                percentage: values.basophils.toFixed(1),
                absolute: basophilsAbs.toFixed(0),
            },
            totalPercentage: totalPercentage.toFixed(1),
        });
    };

    const resetForm = () => {
        setTotalWBC('');
        setNeutrophils('');
        setLymphocytes('');
        setMonocytes('');
        setEosinophils('');
        setBasophils('');
        setResults(null);
    };

    const showInfo = (cellType) => {
        const infoText = {
            neutrophils: 'Neutrófilos: Primeira linha de defesa contra infecções bacterianas. Valores normais: 40-75% (2.000-7.500/μL).',
            lymphocytes: 'Linfócitos: Responsáveis pela imunidade específica. Valores normais: 20-50% (1.000-4.000/μL).',
            monocytes: 'Monócitos: Fagócitos que se transformam em macrófagos. Valores normais: 2-10% (100-1.000/μL).',
            eosinophils: 'Eosinófilos: Envolvidos em respostas alérgicas e parasitárias. Valores normais: 1-6% (50-500/μL).',
            basophils: 'Basófilos: Relacionados a reações alérgicas. Valores normais: 0-2% (0-200/μL).'
        };
        
        Alert.alert('Informação', infoText[cellType]);
    };

    const getCellStatus = (cellType, percentage, absolute) => {
        const statusRanges = {
            neutrophils: { min: 40, max: 75, absMin: 2000, absMax: 7500 },
            lymphocytes: { min: 20, max: 50, absMin: 1000, absMax: 4000 },
            monocytes: { min: 2, max: 10, absMin: 100, absMax: 1000 },
            eosinophils: { min: 1, max: 6, absMin: 50, absMax: 500 },
            basophils: { min: 0, max: 2, absMin: 0, absMax: 200 }
        };

        const range = statusRanges[cellType];
        const absValue = parseFloat(absolute);
        const percValue = parseFloat(percentage);

        if (percValue < range.min || absValue < range.absMin) {
            return { status: 'Baixo', color: '#f59e0b' };
        }
        if (percValue > range.max || absValue > range.absMax) {
            return { status: 'Alto', color: '#ef4444' };
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

                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Análise de Glóbulos Brancos: Calcule valores absolutos e percentuais dos leucócitos
                    </Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={[styles.inputSection, { backgroundColor: currentTheme.surfaceColor }]}>
                        <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                            Valores do Hemograma
                        </Text>
                        
                        <CustomTextInput
                            value={totalWBC}
                            onChangeText={setTotalWBC}
                            placeholder="Leucócitos Totais (/μL)"
                            keyboardType="numeric"
                        />

                        <View style={styles.differentialSection}>
                            <Text style={[styles.differentialTitle, { color: currentTheme.color }]}>
                                Fórmula Leucocitária (%)
                            </Text>
                            
                            <CustomTextInput
                                value={neutrophils}
                                onChangeText={setNeutrophils}
                                placeholder="Neutrófilos (%)"
                                keyboardType="numeric"
                            />
                            
                            <CustomTextInput
                                value={lymphocytes}
                                onChangeText={setLymphocytes}
                                placeholder="Linfócitos (%)"
                                keyboardType="numeric"
                            />
                            
                            <CustomTextInput
                                value={monocytes}
                                onChangeText={setMonocytes}
                                placeholder="Monócitos (%)"
                                keyboardType="numeric"
                            />
                            
                            <CustomTextInput
                                value={eosinophils}
                                onChangeText={setEosinophils}
                                placeholder="Eosinófilos (%)"
                                keyboardType="numeric"
                            />
                            
                            <CustomTextInput
                                value={basophils}
                                onChangeText={setBasophils}
                                placeholder="Basófilos (%)"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.calculateButton, { backgroundColor: currentTheme.buttonColor }]}
                                onPress={calculateLeukogram}
                                activeOpacity={0.8}
                            >
                                <Calculator size={24} color={currentTheme.buttonTheme} strokeWidth={2} />
                                <Text style={[styles.buttonText, { color: currentTheme.buttonTheme }]}>
                                    Calcular Leucograma
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
                                Resultados do Leucograma
                            </Text>
                            
                            <View style={styles.summaryCard}>
                                <Text style={[styles.summaryTitle, { color: currentTheme.color }]}>
                                    Resumo Geral
                                </Text>
                                <Text style={[styles.totalWBC, { color: currentTheme.color }]}>
                                    Leucócitos Totais: {results.totalWBC}/μL
                                </Text>
                                <Text style={[styles.totalPercentage, { color: currentTheme.color }]}>
                                    Soma das Percentagens: {results.totalPercentage}%
                                </Text>
                            </View>

                            <View style={styles.cellsGrid}>
                                <View style={[styles.cellCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.cellHeader}>
                                        <Text style={[styles.cellName, { color: currentTheme.color }]}>
                                            Neutrófilos
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('neutrophils')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.cellValue, { color: currentTheme.color }]}>
                                        {results.neutrophils.percentage}% ({results.neutrophils.absolute}/μL)
                                    </Text>
                                    <Text style={[styles.cellStatus, { 
                                        color: getCellStatus('neutrophils', results.neutrophils.percentage, results.neutrophils.absolute).color 
                                    }]}>
                                        {getCellStatus('neutrophils', results.neutrophils.percentage, results.neutrophils.absolute).status}
                                    </Text>
                                </View>

                                <View style={[styles.cellCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.cellHeader}>
                                        <Text style={[styles.cellName, { color: currentTheme.color }]}>
                                            Linfócitos
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('lymphocytes')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.cellValue, { color: currentTheme.color }]}>
                                        {results.lymphocytes.percentage}% ({results.lymphocytes.absolute}/μL)
                                    </Text>
                                    <Text style={[styles.cellStatus, { 
                                        color: getCellStatus('lymphocytes', results.lymphocytes.percentage, results.lymphocytes.absolute).color 
                                    }]}>
                                        {getCellStatus('lymphocytes', results.lymphocytes.percentage, results.lymphocytes.absolute).status}
                                    </Text>
                                </View>

                                <View style={[styles.cellCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.cellHeader}>
                                        <Text style={[styles.cellName, { color: currentTheme.color }]}>
                                            Monócitos
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('monocytes')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.cellValue, { color: currentTheme.color }]}>
                                        {results.monocytes.percentage}% ({results.monocytes.absolute}/μL)
                                    </Text>
                                    <Text style={[styles.cellStatus, { 
                                        color: getCellStatus('monocytes', results.monocytes.percentage, results.monocytes.absolute).color 
                                    }]}>
                                        {getCellStatus('monocytes', results.monocytes.percentage, results.monocytes.absolute).status}
                                    </Text>
                                </View>

                                <View style={[styles.cellCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.cellHeader}>
                                        <Text style={[styles.cellName, { color: currentTheme.color }]}>
                                            Eosinófilos
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('eosinophils')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.cellValue, { color: currentTheme.color }]}>
                                        {results.eosinophils.percentage}% ({results.eosinophils.absolute}/μL)
                                    </Text>
                                    <Text style={[styles.cellStatus, { 
                                        color: getCellStatus('eosinophils', results.eosinophils.percentage, results.eosinophils.absolute).color 
                                    }]}>
                                        {getCellStatus('eosinophils', results.eosinophils.percentage, results.eosinophils.absolute).status}
                                    </Text>
                                </View>

                                <View style={[styles.cellCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.cellHeader}>
                                        <Text style={[styles.cellName, { color: currentTheme.color }]}>
                                            Basófilos
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('basophils')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.cellValue, { color: currentTheme.color }]}>
                                        {results.basophils.percentage}% ({results.basophils.absolute}/μL)
                                    </Text>
                                    <Text style={[styles.cellStatus, { 
                                        color: getCellStatus('basophils', results.basophils.percentage, results.basophils.absolute).color 
                                    }]}>
                                        {getCellStatus('basophils', results.basophils.percentage, results.basophils.absolute).status}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
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
    differentialSection: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
    differentialTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
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
    summaryCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    totalWBC: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    totalPercentage: {
        fontSize: 14,
        textAlign: 'center',
        opacity: 0.8,
    },
    cellsGrid: {
        gap: 12,
    },
    cellCard: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    cellHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cellName: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    cellValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cellStatus: {
        fontSize: 14,
        fontWeight: '600',
    },
});

export default WhiteBloodCellCountScreen;
