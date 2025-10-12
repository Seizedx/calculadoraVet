import { useState } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { Info, Dog, Cat } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function CompleteHemogramReferences() {
    const { currentTheme } = useTheme();
    const [selectedSpecies, setSelectedSpecies] = useState('dog');
    const [selectedIndex, setSelectedIndex] = useState('hemacias');

    const referenceValues = {
        dog: {
            hemacias: '5.5 – 8.5 x10⁶/µL',
            hemoglobina: '12 – 18 g/dL',
            hematocrito: '37 – 55%',
            leucocitos: '6,000 – 17,000/µL',
            plaquetas: '200,000 – 500,000/µL',
        },
        cat: {
            hemacias: '5.0 – 10.0 x10⁶/µL',
            hemoglobina: '8 – 15 g/dL',
            hematocrito: '24 – 45%',
            leucocitos: '5,500 – 19,500/µL',
            plaquetas: '300,000 – 700,000/µL',
        },
    };

    const indicesData = {
        hemacias: {
            name: 'Hemácias (Eritrócitos)',
            description:
                'As hemácias são responsáveis pelo transporte de oxigênio. Sua contagem avalia a oxigenação e o estado anêmico do paciente.',
            normal: 'Normal: oxigenação adequada e perfusão tecidual normal.',
            conditions: [
                {
                    type: 'Baixo (Anemia)',
                    color: '#f59e0b',
                    causes: [
                        'Perda sanguínea aguda ou crônica',
                        'Hemólise',
                        'Deficiência de ferro, B12 ou folato',
                        'Doença renal crônica',
                    ],
                    notes: 'Redução do transporte de oxigênio e palidez de mucosas.',
                },
                {
                    type: 'Alto (Policitemia)',
                    color: '#ef4444',
                    causes: [
                        'Desidratação',
                        'Policitemia vera (rara)',
                        'Hipóxia crônica (cardiopatias, altitude)',
                    ],
                    notes: 'Aumento da viscosidade sanguínea e risco trombótico.',
                },
            ],
        },
        hemoglobina: {
            name: 'Hemoglobina (Hb)',
            description:
                'Proteína que transporta oxigênio no sangue. Sua concentração reflete diretamente a capacidade de oxigenação.',
            normal: 'Normal: transporte eficiente de oxigênio.',
            conditions: [
                {
                    type: 'Baixo (Anemia)',
                    color: '#f59e0b',
                    causes: [
                        'Hemorragia',
                        'Deficiência de ferro ou vitamina B12',
                        'Doenças crônicas',
                    ],
                    notes: 'Mucosas pálidas, letargia e fraqueza.',
                },
                {
                    type: 'Alto',
                    color: '#ef4444',
                    causes: ['Desidratação', 'Policitemia', 'Hipóxia crônica'],
                    notes: 'Pode ocorrer aumento aparente pela contração do plasma.',
                },
            ],
        },
        hematocrito: {
            name: 'Hematócrito (Ht)',
            description:
                'Proporção de hemácias no volume total de sangue. Indica hidratação e concentração sanguínea.',
            normal: 'Normal: equilíbrio entre hemácias e plasma.',
            conditions: [
                {
                    type: 'Baixo',
                    color: '#f59e0b',
                    causes: [
                        'Anemia',
                        'Hemodiluição (sobrecarga hídrica)',
                        'Hemorragia',
                    ],
                    notes: 'Reflete perda de massa eritrocitária ou excesso de líquidos.',
                },
                {
                    type: 'Alto',
                    color: '#ef4444',
                    causes: [
                        'Desidratação',
                        'Policitemia',
                    ],
                    notes: 'Sangue mais viscoso, risco de hipoperfusão tecidual.',
                },
            ],
        },
        leucocitos: {
            name: 'Leucócitos (Glóbulos Brancos)',
            description:
                'Células de defesa responsáveis pela resposta imune. Alterações indicam infecções, inflamações ou imunossupressão.',
            normal: 'Normal: defesa adequada contra agentes infecciosos.',
            conditions: [
                {
                    type: 'Baixo (Leucopenia)',
                    color: '#f59e0b',
                    causes: [
                        'Infecções virais severas',
                        'Imunossupressão medicamentosa',
                        'Doença medular',
                    ],
                    notes: 'Maior risco de infecção devido à baixa defesa.',
                },
                {
                    type: 'Alto (Leucocitose)',
                    color: '#ef4444',
                    causes: [
                        'Infecção bacteriana',
                        'Inflamação aguda',
                        'Estresse fisiológico',
                        'Neoplasias hematológicas',
                    ],
                    notes: 'Sinal de resposta inflamatória ou infecção ativa.',
                },
            ],
        },
        plaquetas: {
            name: 'Plaquetas (Trombócitos)',
            description:
                'Responsáveis pela coagulação e controle de sangramentos. Alterações podem causar risco hemorrágico ou trombótico.',
            normal: 'Normal: hemostasia preservada.',
            conditions: [
                {
                    type: 'Baixo (Trombocitopenia)',
                    color: '#f59e0b',
                    causes: [
                        'Doenças autoimunes (Ehrlichiose, Lupus)',
                        'Destruição periférica',
                        'Doença medular',
                        'Consumo excessivo (CIVD)',
                    ],
                    notes: 'Risco aumentado de sangramento e petéquias.',
                },
                {
                    type: 'Alto (Trombocitose)',
                    color: '#ef4444',
                    causes: [
                        'Inflamação crônica',
                        'Recuperação pós-hemorragia',
                        'Doenças mieloproliferativas',
                    ],
                    notes: 'Risco aumentado de trombose e agregação plaquetária excessiva.',
                },
            ],
        },
    };

    const selectedData = indicesData[selectedIndex];
    const refValue = referenceValues[selectedSpecies][selectedIndex];

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TopBarComponent />

                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Referências e interpretações do hemograma completo.
                    </Text>
                </View>

                {/* Seletor de espécie */}
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
                                    backgroundColor: selectedSpecies === 'cat'
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

                {/* Seletor de índice */}
                <View style={styles.selector}>
                    {Object.keys(indicesData).map((key) => (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.selectorButton,
                                {
                                    backgroundColor:
                                        selectedIndex === key
                                            ? currentTheme.buttonColor
                                            : currentTheme.unselectedButtonColor,
                                },
                            ]}
                            onPress={() => setSelectedIndex(key)}
                        >
                            <Text
                                style={[
                                    styles.selectorText,
                                    { color: currentTheme.color },
                                ]}
                            >
                                {indicesData[key].name.split(' ')[0]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Card principal */}
                <View
                    style={[
                        styles.card,
                        { backgroundColor: currentTheme.resultBackgroundColor },
                    ]}
                >
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, { color: currentTheme.color }]}>
                            {selectedData.name}
                        </Text>
                        <Info size={20} color={currentTheme.color} strokeWidth={2} />
                    </View>

                    <Text style={[styles.description, { color: currentTheme.color }]}>
                        {selectedData.description}
                    </Text>

                    <Text style={[styles.rangeText, { color: currentTheme.color }]}>
                        Valor de referência ({selectedSpecies === 'dog' ? 'Canino' : 'Felino'}):
                    </Text>
                    <Text style={[styles.refValue, { color: currentTheme.color }]}>
                        {refValue}
                    </Text>

                    <Text style={[styles.normalText, { color: '#10b981' }]}>
                        {selectedData.normal}
                    </Text>

                    {selectedData.conditions.map((cond, idx) => (
                        <View
                            key={idx}
                            style={[styles.conditionCard, { borderColor: cond.color }]}
                        >
                            <Text style={[styles.conditionTitle, { color: cond.color }]}>
                                {cond.type}
                            </Text>
                            <Text style={[styles.conditionLabel, { color: currentTheme.color }]}>
                                Causas comuns:
                            </Text>
                            {cond.causes.map((cause, i) => (
                                <Text
                                    key={i}
                                    style={[styles.causeItem, { color: currentTheme.color }]}
                                >
                                    • {cause}
                                </Text>
                            ))}
                            <Text style={[styles.conditionNotes, { color: currentTheme.color }]}>
                                {cond.notes}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text
                    style={[styles.footerNote, { color: currentTheme.color }]}
                >
                    * Valores podem variar conforme espécie, método e laboratório.
                </Text>
            </ScrollView>
        </View>
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
    speciesContainer: {
        paddingHorizontal: 20,
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
        marginTop: 5,
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 10,
        marginVertical: 10,
    },
    selectorButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginVertical: 4,
    },
    selectorText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    card: {
        marginHorizontal: 15,
        marginTop: 10,
        padding: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 15,
        marginBottom: 10,
    },
    rangeText: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    refValue: {
        fontSize: 14,
        marginBottom: 4,
        textAlign: 'left',
        marginLeft: 10,
    },
    normalText: {
        fontSize: 15,
        fontWeight: '600',
        marginTop: 8,
        marginBottom: 10,
        textAlign: 'center',
    },
    conditionCard: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1.2,
        borderRadius: 10,
    },
    conditionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    conditionLabel: {
        fontSize: 14,
        fontWeight: '600',
    },
    causeItem: {
        fontSize: 14,
        marginLeft: 10,
    },
    conditionNotes: {
        fontSize: 13,
        fontStyle: 'italic',
        marginTop: 5,
    },
    footerNote: {
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 25,
        marginHorizontal: 15,
    },
});
