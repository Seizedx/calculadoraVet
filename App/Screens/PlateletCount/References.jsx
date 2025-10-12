import React, { useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import {
    ChartBar as BarChart3,
    Dog,
    Cat,
    TriangleAlert as AlertTriangle,
    CircleCheck as CheckCircle,
    Circle as XCircle,
} from 'lucide-react-native';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent } from '../../../Components/TopBarComponent';

const { width } = Dimensions.get('window');

export default function PlateletCountReferences() {
    const { currentTheme } = useTheme();
    const [selectedSpecies, setSelectedSpecies] = useState('dog');

    const referenceInfo = {
        dog: {
            normal: { min: 200000, max: 500000 },
            conditions: [
                {
                    name: 'Trombocitopenia',
                    range: '< 200.000/µL',
                    causes: [
                        'Doenças autoimunes',
                        'Infecções virais',
                        'Medicamentos (quimioterapia)',
                        'Doenças da medula óssea',
                        'Esplenomegalia',
                    ],
                    symptoms: [
                        'Petéquias na pele',
                        'Sangramento das gengivas',
                        'Epistaxe (sangramento nasal)',
                        'Hematomas espontâneos',
                    ],
                },
                {
                    name: 'Trombocitose',
                    range: '> 500.000/µL',
                    causes: [
                        'Processos inflamatórios',
                        'Neoplasias',
                        'Desidratação',
                        'Exercício intenso',
                        'Pós-cirúrgico',
                    ],
                    symptoms: [
                        'Geralmente assintomática',
                        'Possível trombose em casos extremos',
                    ],
                },
            ],
        },
        cat: {
            normal: { min: 300000, max: 800000 },
            conditions: [
                {
                    name: 'Trombocitopenia',
                    range: '< 300.000/µL',
                    causes: [
                        'Doenças autoimunes',
                        'Infecções (FeLV, FIV)',
                        'Medicamentos',
                        'Doenças hepáticas',
                        'Coagulopatias hereditárias',
                    ],
                    symptoms: [
                        'Sangramento prolongado',
                        'Petéquias',
                        'Melena',
                        'Hematúria',
                    ],
                },
                {
                    name: 'Trombocitose',
                    range: '> 800.000/µL',
                    causes: [
                        'Inflamação crônica',
                        'Neoplasias',
                        'Hipertireoidismo',
                        'Desidratação',
                        'Estresse',
                    ],
                    symptoms: [
                        'Raramente sintomática',
                        'Possível letargia em casos extremos',
                    ],
                },
            ],
        },
    };

    const currentRef = referenceInfo[selectedSpecies];

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TopBarComponent />


                {/* Seletor de espécie */}
                <View style={styles.speciesContainer}>
                    <Text
                        style={[styles.sectionTitle, { color: currentTheme.color }]}
                    >
                        Selecionar Espécie
                    </Text>
                    <View style={styles.speciesButtons}>
                        <TouchableOpacity
                            style={[
                                styles.speciesButton,
                                {
                                    backgroundColor:
                                        selectedSpecies === 'dog'
                                            ? currentTheme.buttonColor
                                            : currentTheme.unselectedButtonColor,
                                    borderColor: currentTheme.color,
                                },
                            ]}
                            onPress={() => setSelectedSpecies('dog')}
                        >
                            <Dog
                                size={40}
                                color={
                                    selectedSpecies === 'dog'
                                        ? currentTheme.activeTintColor
                                        : currentTheme.inactiveTintColor
                                }
                            />
                            <Text
                                style={[
                                    styles.speciesText,
                                    {
                                        color:
                                            selectedSpecies === 'dog'
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
                                    backgroundColor:
                                        selectedSpecies === 'cat'
                                            ? currentTheme.buttonColor
                                            : currentTheme.unselectedButtonColor,
                                    borderColor: currentTheme.color,
                                },
                            ]}
                            onPress={() => setSelectedSpecies('cat')}
                        >
                            <Cat
                                size={40}
                                color={
                                    selectedSpecies === 'cat'
                                        ? currentTheme.activeTintColor
                                        : currentTheme.inactiveTintColor
                                }
                            />
                            <Text
                                style={[
                                    styles.speciesText,
                                    {
                                        color:
                                            selectedSpecies === 'cat'
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

                <View style={styles.content}>
                    {/* Valores Normais */}
                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: currentTheme.quickAccessBackgroundColor,
                                borderColor: currentTheme.successColor,
                            },
                        ]}
                    >
                        <View style={styles.cardHeader}>
                            <CheckCircle size={24} color={currentTheme.successColor} />
                            <Text style={[styles.cardTitle, { color: currentTheme.color }]}>
                                Valores Normais
                            </Text>
                        </View>
                        <Text
                            style={[styles.normalRange, { color: currentTheme.successColor }]}
                        >
                            {currentRef.normal.min.toLocaleString()} -{' '}
                            {currentRef.normal.max.toLocaleString()}/µL
                        </Text>
                    </View>

                    {/* Condições */}
                    {currentRef.conditions.map((condition, index) => {
                        const isLow = condition.name.includes('citopenia');
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: currentTheme.quickAccessBackgroundColor,
                                        borderColor: isLow
                                            ? currentTheme.dangerColor
                                            : currentTheme.warningColor,
                                    },
                                ]}
                            >
                                <View style={styles.cardHeader}>
                                    {isLow ? (
                                        <XCircle size={24} color={currentTheme.dangerColor} />
                                    ) : (
                                        <AlertTriangle size={24} color={currentTheme.warningColor} />
                                    )}
                                    <Text
                                        style={[styles.cardTitle, { color: currentTheme.color }]}
                                    >
                                        {condition.name}
                                    </Text>
                                </View>

                                <Text
                                    style={[
                                        styles.conditionRange,
                                        {
                                            color: isLow
                                                ? currentTheme.dangerColor
                                                : currentTheme.warningColor,
                                        },
                                    ]}
                                >
                                    {condition.range}
                                </Text>

                                <View style={styles.section}>
                                    <Text
                                        style={[styles.sectionTitle, { color: currentTheme.color }]}
                                    >
                                        Principais Causas:
                                    </Text>
                                    {condition.causes.map((cause, i) => (
                                        <Text
                                            key={i}
                                            style={[
                                                styles.listItem,
                                                { color: currentTheme.inactiveTintColor },
                                            ]}
                                        >
                                            • {cause}
                                        </Text>
                                    ))}
                                </View>

                                <View style={styles.section}>
                                    <Text
                                        style={[styles.sectionTitle, { color: currentTheme.color }]}
                                    >
                                        Sinais Clínicos:
                                    </Text>
                                    {condition.symptoms.map((symptom, i) => (
                                        <Text
                                            key={i}
                                            style={[
                                                styles.listItem,
                                                { color: currentTheme.inactiveTintColor },
                                            ]}
                                        >
                                            • {symptom}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        );
                    })}

                    {/* Informações adicionais */}
                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: currentTheme.quickAccessBackgroundColor,
                                borderColor: currentTheme.color,
                            },
                        ]}
                    >
                        <Text style={[styles.cardTitle, { color: currentTheme.color }]}>
                            Informações Importantes
                        </Text>

                        <View style={styles.section}>
                            {[
                                'A contagem de plaquetas pode variar com idade, raça e condições fisiológicas',
                                'Valores alterados devem sempre ser correlacionados com sinais clínicos',
                                'Recomenda-se repetir exames alterados para confirmação',
                                'Medicamentos anticoagulantes podem interferir nos resultados',
                            ].map((text, i) => (
                                <Text
                                    key={i}
                                    style={[
                                        styles.listItem,
                                        { color: currentTheme.inactiveTintColor },
                                    ]}
                                >
                                    • {text}
                                </Text>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    speciesContainer: {
        paddingHorizontal: 20,
        paddingVertical: 25,
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
    card: {
        padding: 20,
        borderRadius: 15,
        borderWidth: 2,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    normalRange: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    conditionRange: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    section: {
        marginBottom: 15,
    },
    listItem: {
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 20,
    },
});
