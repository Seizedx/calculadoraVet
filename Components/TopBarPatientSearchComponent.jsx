import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
    Animated,
    Keyboard,
} from 'react-native';
import { useTheme } from './ThemeComponent';
import {
    House,
    Menu,
    Search,
    Check,
    X,
} from 'lucide-react-native';
import { useNavigation, DrawerActions, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useRef, useEffect } from 'react';
import { resetToRoute } from './NavigationComponent';

// Lista mock de pacientes - você pode substituir por dados da sua API
const mockPatients = [
    { id: 1, name: 'João Silva' },
    { id: 2, name: 'Maria Santos' },
    { id: 3, name: 'Pedro Oliveira' },
    { id: 4, name: 'Ana Costa' },
    { id: 5, name: 'Carlos Ferreira' },
    { id: 6, name: 'Lucia Pereira' },
];


const TopBarPatientSearch = () => {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const screenTitle = route.params?.title ?? route.name;

    const [showPatientSearch, setShowPatientSearch] = useState(false);
    const [patientName, setPatientName] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const slideAnim = useRef(new Animated.Value(-60)).current;

    useEffect(() => {
        if (showPatientSearch) {

            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -150,
                duration: 300,
                useNativeDriver: false,
            }).start();
            Keyboard.dismiss();
        }
    }, [showPatientSearch]);

    const handlePatientSearch = (text) => {
        setPatientName(text);
        if (text.length > 0) {
            const filtered = mockPatients.filter(patient =>
                patient.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredPatients(filtered);
        } else {
            setFilteredPatients([]);
        }
    };

    const selectPatient = (patient) => {
        setSelectedPatient(patient);
        setPatientName(patient.name);
        setFilteredPatients([]);
    };

    const confirmPatientSelection = () => {
        // Aqui você pode implementar a lógica para salvar o paciente selecionado
        console.log('Paciente selecionado:', selectedPatient);
        setShowPatientSearch(false);
        setPatientName('');
        setSelectedPatient(null);
    };

    const cancelPatientSelection = () => {
        setShowPatientSearch(false);
        setPatientName('');
        setSelectedPatient(null);
        setFilteredPatients([]);
    };

    const togglePatientSearch = () => {
        setShowPatientSearch(!showPatientSearch);
    };

    const renderPatientItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.patientItem, { borderBottomColor: currentTheme.color + '20' }]}
            onPress={() => selectPatient(item)}
        >
            <Text style={[styles.patientName, { color: currentTheme.color }]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.patientSearchBar,
                    {
                        backgroundColor: currentTheme.gradientB,
                        top: slideAnim,
                    }
                ]}
            >
                <Text style={styles.titleBeforeInput}>Pesquisar Paciente</Text>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={[
                            styles.patientInput,
                            {
                                borderColor: currentTheme.inactiveTintColor,
                                color: currentTheme.color,
                            }
                        ]}
                        placeholder="Digite o nome do paciente..."
                        placeholderTextColor={currentTheme.color}
                        scrollEnabled={false}
                        multiline={false}
                        textAlign="center"
                        value={patientName}
                        onChangeText={handlePatientSearch}
                        autoFocus={showPatientSearch}
                    />
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: currentTheme.gradientA }]}
                            onPress={confirmPatientSelection}
                        >
                            <Check size={20} color={currentTheme.color} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, { backgroundColor: currentTheme.gradientA }]}
                            onPress={cancelPatientSelection}
                        >
                            <X size={20} color={currentTheme.color} />
                        </TouchableOpacity>
                    </View>
                </View>

                {filteredPatients.length > 0 && (
                    <View style={[styles.patientsList, { backgroundColor: currentTheme.gradientB }]}>
                        <FlatList
                            data={filteredPatients}
                            renderItem={renderPatientItem}
                            keyExtractor={(item) => item.id.toString()}
                            style={{ maxHeight: 150 }}
                        />
                    </View>
                )}
            </Animated.View>

            <LinearGradient
                colors={[currentTheme.gradientA, currentTheme.gradientB]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.buttonArea}>
                    <TouchableOpacity
                        style={styles.menuButton1}
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                    >
                        <Menu size={40} color={currentTheme.color} strokeWidth={3} />

                    </TouchableOpacity>
                    {route.params.search ? (
                        <TouchableOpacity
                            style={styles.menuButton1}
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        >
                            <Search size={40} color={currentTheme.color} strokeWidth={3} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.menuButton1}
                            onPress={() => {
                                setTimeout(() => resetToRoute('HomeScreen'), 100);
                            }
                            }
                        >
                            <House size={40} color={currentTheme.color} strokeWidth={3} />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity onPress={togglePatientSearch}>
                    <Text style={[styles.headerTitle, { color: currentTheme.color }]}>
                        {screenTitle}
                    </Text>
                </TouchableOpacity>
            </LinearGradient >
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    patientSearchBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingHorizontal: 15,
        paddingTop: 40,
        paddingBottom: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    searchContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    titleBeforeInput: {
        fontSize: 25,
        textAlign: 'center',
    },
    patientInput: {
        flex: 1,
        height: 45,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 5,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    patientsList: {
        marginTop: 10,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 3,
    },
    patientItem: {
        padding: 15,
        borderBottomWidth: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '500',
    },
    header: {
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        transition: 'margin-top 0.3s ease',
    },
    headerTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonArea: {
        marginTop: 40,
        height: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        marginBottom: 5,
    },

});

export default TopBarPatientSearch;