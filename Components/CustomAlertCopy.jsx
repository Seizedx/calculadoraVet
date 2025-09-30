import React from 'react';
import { Modal, View, ScrollView, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTheme } from './ThemeComponent';
const { width, height } = Dimensions.get('window');

export const CustomAlertCopy = ({ visible, title, patientAge, patientWeight,subTitle, message, onClose }) => {
    const { currentTheme } = useTheme();
    const copyContent = async () => {
        try {
            await Clipboard.setStringAsync(`${title}\n\n${message}`);
        } catch (error) {
            alert('Erro ao Copiar');
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={[styles.container, { backgroundColor: currentTheme.backgroundColorBlurred }]}>
                <ScrollView style={[styles.alert, { backgroundColor: currentTheme.accordionBackgroundColor }]}
                    showsVerticalScrollIndicator={false}

                >
                    <View style={styles.containerButton}>
                        <TouchableOpacity onPress={copyContent} style={[styles.button, { backgroundColor: currentTheme.warningColor }]}>
                            <Text style={[styles.textButton, { color: currentTheme.buttonTheme }]}>📋 Copiar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: currentTheme.successColor }]}>
                            <Text style={[styles.textButton, { color: currentTheme.color }]}>✔️ Ok</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.title, { color: currentTheme.color }]}>Detalhes - {title}</Text>
                    {patientAge && (
                    <Text style={[styles.data, { color: currentTheme.color }]}>Idade: {patientAge} anos</Text>
                    )}
                    {patientWeight && (
                    <Text style={[styles.data, { color: currentTheme.color }]}>Peso: {patientWeight} kg(s)</Text>
                    )}
                    <Text style={[styles.subTitle, { color: currentTheme.color }]}>{subTitle}</Text>
                    <Text style={[styles.message, { color: currentTheme.color }]}>{message}</Text>

                </ScrollView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alert: {
        borderRadius: 15,
        padding: 24,
        width: width * 0.8,
        maxHeight: height * 0.8,

    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    data: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subTitle: {
        marginTop: 10,
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 14,
        marginBottom: 40,
        textAlign: 'center',
        lineHeight: 22,
    },
    containerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    textButton: {
        fontWeight: 'bold',
        fontSize: 16,
    },
});
