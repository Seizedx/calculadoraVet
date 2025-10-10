import { useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions
} from 'react-native';
import { ChartBar as BarChart3, Dog, Cat, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent } from '../../../Components/TopBarComponent';

const { width } = Dimensions.get('window');

// Referências e funções para índices hematológicos e plaquetas
const REFERENCE_VALUES = {
    dog: {
        normal: { min: 200000, max: 500000 },
        low: 200000,
        high: 500000,
        vcm: '60-77 fL',
        hcm: '19-24 pg',
        chcm: '32-36 g/dL',
    },
    cat: {
        normal: { min: 300000, max: 800000 },
        low: 300000,
        high: 800000,
        vcm: '39-55 fL',
        hcm: '13-17 pg',
        chcm: '30-36 g/dL',
    },
};

function analyzePlateletCount(count, species) {
    const ref = REFERENCE_VALUES[species];
    let status, interpretation, recommendations;

    if (count < ref.low) {
        status = 'low';
        interpretation = 'Trombocitopenia - Contagem de plaquetas abaixo do normal';
        recommendations = [
            'Investigar causas de trombocitopenia',
            'Avaliar histórico de medicamentos',
            'Considerar doenças autoimunes',
            'Monitorar sinais de sangramento',
            'Repetir exame em 3-7 dias',
        ];
    } else if (count > ref.high) {
        status = 'high';
        interpretation = 'Trombocitose - Contagem de plaquetas acima do normal';
        recommendations = [
            'Investigar causas de trombocitose',
            'Avaliar processos inflamatórios',
            'Considerar doenças neoplásicas',
            'Verificar desidratação',
            'Repetir exame para confirmação',
        ];
    } else {
        status = 'normal';
        interpretation = 'Contagem de plaquetas dentro dos valores normais';
        recommendations = [
            'Manter acompanhamento de rotina',
            'Continuar cuidados preventivos',
        ];
    }

    return { status, interpretation, recommendations };
}

export default function HematologicalIndicesReferences() {
    const { currentTheme } = useTheme();
    const [selectedSpecies, setSelectedSpecies] = useState<'dog' | 'cat'>('dog');

    const referenceInfo = {
        dog: {
            normal: REFERENCE_VALUES.dog.normal,
            vcm: REFERENCE_VALUES.dog.vcm,
            hcm: REFERENCE_VALUES.dog.hcm,
            chcm: REFERENCE_VALUES.dog.chcm,
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
            normal: REFERENCE_VALUES.cat.normal,
            vcm: REFERENCE_VALUES.cat.vcm,
            hcm: REFERENCE_VALUES.cat.hcm,
            chcm: REFERENCE_VALUES.cat.chcm,
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

                <View style={styles.content}>
                    <View style={[
                        styles.iconContainer,
                        { backgroundColor: currentTheme.gradientB, borderColor: currentTheme.color }
                    ]}>
                        <BarChart3 size={80} color={currentTheme.color} strokeWidth={2} />
                    </View>

                    <View style={styles.speciesContainer}>
                        <TouchableOpacity
                            style={[
                                styles.speciesButton,
                                {
                                    backgroundColor: selectedSpecies === 'dog' ? currentTheme.buttonColor : currentTheme.unselectedButtonColor,
                                    borderColor: currentTheme.color,
                                },
                            ]}
                            onPress={() => setSelectedSpecies('dog')}
                        >
                            <Dog size={30} color={selectedSpecies === 'dog' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor} />
                            <Text style={[
                                styles.speciesText,
                                { color: selectedSpecies === 'dog' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor }
                            ]}>
                                Cães
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.speciesButton,
                                {
                                    backgroundColor: selectedSpecies === 'cat' ? currentTheme.buttonColor : currentTheme.unselectedButtonColor,
                                    borderColor: currentTheme.color,
                                },
                            ]}
                            onPress={() => setSelectedSpecies('cat')}
                        >
                            <Cat size={30} color={selectedSpecies === 'cat' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor} />
                            <Text style={[
                                styles.speciesText,
                                { color: selectedSpecies === 'cat' ? currentTheme.activeTintColor : currentTheme.inactiveTintColor }
                            ]}>
                                Gatos
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[
                        styles.card,
                        { backgroundColor: currentTheme.quickAccessBackgroundColor, borderColor: currentTheme.successColor }
                    ]}>
                        <View style={styles.cardHeader}>
                            <CheckCircle size={24} color={currentTheme.successColor} />
                            <Text style={[styles.cardTitle, { color: currentTheme.color }]}>
                                Valores Normais de Plaquetas
                            </Text>
                        </View>
                        <Text style={[styles.normalRange, { color: currentTheme.successColor }]}>
                            {currentRef.normal.min.toLocaleString()} - {currentRef.normal.max.toLocaleString()}/µL
                        </Text>
                    </View>

                    <View style={[
                        styles.card,
                        { backgroundColor: currentTheme.quickAccessBackgroundColor, borderColor: currentTheme.color }
                    ]}>
                        <Text style={[styles.cardTitle, { color: currentTheme.color }]}>
                            Índices Hematológicos
                        </Text>
                        <Text style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}
                        >
                            VCM (Volume Corpuscular Médio): (Hematócrito / Hemácias) x 10
                        </Text>
                        <Text style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}
                        >
                            HCM (Hemoglobina Corpuscular Média): (Hemoglobina / Hemácias) x 10
                        </Text>
                        <Text style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}
                        >
                            CHCM (Concentração de Hemoglobina Corpuscular Média): (Hemoglobina / Hematócrito) x 100
                        </Text>
                        <Text style={[styles.listItem, { color: currentTheme.color }]}>
                            Valores de referência:
                        </Text>
                        <Text style={[styles.listItem, { color: currentTheme.color }]}>
                            Cães: VCM {currentRef.vcm} | HCM {currentRef.hcm} | CHCM {currentRef.chcm}
                        </Text>
                        <Text style={[styles.listItem, { color: currentTheme.color }]}>
                            Gatos: VCM {referenceInfo.cat.vcm} | HCM {referenceInfo.cat.hcm} | CHCM {referenceInfo.cat.chcm}
                        </Text>
                    </View>

                    {currentRef.conditions.map((condition, index) => (
                        <View key={index} style={[
                            styles.card,
                            {
                                backgroundColor: currentTheme.quickAccessBackgroundColor,
                                borderColor: condition.name.includes('citopenia') ? currentTheme.dangerColor : currentTheme.warningColor
                            }
                        ]}>
                            <View style={styles.cardHeader}>
                                {condition.name.includes('citopenia') ? (
                                    <XCircle size={24} color={currentTheme.dangerColor} />
                                ) : (
                                    <AlertTriangle size={24} color={currentTheme.warningColor} />
                                )}
                                <Text style={[styles.cardTitle, { color: currentTheme.color }]}>
                                    {condition.name}
                                </Text>
                            </View>

                            <Text style={[
                                styles.conditionRange,
                                {
                                    color: condition.name.includes('citopenia') ? currentTheme.dangerColor : currentTheme.warningColor
                                }
                            ]}>
                                {condition.range}
                            </Text>

                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                                    Principais Causas:
                                </Text>
                                {condition.causes.map((cause, causeIndex) => (
                                    <Text key={causeIndex} style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}>
                                        • {cause}
                                    </Text>
                                ))}
                            </View>

                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                                    Sinais Clínicos:
                                </Text>
                                {condition.symptoms.map((symptom, symptomIndex) => (
                                    <Text key={symptomIndex} style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}>
                                        • {symptom}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    ))}

                    <View style={[
                        styles.card,
                        { backgroundColor: currentTheme.quickAccessBackgroundColor, borderColor: currentTheme.color }
                    ]}>
                        <Text style={[styles.cardTitle, { color: currentTheme.color }]}>
                            Informações Importantes
                        </Text>

                        <View style={styles.section}>
                            <Text style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}>
                                • A contagem de plaquetas e índices hematológicos pode variar com idade, raça e condições fisiológicas
                            </Text>
                            <Text style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}>
                                • Valores alterados devem sempre ser correlacionados com sinais clínicos
                            </Text>
                            <Text style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}>
                                • Recomenda-se repetir exames alterados para confirmação
                            </Text>
                            <Text style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}>
                                • Medicamentos anticoagulantes podem interferir nos resultados
                            </Text>
                        </View>
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>
                                Referências:
                            </Text>
                            <Text style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}>
                                Kaneko JJ, Harvey JW, Bruss ML. Clinical Biochemistry of Domestic Animals. 6th Edition. Academic Press, 2008.
                            </Text>
                            <Text style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}>
                                Thrall MA, Weiser G, Allison RW, Campbell TW. Veterinary Hematology and Clinical Chemistry. 2nd Edition. Wiley Blackwell, 2012.
                            </Text>
                            <Text style={[styles.listItem, { color: currentTheme.inactiveTintColor }]}>
                                Stockham SL, Scott MA. Fundamentals of Veterinary Clinical Pathology. 2nd Edition. Wiley Blackwell, 2008.
                            </Text>
                        </View>
                    </View>
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
        marginBottom: 20,
    },
    speciesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 30,
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    listItem: {
        fontSize: 14,
        marginBottom: 4,
        lineHeight: 20,
    },
});