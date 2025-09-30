// Components/VolumeOfBloodDonated.js
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Keyboard,
    Alert,
    Dimensions
} from 'react-native';
import {
    Calculator
} from 'lucide-react-native';
import CustomTextInput from '../../../Components/CustomTextInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent, getFormattedDateTime } from '../../../Components/TopBarComponent';
const { width, height } = Dimensions.get('window');

export default function CPDAVolumeCalculator() {
    let patientName; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientAge; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientRace; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientWeight; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT

    const [animalWeight, setAnimalWeight] = useState('');
    const [syringeSize, setSyringeSize] = useState('');
    const [animalType, setAnimalType] = useState('Gato');
    const [customVolume, setCustomVolume] = useState('');
    const [result, setResult] = useState(null);
    const [syringeCalcType, setSyringeCalcType] = useState('max');
    const [containerType, setContainerType] = useState('Seringa');
    const scrollViewRef = useRef(null);
    const weightInputRef = useRef(null);
    const syringeInputRef = useRef(null);
    const customVolumeInputRef = useRef(null);
    const { currentTheme } = useTheme();
    const { formattedDate, formattedTime } = getFormattedDateTime();

    useEffect(() => {
        setResult(null);
    }, [animalWeight, syringeSize, animalType, customVolume, containerType]);

    const calculateBloodDonation = async () => {
        if (!animalWeight.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha o campo de peso.');
            return;
        }

        if (containerType === 'Seringa' && !syringeSize.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha o campo de tamanho da seringa.');
            return;
        }

        const weight = parseFloat(animalWeight);
        const syringe = containerType === 'Seringa' ? parseFloat(syringeSize) : 513; // 513mL for blood bag (450mL blood + 63mL CPDA)

        if (isNaN(weight) || (containerType === 'Seringa' && (isNaN(syringe) || syringe === 0))) {
            Alert.alert('Valores inválidos', 'Por favor, insira valores numéricos válidos.');
            return;
        }

        let bloodVolume, cpdaVolume, totalVolume, fullSyringesNeeded, partialSyringeInfo, bloodPerFullSyringe, cpdaPerFullSyringe, totalPerFullSyringe;

        if (customVolume.trim()) {
            const custom = parseFloat(customVolume);
            if (isNaN(custom) || custom <= 0) {
                Alert.alert('Valor inválido', 'O volume personalizado deve ser um número válido maior que 0.');
                return;
            }

            bloodVolume = custom * weight;
            cpdaVolume = bloodVolume * 0.14;
            totalVolume = bloodVolume + cpdaVolume;

            bloodPerFullSyringe = containerType === 'Seringa' ? Math.min(bloodVolume, syringe / 1.14) : 450;
            cpdaPerFullSyringe = containerType === 'Seringa' ? bloodPerFullSyringe * 0.14 : 63;
            fullSyringesNeeded = Math.floor(totalVolume / syringe);
            const remainingVolume = totalVolume % syringe;

            partialSyringeInfo = null;
            if (remainingVolume > 0) {
                const bloodInPartial = remainingVolume / 1.14;
                const cpdaInPartial = bloodInPartial * 0.14;
                partialSyringeInfo = {
                    bloodVolume: bloodInPartial.toFixed(2),
                    cpdaVolume: cpdaInPartial.toFixed(2),
                    totalVolume: remainingVolume.toFixed(2),
                };
            }

            setResult({
                animalWeight: weight.toFixed(2),
                bloodVolume: bloodVolume.toFixed(2),
                cpdaVolume: cpdaVolume.toFixed(2),
                totalVolume: totalVolume.toFixed(2),
                syringeSize: syringe.toFixed(2),
                fullSyringesNeeded,
                partialSyringeInfo,
                bloodPerFullSyringe: bloodPerFullSyringe.toFixed(2),
                cpdaPerFullSyringe: cpdaPerFullSyringe.toFixed(2),
                totalPerFullSyringe: (bloodPerFullSyringe + cpdaPerFullSyringe).toFixed(2),
                animalType,
                isCustom: true,
                customVolume,
            });

            Keyboard.dismiss();
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 200);

            //ASYNC STORAGE
            const saveToHistory = async () => {
                try {
                    const historyEntry = {
                        isCustom: true,
                        patientName: patientName ?? 'Paciente Não Cadastrado',
                        patientAge: patientAge ?? '',
                        patientSpecies: patientRace ?? animalType,
                        patientWeight: patientWeight ?? animalWeight,
                        date: `${formattedDate}, ${formattedTime}`,///
                        containerType: containerType,///
                        calculationType: 'Volume de Sangue Doado + CPDA', /// alterados, o resto veio de result
                        animalWeight: weight.toFixed(2),
                        bloodVolume: bloodVolume.toFixed(2),
                        cpdaVolume: cpdaVolume.toFixed(2),
                        totalVolume: totalVolume.toFixed(2),
                        syringeSize: syringe.toFixed(2),
                        fullSyringesNeeded,
                        partialSyringeInfo,
                        bloodPerFullSyringe: bloodPerFullSyringe.toFixed(2),
                        cpdaPerFullSyringe: cpdaPerFullSyringe.toFixed(2),
                        totalPerFullSyringe: (bloodPerFullSyringe + cpdaPerFullSyringe).toFixed(2),
                        animalType,
                        customVolume,

                    };

                // Recupera histórico já salvo
                const existingHistory = await AsyncStorage.getItem('calculationHistory');
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
                await AsyncStorage.setItem('calculationHistory', JSON.stringify(historyArray));
            } catch (error) {
                console.error('Erro ao salvar o objeto:', error);
            }
        };

        saveToHistory();

        } else {
            const volumeMinPerKg = animalType === 'Gato' ? 11 : 16;
            const volumeMaxPerKg = animalType === 'Gato' ? 13 : 18;

            const bloodVolumeMin = volumeMinPerKg * weight;
            const bloodVolumeMax = volumeMaxPerKg * weight;
            const cpdaMin = bloodVolumeMin * 0.14;
            const cpdaMax = bloodVolumeMax * 0.14;
            const totalVolumeMin = bloodVolumeMin + cpdaMin;
            const totalVolumeMax = bloodVolumeMax + cpdaMax;

            const bloodPerFullSyringeMin = containerType === 'Seringa' ? syringe / 1.14 : 450;
            const cpdaPerFullSyringeMin = containerType === 'Seringa' ? (syringe / 1.14) * 0.14 : 63;
            const fullSyringesNeededMin = Math.floor(totalVolumeMin / syringe);
            const remainingVolumeMin = totalVolumeMin % syringe;

            let partialSyringeInfoMin = null;
            if (remainingVolumeMin > 0) {
                const bloodInPartialMin = remainingVolumeMin / 1.14;
                const cpdaInPartialMin = bloodInPartialMin * 0.14;
                partialSyringeInfoMin = {
                    bloodVolume: bloodInPartialMin.toFixed(2),
                    cpdaVolume: cpdaInPartialMin.toFixed(2),
                    totalVolume: remainingVolumeMin.toFixed(2),
                };
            }

            const bloodPerFullSyringeMax = containerType === 'Seringa' ? syringe / 1.14 : 450;
            const cpdaPerFullSyringeMax = containerType === 'Seringa' ? (syringe / 1.14) * 0.14 : 63;
            const fullSyringesNeededMax = Math.floor(totalVolumeMax / syringe);
            const remainingVolumeMax = totalVolumeMax % syringe;

            let partialSyringeInfoMax = null;
            if (remainingVolumeMax > 0) {
                const bloodInPartialMax = remainingVolumeMax / 1.14;
                const cpdaInPartialMax = bloodInPartialMax * 0.14;
                partialSyringeInfoMax = {
                    bloodVolume: bloodInPartialMax.toFixed(2),
                    cpdaVolume: cpdaInPartialMax.toFixed(2),
                    totalVolume: remainingVolumeMax.toFixed(2),
                };
            }

            setResult({
                animalWeight: weight.toFixed(2),
                bloodVolumeMin: bloodVolumeMin.toFixed(2),
                bloodVolumeMax: bloodVolumeMax.toFixed(2),
                cpdaVolumeMin: cpdaMin.toFixed(2),
                cpdaVolumeMax: cpdaMax.toFixed(2),
                totalVolumeMin: totalVolumeMin.toFixed(2),
                totalVolumeMax: totalVolumeMax.toFixed(2),
                syringeSize: syringe.toFixed(2),
                fullSyringesNeededMin,
                partialSyringeInfoMin,
                bloodPerFullSyringeMin: bloodPerFullSyringeMin.toFixed(2),
                cpdaPerFullSyringeMin: cpdaPerFullSyringeMin.toFixed(2),
                totalPerFullSyringeMin: (bloodPerFullSyringeMin + cpdaPerFullSyringeMin).toFixed(2),
                fullSyringesNeededMax,
                partialSyringeInfoMax,
                bloodPerFullSyringeMax: bloodPerFullSyringeMax.toFixed(2),
                cpdaPerFullSyringeMax: cpdaPerFullSyringeMax.toFixed(2),
                totalPerFullSyringeMax: (bloodPerFullSyringeMax + cpdaPerFullSyringeMax).toFixed(2),
                animalType,
                isCustom: false,
            });


            Keyboard.dismiss();
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 200);

            //ASYNC STORAGE
            const saveToHistory = async () => {
                try {
                    const historyEntry = {
                        isCustom: false,
                        patientName: patientName ?? 'Paciente Não Cadastrado',
                        patientAge: patientAge ?? '',
                        patientSpecies: patientRace ?? animalType,
                        patientWeight: patientWeight ?? animalWeight,
                        date: `${formattedDate}, ${formattedTime}`,///
                        containerType: containerType,///
                        calculationType: 'Volume de Sangue Doado + CPDA', /// alterados, o resto veio de result
                        animalWeight: weight.toFixed(2),
                        bloodVolumeMin: bloodVolumeMin.toFixed(2),
                        bloodVolumeMax: bloodVolumeMax.toFixed(2),
                        cpdaVolumeMin: cpdaMin.toFixed(2),
                        cpdaVolumeMax: cpdaMax.toFixed(2),
                        totalVolumeMin: totalVolumeMin.toFixed(2),
                        totalVolumeMax: totalVolumeMax.toFixed(2),
                        syringeSize: syringe.toFixed(2),
                        fullSyringesNeededMin,
                        partialSyringeInfoMin,
                        bloodPerFullSyringeMin: bloodPerFullSyringeMin.toFixed(2),
                        cpdaPerFullSyringeMin: cpdaPerFullSyringeMin.toFixed(2),
                        totalPerFullSyringeMin: (bloodPerFullSyringeMin + cpdaPerFullSyringeMin).toFixed(2),
                        fullSyringesNeededMax,
                        partialSyringeInfoMax,
                        bloodPerFullSyringeMax: bloodPerFullSyringeMax.toFixed(2),
                        cpdaPerFullSyringeMax: cpdaPerFullSyringeMax.toFixed(2),
                        totalPerFullSyringeMax: (bloodPerFullSyringeMax + cpdaPerFullSyringeMax).toFixed(2),
                        animalType,
                    };

                    // Recupera histórico já salvo
                    const existingHistory = await AsyncStorage.getItem('calculationHistory');
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
                    await AsyncStorage.setItem('calculationHistory', JSON.stringify(historyArray));
                } catch (error) {
                    console.error('Erro ao salvar o objeto:', error);
                }
            };
            saveToHistory();
        }
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
                        Cálculo de volume de sangue que pode ser doado + CPDA proporcional ao peso
                    </Text>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Peso do Animal:
                    </Text>
                    <CustomTextInput
                        ref={weightInputRef}
                        value={animalWeight}
                        onChangeText={setAnimalWeight}
                        placeholder="Peso (em kg)"
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            if (containerType === 'Seringa') {
                                syringeInputRef.current?.focus();
                            } else {
                                customVolumeInputRef.current?.focus();
                            }
                        }}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Tipo de Recipiente e Tamanho:
                    </Text>
                    <View style={styles.containerTypeWrapper}>
                        <TouchableOpacity
                            style={[styles.animalButton, containerType === 'Seringa' ? { backgroundColor: currentTheme.buttonColor } : { backgroundColor: currentTheme.unselectedButtonColor }]}
                            onPress={() => setContainerType('Seringa')}
                        >
                            <Text style={[styles.animalButtonText, containerType === 'Seringa' ? { color: currentTheme.activeTintColor } : { color: currentTheme.inactiveTintColor }]}>Seringa</Text>
                        </TouchableOpacity>
                        <CustomTextInput
                            ref={syringeInputRef}
                            value={syringeSize}
                            onChangeText={setSyringeSize}
                            placeholder="Tamanho (em mL)"
                            keyboardType="numeric"
                            returnKeyType="done"
                            style={styles.smallInput}
                            editable={containerType === 'Seringa'}
                        />
                    </View>
                    <View style={[styles.containerTypeWrapper, { marginTop: 10 }]}>
                        <TouchableOpacity
                            style={[styles.animalButton, containerType === 'Bolsa' ? { backgroundColor: currentTheme.buttonColor } : { backgroundColor: currentTheme.unselectedButtonColor }]}
                            onPress={() => setContainerType('Bolsa')}
                        >
                            <Text style={[styles.animalButtonText, containerType === 'Bolsa' ? { color: currentTheme.activeTintColor } : { color: currentTheme.inactiveTintColor }]}>Bolsa de Sangue</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.resultNote, { marginTop: 10, textAlign: 'center' }]}>
                        Referência: Uma bolsa completa possui 450mL de sangue e 63mL de CPDA.
                    </Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Espécie de Animal:
                    </Text>
                    <View style={styles.animalTypeContainer}>
                        <TouchableOpacity
                            style={[styles.animalButton, animalType === 'Gato' ? { backgroundColor: currentTheme.buttonColor } : { backgroundColor: currentTheme.unselectedButtonColor }]}
                            onPress={() => setAnimalType('Gato')}
                        >
                            <Text style={[styles.animalButtonText, animalType === 'Gato' ? { color: currentTheme.activeTintColor } : { color: currentTheme.inactiveTintColor }]}>Felino</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.animalButton, animalType === 'Cachorro' ? { backgroundColor: currentTheme.buttonColor } : { backgroundColor: currentTheme.unselectedButtonColor }]}
                            onPress={() => setAnimalType('Cachorro')}
                        >
                            <Text style={[styles.animalButtonText, animalType === 'Cachorro' ? { color: currentTheme.activeTintColor } : { color: currentTheme.inactiveTintColor }]}>Canino</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.resultNote, { marginTop: 10, textAlign: 'center' }]}>
                        {animalType === 'Gato'
                            ? 'Referência:\nUm felino pode doar de 11 a 13 mL por kg'
                            : 'Referência:\nUm canino pode doar de 16 a 18 mL por kg'}
                    </Text>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color, marginTop: 10, }]}>
                        Volume Diferente da Referência:
                    </Text>
                    <CustomTextInput
                        ref={customVolumeInputRef}
                        value={customVolume}
                        onChangeText={setCustomVolume}
                        placeholder="Valor Personalizado (em mL)"
                        keyboardType="numeric"
                    />
                </View>
                <TouchableOpacity
                    style={[styles.buttonZone, { backgroundColor: currentTheme.buttonColor }]}
                    activeOpacity={0.3}
                    onPress={calculateBloodDonation}
                >
                    <View style={styles.buttonTextArea}>
                        <Calculator size={25} color={currentTheme.color} strokeWidth={3} />
                        <Text style={[styles.buttonText, { color: currentTheme.color }]}>Calcular</Text>
                    </View>
                </TouchableOpacity>
                {!result && (
                    <View style={{ marginBottom: 50 }}></View>
                )}
                {result && (
                    <View style={[styles.resultContainer, { backgroundColor: currentTheme.resultBackgroundColor }]}>
                        {result.isCustom ? (
                            <>
                                <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>Total necessário:</Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>
                                    Volume de Sangue ({result.animalType}): {result.bloodVolume} mL
                                </Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>
                                    Volume de CPDA: {result.cpdaVolume} mL
                                </Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>
                                    Volume Total: {result.totalVolume} mL
                                </Text>
                            </>
                        ) : (
                            <>
                                <Text style={[styles.sectionTitle, { marginTop: 20, color: currentTheme.color }]}>Total necessário (Mínimo a Máximo):</Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>
                                    Volume de Sangue ({result.animalType}): {result.bloodVolumeMin} mL a {result.bloodVolumeMax} mL
                                </Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>
                                    Volume de CPDA: {result.cpdaVolumeMin} mL a {result.cpdaVolumeMax} mL
                                </Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>
                                    Volume Total: {result.totalVolumeMin} mL a {result.totalVolumeMax} mL
                                </Text>
                            </>
                        )}

                        {!result.isCustom && (
                            <View style={styles.syringeTypeContainer}>
                                <Text style={[styles.sectionTitle, { marginTop: 10, color: currentTheme.color }]}>Base de Cálculo para {containerType}s:</Text>
                                <View style={styles.animalTypeContainer}>
                                    <TouchableOpacity
                                        style={[styles.syringeButton, syringeCalcType === 'min' ? { backgroundColor: currentTheme.buttonColor } : { backgroundColor: currentTheme.unselectedButtonColor }]}
                                        onPress={() => setSyringeCalcType('min')}
                                    >
                                        <Text style={[styles.animalButtonText, syringeCalcType === 'min' ? { color: currentTheme.activeTintColor } : { color: currentTheme.inactiveTintColor }]}>Mínimo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.syringeButton, syringeCalcType === 'max' ? { backgroundColor: currentTheme.buttonColor } : { backgroundColor: currentTheme.unselectedButtonColor }]}
                                        onPress={() => setSyringeCalcType('max')}
                                    >
                                        <Text style={[styles.animalButtonText, syringeCalcType === 'max' ? { color: currentTheme.activeTintColor } : { color: currentTheme.inactiveTintColor }]}>Máximo</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <Text style={[styles.sectionTitle, { marginTop: 20, color: currentTheme.color }]}>
                            1 {containerType.toLowerCase()} completa de {result.syringeSize}mL possui:
                        </Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>
                            Volume de Sangue: {result.isCustom ? result.bloodPerFullSyringe : (syringeCalcType === 'min' ? result.bloodPerFullSyringeMin : result.bloodPerFullSyringeMax)} mL
                        </Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>
                            Volume de CPDA: {result.isCustom ? result.cpdaPerFullSyringe : (syringeCalcType === 'min' ? result.cpdaPerFullSyringeMin : result.cpdaPerFullSyringeMax)} mL
                        </Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>
                            Volume total: {result.isCustom ? result.totalPerFullSyringe : (syringeCalcType === 'min' ? result.totalPerFullSyringeMin : result.totalPerFullSyringeMax)} mL
                        </Text>

                        <Text style={[styles.sectionTitle, { marginTop: 20, color: currentTheme.color }]}>{containerType}s necessárias:</Text>
                        {result.fullSyringesNeededMin !== 0 &&
                            result.fullSyringesNeededMax !== 0 && (
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>
                                    {result.isCustom ? result.fullSyringesNeeded : (syringeCalcType === 'min' ? result.fullSyringesNeededMin : result.fullSyringesNeededMax)} {containerType.toLowerCase()}(s) completa(s) de {result.syringeSize}mL
                                </Text>
                            )}

                        {(result.isCustom ? result.partialSyringeInfo : (syringeCalcType === 'min' ? result.partialSyringeInfoMin : result.partialSyringeInfoMax)) && (
                            <>
                                <Text style={[styles.sectionTitle, { marginTop: 10, color: currentTheme.color }]}>1 {containerType.toLowerCase()} com:</Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>
                                    Volume de Sangue: {result.isCustom ? result.partialSyringeInfo.bloodVolume : (syringeCalcType === 'min' ? result.partialSyringeInfoMin.bloodVolume : result.partialSyringeInfoMax.bloodVolume)} mL
                                </Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>
                                    Volume de CPDA: {result.isCustom ? result.partialSyringeInfo.cpdaVolume : (syringeCalcType === 'min' ? result.partialSyringeInfoMin.cpdaVolume : result.partialSyringeInfoMax.cpdaVolume)} mL
                                </Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>
                                    Volume Total: {result.isCustom ? result.partialSyringeInfo.totalVolume : (syringeCalcType === 'min' ? result.partialSyringeInfoMin.totalVolume : result.partialSyringeInfoMax.totalVolume)} mL
                                </Text>
                            </>
                        )}
                        {result.isCustom ? (
                            <Text style={styles.resultNote}>
                                {result.animalType === 'Gato'
                                    ? `Utilizado valor personalizado de ${customVolume} mL.\n\nUm gato pode doar de 11 a 13 mL por kg.`
                                    : `Utilizado valor personalizado de ${customVolume} mL.\n\nUm cachorro pode doar de 16 a 18 mL por kg.`}
                            </Text>
                        ) : (
                            <Text style={styles.resultNote}>
                                {result.animalType === 'Gato'
                                    ? `Um gato pode doar de 11 a 13 mL por kg.\n\n`
                                    : `Um cachorro pode doar de 16 a 18 mL por kg.\n\n`}
                            </Text>
                        )}
                    </View>
                )
                }
            </ScrollView >
        </View >
    );
}

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
    animalTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    containerTypeWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    animalButton: {
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 20,
        marginHorizontal: 10,
    },
    syringeTypeContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    syringeButton: {
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 10,
    },
    animalButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonZone: {
        alignSelf: 'center',
        marginTop: 20,
        padding: 10,
        width: width * 0.85,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonTextArea: {
        marginLeft: -35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 27,
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
    resultText: {
        fontSize: 16,
        marginBottom: 5,
        marginLeft: 10,
        textAlign: 'center'
    },
    resultNote: {
        paddingHorizontal: 20,
        color: '#919191ff',
        fontSize: 14,
        marginTop: 15,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    smallInput: {
        width: 250,
    },
});