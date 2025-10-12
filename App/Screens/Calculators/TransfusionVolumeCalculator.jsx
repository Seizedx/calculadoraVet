// Components/InfusionVolumeCalculator.js
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Keyboard,
    Alert,
    Dimensions,
} from 'react-native';
import {
    Calculator
} from 'lucide-react-native';
import CustomTextInput from '../../../Components/CustomTextInput';
import { AsyncStorageHistoryComponent } from '../../../Components/AsyncStorageHistoryComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent, getFormattedDateTime } from '../../../Components/TopBarComponent';
const { width, height } = Dimensions.get('window');

export default function TransfusionVolumeCalculator() {
    let patientName; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientAge; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientRace; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientWeight; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    const [animalWeight, setAnimalWeight] = useState('');
    const [desiredHematocrit, setDesiredHematocrit] = useState('');
    const [currentHematocrit, setCurrentHematocrit] = useState('');
    const [donorHematocrit, setDonorHematocrit] = useState('');
    const [animalType, setAnimalType] = useState('Gato');
    const [result, setResult] = useState(null);
    const scrollViewRef = useRef(null);
    const weightInputRef = useRef(null);
    const desiredHematocritInputRef = useRef(null);
    const currentHematocritInputRef = useRef(null);
    const donorHematocritInputRef = useRef(null);
    const { currentTheme } = useTheme();
    const { formattedDate, formattedTime } = getFormattedDateTime();


    // RESETA O RESULTADO AO ALTERAR INPUTS
    useEffect(() => {
        setResult(null);
    }, [animalWeight, desiredHematocrit, currentHematocrit, donorHematocrit, animalType]);

    const calculateInfusionVolume = async () => {
        if (!animalWeight.trim() || !desiredHematocrit.trim() || !currentHematocrit.trim() || !donorHematocrit.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }

        const weight = parseFloat(animalWeight);
        const desiredHct = parseFloat(desiredHematocrit);
        const currentHct = parseFloat(currentHematocrit);
        const donorHct = parseFloat(donorHematocrit);

        if (isNaN(weight) || isNaN(desiredHct) || isNaN(currentHct) || isNaN(donorHct) || donorHct === 0) {
            Alert.alert('Valores inválidos', 'Por favor, insira valores numéricos válidos.');
            return;
        }

        if (desiredHct <= currentHct) {
            Alert.alert('Valores inválidos', 'O hematócrito desejado deve ser maior que o hematócrito atual.');
            return;
        }

        if (donorHct <= 0) {
            Alert.alert('Valores inválidos', 'O hematócrito do doador deve ser maior que 0.');
            return;
        }

        const volemiaPerKg = animalType === 'Gato' ? 70 : 90;
        const bloodVolume = ((weight * volemiaPerKg) * (desiredHct - currentHct)) / donorHct;
        const totalCPDA = bloodVolume * 0.14;
        const infusionVolume = bloodVolume + totalCPDA;

        setResult({
            animalWeight: weight.toFixed(2),
            desiredHematocrit: desiredHct.toFixed(2),
            currentHematocrit: currentHct.toFixed(2),
            donorHematocrit: donorHct.toFixed(2),
            bloodVolume: bloodVolume.toFixed(2),
            infusionVolume: infusionVolume.toFixed(2),
            totalCPDA: totalCPDA.toFixed(2),
            animalType,
        });


        Keyboard.dismiss();
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 200);

        const historyEntry = {
            patientName: patientName ?? 'Paciente Não Cadastrado',
            patientAge: patientAge ?? '',
            patientSpecies: patientRace ?? animalType,
            patientWeight: patientWeight ?? animalWeight,
            date: `${formattedDate}, ${formattedTime}`,
            calculationType: 'Volume de Tranfusão', /// alterados, o resto veio de result
            animalWeight: weight.toFixed(2),
            desiredHematocrit: desiredHct.toFixed(2),
            currentHematocrit: currentHct.toFixed(2),
            donorHematocrit: donorHct.toFixed(2),
            bloodVolume: bloodVolume.toFixed(2),
            infusionVolume: infusionVolume.toFixed(2),
            totalCPDA: totalCPDA.toFixed(2),
            animalType,
        };

        AsyncStorageHistoryComponent('calculationHistory', historyEntry);
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
                        Cálculo de volume de sangue e CPDA necessário para alcançar determinado hematócrito.
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
                            desiredHematocritInputRef.current?.focus();
                        }}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Hematócrito Desejado:</Text>
                    <CustomTextInput
                        ref={desiredHematocritInputRef}
                        value={desiredHematocrit}
                        onChangeText={setDesiredHematocrit}
                        placeholder="Hematócrito (em %)"
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            currentHematocritInputRef.current?.focus();
                        }}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Hematócrito Atual:</Text>
                    <CustomTextInput
                        ref={currentHematocritInputRef}
                        value={currentHematocrit}
                        onChangeText={setCurrentHematocrit}
                        placeholder="Hematócrito (em %)"
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            donorHematocritInputRef.current?.focus();
                        }}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Hematócrito do Doador:</Text>
                    <CustomTextInput
                        ref={donorHematocritInputRef}
                        value={donorHematocrit}
                        onChangeText={setDonorHematocrit}
                        placeholder="Hematócrito (em %)"
                        keyboardType="numeric"
                        returnKeyType="done"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Espécie de Animal:</Text>
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
                            ? 'Volemia média de felinos: 60 a 70 mL/kg (usado 70 mL/kg)'
                            : 'Volemia média de caninos: 80 a 90 mL/kg (usado 90 mL/kg)'}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.buttonZone, { backgroundColor: currentTheme.buttonColor }]}
                    activeOpacity={0.3}
                    onPress={calculateInfusionVolume}
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
                        <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>Resultado:</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>
                            Volume de Sangue ({result.animalType}): {result.bloodVolume} mL
                        </Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>
                            Volume de CPDA ({result.animalType}): {result.totalCPDA} mL
                        </Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>
                            Volume Total da Transfusão ({result.animalType}): {result.infusionVolume} mL
                        </Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Peso: {result.animalWeight} kg</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Hematócrito Desejado: {result.desiredHematocrit} %</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Hematócrito Atual: {result.currentHematocrit} %</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>
                            Hematócrito do Doador: {result.donorHematocrit} %</Text>
                        <Text style={styles.resultNote}>
                            Lembrar de sempre checar se valores incluem CPDA.
                        </Text>
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
    animalTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
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
});