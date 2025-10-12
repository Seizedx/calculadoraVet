import AsyncStorage from '@react-native-async-storage/async-storage';

export const AsyncStorageHistoryComponent = async (historyType, historyEntry) => {
    try {
        // Recupera histórico já salvo
        const existingHistory = await AsyncStorage.getItem(historyType);
        let historyArray;

        try {
            historyArray = existingHistory ? JSON.parse(existingHistory) : [];
            if (!Array.isArray(historyArray)) {
                historyArray = [historyArray];
            }
        } catch (err) {
            historyArray = [];
        }

        historyArray.push(historyEntry);
        await AsyncStorage.setItem(historyType, JSON.stringify(historyArray));
    } catch (error) {
        console.error('Erro ao salvar o objeto:', error);
    }
};

export const loadHistory = async (loadHistoryType, setHistory) => {
    try {
        const storedHistory = await AsyncStorage.getItem(loadHistoryType);

        if (storedHistory) {
            const parsedHistory = JSON.parse(storedHistory);
            const limitedHistory = parsedHistory.slice(-30);

            setHistory(limitedHistory);

            if (parsedHistory.length > 30) {
                await AsyncStorage.setItem(loadHistoryType, JSON.stringify(limitedHistory));
            }
        }
    } catch (error) {
        Alert.alert('Erro ao carregar histórico:', error.message);
    }
};