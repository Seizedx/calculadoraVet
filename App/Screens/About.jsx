import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import {
    Heart,
    Stethoscope,
    Award,
    MapPin,
    Mail,
    Users,
    BookOpen
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../Components/ThemeComponent';
import { TopBarComponent } from '../../Components/TopBarComponent';

const About = () => {
    const { currentTheme, toggleTheme } = useTheme();
    const navigation = useNavigation();

    const handleContact = () => {
        // Implementar lógica de contato
        console.log('Contato pressed');
    };

    const InfoCard = ({ icon: Icon, title, content, iconColor = '#E53E3E' }) => (
        <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
                <Icon color={iconColor} size={24} />
                <Text style={styles.cardTitle}>{title}</Text>
            </View>
            <Text style={styles.cardContent}>{content}</Text>
        </View>
    );

    const StatItem = ({ number, label, color = '#E53E3E' }) => (
        <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color }]}>{number}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
            <ScrollView showsHorizontalScrollIndicator={false}>
                <TopBarComponent />
                <View style={[styles.mainView, { backgroundColor: currentTheme.backgroundColor }]}>
                    {/* Sobre o App */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sobre o Aplicativo</Text>
                        <Text style={styles.description}>
                            A calculadoraVet é uma ferramenta especializada desenvolvida para auxiliar profissionais
                            de saúde e estudantes no diagnóstico e compreensão de doenças hematológicas.
                            Oferecendo recursos práticos e educacionais baseados em evidências científicas atuais.
                        </Text>
                    </View>

                    {/* Estatísticas */}
                    <View style={styles.statsContainer}>
                        <StatItem number="5+" label="Anos de Experiência" />
                        <StatItem number="800+" label="Pacientes Atendidos" color="#38A169" />
                        <StatItem number="50+" label="Casos Complexos" color="#3182CE" />
                    </View>

                    {/* Sobre a Dra. Kimberli */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Dra. Kimberli de Oliveira Duarte</Text>

                        <InfoCard
                            icon={Stethoscope}
                            title="Especialidade"
                            content="Médica Hematologista com vasta experiência em diagnóstico e tratamento de distúrbios sanguíneos, incluindo anemias, leucemias, linfomas e distúrbios de coagulação."
                            iconColor="#E53E3E"
                        />

                        <InfoCard
                            icon={MapPin}
                            title="Localização"
                            content="Caxias do Sul - Rio Grande do Sul. Atendimento em consultório particular e hospital regional, oferecendo cuidado especializado para a comunidade da Serra Gaúcha."
                            iconColor="#3182CE"
                        />

                        <InfoCard
                            icon={Award}
                            title="Formação e Experiência"
                            content="Graduação em Medicina, Residência em Clínica Médica e especialização em Hematologia. Participação ativa em congressos nacionais e internacionais, sempre atualizada com as mais recentes terapias."
                            iconColor="#38A169"
                        />

                        <InfoCard
                            icon={Users}
                            title="Área de Atuação"
                            content="Diagnóstico diferencial de anemias, investigação de distúrbios hemorrágicos, acompanhamento de pacientes oncohematológicos e orientação em medicina transfusional."
                            iconColor="#805AD5"
                        />
                    </View>

                    {/* Sobre Hematologia */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Sobre a Hematologia</Text>

                        <InfoCard
                            icon={BookOpen}
                            title="O que é Hematologia?"
                            content="A Hematologia é a especialidade médica que estuda o sangue e os órgãos hematopoiéticos (medula óssea, baço, linfonodos). Engloba o diagnóstico e tratamento de doenças como anemias, leucemias, linfomas, mieloma múltiplo e distúrbios de coagulação."
                            iconColor="#F56500"
                        />

                        <InfoCard
                            icon={Heart}
                            title="Importância Clínica"
                            content="O sangue é essencial para o transporte de oxigênio, nutrientes e células de defesa. Alterações hematológicas podem indicar desde deficiências nutricionais até neoplasias complexas, sendo crucial o diagnóstico precoce e tratamento adequado."
                            iconColor="#E53E3E"
                        />
                    </View>

                    {/* Recursos do App */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Recursos do Aplicativo</Text>
                        <View style={styles.featuresList}>
                            <Text style={styles.featureItem}>• Atlas hematológico com imagens de alta qualidade</Text>
                            <Text style={styles.featureItem}>• Calculadoras clínicas especializadas</Text>
                            <Text style={styles.featureItem}>• Protocolos de diagnóstico atualizados</Text>
                            <Text style={styles.featureItem}>• Casos clínicos interativos</Text>
                            <Text style={styles.featureItem}>• Referências bibliográficas confiáveis</Text>
                            <Text style={styles.featureItem}>• Interface intuitiva e responsiva</Text>
                        </View>
                    </View>

                    {/* Contato */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contato Profissional</Text>
                        <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
                            <Mail color="#FFFFFF" size={20} />
                            <Text style={styles.contactButtonText}>Entrar em Contato</Text>
                        </TouchableOpacity>
                        <Text style={styles.contactNote}>
                            Para consultas médicas ou dúvidas profissionais, entre em contato através dos canais oficiais.
                        </Text>
                    </View>

                    {/* Disclaimer */}
                    <View style={styles.disclaimer}>
                        <Text style={styles.disclaimerText}>
                            <Text style={styles.disclaimerBold}>Importante:</Text> Este aplicativo tem finalidade
                            educacional e não substitui a consulta médica presencial. Sempre procure orientação
                            médica qualificada para diagnóstico e tratamento.
                        </Text>
                    </View>

                </View>
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    logoContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 15,
        borderRadius: 50,
        marginBottom: 15,
    },
    appTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    appSubtitle: {
        fontSize: 16,
        color: '#FFFFFF',
        opacity: 0.9,
    },
    section: {
        paddingHorizontal: 20,
        paddingVertical: 25,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2D3748',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4A5568',
        textAlign: 'justify',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 25,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#718096',
        textAlign: 'center',
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2D3748',
        marginLeft: 10,
        flex: 1,
    },
    cardContent: {
        fontSize: 15,
        lineHeight: 22,
        color: '#4A5568',
        textAlign: 'justify',
    },
    featuresList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    featureItem: {
        fontSize: 15,
        lineHeight: 24,
        color: '#4A5568',
        marginBottom: 8,
    },
    contactButton: {
        backgroundColor: '#E53E3E',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 12,
        marginBottom: 15,
    },
    contactButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    contactNote: {
        fontSize: 14,
        color: '#718096',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    disclaimer: {
        backgroundColor: '#FED7D7',
        borderLeftWidth: 4,
        borderLeftColor: '#E53E3E',
        padding: 20,
        marginHorizontal: 20,
        marginTop: 10,
        borderRadius: 8,
    },
    disclaimerText: {
        fontSize: 14,
        color: '#742A2A',
        lineHeight: 20,
        textAlign: 'justify',
    },
    disclaimerBold: {
        fontWeight: 'bold',
    },
});

export default About;