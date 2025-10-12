import { useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert,
    TextInput,
} from 'react-native';
import { Calculator, RotateCcw, Dog, Cat } from 'lucide-react-native';
import { useTheme } from '../../../Components/ThemeComponent';
import { AsyncStorageHistoryComponent } from '../../../Components/AsyncStorageHistoryComponent';
import { TopBarComponent, getFormattedDateTime } from '../../../Components/TopBarComponent';

const { width } = Dimensions.get('window');

export default function PlateletCountScreen() {
    let patientName; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientAge; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientRace; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    let patientWeight; ////////////////////////////////////////TEMPORÁRIO, ATÉ FAZER O COMPONENT
    const { currentTheme } = useTheme();
    const [count, setCount] = useState(0);
    const [selectedSpecies, setSelectedSpecies] = useState('dog');
    const [microLiters, setMicroLiters] = useState('10000');
    const { formattedDate, formattedTime } = getFormattedDateTime();


    const REFERENCE_VALUES = {
        dog: { min: 200000, max: 500000 },
        cat: { min: 300000, max: 800000 },
    };

    const resetCount = () => {
        Alert.alert(
            'Resetar Contador',
            'Tem certeza que deseja resetar a contagem?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Resetar', onPress: () => setCount(0) },
            ]
        );
    };

    const incrementCount = () => setCount(prev => prev + 1);
    const decrementCount = () => count > 0 && setCount(prev => prev - 1);

    const analyzeResults = () => {
        if (count === 0) {
            Alert.alert('Aviso', 'Por favor, realize a contagem antes de analisar.');
            return;
        }
        if (!microLiters) {
            Alert.alert('Aviso', 'Por favor, digitar um valor fator de conversão.');
            return;
        }

        const microLitersNumber = Number(microLiters) || 0;
        const plateletCountPerMicroLiter = count * microLitersNumber;

        const ref = REFERENCE_VALUES[selectedSpecies];
        let status, interpretation, color;

        if (plateletCountPerMicroLiter < ref.min) {
            status = 'Baixo';
            interpretation = 'Trombocitopenia - Contagem de plaquetas abaixo do normal';
            color = '#ef4444';
        } else if (plateletCountPerMicroLiter > ref.max) {
            status = 'Alto';
            interpretation = 'Trombocitose - Contagem de plaquetas acima do normal';
            color = '#f59e0b';
        } else {
            status = 'Normal';
            interpretation = 'Contagem de plaquetas dentro dos valores normais';
            color = '#10b981';
        }

        Alert.alert(
            'Análise dos Resultados',
            `Contagem: ${plateletCountPerMicroLiter.toLocaleString()}/µL\nStatus: ${status}\nInterpretação: ${interpretation}`,
            [{ text: 'OK' }]
        );

        const historyEntry = {
            patientName: patientName ?? 'Paciente Não Cadastrado',
            patientAge: patientAge ?? '',
            patientSpecies: patientRace ?? selectedSpecies,
            patientWeight: patientWeight ?? '',
            date: `${formattedDate}, ${formattedTime}`,///
            microLitersNumber: microLitersNumber,
            plateletCount: plateletCountPerMicroLiter ?? 0,
        };

        AsyncStorageHistoryComponent('plateletHistory', historyEntry);

    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TopBarComponent />

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

                <View style={styles.counterContainer}>
                    <View style={[styles.countDisplay, { borderColor: currentTheme.color }]}>
                        <Text style={[styles.countText, { color: currentTheme.color }]}>{count}</Text>
                        <Text style={[styles.countLabel, { color: currentTheme.inactiveTintColor }]}>
                            Plaquetas Contadas
                        </Text>
                    </View>
                </View>

                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={[styles.countButton, { backgroundColor: currentTheme.minusButtonColor }]}
                        onPress={decrementCount}
                    >
                        <Text style={[styles.countButtonText, { color: currentTheme.color }]}>-</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.mainCountButton, { backgroundColor: currentTheme.plusButtonColor }]}
                        onPress={incrementCount}
                    >
                        <Text style={[styles.mainCountButtonText, { color: currentTheme.color }]}>+1</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.countButton, { backgroundColor: currentTheme.plusAltButtonColor }]}
                        onPress={incrementCount}
                    >
                        <Text style={[styles.countButtonText, { color: currentTheme.color }]}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: currentTheme.quickAccessBackgroundColor }]}
                        onPress={resetCount}
                    >
                        <RotateCcw size={24} color={currentTheme.color} />
                        <Text style={[styles.actionButtonText, { color: currentTheme.color }]}>Resetar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, { backgroundColor: currentTheme.quickAccessBackgroundColor }]}
                        onPress={analyzeResults}
                    >
                        <Calculator size={24} color={currentTheme.color} />
                        <Text style={[styles.actionButtonText, { color: currentTheme.color }]}>Analisar</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                        Fator de conversão (µL):
                    </Text>
                    <TextInput
                        style={[styles.textInput, { color: currentTheme.color, borderColor: currentTheme.inactiveTintColor }]}
                        placeholder="Digite o valor"
                        placeholderTextColor={currentTheme.inactiveTintColor}
                        value={microLiters}
                        onChangeText={text => setMicroLiters(text.replace(/[^0-9]/g, ''))}
                        keyboardType="numeric"
                    />
                </View>

                <View style={[styles.referenceCard, { backgroundColor: currentTheme.quickAccessBackgroundColor, borderColor: currentTheme.color }]}>
                    <Text style={[styles.referenceTitle, { color: currentTheme.color }]}>
                        Valores de Referência ({selectedSpecies === 'dog' ? 'Cão' : 'Gato'})
                    </Text>
                    <Text style={[styles.referenceText, { color: currentTheme.inactiveTintColor }]}>
                        Normal: {REFERENCE_VALUES[selectedSpecies].min.toLocaleString()} - {REFERENCE_VALUES[selectedSpecies].max.toLocaleString()}/µL
                    </Text>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    speciesContainer: {
        paddingHorizontal: 20,
        paddingVertical: 25
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center'
    },
    speciesButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    speciesButton: {
        alignItems: 'center',
        padding: 5,
        borderRadius: 15,
        borderWidth: 2,
        width: width * 0.4
    },
    speciesText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    counterContainer: {
        paddingHorizontal: 50,
        paddingVertical: 10
    },
    countDisplay: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        borderWidth: 2
    },
    countText: {
        fontSize: 55,
        fontWeight: 'bold'
    },
    countLabel: {
        fontSize: 16
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    countButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    countButtonText: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    mainCountButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainCountButtonText: {
        fontSize: 32,
        fontWeight: 'bold'
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10,
        gap: 10
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    textInput: {
        width: width * 0.4,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 16,
        textAlign: 'center'
    },
    referenceCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 20,
        borderRadius: 15,
        borderWidth: 1
    },
    referenceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5
    },
    referenceText: {
        fontSize: 14
    },
});
