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

export default function LeukogramReferences() {
    const { currentTheme } = useTheme();
    const [selectedSpecies, setSelectedSpecies] = useState('dog');
    const [selectedCell, setSelectedCell] = useState('neutrophils');

    // Valores de referência baseados em cães e gatos
    const referenceValues = {
        dog: {
            neutrophils: '40 - 75% (2.000 - 7.500/μL)',
            lymphocytes: '20 - 50% (1.000 - 4.000/μL)',
            monocytes: '2 - 10% (100 - 1.000/μL)',
            eosinophils: '1 - 6% (50 - 500/μL)',
            basophils: '0 - 2% (0 - 200/μL)',
        },
        cat: {
            neutrophils: '35 - 75% (2.500 - 12.500/μL)',
            lymphocytes: '20 - 55% (1.500 - 7.000/μL)',
            monocytes: '1 - 4% (0 - 300/μL)',
            eosinophils: '2 - 10% (100 - 1.500/μL)',
            basophils: '0 - 1% (0 - 100/μL)',
        },
    };

    const cellsData = {
        neutrophils: {
            name: 'Neutrófilos',
            description:
                'Primeira linha de defesa contra infecções bacterianas. Importante na resposta inflamatória.',
            normal: 'Normal: Valores dentro da faixa de referência.',
            conditions: [
                { type: 'Baixo', color: '#f59e0b', causes: ['Infecções virais', 'Doenças crônicas'], notes: 'Neutropenia' },
                { type: 'Alto', color: '#ef4444', causes: ['Infecções bacterianas', 'Inflamação aguda'], notes: 'Neutrofilia' },
            ],
        },
        lymphocytes: {
            name: 'Linfócitos',
            description:
                'Responsáveis pela imunidade específica, produzindo anticorpos e combatendo patógenos.',
            normal: 'Normal: Valores dentro da faixa de referência.',
            conditions: [
                { type: 'Baixo', color: '#f59e0b', causes: ['Imunossupressão', 'Infecções graves'], notes: 'Linfopenia' },
                { type: 'Alto', color: '#ef4444', causes: ['Infecções virais', 'Estresse'], notes: 'Linfocitose' },
            ],
        },
        monocytes: {
            name: 'Monócitos',
            description:
                'Fagócitos que se transformam em macrófagos, participando da resposta imune e remoção de detritos.',
            normal: 'Normal: Valores dentro da faixa de referência.',
            conditions: [
                { type: 'Baixo', color: '#f59e0b', causes: ['Infecções agudas', 'Medicações'], notes: 'Monocitopenia' },
                { type: 'Alto', color: '#ef4444', causes: ['Infecções crônicas', 'Inflamações'], notes: 'Monocitose' },
            ],
        },
        eosinophils: {
            name: 'Eosinófilos',
            description:
                'Participam de respostas alérgicas e parasitárias, regulando a inflamação.',
            normal: 'Normal: Valores dentro da faixa de referência.',
            conditions: [
                { type: 'Baixo', color: '#f59e0b', causes: ['Infecções bacterianas'], notes: 'Eosinopenia' },
                { type: 'Alto', color: '#ef4444', causes: ['Alergias', 'Parasitoses'], notes: 'Eosinofilia' },
            ],
        },
        basophils: {
            name: 'Basófilos',
            description:
                'Relacionados a reações alérgicas e inflamatórias, liberando histamina.',
            normal: 'Normal: Valores dentro da faixa de referência.',
            conditions: [
                { type: 'Baixo', color: '#f59e0b', causes: ['Pouco relevante clinicamente'], notes: 'Basopenia' },
                { type: 'Alto', color: '#ef4444', causes: ['Reações alérgicas'], notes: 'Basofilia' },
            ],
        },
    };

    const selectedData = cellsData[selectedCell];
    const refValue = referenceValues[selectedSpecies][selectedCell];

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TopBarComponent />

                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeSubtitle, { color: currentTheme.color }]}>
                        Referências e interpretações de leucócitos (leucograma).
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
                                size={36}
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
                                size={36}
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

                {/* Seletor de célula */}
                <View style={styles.selector}>
                    {Object.keys(cellsData).map((key) => (
                        <TouchableOpacity
                            key={key}
                            style={[
                                styles.selectorButton,
                                {
                                    backgroundColor:
                                        selectedCell === key
                                            ? currentTheme.buttonColor
                                            : currentTheme.unselectedButtonColor,
                                },
                            ]}
                            onPress={() => setSelectedCell(key)}
                        >
                            <Text
                                style={[
                                    styles.selectorText,
                                    { color: currentTheme.color },
                                ]}
                            >
                                {cellsData[key].name}
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
                        <Text
                            style={[styles.cardTitle, { color: currentTheme.color }]}
                        >
                            {selectedData.name}
                        </Text>
                        <Info size={20} color={currentTheme.color} strokeWidth={2} />
                    </View>

                    <Text
                        style={[styles.description, { color: currentTheme.color }]}
                    >
                        {selectedData.description}
                    </Text>

                    <Text style={[styles.rangeText, { color: currentTheme.color }]}>
                        Valor de referência ({selectedSpecies === 'dog' ? 'Canino' : 'Felino'}):
                    </Text>
                    <Text
                        style={[styles.refValue, { color: currentTheme.color }]}
                    >
                        {refValue}
                    </Text>

                    <Text style={[styles.normalText, { color: '#10b981' }]}>
                        {selectedData.normal}
                    </Text>

                    {selectedData.conditions.map((cond, idx) => (
                        <View
                            key={idx}
                            style={[
                                styles.conditionCard,
                                { borderColor: cond.color },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.conditionTitle,
                                    { color: cond.color },
                                ]}
                            >
                                {cond.type}
                            </Text>
                            <Text
                                style={[
                                    styles.conditionLabel,
                                    { color: currentTheme.color },
                                ]}
                            >
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
                            <Text
                                style={[styles.conditionNotes, { color: currentTheme.color }]}
                            >
                                {cond.notes}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text
                    style={[
                        styles.footerNote,
                        { color: currentTheme.color },
                    ]}
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
        paddingHorizontal: 15,
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
        marginBottom: 15,
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
        gap: 10,
        marginVertical: 10,
        flexWrap: 'wrap',
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
