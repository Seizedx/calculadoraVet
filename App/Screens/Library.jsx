import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Linking,
    TouchableOpacity,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../Components/ThemeComponent';
import { List } from 'react-native-paper';
import { TopBarComponent } from '../../Components/TopBarComponent';

const Library = () => {
    const { currentTheme } = useTheme();
    const navigation = useNavigation();

    const openLink = (url) => {
        Linking.openURL(url);
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsHorizontalScrollIndicator={false}>
                <TopBarComponent />
                <View style={[styles.mainView, { backgroundColor: currentTheme.backgroundColor }]}>
                    <Text style={[styles.subtitle, { color: currentTheme.color }]}>
                        Guia para consulta rápida de hemogramas, morfologia, cálculos, transfusões e muito mais.
                    </Text>
                    <List.Accordion
                        title="📊 Valores de Referência"
                        titleStyle={[styles.accordionTitle, { color: currentTheme.color }]}
                        style={[styles.accordion, { backgroundColor: currentTheme.accordionBackgroundColor, borderColor: currentTheme.color }]}
                        titleNumberOfLines={2}
                    >
                        <View style={[styles.accordionContent, { backgroundColor: currentTheme.backgroundColor }]}>
                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🐕 CÃES:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • PCV: 35-57%{'\n'}
                                • Hemoglobina: 11.9-18.9 g/dL{'\n'}
                                • Eritrócitos: 4.95-7.87×10⁶/µL{'\n'}
                                • Leucócitos: 5.0-14.1×10³/µL{'\n'}
                                • Plaquetas: 175-500×10³/µL{'\n'}
                                • Reticulócitos: 0-1.5%{'\n'}
                                • Proteínas totais: 5.4-7.5 g/dL{'\n'}
                                • VCM: 60-77 fL{'\n'}
                                • CHCM: 30-36 g/dL
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🐱 GATOS:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • PCV: 30-45%{'\n'}
                                • Hemoglobina: 9.8-15.4 g/dL{'\n'}
                                • Eritrócitos: 5.0-10.0×10⁶/µL{'\n'}
                                • Leucócitos: 5.5-19.5×10³/µL{'\n'}
                                • Plaquetas: 230-680×10³/µL{'\n'}
                                • Reticulócitos: 0.4-2.0%{'\n'}
                                • Proteínas totais: 5.4-7.8 g/dL{'\n'}
                                • VCM: 39-55 fL{'\n'}
                                • CHCM: 30-36 g/dL
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>⚪ Leucograma Diferencial:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Neutrófilos: 60-77% (cães), 35-75% (gatos){'\n'}
                                • Linfócitos: 12-30% (cães), 20-55% (gatos){'\n'}
                                • Monócitos: 3-10% (ambos){'\n'}
                                • Eosinófilos: 2-10% (cães), 2-12% (gatos){'\n'}
                                • Basófilos: 0-1% (raros)
                            </Text>

                            <TouchableOpacity onPress={() => openLink("https://www.merckvetmanual.com/multimedia/table/hematology-complete-blood-count-reference-ranges")}>
                                <Text style={styles.link}>🔗 Merck Vet Manual - Valores Referência</Text>
                            </TouchableOpacity>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        title="🧾 Interpretação do Hemograma"
                        titleStyle={[styles.accordionTitle, { color: currentTheme.color }]}
                        style={[styles.accordion, { backgroundColor: currentTheme.accordionBackgroundColor, borderColor: currentTheme.color }]}
                        titleNumberOfLines={2}
                    >
                        <View style={[styles.accordionContent, { backgroundColor: currentTheme.backgroundColor }]}>
                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🔴 ERITROGRAMA:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Anemia regenerativa: ↑ reticulócitos (&gt;60k/µL), policromatofilia{'\n'}
                                • Anemia não-regenerativa: ↓ reticulócitos (&lt;60k/µL){'\n'}
                                • Microcítica hipocrômica: deficiência ferro, doença crônica{'\n'}
                                • Macrocítica: deficiência B12/folato, FeLV, regeneração{'\n'}
                                • Normocrômica normocítica: doença crônica, renal, endócrina
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>⚪ LEUCOGRAMA:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Neutrofilia + desvio esquerda (&gt;3% bandas): infecção bacteriana{'\n'}
                                • Neutrofilia sem desvio: stress, corticoides, exercício{'\n'}
                                • Linfocitose: viral, stress felino, leucemia linfocítica{'\n'}
                                • Linfopenia: stress canino, corticoides, viral{'\n'}
                                • Monocitose: inflamação crônica, necrose, stress{'\n'}
                                • Eosinofilia: parasitas, alergia, mastocitoma, stress{'\n'}
                                • Neutropenia: viral, sepse grave, quimioterapia
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🟡 PLAQUETAS:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Trombocitopenia: &lt;150k (cão), &lt;230k (gato){'\n'}
                                • Causas: IMTP, DIC, sequestro esplênico, medicamentos{'\n'}
                                • Trombocitose: &gt;500k, inflamação, neoplasia, ferro{'\n'}
                                • Agregação: artefato EDTA, ativação plaquetária
                            </Text>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        title="🔬 Morfologia e Achados Microscópicos"
                        titleStyle={[styles.accordionTitle, { color: currentTheme.color }]}
                        style={[styles.accordion, { backgroundColor: currentTheme.accordionBackgroundColor, borderColor: currentTheme.color }]}
                        titleNumberOfLines={2}
                    >
                        <View style={[styles.accordionContent, { backgroundColor: currentTheme.backgroundColor }]}>
                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🔴 Alterações Eritrocitárias:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Esferócitos: anemia hemolítica imunomediada{'\n'}
                                • Equinócitos (burr cells): uremia, artefato, eletrólitos{'\n'}
                                • Acantócitos (spur cells): doença hepática severa{'\n'}
                                • Esquizócitos (fragmentos): DIC, dirofilariose, glomerulonefrite{'\n'}
                                • Dacriócitos (tear drops): mielofibrose, anemia severa{'\n'}
                                • Codócitos (target cells): hepatopatia, deficiência ferro{'\n'}
                                • Estomatócitos: defeito membrana, artefato
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🟦 Inclusões Eritrocitárias:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Corpúsculos de Heinz: dano oxidativo (cebola, alho, acetaminofeno){'\n'}
                                • Corpúsculos de Howell-Jolly: regeneração, asplenia{'\n'}
                                • Pontilhado basófilo: saturnismo, regeneração intensa{'\n'}
                                • Babesia spp: piroplasmas intracelulares{'\n'}
                                • Mycoplasma spp: epicelulares, cadeias{'\n'}
                                • Corpos de Pappenheimer: ferro, siderose
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>⚪ Alterações Leucocitárias:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Neutrófilos tóxicos: sepse, endotoxemia{'\n'}
                                • Hipersegmentação: corticoides, deficiência B12{'\n'}
                                • Vacuolização citoplasmática: sepse, drogas{'\n'}
                                • Corpúsculos de Döhle: infecção, stress{'\n'}
                                • Inclusões de Ehrlichia: mórulas em monócitos{'\n'}
                                • Anaplasma: em neutrófilos e plaquetas{'\n'}
                                • Células blásticas: leucemia, linfoma
                            </Text>

                            <TouchableOpacity onPress={() => openLink("https://eclinpath.com/hematology/")}>
                                <Text style={styles.link}>🔗 eClinPath - Atlas Morfologia</Text>
                            </TouchableOpacity>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        title="🧮 Cálculos e Fórmulas Hematológicas"
                        titleStyle={[styles.accordionTitle, { color: currentTheme.color }]}
                        style={[styles.accordion, { backgroundColor: currentTheme.accordionBackgroundColor, borderColor: currentTheme.color }]}
                        titleNumberOfLines={2}
                    >
                        <View style={[styles.accordionContent, { backgroundColor: currentTheme.backgroundColor }]}>
                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>📏 Índices Hematimétricos:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • VCM = (Hematócrito × 10) ÷ Eritrócitos{'\n'}
                                • HCM = (Hemoglobina × 10) ÷ Eritrócitos{'\n'}
                                • CHCM = (Hemoglobina × 100) ÷ Hematócrito{'\n'}
                                • RDW = Coeficiente variação eritrócitos
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🔄 Cálculos Reticulócitos:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Absolutos = Eritrócitos × (% Reticulócitos ÷ 100){'\n'}
                                • Corrigidos = % Retic × (Hct paciente ÷ Hct normal){'\n'}
                                • Índice produção = Retic corr. ÷ Fator maturação{'\n'}
                                • Fator maturação: Hct 45% = 1.0; 35% = 1.5; 25% = 2.0; 15% = 2.5
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>💉 Cálculos Transfusionais:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Volume = (Hct desejado - atual) × Peso × 90 ÷ Hct doador{'\n'}
                                • Dose padrão: 10-22 mL/kg (cão), 8-15 mL/kg (gato){'\n'}
                                • Elevação Hct: ~1% por mL/kg transfundido{'\n'}
                                • Volume sanguíneo total: 80-90 mL/kg (cão), 60-70 mL/kg (gato)
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🩸 Volume Coleta Máximo:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Coleta única: 10-15% volume sanguíneo total{'\n'}
                                • Cão 20kg: máximo 120-180 mL{'\n'}
                                • Gato 4kg: máximo 24-42 mL{'\n'}
                                • Frequência: máximo 1x/mês doação regular
                            </Text>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        title="🦠 Principais Doenças Hematológicas"
                        titleStyle={[styles.accordionTitle, { color: currentTheme.color }]}
                        style={[styles.accordion, { backgroundColor: currentTheme.accordionBackgroundColor, borderColor: currentTheme.color }]}
                        titleNumberOfLines={2}
                    >
                        <View style={[styles.accordionContent, { backgroundColor: currentTheme.backgroundColor }]}>
                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🩸 Anemia Hemolítica Imunomediada (IMHA):</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Achados: esferócitos (&gt;5%), autoaglutinação{'\n'}
                                • Laboratorial: ↑ bilirrubina, ↑ LDH, ↓ haptoglobina{'\n'}
                                • Coombs direto positivo (nem sempre){'\n'}
                                • Regeneração intensa: reticulocitose marcante{'\n'}
                                • Tratamento: prednisolona, ciclosporina, azatioprina{'\n'}
                                • Prognóstico reservado: mortalidade 20-30%
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🦠 Hemoparasitoses:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Babesia canis/gibsoni: piroplasmas grandes/pequenos{'\n'}
                                • Mycoplasma haemofelis: epicelular, cadeias ou cocos{'\n'}
                                • Ehrlichia canis: mórulas em monócitos{'\n'}
                                • Anaplasma platys: em plaquetas{'\n'}
                                • Hepatozoon: gamontes em neutrófilos{'\n'}
                                • Diagnóstico: esfregaço + PCR + sorologia
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🏜️ Leishmaniose Visceral:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Pancitopenia progressiva{'\n'}
                                • Hiperproteinemia (hipergamaglobulinemia){'\n'}
                                • Hipoalbuminemia{'\n'}
                                • Amastigotas em macrófagos (medula óssea){'\n'}
                                • Diagnóstico: sorologia, PCR, citologia{'\n'}
                                • Tratamento: miltefosina, antimoniato meglumina
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🩸 Leucemias e Linfomas:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Leucemia linfocítica: ↑ linfócitos maduros{'\n'}
                                • Leucemia aguda: &gt;20% blastos circulantes{'\n'}
                                • Linfoma multicêntrico: linfadenopatia{'\n'}
                                • FeLV+ gatos: anemia não-regenerativa{'\n'}
                                • Diagnóstico: citologia, imunofenotipagem, PCR
                            </Text>

                            <TouchableOpacity onPress={() => openLink("https://www.wsava.org/guidelines/")}>
                                <Text style={styles.link}>🔗 WSAVA Guidelines - Oncologia</Text>
                            </TouchableOpacity>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        title="💉 Coleta, Processamento e Transfusão"
                        titleStyle={[styles.accordionTitle, { color: currentTheme.color }]}
                        style={[styles.accordion, { backgroundColor: currentTheme.accordionBackgroundColor, borderColor: currentTheme.color }]}
                        titleNumberOfLines={2}
                    >
                        <View style={[styles.accordionContent, { backgroundColor: currentTheme.backgroundColor }]}>
                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🩸 Técnicas de Coleta:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Veia jugular: mais confiável, menos hemólise{'\n'}
                                • Veia cefálica: adequada para volumes menores{'\n'}
                                • Agulha 21-23G para cães, 23-25G para gatos{'\n'}
                                • Aspiração suave: evitar hemólise{'\n'}
                                • Homogeneização imediata com anticoagulante{'\n'}
                                • Processamento em até 4 horas (EDTA)
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🧪 Anticoagulantes:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • EDTA K3: 1.8 mg/mL - hemograma completo{'\n'}
                                • Citrato sódio: 1:9 - coagulograma, VHS{'\n'}
                                • Heparina sódica: 10-20 UI/mL - gasometria{'\n'}
                                • Fluoreto sódio: glicemia (inibe glicolise){'\n'}
                                • Sem anticoagulante: bioquímica sérica
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🏥 Tipagem Sanguínea:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Cães: DEA 1.1 (mais importante), 1.2, 3, 4, 5, 7{'\n'}
                                • Gatos: A (comum), B (raro), AB (muito raro){'\n'}
                                • Prova cruzada: major (doador→receptor), minor{'\n'}
                                • Incompatibilidade: hemólise, choque{'\n'}
                                • Primeira transfusão: pode ser sem tipagem (cães)
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>💰 Hemoderivados Disponíveis:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Sangue total: anemia + hipovolemia{'\n'}
                                • Concentrado hemácias: anemia pura{'\n'}
                                • Plasma fresco congelado: fatores coagulação{'\n'}
                                • Concentrado plaquetas: trombocitopenia grave{'\n'}
                                • Albumina: hipoproteinemia{'\n'}
                                • Crioprecipitado: fibrinogênio, fator VIII
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>⚠️ Reações Adversas:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Hemolítica aguda: hemoglobinúria, choque{'\n'}
                                • Febril não-hemolítica: febre, tremores{'\n'}
                                • Alérgica: urticária, prurido{'\n'}
                                • Sobrecarga circulatória: edema pulmonar{'\n'}
                                • TRALI: lesão pulmonar aguda{'\n'}
                                • Infecciosa: transmissão patógenos
                            </Text>

                            <TouchableOpacity onPress={() => openLink("https://www.acvim.org/Portals/0/PDF/Guidelines/Transfusion%20Medicine.pdf")}>
                                <Text style={styles.link}>🔗 ACVIM - Medicina Transfusional</Text>
                            </TouchableOpacity>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        title="🚨 Emergências e Situações Críticas"
                        titleStyle={[styles.accordionTitle, { color: currentTheme.color }]}
                        style={[styles.accordion, { backgroundColor: currentTheme.accordionBackgroundColor, borderColor: currentTheme.color }]}
                        titleNumberOfLines={2}
                    >
                        <View style={[styles.accordionContent, { backgroundColor: currentTheme.backgroundColor }]}>
                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>⚡ Valores Críticos:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Hematócrito &lt;15%: transfusão URGENTE{'\n'}
                                • Plaquetas &lt;20k: risco hemorragia espontânea{'\n'}
                                • Leucócitos &lt;2k: neutropenia severa{'\n'}
                                • Hemoglobina &lt;5 g/dL: hipóxia tissular{'\n'}
                                • Células blásticas &gt;20%: leucemia aguda
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>💉 Protocolo Transfusional Emergência:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                1. Avaliar necessidade (clínica + laboratorial){'\n'}
                                2. Tipagem sanguínea (se tempo permitir){'\n'}
                                3. Acesso venoso calibroso (18-20G){'\n'}
                                4. Pré-medicação: difenidramina 1 mg/kg{'\n'}
                                5. Infusão inicial lenta: 0.25 mL/kg/h × 30min{'\n'}
                                6. Se sem reação: aumentar para 5-10 mL/kg/h{'\n'}
                                7. Monitorizar: FC, FR, temperatura, mucosas
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🔥 Sinais Reação Transfusional:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Imediatos: taquicardia, dispneia, vômito{'\n'}
                                • Febre &gt;1°C acima basal{'\n'}
                                • Tremores, salivação{'\n'}
                                • Urticária, eritema{'\n'}
                                • Hemoglobinúria (urina vermelha/marrom){'\n'}
                                → PARAR transfusão imediatamente!
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🌊 CID - Coagulação Intravascular Disseminada:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                • Causas: sepse, neoplasia, trauma, choque{'\n'}
                                • Laboratorial: ↑ PT/PTT, ↓ fibrinogênio{'\n'}
                                • ↑ D-dímeros, esquizócitos{'\n'}
                                • Trombocitopenia por consumo{'\n'}
                                • Tratamento: causa base + plasma fresco{'\n'}
                                • Evitar heparina (controverso)
                            </Text>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🔍 Checklist Emergência Hematológica:</Text>
                            <Text style={[styles.subtext, { color: currentTheme.color }]}>
                                ☐ Sinais vitais estáveis?{'\n'}
                                ☐ Mucosas pálidas/ictéricas?{'\n'}
                                ☐ Sangramento ativo?{'\n'}
                                ☐ Esplenomegalia/hepatomegalia?{'\n'}
                                ☐ Linfadenopatia?{'\n'}
                                ☐ Histórico medicamentos/tóxicos?{'\n'}
                                ☐ Hemograma + esfregaço urgente{'\n'}
                                ☐ Perfil coagulação se indicado
                            </Text>
                        </View>
                    </List.Accordion>
                    <List.Accordion
                        title="🌐 Links e Recursos Científicos"
                        titleStyle={[styles.accordionTitle, { color: currentTheme.color }]}
                        style={[styles.accordion, { backgroundColor: currentTheme.accordionBackgroundColor, borderColor: currentTheme.color }]}
                        titleNumberOfLines={2}
                    >
                        <View style={[styles.accordionContent, { backgroundColor: currentTheme.backgroundColor }]}>
                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>📚 Manuais e Referências:</Text>

                            <TouchableOpacity onPress={() => openLink("https://www.merckvetmanual.com/hematologic-system")}>
                                <Text style={styles.link}>🔗 Merck Veterinary Manual - Hematologia</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openLink("https://eclinpath.com/hematology/")}>
                                <Text style={styles.link}>🔗 eClinPath Cornell - Atlas Hematológico</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openLink("https://www.idexx.com/en/veterinary/reference-laboratories/reference-values/")}>
                                <Text style={styles.link}>🔗 IDEXX Reference Laboratory</Text>
                            </TouchableOpacity>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🏛️ Organizações Profissionais:</Text>

                            <TouchableOpacity onPress={() => openLink("https://www.asvcp.org/")}>
                                <Text style={styles.link}>🔗 ASVCP - Patologia Clínica Veterinária</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openLink("https://www.acvim.org/")}>
                                <Text style={styles.link}>🔗 ACVIM - Medicina Interna Veterinária</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openLink("https://www.wsava.org/guidelines/")}>
                                <Text style={styles.link}>🔗 WSAVA Guidelines</Text>
                            </TouchableOpacity>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>🇧🇷 Recursos Nacionais:</Text>

                            <TouchableOpacity onPress={() => openLink("http://www.cbpv.org.br/")}>
                                <Text style={styles.link}>🔗 CBPV - Colégio Brasileiro Patologia</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openLink("https://www.cfmv.gov.br/")}>
                                <Text style={styles.link}>🔗 CFMV - Conselho Federal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openLink("https://www.sbcv.org.br/")}>
                                <Text style={styles.link}>🔗 SBCV - Sociedade Brasileira Clínicos</Text>
                            </TouchableOpacity>

                            <Text style={[styles.sectionSubtitle, { color: currentTheme.color }]}>📖 Journals e Publicações:</Text>

                            <TouchableOpacity onPress={() => openLink("https://onlinelibrary.wiley.com/journal/19391676")}>
                                <Text style={styles.link}>🔗 Veterinary Clinical Pathology Journal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => openLink("https://www.sciencedirect.com/journal/the-veterinary-journal")}>
                                <Text style={styles.link}>🔗 The Veterinary Journal</Text>
                            </TouchableOpacity>
                        </View>
                    </List.Accordion>
                    <View style={styles.footer}>
                        <Text style={[styles.footerText, { color: currentTheme.color }]}>Em desenvolvimento.</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainView: {
        flex: 1,
        marginBottom: 50,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 25,
        fontStyle: 'italic',
        paddingHorizontal: 20,
    },
    accordion: {
        borderBottomWidth: 3,
    },
    accordionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    accordionContent: {
        padding: 15,
        paddingTop: 10,
    },
    sectionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 8,
    },
    subtext: {
        fontSize: 15,
        marginBottom: 12,
        paddingLeft: 5,
        lineHeight: 22,
    },
    link: {
        fontSize: 15,
        color: '#2e86de',
        marginVertical: 6,
        textDecorationLine: 'underline',
        paddingVertical: 2,
    },
    footer: {
        marginTop: 55,
        marginBottom: 15,
    },
    footerText: {
        position: 'absolute',
        bottom: -10,
        right: 25,
    }
});

export default Library;