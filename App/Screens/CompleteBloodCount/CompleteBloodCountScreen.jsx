import {
    View,
    StyleSheet,
    ScrollView,
    Text,
    TouchableOpacity,
    Alert,
    Dimensions,
} from 'react-native';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import CustomTextInput from '../../../Components/CustomTextInput';
import { useState } from 'react';
import { Calculator, Info, RotateCcw, Dog, Cat, BookOpen, Activity } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export const CompleteBloodCountScreen = () => {
    const { currentTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('application');
    const [selectedSpecies, setSelectedSpecies] = useState('dog');
    
    // Estados para os valores do hemograma
    const [hematocrit, setHematocrit] = useState('');
    const [hemoglobin, setHemoglobin] = useState('');
    const [rbcCount, setRbcCount] = useState('');
    const [totalWBC, setTotalWBC] = useState('');
    const [neutrophils, setNeutrophils] = useState('');
    const [lymphocytes, setLymphocytes] = useState('');
    const [monocytes, setMonocytes] = useState('');
    const [eosinophils, setEosinophils] = useState('');
    const [basophils, setBasophils] = useState('');
    const [plateletCount, setPlateletCount] = useState('');
    
    const [results, setResults] = useState(null);

    // Valores de referência para cães e gatos
    const referenceValues = {
        dog: {
            hematocrit: { min: 37, max: 55 },
            hemoglobin: { min: 12, max: 18 },
            rbc: { min: 5.5, max: 8.5 },
            wbc: { min: 6000, max: 17000 },
            neutrophils: { min: 3000, max: 11500 },
            lymphocytes: { min: 1000, max: 4800 },
            monocytes: { min: 150, max: 1350 },
            eosinophils: { min: 100, max: 1250 },
            basophils: { min: 0, max: 100 },
            platelets: { min: 200000, max: 500000 },
            mcv: { min: 60, max: 77 },
            mch: { min: 19.5, max: 24.5 },
            mchc: { min: 32, max: 36 }
        },
        cat: {
            hematocrit: { min: 30, max: 45 },
            hemoglobin: { min: 8, max: 15 },
            rbc: { min: 5, max: 10 },
            wbc: { min: 5500, max: 19500 },
            neutrophils: { min: 2500, max: 12500 },
            lymphocytes: { min: 1500, max: 7000 },
            monocytes: { min: 0, max: 850 },
            eosinophils: { min: 0, max: 1500 },
            basophils: { min: 0, max: 100 },
            platelets: { min: 300000, max: 800000 },
            mcv: { min: 39, max: 55 },
            mch: { min: 12.5, max: 17.5 },
            mchc: { min: 30, max: 36 }
        }
    };

    const calculateCompleteBloodCount  = () => {
        if (!hematocrit || !hemoglobin || !rbcCount || !totalWBC || !plateletCount) {
            Alert.alert('Erro', 'Por favor, preencha pelo menos os campos básicos do hemograma.');
            return;
        }

        const hct = parseFloat(hematocrit);
        const hgb = parseFloat(hemoglobin);
        const rbc = parseFloat(rbcCount) * 1000000; // Converter para células/μL
        const wbc = parseFloat(totalWBC);
        const platelets = parseFloat(plateletCount);

        if (hct <= 0 || hgb <= 0 || rbc <= 0 || wbc <= 0 || platelets <= 0) {
            Alert.alert('Erro', 'Todos os valores devem ser maiores que zero.');
            return;
        }

        // Cálculos dos índices hematológicos
        const mcv = (hct / rbc) * 10; // Volume Corpuscular Médio (fL)
        const mch = (hgb / rbc) * 10; // Hemoglobina Corpuscular Média (pg)
        const mchc = (hgb / hct) * 100; // Concentração de Hemoglobina Corpuscular Média (g/dL)

        // Cálculos da fórmula leucocitária
        const neutrophilsAbs = ((parseFloat(neutrophils) || 0) / 100) * wbc;
        const lymphocytesAbs = ((parseFloat(lymphocytes) || 0) / 100) * wbc;
        const monocytesAbs = ((parseFloat(monocytes) || 0) / 100) * wbc;
        const eosinophilsAbs = ((parseFloat(eosinophils) || 0) / 100) * wbc;
        const basophilsAbs = ((parseFloat(basophils) || 0) / 100) * wbc;

        const totalPercentage = (parseFloat(neutrophils) || 0) + (parseFloat(lymphocytes) || 0) + 
                               (parseFloat(monocytes) || 0) + (parseFloat(eosinophils) || 0) + 
                               (parseFloat(basophils) || 0);

        if (totalPercentage > 100) {
            Alert.alert('Aviso', 'A soma das porcentagens da fórmula leucocitária não pode ser maior que 100%.');
            return;
        }

        setResults({
            hematocrit: hct.toFixed(1),
            hemoglobin: hgb.toFixed(1),
            rbc: (rbc / 1000000).toFixed(2),
            wbc: wbc.toFixed(0),
            platelets: platelets.toFixed(0),
            mcv: mcv.toFixed(2),
            mch: mch.toFixed(2),
            mchc: mchc.toFixed(2),
            neutrophils: {
                percentage: (parseFloat(neutrophils) || 0).toFixed(1),
                absolute: neutrophilsAbs.toFixed(0),
            },
            lymphocytes: {
                percentage: (parseFloat(lymphocytes) || 0).toFixed(1),
                absolute: lymphocytesAbs.toFixed(0),
            },
            monocytes: {
                percentage: (parseFloat(monocytes) || 0).toFixed(1),
                absolute: monocytesAbs.toFixed(0),
            },
            eosinophils: {
                percentage: (parseFloat(eosinophils) || 0).toFixed(1),
                absolute: eosinophilsAbs.toFixed(0),
            },
            basophils: {
                percentage: (parseFloat(basophils) || 0).toFixed(1),
                absolute: basophilsAbs.toFixed(0),
            },
            totalPercentage: totalPercentage.toFixed(1),
        });
    };

    const resetForm = () => {
        setHematocrit('');
        setHemoglobin('');
        setRbcCount('');
        setTotalWBC('');
        setNeutrophils('');
        setLymphocytes('');
        setMonocytes('');
        setEosinophils('');
        setBasophils('');
        setPlateletCount('');
        setResults(null);
    };

    const getValueStatus = (value, parameter) => {
        const ranges = referenceValues[selectedSpecies][parameter];
        if (!ranges) return { status: 'Normal', color: '#10b981' };
        
        const numValue = parseFloat(value);
        if (numValue < ranges.min) return { status: 'Baixo', color: '#f59e0b' };
        if (numValue > ranges.max) return { status: 'Alto', color: '#ef4444' };
        return { status: 'Normal', color: '#10b981' };
    };

    const showInfo = (parameter) => {
        const infoText = {
            hematocrit: 'Hematócrito: Percentual de volume ocupado pelas hemácias no sangue total.',
            hemoglobin: 'Hemoglobina: Proteína responsável pelo transporte de oxigênio.',
            rbc: 'Hemácias: Células vermelhas do sangue que transportam oxigênio.',
            wbc: 'Leucócitos: Células brancas do sangue responsáveis pela defesa.',
            platelets: 'Plaquetas: Fragmentos celulares importantes para a coagulação.',
            mcv: 'VCM: Volume médio das hemácias.',
            mch: 'HCM: Quantidade média de hemoglobina por hemácia.',
            mchc: 'CHCM: Concentração média de hemoglobina nas hemácias.'
        };
        
        Alert.alert('Informação', infoText[parameter]);
    };

    const renderApplicationTab = () => (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            <TopBarComponent />
            
            <View style={styles.welcomeSection}>
                <Text style={[styles.welcomeTitle, { color: currentTheme.color }]}>
                    Hemograma Completo
                </Text>
                <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                    Análise completa do hemograma para {selectedSpecies === 'dog' ? 'cães' : 'gatos'}
                </Text>
            </View>

            {/* Seleção de Espécie */}
            <View style={styles.speciesContainer}>
                <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                    Selecionar Espécie
                </Text>
                <View style={styles.speciesButtons}>
                    <TouchableOpacity
                        style={[
                            styles.speciesButton,
                            {
                                backgroundColor: selectedSpecies === 'dog'
                                    ? currentTheme.buttonColor
                                    : currentTheme.unselectedButtonColor,
                                borderColor: currentTheme.color,
                            },
                        ]}
                        onPress={() => setSelectedSpecies('dog')}
                    >
                        <Dog size={40} color={selectedSpecies === 'dog' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor} />
                        <Text
                            style={[
                                styles.speciesText,
                                {
                                    color: selectedSpecies === 'dog'
                                        ? currentTheme.activeTintColor
                                        : currentTheme.inactiveTintColor,
                                },
                            ]}
                        >
                            Cão
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.speciesButton,
                            {
                                backgroundColor: selectedSpecies === 'cat'
                                    ? currentTheme.buttonColor
                                    : currentTheme.unselectedButtonColor,
                                borderColor: currentTheme.color,
                            },
                        ]}
                        onPress={() => setSelectedSpecies('cat')}
                    >
                        <Cat size={40} color={selectedSpecies === 'cat' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor} />
                        <Text
                            style={[
                                styles.speciesText,
                                {
                                    color: selectedSpecies === 'cat'
                                        ? currentTheme.activeTintColor
                                        : currentTheme.inactiveTintColor,
                                },
                            ]}
                        >
                            Gato
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.formContainer}>
                <View style={[styles.inputSection, { backgroundColor: currentTheme.surfaceColor }]}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                        Valores Básicos do Hemograma
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
                        placeholder="Hemácias (milhões/μL)"
                        keyboardType="numeric"
                    />
                    
                    <CustomTextInput
                        value={totalWBC}
                        onChangeText={setTotalWBC}
                        placeholder="Leucócitos Totais (/μL)"
                        keyboardType="numeric"
                    />
                    
                    <CustomTextInput
                        value={plateletCount}
                        onChangeText={setPlateletCount}
                        placeholder="Plaquetas (/μL)"
                        keyboardType="numeric"
                    />
                </View>

                <View style={[styles.inputSection, { backgroundColor: currentTheme.surfaceColor }]}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
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

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.calculateButton, { backgroundColor: currentTheme.buttonColor }]}
                            onPress={calculateCompleteBloodCount}
                            activeOpacity={0.8}
                        >
                            <Calculator size={24} color={currentTheme.buttonTheme} strokeWidth={2} />
                            <Text style={[styles.buttonText, { color: currentTheme.buttonTheme }]}>
                                Calcular Hemograma
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
                            Resultados do Hemograma Completo
                        </Text>
                        
                        {/* Valores Básicos */}
                        <View style={styles.resultsGroup}>
                            <Text style={[styles.groupTitle, { color: currentTheme.color }]}>
                                Valores Básicos
                            </Text>
                            
                            <View style={styles.resultsGrid}>
                                <View style={[styles.resultCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.resultHeader}>
                                        <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                            Hematócrito
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('hematocrit')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                        {results.hematocrit}%
                                    </Text>
                                    <Text style={[styles.resultStatus, { 
                                        color: getValueStatus(results.hematocrit, 'hematocrit').color 
                                    }]}>
                                        {getValueStatus(results.hematocrit, 'hematocrit').status}
                                    </Text>
                                </View>

                                <View style={[styles.resultCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.resultHeader}>
                                        <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                            Hemoglobina
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('hemoglobin')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                        {results.hemoglobin} g/dL
                                    </Text>
                                    <Text style={[styles.resultStatus, { 
                                        color: getValueStatus(results.hemoglobin, 'hemoglobin').color 
                                    }]}>
                                        {getValueStatus(results.hemoglobin, 'hemoglobin').status}
                                    </Text>
                                </View>

                                <View style={[styles.resultCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.resultHeader}>
                                        <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                            Hemácias
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('rbc')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                        {results.rbc} milhões/μL
                                    </Text>
                                    <Text style={[styles.resultStatus, { 
                                        color: getValueStatus(results.rbc, 'rbc').color 
                                    }]}>
                                        {getValueStatus(results.rbc, 'rbc').status}
                                    </Text>
                                </View>

                                <View style={[styles.resultCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.resultHeader}>
                                        <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                            Leucócitos
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('wbc')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                        {results.wbc}/μL
                                    </Text>
                                    <Text style={[styles.resultStatus, { 
                                        color: getValueStatus(results.wbc, 'wbc').color 
                                    }]}>
                                        {getValueStatus(results.wbc, 'wbc').status}
                                    </Text>
                                </View>

                                <View style={[styles.resultCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.resultHeader}>
                                        <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                            Plaquetas
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('platelets')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                        {results.platelets}/μL
                                    </Text>
                                    <Text style={[styles.resultStatus, { 
                                        color: getValueStatus(results.platelets, 'platelets').color 
                                    }]}>
                                        {getValueStatus(results.platelets, 'platelets').status}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Índices Hematológicos */}
                        <View style={styles.resultsGroup}>
                            <Text style={[styles.groupTitle, { color: currentTheme.color }]}>
                                Índices Hematológicos
                            </Text>
                            
                            <View style={styles.resultsGrid}>
                                <View style={[styles.resultCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.resultHeader}>
                                        <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                            VCM
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('mcv')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                        {results.mcv} fL
                                    </Text>
                                    <Text style={[styles.resultStatus, { 
                                        color: getValueStatus(results.mcv, 'mcv').color 
                                    }]}>
                                        {getValueStatus(results.mcv, 'mcv').status}
                                    </Text>
                                </View>

                                <View style={[styles.resultCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.resultHeader}>
                                        <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                            HCM
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('mch')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                        {results.mch} pg
                                    </Text>
                                    <Text style={[styles.resultStatus, { 
                                        color: getValueStatus(results.mch, 'mch').color 
                                    }]}>
                                        {getValueStatus(results.mch, 'mch').status}
                                    </Text>
                                </View>

                                <View style={[styles.resultCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.resultHeader}>
                                        <Text style={[styles.resultLabel, { color: currentTheme.color }]}>
                                            CHCM
                                        </Text>
                                        <TouchableOpacity onPress={() => showInfo('mchc')}>
                                            <Info size={18} color={currentTheme.color} strokeWidth={2} />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={[styles.resultValue, { color: currentTheme.color }]}>
                                        {results.mchc} g/dL
                                    </Text>
                                    <Text style={[styles.resultStatus, { 
                                        color: getValueStatus(results.mchc, 'mchc').color 
                                    }]}>
                                        {getValueStatus(results.mchc, 'mchc').status}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Fórmula Leucocitária */}
                        <View style={styles.resultsGroup}>
                            <Text style={[styles.groupTitle, { color: currentTheme.color }]}>
                                Fórmula Leucocitária
                            </Text>
                            
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
                                </View>
                            </View>
                        </View>
                    </View>
                )}
            </View>

        </ScrollView>
    );

    const renderReferencesTab = () => (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
            <TopBarComponent />
            
            <View style={styles.welcomeSection}>
                <Text style={[styles.welcomeTitle, { color: currentTheme.color }]}>
                    Valores de Referência
                </Text>
                <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                    Valores normais para hemograma em medicina veterinária
                </Text>
            </View>

            <View style={styles.formContainer}>
                {['dog', 'cat'].map(species => (
                    <View key={species} style={[styles.inputSection, { backgroundColor: currentTheme.surfaceColor }]}>
                        <View style={styles.speciesHeader}>
                            {species === 'dog' ? (
                                <Dog size={24} color={currentTheme.color} />
                            ) : (
                                <Cat size={24} color={currentTheme.color} />
                            )}
                            <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                                {species === 'dog' ? 'Cães' : 'Gatos'}
                            </Text>
                        </View>
                        
                        <View style={styles.referenceGrid}>
                            {Object.entries(referenceValues[species]).map(([parameter, range]) => (
                                <View key={parameter} style={[styles.referenceCard, { backgroundColor: currentTheme.resultBackgroundColor }]}>
                                    <Text style={[styles.referenceLabel, { color: currentTheme.color }]}>
                                        {getParameterName(parameter)}
                                    </Text>
                                    <Text style={[styles.referenceValue, { color: currentTheme.color }]}>
                                        {range.min} - {range.max} {getParameterUnit(parameter)}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                ))}
            </View>

        </ScrollView>
    );

    const getParameterName = (parameter) => {
        const names = {
            hematocrit: 'Hematócrito',
            hemoglobin: 'Hemoglobina',
            rbc: 'Hemácias',
            wbc: 'Leucócitos',
            neutrophils: 'Neutrófilos',
            lymphocytes: 'Linfócitos',
            monocytes: 'Monócitos',
            eosinophils: 'Eosinófilos',
            basophils: 'Basófilos',
            platelets: 'Plaquetas',
            mcv: 'VCM',
            mch: 'HCM',
            mchc: 'CHCM'
        };
        return names[parameter] || parameter;
    };

    const getParameterUnit = (parameter) => {
        const units = {
            hematocrit: '%',
            hemoglobin: 'g/dL',
            rbc: 'milhões/μL',
            wbc: '/μL',
            neutrophils: '/μL',
            lymphocytes: '/μL',
            monocytes: '/μL',
            eosinophils: '/μL',
            basophils: '/μL',
            platelets: '/μL',
            mcv: 'fL',
            mch: 'pg',
            mchc: 'g/dL'
        };
        return units[parameter] || '';
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            {/* Tab Content */}
            {activeTab === 'application' ? renderApplicationTab() : renderReferencesTab()}
            
            {/* Tab Navigation - Bottom */}
            <View style={[styles.tabContainer, { backgroundColor: currentTheme.surfaceColor }]}>
                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        {
                            backgroundColor: activeTab === 'application' 
                                ? currentTheme.buttonColor 
                                : 'transparent',
                        },
                    ]}
                    onPress={() => setActiveTab('application')}
                >
                    <Activity 
                        size={20} 
                        color={activeTab === 'application' 
                            ? currentTheme.activeTintColor 
                            : currentTheme.inactiveTintColor} 
                    />
                    <Text
                        style={[
                            styles.tabText,
                            {
                                color: activeTab === 'application' 
                                    ? currentTheme.activeTintColor 
                                    : currentTheme.inactiveTintColor,
                            },
                        ]}
                    >
                        Hemograma
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.tabButton,
                        {
                            backgroundColor: activeTab === 'references' 
                                ? currentTheme.buttonColor 
                                : 'transparent',
                        },
                    ]}
                    onPress={() => setActiveTab('references')}
                >
                    <BookOpen 
                        size={20} 
                        color={activeTab === 'references' 
                            ? currentTheme.activeTintColor 
                            : currentTheme.inactiveTintColor} 
                    />
                    <Text
                        style={[
                            styles.tabText,
                            {
                                color: activeTab === 'references' 
                                    ? currentTheme.activeTintColor 
                                    : currentTheme.inactiveTintColor,
                            },
                        ]}
                    >
                        Referências
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        paddingBottom: 80, // Espaço para as tabs inferiores
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginHorizontal: 4,
        borderRadius: 12,
        gap: 8,
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
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
    speciesContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    speciesButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    speciesButton: {
        alignItems: 'center',
        padding: 15,
        borderRadius: 15,
        borderWidth: 2,
        width: width * 0.4,
        gap: 8,
    },
    speciesText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    formContainer: {
        paddingHorizontal: 20,
    },
    inputSection: {
        padding: 20,
        marginBottom: 20,
        borderRadius: 16,
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
    resultsGroup: {
        marginBottom: 25,
    },
    groupTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    resultsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    resultCard: {
        flex: 1,
        minWidth: '45%',
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    resultLabel: {
        fontSize: 14,
        fontWeight: '600',
        flex: 1,
    },
    resultValue: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    resultStatus: {
        fontSize: 12,
        fontWeight: '600',
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
    speciesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
    },
    referenceGrid: {
        gap: 10,
    },
    referenceCard: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 8,
    },
    referenceLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    referenceValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CompleteBloodCountScreen;
