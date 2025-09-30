import { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity
} from 'react-native';
import {
    AlertCircle,
    Dog,
    Cat
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../Components/ThemeComponent';
import { TopBarComponent } from '../../../Components/TopBarComponent';
import { CustomAlertCopy } from '../../../Components/CustomAlertCopy';

export default function CalculatorsHistory() {
    const [history, setHistory] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const scrollViewRef = useRef(null);
    const { currentTheme } = useTheme();

    useEffect(() => {
        const loadHistory = async () => {
            try {
                const storedHistory = await AsyncStorage.getItem('calculationHistory');
                if (storedHistory) {
                    const parsedHistory = JSON.parse(storedHistory);
                    const limitedHistory = parsedHistory.slice(-30);
                    setHistory(limitedHistory);

                    if (parsedHistory.length > 30) {
                        await AsyncStorage.setItem('calculationHistory', JSON.stringify(limitedHistory));
                    }
                }
            } catch (error) {
                Alert.alert('Erro ao carregar histórico:', error.message);
            }
        };
        loadHistory();
    }, []);

    const VolumeOfBloodDonatedCalculator = (item) => {
        let msg = '';

        if (item.isCustom) {
            msg += `Total necessário:\n`;
            msg += `- Volume de Sangue (${item.animalType}): ${item.bloodVolume} mL\n`;
            msg += `- Volume de CPDA: ${item.cpdaVolume} mL\n`;
            msg += `- Volume Total: ${item.totalVolume} mL\n\n`;

            msg += `1 ${item.containerType.toLowerCase()} completa de ${item.syringeSize} mL possui:\n`;
            msg += `- Volume de Sangue: ${item.bloodPerFullSyringe} mL\n`;
            msg += `- Volume de CPDA: ${item.cpdaPerFullSyringe} mL\n`;
            msg += `- Volume Total: ${item.totalPerFullSyringe} mL\n\n`;

            msg += `${item.containerType}(s) necessárias:\n`;
            if (item.fullSyringesNeeded >= 1) {
                msg += `${item.fullSyringesNeeded} ${item.containerType.toLowerCase()}(s) completa(s) de ${item.syringeSize} mL\n\n`;
            }

            if (item.partialSyringeInfo) {
                msg += `1 ${item.containerType.toLowerCase()} com:\n`;
                msg += `- Volume de Sangue: ${item.partialSyringeInfo.bloodVolume} mL\n`;
                msg += `- Volume de CPDA: ${item.partialSyringeInfo.cpdaVolume} mL\n`;
                msg += `- Volume Total: ${item.partialSyringeInfo.totalVolume} mL\n\n\n`;
            }
            msg += item.animalType === 'Gato'
                ? `Observação: Utilizado o valor personalizado de ${item.customVolume}.\n\nGatos podem doar de 11 a 13 mL por kg.\n\n`
                : `Observação: Observação: Utilizado o valor personalizado de ${item.customVolume}.\n\nCães podem doar de 16 a 18 mL por kg.\n\n`;

            return msg;
        } else {
            msg += `Total necessário (Mínimo a Máximo):\n`;
            msg += `- Volume de Sangue (${item.animalType}): ${item.bloodVolumeMin} mL a ${item.bloodVolumeMax} mL\n`;
            msg += `- Volume de CPDA: ${item.cpdaVolumeMin} mL a ${item.cpdaVolumeMax} mL\n`;
            msg += `- Volume Total: ${item.totalVolumeMin} mL a ${item.totalVolumeMax} mL\n\n`;

            msg += `1 ${item.containerType.toLowerCase()} completa de ${item.syringeSize} mL possui:\n`;
            msg += `- Volume de Sangue: ${item.bloodPerFullSyringeMin} mL\n`;
            msg += `- Volume de CPDA: ${item.cpdaPerFullSyringeMin} mL\n`;
            msg += `- Volume Total: ${item.totalPerFullSyringeMin} mL\n\n`;

            msg += `${item.containerType}(s) necessárias:\n`;
            msg += `Mínimo:\n`;
            if (item.fullSyringesNeededMin >= 1) {
                msg += `${item.fullSyringesNeededMin} ${item.containerType.toLowerCase()}(s) completa(s) de ${item.syringeSize} mL\n`;
            }
            if (item.partialSyringeInfoMin) {
                msg += `1 ${item.containerType.toLowerCase()}(s) com:\n`;
                msg += `- Sangue: ${item.partialSyringeInfoMin.bloodVolume} mL\n`;
                msg += `- CPDA: ${item.partialSyringeInfoMin.cpdaVolume} mL\n`;
                msg += `- Total: ${item.partialSyringeInfoMin.totalVolume} mL\n\n`;
            }
            msg += `Máximo:\n`;
            if (item.fullSyringesNeededMax >= 1) {
                msg += `${item.fullSyringesNeededMax} ${item.containerType.toLowerCase()}(s) completa(s) de ${item.syringeSize} mL\n`;
            }
            if (item.partialSyringeInfoMax) {
                msg += `1 ${item.containerType.toLowerCase()}(s) com:\n`;
                msg += `- Sangue: ${item.partialSyringeInfoMax.bloodVolume} mL\n`;
                msg += `- CPDA: ${item.partialSyringeInfoMax.cpdaVolume} mL\n`;
                msg += `- Total: ${item.partialSyringeInfoMax.totalVolume} mL\n\n`;
            }
            msg += item.animalType === 'Gato'
                ? `Observação: Gatos podem doar de 11 a 13 mL por kg.\n\n`
                : `Observação: Cães podem doar de 16 a 18 mL por kg.\n\n`;

            msg += `Registrado em: ${item.date}`;
            return msg;
        };
    }

    const CPDAVolumeCalculator = (item) => {
        let msg = `Total necessário:\n`;
        msg += `- Volume de Sangue Total: ${item.bloodVolume} mL\n`;
        msg += `- Volume de CPDA Total: ${item.cpdaVolume} mL\n`;
        msg += `- Volume Total: ${item.totalVolume} mL\n\n`;

        msg += `1 ${item.containerType.toLowerCase()} completa de ${item.syringeSize} mL possui:\n`;
        msg += `- Volume de Sangue: ${item.bloodPerFullSyringe} mL\n`;
        msg += `- Volume de CPDA: ${item.cpdaPerFullSyringe} mL\n`;
        msg += `- Volume Total: ${item.totalPerFullSyringe} mL\n\n`;

        msg += `${item.containerType}(s) necessárias:\n`;
        if (item.fullSyringesNeeded !== 0) {
            msg += `${item.fullSyringesNeeded} ${item.containerType.toLowerCase()}(s) completa(s) de ${item.syringeSize} mL\n`;
        }

        if (item.partialSyringeInfo) {
            msg += `1 ${item.containerType.toLowerCase()} de ${item.syringeSize} mL com:\n`;
            msg += `- Volume de Sangue: ${item.partialSyringeInfo.bloodVolume} mL\n`;
            msg += `- Volume de CPDA: ${item.partialSyringeInfo.cpdaVolume} mL\n`;
            msg += `- Volume Total: ${item.partialSyringeInfo.totalVolume} mL\n\n`;
        }

        msg += `Proporção: 1mL sangue : 0.14mL CPDA\n\n`;
        msg += `Registrado em: ${item.date}`;

        return msg;
    };

    const TranfusionVolumeCalculator = (item) => {
        let msg = `Hematócrito Desejado: ${item.desiredHematocrit}%\n`;
        msg += `Hematócrito Atual: ${item.currentHematocrit}%\n`;
        msg += `Hematócrito do Doador: ${item.donorHematocrit}%\n\n`;
        msg += `Volume Total de Transfusão: ${item.infusionVolume}mL\n`;
        msg += `Sangue: ${item.bloodVolume}mL\n`;
        msg += `CPDA: ${item.totalCPDA}mL\n\n`;
        msg += `Verificar se Valores de CPDA Foram Incluídos\n\n`;
        msg += `Registrado em: ${item.date}`;

        return msg;
    };

    const DropRateCalculator = (item) => {
        let msg = `Volume Total: ${item.totalVolume}mL\n\n`;
        msg += `30min Iniciais:\n`;
        msg += `Volume: ${item.volume30Min}mL\n\n`;
        msg += `Quantidade em Gotas:\n`;
        msg += `${item.dropsPerMinute30Min} gotas/min, 1 gota a cada ${item.dropsPerSecond30Min}s\n\n`;
        msg += `Volume Restante:\n`;
        msg += `${item.infusionRatePerHour}mL/h em ${item.calculatedTimeRemaining}h\n\n`;
        msg += `Quantidade em Gotas:`;
        msg += `${item.dropsPerMinuteRemaining} gotas/min, 1 gota a cada ${item.dropsPerSecondRemaining}s\n\n`;
        msg += `Verificar se Valores de CPDA Foram Incluídos\n\n`;
        msg += `Registrado em: ${item.date}`;

        return msg;
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
                        Histórico de cálculos de doação de sangue realizados. Clique em cima para mais informações.
                    </Text>
                </View>

                {history.length === 0 ? (
                    <Text style={[styles.emptyText, { color: currentTheme.color }]}>Nenhum cálculo registrado.</Text>
                ) : (
                    [...history].reverse().map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.3}
                                style={[
                                    styles.historyCard,
                                    { backgroundColor: currentTheme.quickAccessBackgroundColor, borderColor: currentTheme.color }
                                ]}
                                onPress={() => setSelectedItem(item)}
                            >
                                <View style={styles.patientArea}>
                                    {item.patientName === 'Paciente Não Cadastrado' ? (
                                        <View style={styles.patientNameAndIconArea}>
                                            <Text style={[styles.cardTitle, { color: currentTheme.color }]}>
                                                {item.patientName}
                                            </Text>
                                            {item.patientSpecies === 'Cachorro' && (
                                                <Text style={styles.cardTitle}>
                                                    <Dog size={28} color={currentTheme.color} strokeWidth={2} />
                                                </Text>
                                            )}
                                            {item.patientSpecies === 'Gato' && (
                                                <Text style={styles.cardTitle}>
                                                    <Cat size={28} color={currentTheme.color} strokeWidth={2} />
                                                </Text>
                                            )}
                                            {!item.patientSpecies && (
                                                <Text style={styles.cardTitle}>
                                                    <AlertCircle size={28} color={currentTheme.color} strokeWidth={2} />
                                                </Text>
                                            )}
                                        </View>
                                    ) : (
                                        <View style={styles.patientNameAndIconArea}>
                                            <Text style={[styles.cardTitle, { color: currentTheme.color }]}>
                                                {item?.patientName}
                                            </Text>
                                            {item?.patientSpecies === 'Cachorro' && (
                                                <Text style={styles.cardTitle}>
                                                    <Dog size={28} color={currentTheme.color} strokeWidth={2} />
                                                </Text>
                                            )}
                                            {item?.patientSpecies === 'Gato' && (
                                                <Text style={styles.cardTitle}>
                                                    <Cat size={28} color={currentTheme.color} strokeWidth={2} />
                                                </Text>
                                            )}
                                            {!item?.patientSpecies && (
                                                <Text style={styles.cardTitle}>
                                                    <AlertCircle size={28} color={currentTheme.color} strokeWidth={2} />
                                                </Text>
                                            )}
                                        </View>
                                    )}
                                    {item?.patientAge !== '' && (
                                        <Text style={[styles.cardPatientText, { color: currentTheme.color }]}>
                                            Idade: {item.patientAge} anos
                                        </Text>
                                    )}
                                    {item?.patientWeight !== '' && (
                                        <Text style={[styles.cardPatientText, { color: currentTheme.color }]}>
                                            Peso: {item.patientWeight} kg(s)
                                        </Text>
                                    )}
                                </View>

                                {/*VOLUME CPDA X SANGUE*/}
                                {
                                    item.calculationType === 'Volume CPDA x Sangue' && (
                                        <View>
                                            <Text style={[styles.cardSubtitle, { color: currentTheme.color }]}>
                                                {item.calculationType}
                                            </Text>
                                            <Text style={[styles.sectionTitle, { color: currentTheme.color, marginTop: 10, }]}>Total necessário:</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                Volume de Sangue Total: {item.bloodVolume} mL
                                            </Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                Volume de CPDA Total: {item.cpdaVolume} mL
                                            </Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                Volume Total: {item.totalVolume} mL
                                            </Text>

                                            <Text style={[styles.cardNote, { color: currentTheme.color }]}>
                                                Registrado em: {item.date}
                                            </Text>
                                            <Text style={[styles.cardNote, { color: currentTheme.color }]}>
                                                Proporção: 1mL sangue : 0.14mL CPDA
                                            </Text>
                                        </View>
                                    )
                                }
                                {/* VOLUME DE SANGUE DOADO + CPDA */}
                                {
                                    item.calculationType === 'Volume de Sangue Doado + CPDA' && (
                                        <View>
                                            <Text style={[styles.cardSubtitle, { color: currentTheme.color }]}>
                                                {item.calculationType}
                                            </Text>

                                            {item.isCustom ? (
                                                <>
                                                    <Text style={[styles.sectionTitle, { color: currentTheme.color, marginTop: 10 }]}>Total necessário:</Text>
                                                    <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                        Volume de Sangue ({item.animalType}): {item.bloodVolume} mL
                                                    </Text>
                                                    <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                        Volume de CPDA: {item.cpdaVolume} mL
                                                    </Text>
                                                    <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                        Volume Total: {item.totalVolume} mL
                                                    </Text>
                                                </>
                                            ) : (
                                                <>
                                                    <Text style={[styles.sectionTitle, { color: currentTheme.color, marginTop: 10 }]}>Total necessário (Mínimo a Máximo):</Text>
                                                    <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                        Volume de Sangue ({item.animalType}): {item.bloodVolumeMin} mL a {item.bloodVolumeMax} mL
                                                    </Text>
                                                    <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                        Volume de CPDA: {item.cpdaVolumeMin} mL a {item.cpdaVolumeMax} mL
                                                    </Text>
                                                    <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                        Volume Total: {item.totalVolumeMin} mL a {item.totalVolumeMax} mL
                                                    </Text>
                                                </>
                                            )}

                                            <Text style={[styles.cardNote, { color: currentTheme.color }]}>
                                                Registrado em: {item.date}
                                            </Text>
                                            <Text style={[styles.cardNote, { color: currentTheme.color }]}>
                                                {item.animalType === 'Gato'
                                                    ? 'Um gato pode doar de 11 a 13 mL por kg'
                                                    : 'Um cachorro pode doar de 16 a 18 mL por kg'}
                                            </Text>
                                        </View>
                                    )
                                }
                                {/* VOLUME DE TRANSFUSÃO */}
                                {
                                    item.calculationType === 'Volume de Tranfusão' && (
                                        <View>
                                            <Text style={[styles.cardSubtitle, { color: currentTheme.color }]}>
                                                {item.calculationType}
                                            </Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                Volume de Sangue ({item.animalType}): {item.bloodVolume} mL
                                            </Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                Volume de CPDA ({item.animalType}): {item.totalCPDA} mL
                                            </Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                Volume Total da Transfusão ({item.animalType}): {item.infusionVolume} mL
                                            </Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Peso: {item.animalWeight} kg</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Hematócrito Desejado: {item.desiredHematocrit} %</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Hematócrito Atual: {item.currentHematocrit} %</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>
                                                Hematócrito do Doador: {item.donorHematocrit} %</Text>
                                            <Text style={styles.cardNote}>
                                                Lembrar de sempre checar se valores incluem CPDA.
                                            </Text>
                                        </View>
                                    )
                                }
                                {/* TAXA DE INFUSÃO */}
                                {
                                    item.calculationType === 'Taxa de Infusão' && (
                                        <View>
                                            <Text style={[styles.sectionTitle, { color: currentTheme.color }]}>Primeiros 30 minutos:</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Volume: {item.volume30Min} mL</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Gotas por minuto: {item.dropsPerMinute30Min} gotas/min</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>1 gota a cada {item.dropsPerSecond30Min} segundo(s)</Text>
                                            <Text style={[styles.sectionTitle, { color: currentTheme.color, marginTop: 20 }]}>Volume de Infusão:</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Volume Total: {item.totalVolume} mL</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Volume Restante: {item.volumeRemaining} mL</Text>
                                            <Text style={[styles.sectionTitle, { color: currentTheme.color, marginTop: 20 }]}>Período Restante:</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Tempo Definido/Calculado: {item.calculatedTimeRemaining} h</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Taxa de Infusão por Hora: {item.infusionRatePerHour} mL/h</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Taxa de Infusão por Kg/h: {item.infusionRateRemaining} mL/kg/h</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>Gotas por minuto: {item.dropsPerMinuteRemaining} gotas/min</Text>
                                            <Text style={[styles.cardText, { color: currentTheme.color }]}>1 gota a cada {item.dropsPerSecondRemaining} segundo(s)</Text>
                                            <Text style={styles.cardNote}>Verificar se Valores de CPDA Foram Incluídos</Text>
                                        </View>
                                    )
                                }
                            </TouchableOpacity>
                        );
                    })
                )}
                <View style={{ marginBottom: 50 }}></View>
            </ScrollView>

            {
                selectedItem && (
                    <CustomAlertCopy
                        visible={!!selectedItem}
                        title={selectedItem.patientName}
                        subTitle={selectedItem.calculationType}
                        patientAge={selectedItem.patientAge}
                        patientWeight={selectedItem.patientWeight}
                        message={
                            selectedItem.calculationType === 'Volume CPDA x Sangue'
                                ? CPDAVolumeCalculator(selectedItem)
                                : selectedItem.calculationType === 'Volume de Sangue Doado + CPDA'
                                    ? VolumeOfBloodDonatedCalculator(selectedItem)
                                    : selectedItem.calculationType === 'Volume de Tranfusão'
                                        ? TranfusionVolumeCalculator(selectedItem)
                                        : DropRateCalculator(selectedItem)
                        }
                        onClose={() => setSelectedItem(null)}
                    />
                )
            }

        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
    historyCard: {
        padding: 10,
        marginHorizontal: 20,
        borderRadius: 15,
        marginVertical: 8,
        borderWidth: 1,
        borderWidth: 1,
    },
    patientArea: {
        alignItems: 'flex-start',
    },
    cardPatientText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    patientNameAndIconArea: {
        fontSize: 18,
        fontWeight: 'bold',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardText: {
        fontSize: 14,
        lineHeight: 20,
    },
    cardNote: {
        marginTop: 8,
        fontSize: 12,
        fontStyle: 'italic',
        textAlign: 'right',
    },
});
