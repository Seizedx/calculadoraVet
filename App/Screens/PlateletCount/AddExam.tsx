import { useState, useRef } from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert,
} from 'react-native';
import { CirclePlus as PlusCircle, Save, Dog, Cat } from 'lucide-react-native';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { analyzePlateletCount, PlateletCount } from './Platelet';

const { width } = Dimensions.get('window');

export default function PlateletCountAddExam() {
    const { currentTheme } = useTheme();
    const [animalName, setAnimalName] = useState('');
    const [species, setSpecies] = useState<'dog' | 'cat'>('dog');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [plateletCount, setPlateletCount] = useState('');
    const [notes, setNotes] = useState('');

    const nameRef = useRef<TextInput>(null);
    const ageRef = useRef<TextInput>(null);
    const weightRef = useRef<TextInput>(null);
    const countRef = useRef<TextInput>(null);
    const notesRef = useRef<TextInput>(null);

    const resetForm = () => {
        setAnimalName('');
        setAge('');
        setWeight('');
        setPlateletCount('');
        setNotes('');
        setSpecies('dog');
    };

    const saveExam = () => {
        if (!animalName || !age || !weight || !plateletCount) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        const count = parseInt(plateletCount);
        if (isNaN(count) || count <= 0) {
            Alert.alert('Erro', 'Por favor, insira um valor válido para a contagem de plaquetas.');
            return;
        }

        const analysis = analyzePlateletCount(count, species);

        const exam: PlateletCount = {
            id: Date.now().toString(),
            animalName,
            species,
            age: parseInt(age),
            weight: parseFloat(weight),
            plateletCount: count,
            date: new Date(),
            notes,
        };

        // Aqui você salvaria no storage local ou banco de dados

        Alert.alert(
            'Exame Salvo',
            `Paciente: ${animalName}\nContagem: ${count.toLocaleString()}/µL\nStatus: ${analysis.interpretation}`,
            [
                {
                    text: 'Novo Exame',
                    onPress: resetForm,
                },
                {
                    text: 'OK',
                },
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TopBarComponent />
                <View style={styles.content}>
                    <View style={[
                        styles.iconContainer,
                        { backgroundColor: currentTheme.gradientB, borderColor: currentTheme.color }
                    ]}>
                        <PlusCircle size={80} color={currentTheme.color} strokeWidth={2} />
                    </View>
                    <View style={styles.speciesContainer}>
                        <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>Selecionar Espécie:</Text>
                        <View style={styles.speciesButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.speciesButton,
                                    {
                                        backgroundColor: species === 'dog' ? currentTheme.buttonColor : currentTheme.unselectedButtonColor,
                                        borderColor: currentTheme.color,
                                    },
                                ]}
                                onPress={() => setSpecies('dog')}
                            >
                                <Dog size={40} color={species === 'dog' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor} />
                                <Text style={[
                                    styles.speciesText,
                                    { color: species === 'dog' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor }
                                ]}>
                                    Cão
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.speciesButton,
                                    {
                                        backgroundColor: species === 'cat' ? currentTheme.buttonColor : currentTheme.unselectedButtonColor,
                                        borderColor: currentTheme.color,
                                    },
                                ]}
                                onPress={() => setSpecies('cat')}
                            >
                                <Cat size={40} color={species === 'cat' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor} />
                                <Text style={[
                                    styles.speciesText,
                                    { color: species === 'cat' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor }
                                ]}>
                                    Gato
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formContainer}>
                        <Text style={[styles.label, { color: currentTheme.color }]}>Nome do Animal:</Text>
                        <TextInput
                            ref={nameRef}
                            style={[styles.textInput, { color: currentTheme.color, borderColor: currentTheme.inactiveTintColor }]}
                            placeholder="Digite o nome do animal"
                            placeholderTextColor={currentTheme.inactiveTintColor}
                            value={animalName}
                            onChangeText={setAnimalName}
                            returnKeyType="next"
                            onSubmitEditing={() => ageRef.current?.focus()}
                        />

                        <Text style={[styles.label, { color: currentTheme.color }]}>Idade (anos):</Text>
                        <TextInput
                            ref={ageRef}
                            style={[styles.textInput, { color: currentTheme.color, borderColor: currentTheme.inactiveTintColor }]}
                            placeholder="Digite a idade em anos"
                            placeholderTextColor={currentTheme.inactiveTintColor}
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => weightRef.current?.focus()}
                        />

                        <Text style={[styles.label, { color: currentTheme.color }]}>Peso (kg):</Text>
                        <TextInput
                            ref={weightRef}
                            style={[styles.textInput, { color: currentTheme.color, borderColor: currentTheme.inactiveTintColor }]}
                            placeholder="Digite o peso em kg"
                            placeholderTextColor={currentTheme.inactiveTintColor}
                            value={weight}
                            onChangeText={setWeight}
                            keyboardType="decimal-pad"
                            returnKeyType="next"
                            onSubmitEditing={() => countRef.current?.focus()}
                        />

                        <Text style={[styles.label, { color: currentTheme.color }]}>Contagem de Plaquetas (/µL):</Text>
                        <TextInput
                            ref={countRef}
                            style={[styles.textInput, { color: currentTheme.color, borderColor: currentTheme.inactiveTintColor }]}
                            placeholder="Ex: 350000"
                            placeholderTextColor={currentTheme.inactiveTintColor}
                            value={plateletCount}
                            onChangeText={setPlateletCount}
                            keyboardType="numeric"
                            returnKeyType="next"
                            onSubmitEditing={() => notesRef.current?.focus()}
                        />

                        <Text style={[styles.label, { color: currentTheme.color }]}>Observações (opcional):</Text>
                        <TextInput
                            ref={notesRef}
                            style={[styles.textInput, { color: currentTheme.color, borderColor: currentTheme.inactiveTintColor }]}
                            placeholder="Digite observações adicionais..."
                            placeholderTextColor={currentTheme.inactiveTintColor}
                            value={notes}
                            onChangeText={setNotes}
                            multiline={true}
                            numberOfLines={4}
                            returnKeyType="done"
                            textAlignVertical="top"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: currentTheme.buttonColor }]}
                        onPress={saveExam}
                    >
                        <Save size={24} color={currentTheme.buttonTheme} />
                        <Text style={[styles.saveButtonText, { color: currentTheme.buttonTheme }]}>Salvar Exame</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    iconContainer: {
        marginTop: 20,
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 8,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    speciesContainer: {
        marginBottom: 10,
    },
    speciesButtons: {
        marginTop: 10,
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
    formContainer: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 15,
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        minHeight: 100,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        gap: 10,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});