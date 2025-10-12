// Components/CompleteBloodCountScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Dimensions,
    Keyboard,
} from 'react-native';
import {
    Calculator,
    Info,
    RotateCcw,
    Dog,
    Cat,
} from 'lucide-react-native';
import { TopBarComponent, getFormattedDateTime, scrollToResult } from '../../../Components/TopBarComponent';
import CustomTextInput from '../../../Components/CustomTextInput';
import { useTheme } from '../../../Components/ThemeComponent';

const { width } = Dimensions.get('window');

export default function CompleteBloodCountScreen() {
    const { currentTheme } = useTheme();
    const { formattedDate, formattedTime } = getFormattedDateTime();


    // Espécie
    const [selectedSpecies, setSelectedSpecies] = useState('dog');

    // Valores básicos
    const [hematocrit, setHematocrit] = useState('');
    const [hemoglobin, setHemoglobin] = useState('');
    const [rbcCount, setRbcCount] = useState(''); // milhões/μL
    const [totalWBC, setTotalWBC] = useState(''); // /μL
    const [plateletCount, setPlateletCount] = useState(''); // /μL
    const [rdw, setRdw] = useState(''); // opcional, %

    // Fórmula leucocitária (porcentagens)
    const [neutrophils, setNeutrophils] = useState('');
    const [lymphocytes, setLymphocytes] = useState('');
    const [monocytes, setMonocytes] = useState('');
    const [eosinophils, setEosinophils] = useState('');
    const [basophils, setBasophils] = useState('');

    // Refs para navegação entre inputs
    const rbcRef = useRef(null);
    const wbcRef = useRef(null);
    const plateletsRef = useRef(null);
    const neutRef = useRef(null);
    const lymphRef = useRef(null);
    const monoRef = useRef(null);
    const eosRef = useRef(null);
    const basoRef = useRef(null);
    const scrollViewRef = useRef(null);
    const resultViewRef = useRef(null);


    // Resultado
    const [results, setResults] = useState(null);


    // Valores de referência (mantidos para cão e gato)
    const referenceValues = {
        dog: {
            hematocrit: { min: 37, max: 55 },
            hemoglobin: { min: 12, max: 18 },
            rbc: { min: 5.5, max: 8.5 }, // milhões/μL
            wbc: { min: 6000, max: 17000 }, // /μL
            neutrophils: { min: 3000, max: 11500 }, // absolute /μL
            lymphocytes: { min: 1000, max: 4800 },
            monocytes: { min: 150, max: 1350 },
            eosinophils: { min: 100, max: 1250 },
            basophils: { min: 0, max: 100 },
            platelets: { min: 200000, max: 500000 },
            mcv: { min: 60, max: 77 }, // fL
            mch: { min: 19.5, max: 24.5 }, // pg
            mchc: { min: 32, max: 36 }, // g/dL
        },
        cat: {
            hematocrit: { min: 30, max: 45 },
            hemoglobin: { min: 8, max: 15 },
            rbc: { min: 5, max: 10 }, // milhões/μL
            wbc: { min: 5500, max: 19500 }, // /μL
            neutrophils: { min: 2500, max: 12500 },
            lymphocytes: { min: 1500, max: 7000 },
            monocytes: { min: 0, max: 850 },
            eosinophils: { min: 0, max: 1500 },
            basophils: { min: 0, max: 100 },
            platelets: { min: 300000, max: 800000 },
            mcv: { min: 39, max: 55 }, // fL
            mch: { min: 12.5, max: 17.5 }, // pg
            mchc: { min: 30, max: 36 }, // g/dL
        },
    };

    useEffect(() => {
        setResults(null);
    }, [
        hematocrit,
        hemoglobin,
        rbcCount,
        totalWBC,
        plateletCount,
        neutrophils,
        lymphocytes,
        monocytes,
        eosinophils,
        basophils,
        rdw,
        selectedSpecies,
    ]);

    const showInfo = (parameter) => {
        const infoText = {
            hematocrit: 'Hematócrito: percentual do volume sanguíneo ocupado por hemácias.',
            hemoglobin: 'Hemoglobina: proteína que transporta oxigénio nas hemácias (g/dL).',
            rbc: 'Hemácias (RBC): número de eritrócitos, em milhões/μL.',
            wbc: 'Leucócitos (WBC): contagem total de células brancas por μL.',
            platelets: 'Plaquetas: fragmentos celulares responsáveis pela coagulação (/μL).',
            mcv: 'VCM: volume corpuscular médio (fL) — calculado a partir do Hct e RBC.',
            mch: 'HCM: hemoglobina corpuscular média (pg) — calculado a partir do Hgb e RBC.',
            mchc: 'CHCM: concentração de hemoglobina corpuscular média (g/dL) — Hgb/Hct.',
            rdw: 'RDW: amplitude de distribuição de hemácias (opcional).',
            neutrophils: 'Neutrófilos: principais células da defesa inata (percentual e absoluto).',
            lymphocytes: 'Linfócitos: células da resposta imunitária (percentual e absoluto).',
            monocytes: 'Monócitos: células fagocitárias (percentual e absoluto).',
            eosinophils: 'Eosinófilos: associados a parasitas e alergias (percentual e absoluto).',
            basophils: 'Basófilos: células raras, muitas vezes pouco numeradas (percentual e absoluto).',
        };

        Alert.alert('Informação', infoText[parameter] ?? 'Informação não disponível.');
    };

    const getValueStatus = (value, parameter) => {
        const ranges = referenceValues[selectedSpecies][parameter];
        if (!ranges || value === null || value === undefined || value === '') {
            return { status: '—', color: currentTheme.inactiveTintColor };
        }

        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return { status: '—', color: currentTheme.inactiveTintColor };
        }

        if (numValue < ranges.min) {
            return { status: 'Baixo', color: '#f59e0b' };
        }

        if (numValue > ranges.max) {
            return { status: 'Alto', color: '#ef4444' };
        }

        return { status: 'Normal', color: '#10b981' };
    };

    const calculateCompleteBloodCount = () => {
        // checagem de campos essenciais
        if (
            !hematocrit.trim() ||
            !hemoglobin.trim() ||
            !rbcCount.trim() ||
            !totalWBC.trim() ||
            !plateletCount.trim()
        ) {
            Alert.alert('Erro', 'Preencha os campos: Hematócrito, Hemoglobina, Hemácias, Leucócitos e Plaquetas.');
            return;
        }

        const hct = parseFloat(hematocrit);
        const hgb = parseFloat(hemoglobin);
        const rbcMillions = parseFloat(rbcCount); // em milhões/μL
        const wbc = parseFloat(totalWBC);
        const platelets = parseFloat(plateletCount);

        if (
            isNaN(hct) ||
            isNaN(hgb) ||
            isNaN(rbcMillions) ||
            isNaN(wbc) ||
            isNaN(platelets)
        ) {
            Alert.alert('Erro', 'Um ou mais campos essenciais contêm valores inválidos.');
            return;
        }

        if (hct <= 0 || hgb <= 0 || rbcMillions <= 0 || wbc <= 0 || platelets <= 0) {
            Alert.alert('Erro', 'Todos os valores essenciais devem ser maiores que zero.');
            return;
        }

        // converter RBC para células/μL para cálculos absolutos:
        const rbc = rbcMillions * 1000000; // células/μL

        // índices hematológicos
        const mcv = (hct / rbc) * 10; // fL
        const mch = (hgb / rbc) * 10; // pg
        const mchc = (hgb / hct) * 100; // g/dL

        // fórmula leucocitária (percent -> absolute)
        const pctNeut = parseFloat(neutrophils) || 0;
        const pctLymph = parseFloat(lymphocytes) || 0;
        const pctMono = parseFloat(monocytes) || 0;
        const pctEos = parseFloat(eosinophils) || 0;
        const pctBaso = parseFloat(basophils) || 0;

        const totalPct = pctNeut + pctLymph + pctMono + pctEos + pctBaso;

        if (totalPct > 100) {
            Alert.alert('Aviso', 'A soma das porcentagens da fórmula leucocitária não pode exceder 100%.');
            return;
        }

        const neutAbs = Math.round((pctNeut / 100) * wbc);
        const lymphAbs = Math.round((pctLymph / 100) * wbc);
        const monoAbs = Math.round((pctMono / 100) * wbc);
        const eosAbs = Math.round((pctEos / 100) * wbc);
        const basoAbs = Math.round((pctBaso / 100) * wbc);

        // Montar resultado
        const res = {
            hematocrit: hct.toFixed(1),
            hemoglobin: hgb.toFixed(1),
            rbc: (rbcMillions).toFixed(2),
            wbc: Math.round(wbc).toString(),
            platelets: Math.round(platelets).toString(),
            rdw: rdw.trim() ? parseFloat(rdw).toFixed(1) + '%' : null,
            mcv: mcv.toFixed(2),
            mch: mch.toFixed(2),
            mchc: mchc.toFixed(2),
            neutrophils: {
                percentage: pctNeut.toFixed(1),
                absolute: neutAbs.toString(),
            },
            lymphocytes: {
                percentage: pctLymph.toFixed(1),
                absolute: lymphAbs.toString(),
            },
            monocytes: {
                percentage: pctMono.toFixed(1),
                absolute: monoAbs.toString(),
            },
            eosinophils: {
                percentage: pctEos.toFixed(1),
                absolute: eosAbs.toString(),
            },
            basophils: {
                percentage: pctBaso.toFixed(1),
                absolute: basoAbs.toString(),
            },
            totalLeukocytePercentage: totalPct.toFixed(1),
        };

        setResults(res);

        Keyboard.dismiss();
        setTimeout(() => {
            scrollToResult(scrollViewRef, resultViewRef);
        }, 200);
    };

    const resetForm = () => {
        setHematocrit('');
        setHemoglobin('');
        setRbcCount('');
        setTotalWBC('');
        setPlateletCount('');
        setRdw('');
        setNeutrophils('');
        setLymphocytes('');
        setMonocytes('');
        setEosinophils('');
        setBasophils('');
        setResults(null);
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                ref={scrollViewRef}
            >
                <TopBarComponent />

                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Análise completa do hemograma para {selectedSpecies === 'dog' ? 'cães' : 'gatos'}.
                    </Text>
                </View>

                {/* Seleção de espécie */}
                <View style={styles.inputGroup}>
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
                </View>

                <View style={[styles.inputSection, { backgroundColor: currentTheme.surfaceColor }]}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                        Valores Básicos do Hemograma
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            Hematócrito
                        </Text>
                        <CustomTextInput
                            value={hematocrit}
                            onChangeText={setHematocrit}
                            placeholder="Em %"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => rbcRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            Hemoglobina
                        </Text>
                        <CustomTextInput
                            value={hemoglobin}
                            onChangeText={setHemoglobin}
                            placeholder="Em g/dL"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => rbcRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            Hemácias (RBC)
                        </Text>
                        <CustomTextInput
                            ref={rbcRef}
                            value={rbcCount}
                            onChangeText={setRbcCount}
                            placeholder="Em milhões/μL"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => wbcRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            Leucócitos Totais (WBC)
                        </Text>
                        <CustomTextInput
                            ref={wbcRef}
                            value={totalWBC}
                            onChangeText={setTotalWBC}
                            placeholder="Em /μL"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => plateletsRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            Plaquetas
                        </Text>
                        <CustomTextInput
                            ref={plateletsRef}
                            value={plateletCount}
                            onChangeText={setPlateletCount}
                            placeholder="Em /μL"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => neutRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            RDW (opcional)
                        </Text>
                        <CustomTextInput
                            value={rdw}
                            onChangeText={setRdw}
                            placeholder="Em %"
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Fórmula Leucocitária */}
                <View style={[styles.inputSection, { backgroundColor: currentTheme.surfaceColor }]}>
                    <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                        Fórmula Leucocitária (%)
                    </Text>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            Neutrófilos
                        </Text>
                        <CustomTextInput
                            ref={neutRef}
                            value={neutrophils}
                            onChangeText={setNeutrophils}
                            placeholder="Em %"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => lymphRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            Linfócitos
                        </Text>
                        <CustomTextInput
                            ref={lymphRef}
                            value={lymphocytes}
                            onChangeText={setLymphocytes}
                            placeholder="Em %"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => monoRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            Monócitos
                        </Text>
                        <CustomTextInput
                            ref={monoRef}
                            value={monocytes}
                            onChangeText={setMonocytes}
                            placeholder="Em %"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => eosRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            Eosinófilos
                        </Text>
                        <CustomTextInput
                            ref={eosRef}
                            value={eosinophils}
                            onChangeText={setEosinophils}
                            placeholder="Em %"
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => basoRef.current?.focus()}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                            Basófilos
                        </Text>
                        <CustomTextInput
                            ref={basoRef}
                            value={basophils}
                            onChangeText={setBasophils}
                            placeholder="Em %"
                            keyboardType="numeric"
                            returnKeyType="done"
                        />
                    </View>

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

                {/* Resultados */}
                {results && (
                    <View style={[styles.resultsSection, { backgroundColor: currentTheme.resultBackgroundColor }]} ref={resultViewRef}>
                        <Text style={[styles.resultsTitle, { color: currentTheme.color }]}>
                            Resultados do Hemograma Completo
                        </Text>

                        {/* Valores Básicos */}
                        <View style={styles.resultsGroup}>
                            <Text style={[styles.groupTitle, { color: currentTheme.color }]}>Valores Básicos</Text>

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
                                    <Text style={[styles.resultStatus, { color: getValueStatus(results.hematocrit, 'hematocrit').color }]}>
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
                                    <Text style={[styles.resultStatus, { color: getValueStatus(results.hemoglobin, 'hemoglobin').color }]}>
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
                                    <Text style={[styles.resultStatus, { color: getValueStatus(results.rbc, 'rbc').color }]}>
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
                                    <Text style={[styles.resultStatus, { color: getValueStatus(results.wbc, 'wbc').color }]}>
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
                                    <Text style={[styles.resultStatus, { color: getValueStatus(results.platelets, 'platelets').color }]}>
                                        {getValueStatus(results.platelets, 'platelets').status}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Índices Hematológicos */}
                        <View style={styles.resultsGroup}>
                            <Text style={[styles.groupTitle, { color: currentTheme.color }]}>Índices Hematológicos</Text>

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
                                    <Text style={[styles.resultStatus, { color: getValueStatus(results.mcv, 'mcv').color }]}>
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
                                    <Text style={[styles.resultStatus, { color: getValueStatus(results.mch, 'mch').color }]}>
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
                                    <Text style={[styles.resultStatus, { color: getValueStatus(results.mchc, 'mchc').color }]}>
                                        {getValueStatus(results.mchc, 'mchc').status}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Fórmula Leucocitária — valores percentuais e absolutos */}
                        <View style={styles.resultsGroup}>
                            <Text style={[styles.groupTitle, { color: currentTheme.color }]}>Fórmula Leucocitária</Text>

                            <View style={styles.cellsGrid}>
                                <View style={[styles.cellCard, { backgroundColor: currentTheme.surfaceColor }]}>
                                    <View style={styles.cellHeader}>
                                        <Text style={[styles.cellName, { color: currentTheme.color }]}>Neutrófilos</Text>
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
                                        <Text style={[styles.cellName, { color: currentTheme.color }]}>Linfócitos</Text>
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
                                        <Text style={[styles.cellName, { color: currentTheme.color }]}>Monócitos</Text>
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
                                        <Text style={[styles.cellName, { color: currentTheme.color }]}>Eosinófilos</Text>
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
                                        <Text style={[styles.cellName, { color: currentTheme.color }]}>Basófilos</Text>
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

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
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
        padding: 16,
        marginBottom: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    inputGroup: {
        paddingHorizontal: 20,
    },
    inputLabel: {
        fontSize: 16,
        textAlign: 'center',
    },
    centeredLabel: {
        textAlign: 'center',
    },
    speciesButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
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
        fontSize: 18,
        fontWeight: 'bold',
    },
    resultsSection: {
        padding: 16,
        marginHorizontal: 20,
        borderRadius: 12,
        marginBottom: 12,
    },
    resultsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    resultsGroup: {
        marginBottom: 14,
    },
    groupTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
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
        borderRadius: 10,
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
        padding: 14,
        borderRadius: 10,
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
});
