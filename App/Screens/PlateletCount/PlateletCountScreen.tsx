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
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { analyzePlateletCount } from './Platelet';

const { width } = Dimensions.get('window');

export default function PlateletCountScreen() {
    const { currentTheme } = useTheme();
    const [count, setCount] = useState(0);
    const [selectedSpecies, setSelectedSpecies] = useState<'dog' | 'cat'>('dog');
    const [microLiters, setMicroLiters] = useState<string>('10000');

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

    const incrementCount = () => {
        setCount(prev => prev + 1);
    };

    const decrementCount = () => {
        if (count > 0) {
            setCount(prev => prev - 1);
        }
    };

    const analyzeResults = () => {
        if (count === 0) {
            Alert.alert('Aviso', 'Por favor, realize a contagem antes de analisar.');
            return;
        }
        if (microLiters === '') {
            Alert.alert('Aviso', 'Por favor, digitar um valor fator de conversão.');
            return;
        }

        const microLitersNumber = Number(microLiters) || 0;
        const plateletCountPerMicroLiter = count * microLitersNumber;
        const analysis = analyzePlateletCount(plateletCountPerMicroLiter, selectedSpecies);

        Alert.alert(
            'Análise dos Resultados',
            `Contagem: ${plateletCountPerMicroLiter.toLocaleString()}/µL\n\nInterpretação: ${analysis.interpretation}`,
            [{ text: 'OK' }]
        );
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
                    <View
                        style={[
                            styles.countDisplay,
                            { borderColor: currentTheme.color },
                        ]}
                    >
                        <View style={styles.countDisplayIcon}>
                            <Calculator size={50} color={currentTheme.buttonColor} />
                        </View>
                        <Text style={[styles.countText, { color: currentTheme.color }]}>
                            {count}
                        </Text>
                        <Text
                            style={[
                                styles.countLabel,
                                { color: currentTheme.inactiveTintColor },
                            ]}
                        >
                            Plaquetas Contadas
                        </Text>
                    </View>
                </View>

                <View style={styles.controlsContainer}>
                    <TouchableOpacity
                        style={[
                            styles.countButton,
                            { backgroundColor: currentTheme.minusButtonColor },
                        ]}
                        onPress={decrementCount}
                    >
                        <Text
                            style={[
                                styles.countButtonText,
                                { color: currentTheme.color },
                            ]}
                        >
                            -
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.mainCountButton,
                            { backgroundColor: currentTheme.plusButtonColor },
                        ]}
                        onPress={incrementCount}
                    >
                        <Text
                            style={[
                                styles.mainCountButtonText,
                                { color: currentTheme.color },
                            ]}
                        >
                            +1
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.countButton,
                            { backgroundColor: currentTheme.plusAltButtonColor },
                        ]}
                        onPress={incrementCount}
                    >
                        <Text
                            style={[
                                styles.countButtonText,
                                { color: currentTheme.color },
                            ]}
                        >
                            +
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: currentTheme.quickAccessBackgroundColor },
                        ]}
                        onPress={resetCount}
                    >
                        <RotateCcw size={24} color={currentTheme.color} />
                        <Text
                            style={[
                                styles.actionButtonText,
                                { color: currentTheme.color },
                            ]}
                        >
                            Resetar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: currentTheme.quickAccessBackgroundColor },
                        ]}
                        onPress={analyzeResults}
                    >
                        <Calculator size={24} color={currentTheme.color} />
                        <Text
                            style={[
                                styles.actionButtonText,
                                { color: currentTheme.color },
                            ]}
                        >
                            Analisar
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={[styles.inputLabel, { color: currentTheme.color }]}>
                        Fator de conversão (µL):
                    </Text>
                    <TextInput
                        style={[
                            styles.textInput,
                            {
                                color: currentTheme.color,
                                borderColor: currentTheme.inactiveTintColor,
                            },
                        ]}
                        placeholder="Digite o valor"
                        placeholderTextColor={currentTheme.inactiveTintColor}
                        value={microLiters}
                        onChangeText={(text) => {
                            const numeric = text.replace(/[^0-9]/g, '');
                            setMicroLiters(numeric);
                        }}
                        keyboardType="numeric"
                        returnKeyType="done"
                    />
                </View>

                <View
                    style={[
                        styles.referenceCard,
                        {
                            backgroundColor: currentTheme.quickAccessBackgroundColor,
                            borderColor: currentTheme.color,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.referenceTitle,
                            { color: currentTheme.color },
                        ]}
                    >
                        Valores de Referência ({selectedSpecies === 'dog' ? 'Cão' : 'Gato'})
                    </Text>
                    <Text
                        style={[
                            styles.referenceText,
                            { color: currentTheme.inactiveTintColor },
                        ]}
                    >
                        {selectedSpecies === 'dog'
                            ? 'Normal: 200.000 - 500.000/µL'
                            : 'Normal: 300.000 - 800.000/µL'}
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        padding: 5,
        borderRadius: 15,
        borderWidth: 2,
        width: width * 0.4,
    },
    speciesText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    counterContainer: {
        paddingHorizontal: 50,
        paddingVertical: 10,
    },
    countDisplay: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 20,
        borderWidth: 2,
    },
    countDisplayIcon: {
        position: 'absolute',
        left: 10,
        bottom: '40%',
    },
    countText: {
        fontSize: 55,
        fontWeight: 'bold',
    },
    countLabel: {
        fontSize: 16,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    countButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countButtonText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    mainCountButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainCountButtonText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10,
        gap: 10,
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center', justifyContent: 'center',
        gap: 10,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    textInput: {
        width: width * 0.4,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 20,
        paddingVertical: 10,
        fontSize: 16,
        textAlign: 'center',
    },
    referenceCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
    },
    referenceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    referenceText: {
        fontSize: 14,
    },
});
