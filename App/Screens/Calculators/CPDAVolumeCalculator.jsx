import { useState, useEffect, useRef } from 'react';
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
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent, getFormattedDateTime } from '../../../Components/TopBarComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

export default function CPDAVolumeCalculator() {
    let patientName; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientAge; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientRace; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientWeight; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    const [bloodVolume, setBloodVolume] = useState('');
    const [syringeSize, setSyringeSize] = useState('');
    const [result, setResult] = useState(null);
    const [containerType, setContainerType] = useState('Seringa');
    const scrollViewRef = useRef(null);
    const bloodInputRef = useRef(null);
    const syringeInputRef = useRef(null);
    const { currentTheme } = useTheme();
    const { formattedDate, formattedTime } = getFormattedDateTime();

    // RESETA O RESULTADO AO ALTERAR INPUTS
    useEffect(() => {
        setResult(null);
    }, [bloodVolume, syringeSize, containerType]);


    const calculateCPDA = async () => {
        if (!bloodVolume.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha o campo de volume de sangue.');
            return;
        }

        if (containerType === 'Seringa' && !syringeSize.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha o campo de tamanho da seringa.');
            return;
        }

        const blood = parseFloat(bloodVolume);
        const syringe = containerType === 'Seringa' ? parseFloat(syringeSize) : 513; // 513mL for blood bag (450mL blood + 63mL CPDA)

        if (isNaN(blood) || (containerType === 'Seringa' && (isNaN(syringe) || syringe === 0))) {
            Alert.alert('Valores inválidos', 'Por favor, insira valores numéricos válidos.');
            return;
        }

        const cpda = blood * 0.14;
        const totalVolume = blood + cpda;
        const bloodPerFullSyringe = containerType === 'Seringa' ? syringe / 1.14 : 450;
        const cpdaPerFullSyringe = containerType === 'Seringa' ? (syringe / 1.14) * 0.14 : 63;
        const fullSyringesNeeded = Math.floor(totalVolume / syringe);
        const remainingVolume = totalVolume % syringe;

        let partialSyringeInfo = null;
        if (remainingVolume > 0) {
            const bloodInPartial = remainingVolume / 1.14;
            const cpdaInPartial = bloodInPartial * 0.14;

            partialSyringeInfo = {
                bloodVolume: bloodInPartial.toFixed(2),
                cpdaVolume: cpdaInPartial.toFixed(2),
                totalVolume: remainingVolume.toFixed(2)
            };
        }

        setResult({
            bloodVolume: blood.toFixed(2),
            cpdaVolume: cpda.toFixed(2),
            totalVolume: totalVolume.toFixed(2),
            syringeSize: syringe.toFixed(2),
            fullSyringesNeeded: fullSyringesNeeded,
            partialSyringeInfo: partialSyringeInfo,
            bloodPerFullSyringe: bloodPerFullSyringe.toFixed(2),
            cpdaPerFullSyringe: cpdaPerFullSyringe.toFixed(2),
            totalPerFullSyringe: (bloodPerFullSyringe + cpdaPerFullSyringe).toFixed(2),
            date: `${formattedDate}, ${formattedTime}`,
        });

        Keyboard.dismiss();
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 200);

        //ASYNC STORAGE
        const saveToHistory = async () => {
            try {
                const historyEntry = {
                    patientName: patientName ?? 'Paciente Não Cadastrado',
                    patientAge: patientAge ?? '',
                    patientSpecies: patientRace ?? '',
                    patientWeight: patientWeight ?? '',
                    date: `${formattedDate}, ${formattedTime}`,///
                    containerType: containerType,///
                    calculationType: 'Volume CPDA x Sangue', /// alterados, o resto veio de result
                    bloodVolume: blood.toFixed(2),
                    cpdaVolume: cpda.toFixed(2),
                    totalVolume: totalVolume.toFixed(2),
                    syringeSize: syringe.toFixed(2),
                    fullSyringesNeeded: fullSyringesNeeded,
                    partialSyringeInfo: partialSyringeInfo,
                    bloodPerFullSyringe: bloodPerFullSyringe.toFixed(2),
                    cpdaPerFullSyringe: cpdaPerFullSyringe.toFixed(2),
                    totalPerFullSyringe: (bloodPerFullSyringe + cpdaPerFullSyringe).toFixed(2),
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
                        Cálculo de proporção entre Sangue e CPDA em seringa ou bolsa de sangue
                    </Text>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>Volume de Sangue:</Text>
                    <CustomTextInput
                        ref={bloodInputRef}
                        value={bloodVolume}
                        onChangeText={setBloodVolume}
                        placeholder="Volume (em mL)"
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            if (containerType === 'Seringa') {
                                syringeInputRef.current?.focus();
                            } else {
                                Keyboard.dismiss();
                            }
                        }}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>Tipo de Recipiente e Tamanho:</Text>
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
                            onFocus={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
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

                <TouchableOpacity
                    style={[styles.buttonZone, { backgroundColor: currentTheme.buttonColor }]}
                    activeOpacity={0.3}
                    onPress={calculateCPDA}
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
                        <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>Total necessário:</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume de Sangue Total: {result.bloodVolume} mL</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume de CPDA Total: {result.cpdaVolume} mL</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume Total: {result.totalVolume} mL</Text>

                        <Text style={[styles.sectionTitle, { marginTop: 20, color: currentTheme.color }]}>1 {containerType.toLowerCase()} completa de {result.syringeSize}mL possui:</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume de Sangue: {result.bloodPerFullSyringe} mL</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume de CPDA: {result.cpdaPerFullSyringe} mL</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume total: {result.totalPerFullSyringe} mL</Text>

                        <Text style={[styles.sectionTitle, { marginTop: 20, color: currentTheme.color }]}>{containerType}(s) necessárias:</Text>

                        {result.fullSyringesNeeded !== 0 && (
                            <Text style={[styles.resultText, { color: currentTheme.color }]}>{result.fullSyringesNeeded} {containerType.toLowerCase()}(s) completa(s) de {result.syringeSize}mL</Text>
                        )}

                        {result.partialSyringeInfo && (
                            <>
                                <Text style={[styles.sectionTitle, { marginTop: 10, color: currentTheme.color }]}>1 {containerType.toLowerCase()} com:</Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume de Sangue: {result.partialSyringeInfo.bloodVolume} mL</Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume de CPDA: {result.partialSyringeInfo.cpdaVolume} mL</Text>
                                <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume Total: {result.partialSyringeInfo.totalVolume} mL</Text>
                            </>
                        )}

                        <Text style={styles.resultNote}>Proporção: 1mL sangue : 0.14mL CPDA</Text>
                    </View>
                )}
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