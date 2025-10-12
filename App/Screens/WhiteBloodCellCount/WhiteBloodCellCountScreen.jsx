import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Alert,
    Dimensions,
    Keyboard,
} from 'react-native';
import { TopBarComponent, getFormattedDateTime, scrollToResult } from '../../../Components/TopBarComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import CustomTextInput from '../../../Components/CustomTextInput';
import { useState, useRef } from 'react';
import { Calculator, Info, RotateCcw } from 'lucide-react-native';
import { Dog, Cat } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export const WhiteBloodCellCountScreen = () => {
    const { currentTheme } = useTheme();
    const { formattedDate, formattedTime } = getFormattedDateTime();

    const [selectedSpecies, setSelectedSpecies] = useState('dog');
    const [totalWBC, setTotalWBC] = useState('');
    const [neutrophils, setNeutrophils] = useState('');
    const [lymphocytes, setLymphocytes] = useState('');
    const [monocytes, setMonocytes] = useState('');
    const [eosinophils, setEosinophils] = useState('');
    const [basophils, setBasophils] = useState('');
    const [results, setResults] = useState(null);

    const scrollViewRef = useRef(null);
    const resultViewRef = useRef(null);

    const cellNamesPT = {
        neutrophils: 'Neutrófilos',
        lymphocytes: 'Linfócitos',
        monocytes: 'Monócitos',
        eosinophils: 'Eosinófilos',
        basophils: 'Basófilos',
    };

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
            neutrophils: { percentage: values.neutrophils.toFixed(1), absolute: neutrophilsAbs.toFixed(0) },
            lymphocytes: { percentage: values.lymphocytes.toFixed(1), absolute: lymphocytesAbs.toFixed(0) },
            monocytes: { percentage: values.monocytes.toFixed(1), absolute: monocytesAbs.toFixed(0) },
            eosinophils: { percentage: values.eosinophils.toFixed(1), absolute: eosinophilsAbs.toFixed(0) },
            basophils: { percentage: values.basophils.toFixed(1), absolute: basophilsAbs.toFixed(0) },
            totalPercentage: totalPercentage.toFixed(1),
        });

        Keyboard.dismiss();
        setTimeout(() => {
            scrollToResult(scrollViewRef, resultViewRef);
        }, 200);
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
            neutrophils: 'Neutrófilos: Primeira linha de defesa contra infecções bacterianas.',
            lymphocytes: 'Linfócitos: Responsáveis pela imunidade específica.',
            monocytes: 'Monócitos: Fagócitos que se transformam em macrófagos.',
            eosinophils: 'Eosinófilos: Envolvidos em respostas alérgicas e parasitárias.',
            basophils: 'Basófilos: Relacionados a reações alérgicas.',
        };
        Alert.alert('Informação', infoText[cellType]);
    };

    const getCellStatus = (cellType, percentage, absolute) => {
        const ranges = {
            dog: {
                neutrophils: { min: 40, max: 75, absMin: 2000, absMax: 7500 },
                lymphocytes: { min: 20, max: 50, absMin: 1000, absMax: 4000 },
                monocytes: { min: 2, max: 10, absMin: 100, absMax: 1000 },
                eosinophils: { min: 1, max: 6, absMin: 50, absMax: 500 },
                basophils: { min: 0, max: 2, absMin: 0, absMax: 200 }
            },
            cat: {
                neutrophils: { min: 35, max: 75, absMin: 2500, absMax: 12500 },
                lymphocytes: { min: 20, max: 55, absMin: 1500, absMax: 7000 },
                monocytes: { min: 1, max: 4, absMin: 100, absMax: 600 },
                eosinophils: { min: 2, max: 12, absMin: 100, absMax: 1500 },
                basophils: { min: 0, max: 1, absMin: 0, absMax: 100 }
            }
        };

        const range = ranges[selectedSpecies][cellType];
        const absValue = parseFloat(absolute);
        const percValue = parseFloat(percentage);

        if (percValue < range.min || absValue < range.absMin) return { status: 'Baixo', color: '#f59e0b' };
        if (percValue > range.max || absValue > range.absMax) return { status: 'Alto', color: '#ef4444' };
        return { status: 'Normal', color: '#10b981' };
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
                        Análise de Glóbulos Brancos: Calcule valores absolutos e percentuais dos leucócitos
                    </Text>
                </View>

                <View style={styles.container}>
                    <View style={[styles.inputSection, { backgroundColor: currentTheme.surfaceColor }]}>
                        <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                            Selecionar Espécie
                        </Text>
                        <View style={styles.speciesButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.speciesButton,
                                    selectedSpecies === 'dog'
                                        ? { backgroundColor: currentTheme.buttonColor }
                                        : { backgroundColor: currentTheme.unselectedButtonColor },
                                    { borderColor: currentTheme.color },
                                ]}
                                onPress={() => setSelectedSpecies('dog')}
                            >
                                <Dog
                                    size={36}
                                    color={selectedSpecies === 'dog' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor}
                                />
                                <Text style={[
                                    styles.speciesText,
                                    selectedSpecies === 'dog'
                                        ? { color: currentTheme.activeTintColor }
                                        : { color: currentTheme.inactiveTintColor },
                                ]}>
                                    Cão
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.speciesButton,
                                    selectedSpecies === 'cat'
                                        ? { backgroundColor: currentTheme.buttonColor }
                                        : { backgroundColor: currentTheme.unselectedButtonColor },
                                    { borderColor: currentTheme.color },
                                ]}
                                onPress={() => setSelectedSpecies('cat')}
                            >
                                <Cat
                                    size={36}
                                    color={selectedSpecies === 'cat' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor}
                                />
                                <Text style={[
                                    styles.speciesText,
                                    selectedSpecies === 'cat'
                                        ? { color: currentTheme.activeTintColor }
                                        : { color: currentTheme.inactiveTintColor },
                                ]}>
                                    Gato
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>Leucócitos Totais</Text>
                        <CustomTextInput
                            value={totalWBC}
                            onChangeText={setTotalWBC}
                            placeholder="Em (/μL)"
                            keyboardType="numeric"
                        />

                        <Text style={[styles.sectionTitle, { color: currentTheme.color, marginTop: 20 }]}>
                            Fórmula Leucocitária (%)
                        </Text>

                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>Neutrófilos</Text>
                        <CustomTextInput value={neutrophils} onChangeText={setNeutrophils} placeholder="Em (%)" keyboardType="numeric" />
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>Linfócitos</Text>
                        <CustomTextInput value={lymphocytes} onChangeText={setLymphocytes} placeholder="Em (%)" keyboardType="numeric" />
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>Monócitos</Text>
                        <CustomTextInput value={monocytes} onChangeText={setMonocytes} placeholder="Em (%)" keyboardType="numeric" />
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>Eosinófilos</Text>
                        <CustomTextInput value={eosinophils} onChangeText={setEosinophils} placeholder="Em (%)" keyboardType="numeric" />
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>Basófilos</Text>
                        <CustomTextInput value={basophils} onChangeText={setBasophils} placeholder="Em (%)" keyboardType="numeric" />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.calculateButton, { backgroundColor: currentTheme.buttonColor }]}
                                onPress={calculateLeukogram}
                                activeOpacity={0.8}
                            >
                                <Calculator size={24} color={currentTheme.buttonTheme} strokeWidth={2} />
                                <Text style={[styles.buttonText, { color: currentTheme.buttonTheme }]}>Calcular Leucograma</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.resetButton, { backgroundColor: currentTheme.inactiveTintColor }]}
                                onPress={resetForm}
                                activeOpacity={0.8}
                            >
                                <RotateCcw size={24} color={currentTheme.buttonTheme} strokeWidth={2} />
                                <Text style={[styles.buttonText, { color: currentTheme.buttonTheme }]}>Limpar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {results && (
                        <View style={[styles.resultsSection, { backgroundColor: currentTheme.resultBackgroundColor }]} ref={resultViewRef}>
                            <Text style={[styles.resultsTitle, { color: currentTheme.color }]}>Resultados do Leucograma</Text>

                            <View style={styles.summaryCard}>
                                <Text style={[styles.summaryTitle, { color: currentTheme.color }]}>Resumo Geral</Text>
                                <Text style={[styles.totalWBC, { color: currentTheme.color }]}>Leucócitos Totais: {results.totalWBC}/μL</Text>
                                <Text style={[styles.totalPercentage, { color: currentTheme.color }]}>Soma das Percentagens: {results.totalPercentage}%</Text>
                            </View>

                            <View style={styles.cellsGrid}>
                                {['neutrophils', 'lymphocytes', 'monocytes', 'eosinophils', 'basophils'].map((cell) => (
                                    <View key={cell} style={[styles.cellCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                        <View style={styles.cellHeader}>
                                            <Text style={[styles.cellName, { color: currentTheme.color }]}>
                                                {cellNamesPT[cell]}
                                            </Text>
                                            <TouchableOpacity onPress={() => showInfo(cell)}>
                                                <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={[styles.cellValue, { color: currentTheme.color }]}>
                                            {results[cell].percentage}% ({results[cell].absolute}/μL)
                                        </Text>
                                        <Text style={[styles.cellStatus, { color: getCellStatus(cell, results[cell].percentage, results[cell].absolute).color }]}>
                                            {getCellStatus(cell, results[cell].percentage, results[cell].absolute).status}
                                        </Text>
                                    </View>
                                ))}
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
    inputSection: {
        marginBottom: 20,
        borderRadius: 16,
    },
    inputLabel: {
        fontSize: 16,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        width: width * 0.95,
        borderRadius: 10,
        gap: 15,
    },
    calculateButton: {
        flex: 7,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 20,
        gap: 10,
    },
    resetButton: {
        flex: 3,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 20,
        borderRadius: 10,
        gap: 10,
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
    speciesButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    speciesButton: {
        alignItems: 'center',
        padding: 5,
        borderRadius: 15,
        borderWidth: 2,
        width: width * 0.4,
    },
    speciesText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 5,
    },
});

export default WhiteBloodCellCountScreen;
