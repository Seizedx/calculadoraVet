// Components/InfusionRateCalculator.js
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
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import CustomTextInput from '../../../Components/CustomTextInput';
import { AsyncStorageHistoryComponent } from '../../../Components/AsyncStorageHistoryComponent';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent, getFormattedDateTime } from '../../../Components/TopBarComponent';
const { width, height } = Dimensions.get('window');

export default function InfusionRateCalculator() {
    let patientName; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientAge; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientRace; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientWeight; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    const [totalVolume, setTotalVolume] = useState('');
    const [weight, setWeight] = useState('');
    const [infusionRate30Min, setInfusionRate30Min] = useState('');
    const [infusionRateRemaining, setInfusionRateRemaining] = useState('');
    const [totalTimeRemaining, setTotalTimeRemaining] = useState('');
    const [result, setResult] = useState(null);
    const scrollViewRef = useRef(null);
    const totalVolumeInputRef = useRef(null);
    const weightInputRef = useRef(null);
    const infusionRate30MinInputRef = useRef(null);
    const infusionRateRemainingInputRef = useRef(null);
    const totalTimeRemainingInputRef = useRef(null);
    const { currentTheme } = useTheme();
    const { formattedDate, formattedTime } = getFormattedDateTime();

    // RESETA O RESULTADO AO ALTERAR INPUTS
    useEffect(() => {
        setResult(null);
    }, [totalVolume, weight, infusionRate30Min, infusionRateRemaining, totalTimeRemaining]);

    const calculateInfusion = async () => {
        // Validar campos obrigatórios
        if (!totalVolume.trim() || !weight.trim() || !infusionRate30Min.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha os campos obrigatórios: Volume Total, Peso e Taxa de Infusão (30 min).');
            return;
        }

        // Converter entradas para números
        const totalVolumeValue = parseFloat(totalVolume);
        const weightValue = parseFloat(weight);
        const infusionRate30MinValue = parseFloat(infusionRate30Min);
        const infusionRateRemainingValue = infusionRateRemaining.trim() ? parseFloat(infusionRateRemaining) : null;
        const totalTimeRemainingValue = totalTimeRemaining.trim() ? parseFloat(totalTimeRemaining) : null;

        // Validações de entrada
        if (
            isNaN(totalVolumeValue) ||
            isNaN(weightValue) ||
            isNaN(infusionRate30MinValue) ||
            totalVolumeValue <= 0 ||
            weightValue <= 0 ||
            infusionRate30MinValue <= 0
        ) {
            Alert.alert('Valores inválidos', 'Por favor, insira valores numéricos válidos e maiores que zero nos campos obrigatórios.');
            return;
        }

        // Validar infusionRateRemainingValue se fornecido
        if (infusionRateRemainingValue !== null && (isNaN(infusionRateRemainingValue) || infusionRateRemainingValue <= 0)) {
            Alert.alert('Valores inválidos', 'A taxa de infusão restante deve ser um número maior que zero ou deixada em branco.');
            return;
        }

        // Define o tempo padrão como 3.5 horas se totalTimeRemainingValue não for fornecido
        const defaultTotalTime = 3.5;
        const effectiveTotalTime = totalTimeRemainingValue && !isNaN(totalTimeRemainingValue) && totalTimeRemainingValue > 0 ? totalTimeRemainingValue : defaultTotalTime;

        // Validação: tempo restante não pode exceder 3.5 horas
        if (effectiveTotalTime > 3.5) {
            Alert.alert('Erro', 'O tempo restante não pode exceder 3.5 horas.');
            return;
        }

        // Cálculo dos primeiros 30 minutos (0.5 horas)
        const volume30Min = (weightValue * infusionRate30MinValue) / 2;
        const dropsPerMinute30Min = volume30Min / (0.5 * 3);
        const dropsPerSecond30Min = dropsPerMinute30Min > 0 ? 60 / dropsPerMinute30Min : 0; // Evitar divisão por zero

        // Cálculo do volume restante
        const volumeRemaining = totalVolumeValue - volume30Min;

        // Validação: volume restante deve ser positivo
        if (volumeRemaining <= 0) {
            Alert.alert('Erro', 'O volume dos 30 minutos iniciais excede o volume total. Reduza a taxa de infusão inicial.');
            return;
        }

        // Cálculo do período restante
        let infusionRatePerHour, calculatedTimeRemaining, dropsPerMinuteRemaining, dropsPerSecondRemaining;
        let effectiveInfusionRateRemainingValue = infusionRateRemainingValue;

        if (infusionRateRemainingValue !== null && infusionRateRemainingValue > 0) {
            // Caso infusionRateRemaining seja fornecido
            infusionRatePerHour = weightValue * infusionRateRemainingValue;
            calculatedTimeRemaining = volumeRemaining / infusionRatePerHour;
            dropsPerMinuteRemaining = volumeRemaining / (effectiveTotalTime * 3); // Gota por minuto
            dropsPerSecondRemaining = dropsPerMinuteRemaining > 0 ? 60 / dropsPerMinuteRemaining : 0; // Gota por segundo

            // Validação: tempo restante calculado não pode exceder o tempo restante definido
            if (calculatedTimeRemaining > effectiveTotalTime) {
                const minInfusionRateRemaining = (volumeRemaining / effectiveTotalTime) / weightValue; // Taxa mínima ajustada
                Alert.alert(
                    'Atenção',
                    `A taxa de infusão selecionada resulta em um tempo restante superior a ${effectiveTotalTime} horas. Viável a partir de ${minInfusionRateRemaining.toFixed(2)} mL/kg/h. Reavaliar necessidade.`
                );
                return;
            }
            dropsPerMinuteRemaining = volumeRemaining / (effectiveTotalTime * 3); // Gota por minuto
            dropsPerSecondRemaining = dropsPerMinuteRemaining > 0 ? 60 / dropsPerMinuteRemaining : 0; // Gota por segundo
        } else {
            // Caso infusionRateRemaining não seja fornecido
            infusionRatePerHour = volumeRemaining / effectiveTotalTime; // Volume em 1 hora
            effectiveInfusionRateRemainingValue = infusionRatePerHour / weightValue; // Taxa de infusão em mL/kg/h
            calculatedTimeRemaining = effectiveTotalTime; // Tempo calculado é o tempo fornecido ou padrão
            dropsPerMinuteRemaining = volumeRemaining / (effectiveTotalTime * 3); // Gota por minuto
            dropsPerSecondRemaining = dropsPerMinuteRemaining > 0 ? 60 / dropsPerMinuteRemaining : 0; // Gota por segundo
        }

        // Armazenar resultado
        setResult({
            totalVolume: totalVolumeValue.toFixed(2),
            weight: weightValue.toFixed(2),
            infusionRate30Min: infusionRate30MinValue.toFixed(2),
            infusionRateRemaining: effectiveInfusionRateRemainingValue ? effectiveInfusionRateRemainingValue.toFixed(2) : '0.00',
            totalTimeRemaining: effectiveTotalTime.toFixed(2),
            volume30Min: volume30Min.toFixed(2),
            dropsPerMinute30Min: dropsPerMinute30Min.toFixed(2),
            dropsPerSecond30Min: dropsPerSecond30Min.toFixed(2),
            volumeRemaining: volumeRemaining.toFixed(2),
            infusionRatePerHour: infusionRatePerHour.toFixed(2),
            calculatedTimeRemaining: calculatedTimeRemaining.toFixed(2),
            dropsPerMinuteRemaining: dropsPerMinuteRemaining.toFixed(2),
            dropsPerSecondRemaining: dropsPerSecondRemaining.toFixed(2),
        });

        Keyboard.dismiss();
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 200);


        const historyEntry = {
            patientName: patientName ?? 'Paciente Não Cadastrado',
            patientAge: patientAge ?? '',
            patientSpecies: patientRace ?? '',
            patientWeight: patientWeight ?? '',
            date: `${formattedDate}, ${formattedTime}`,///
            calculationType: 'Taxa de Infusão', /// alterados, o resto veio de result
            totalVolume: totalVolumeValue.toFixed(2),
            weight: weightValue.toFixed(2),
            infusionRate30Min: infusionRate30MinValue.toFixed(2),
            infusionRateRemaining: effectiveInfusionRateRemainingValue ? effectiveInfusionRateRemainingValue.toFixed(2) : '0.00',
            totalTimeRemaining: effectiveTotalTime.toFixed(2),
            volume30Min: volume30Min.toFixed(2),
            dropsPerMinute30Min: dropsPerMinute30Min.toFixed(2),
            dropsPerSecond30Min: dropsPerSecond30Min.toFixed(2),
            volumeRemaining: volumeRemaining.toFixed(2),
            infusionRatePerHour: infusionRatePerHour.toFixed(2),
            calculatedTimeRemaining: calculatedTimeRemaining.toFixed(2),
            dropsPerMinuteRemaining: dropsPerMinuteRemaining.toFixed(2),
            dropsPerSecondRemaining: dropsPerSecondRemaining.toFixed(2),
        };
        AsyncStorageHistoryComponent('calculationHistory', historyEntry);
    };



    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <KeyboardAwareScrollView
                bottomOffset={20}
                ref={scrollViewRef}>
                <TopBarComponent />
                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Cálculo para determinar taxa de infusão por tempo ou volume conforme referências ou personalizado.
                    </Text>
                </View>
                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Volume Total da Transfusão:
                    </Text>
                    <Text style={styles.referenceText}>Lembrar de Incluir Volume de CPDA</Text>
                    <CustomTextInput
                        ref={totalVolumeInputRef}
                        value={totalVolume}
                        onChangeText={setTotalVolume}
                        placeholder="Volume (em mL)"
                        keyboardType="numeric"
                        blurOnSubmit={false}
                        returnKeyType="next"
                        onSubmitEditing={() => weightInputRef.current?.focus()}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Peso do Animal:
                    </Text>
                    <CustomTextInput
                        ref={weightInputRef}
                        value={weight}
                        onChangeText={setWeight}
                        placeholder="Peso (em kg)"
                        keyboardType="numeric"
                        blurOnSubmit={false}
                        returnKeyType="next"
                        onSubmitEditing={() => infusionRate30MinInputRef.current?.focus()}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Taxa de Infusão dos 30min Iniciais
                    </Text>
                    <Text style={styles.referenceText}>Recomendado: 0.5 à 5mL</Text>
                    <CustomTextInput
                        ref={infusionRate30MinInputRef}
                        value={infusionRate30Min}
                        onChangeText={setInfusionRate30Min}
                        placeholder="Taxa (em mL/kg/h)"
                        keyboardType="numeric"
                        blurOnSubmit={false}
                        returnKeyType="next"
                        onSubmitEditing={() => infusionRateRemainingInputRef.current?.focus()}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Determinar Taxa de Infusão Restante:
                    </Text>
                    <Text style={styles.referenceText}>
                        Referências de taxa de infusão (período restante):{'\n'} {'\n'}
                        • Desidratado: 10 a 20 mL/kg/h{'\n'}
                        • Normohidratado: 4 a 10 mL/kg/h{'\n'}
                        • Hemorragia maciça: 22 a 40 mL/kg/h{'\n'}
                        • Cardiopata/Filhote/Nefropata: 1 a 5 mL/kg/h
                    </Text>
                    <CustomTextInput
                        ref={infusionRateRemainingInputRef}
                        value={infusionRateRemaining}
                        onChangeText={setInfusionRateRemaining}
                        placeholder="Taxa (em mL/kg/h)"
                        keyboardType="numeric"
                        blurOnSubmit={false}
                        returnKeyType="next"
                        onSubmitEditing={() => totalTimeRemainingInputRef.current?.focus()}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, styles.centeredLabel, { color: currentTheme.color }]}>
                        Determinar Tempo Total de Infusão:
                    </Text>
                    <CustomTextInput
                        ref={totalTimeRemainingInputRef}
                        value={totalTimeRemaining}
                        onChangeText={setTotalTimeRemaining}
                        placeholder="Tempo (em horas)"
                        keyboardType="numeric"
                        blurOnSubmit={true}
                        returnKeyType="done"
                    />
                    <Text style={[styles.referenceText, { marginBottom: 0 }]}>Valor Padrão e Limite: 3.5 horas.</Text>
                    <Text style={[styles.referenceText, { marginBottom: 0 }]}>Caso Definir Taxa de Infusão Restante, Tempo em Horas Não Será Utilizado</Text>
                </View>
                <TouchableOpacity
                    style={[styles.buttonZone, { backgroundColor: currentTheme.buttonColor }]}
                    activeOpacity={0.3}
                    onPress={calculateInfusion}
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
                        <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>Primeiros 30 minutos:</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume: {result.volume30Min} mL</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Gotas por minuto: {result.dropsPerMinute30Min} gotas/min</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>1 gota a cada {result.dropsPerSecond30Min} segundo(s)</Text>

                        <Text style={[styles.sectionTitle, { color: currentTheme.color, marginTop: 20 }]}>Volume de Infusão:</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume Total: {result.totalVolume} mL</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Volume Restante: {result.volumeRemaining} mL</Text>
                        <Text style={[styles.sectionTitle, { color: currentTheme.color, marginTop: 20 }]}>Período Restante:</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Tempo Definido/Calculado: {result.calculatedTimeRemaining} h</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Taxa de Infusão por Hora: {result.infusionRatePerHour} mL/h</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Taxa de Infusão por Kg/h: {result.infusionRateRemaining} mL/kg/h</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>Gotas por minuto: {result.dropsPerMinuteRemaining} gotas/min</Text>
                        <Text style={[styles.resultText, { color: currentTheme.color }]}>1 gota a cada {result.dropsPerSecondRemaining} segundo(s)</Text>
                        <Text style={styles.resultNote}>Verificar se Valores de CPDA Foram Incluídos</Text>
                    </View>
                )}
            </KeyboardAwareScrollView >
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
        marginBottom: 5,
    },
    inputLabel: {
        fontSize: 16,
        textAlign: 'center',
    },
    centeredLabel: {
        textAlign: 'center',
    },
    centeredLabel: {
        textAlign: 'center',
    },
    referenceText: {
        paddingHorizontal: 20,
        color: '#919191ff',
        fontSize: 14,
        marginTop: 5,
        fontStyle: 'italic',
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