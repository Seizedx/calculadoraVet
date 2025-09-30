import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Sun, Moon } from "lucide-react-native";

export const themes = {
    light: {
        gradientA: '#FF6B6B',
        gradientB: '#FFE5E5',
        backgroundColor: '#ffffff',
        backgroundColorBlurred: 'rgba(0,0,0,0.5)',
        statusBarBackgroundColor: '#ffffff',
        accordionBackgroundColor: '#bbbbbb',
        quickAccessBackgroundColor: '#00000010',
        resultBackgroundColor: '#dcdcdcff',
        activeTintColor: '#000000',
        inactiveTintColor: '#5d5d5d',
        plusButtonColor: '#0080ffff',
        plusAltButtonColor: '#2cb85bff',
        minusButtonColor: '#af0000ff',
        buttonColor: '#ff0000',
        unselectedButtonColor: '#ff000040',
        buttonTheme: '#000000',
        color: '#000000',
        successColor: '#22ce00',
        warningColor: '#ffee00',
        dangerColor: '#c03f3f',
        barStyle: 'dark-content',
        size: 40,
    },
    dark: {
        gradientA: '#484848',
        gradientB: '#60161A',
        backgroundColor: '#1a1a1a',
        backgroundColorBlurred: 'rgba(0,0,0,0.5)',
        statusBarBackgroundColor: '#1a1a1a',
        quickAccessBackgroundColor: '#bbbbbb10',
        resultBackgroundColor: '#3a3a3aff',
        accordionBackgroundColor: '#4f4e4eff',
        activeTintColor: '#ffffff',
        inactiveTintColor: '#7c7c7c',
        plusButtonColor: '#0039aaff',
        plusAltButtonColor: '#327847ff',
        minusButtonColor: '#ba0000ff',
        buttonColor: '#7c0000',
        unselectedButtonColor: '#7c000040',
        successColor: '#189100ff',
        warningColor: '#b8ab00ff',
        dangerColor: '#862e2eff',
        buttonTheme: '#ffffff',
        color: '#d2d2d2',
        barStyle: 'light-content',
        size: 40,
    },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(true);
    const [actualTheme, setActualTheme] = useState('light');

    const toggleTheme = () => {
        setTheme((prev) => !prev);
        setActualTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const currentTheme = themes[actualTheme];

    return (
        <ThemeContext.Provider value={{ actualTheme, toggleTheme, currentTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeSwitch = () => {
    const { actualTheme, toggleTheme } = useTheme();
    const [isDark, setIsDark] = useState(actualTheme === 'dark');
    const animation = useRef(new Animated.Value(actualTheme === 'dark' ? 1 : 0)).current;

    useEffect(() => {
        Animated.spring(animation, {
            toValue: isDark ? 1 : 0,
            friction: 7,
            tension: 60,
            useNativeDriver: false,
        }).start();
    }, [isDark]);

    const toggleSwitch = () => {
        setIsDark(!isDark);
        toggleTheme();
    };

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [3, 70 - 30 - 3],
    });

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["#32323230", "#ffb30030"],
    });

    const circleColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["#ffb300", "#323232"],
    });

    return (
        <TouchableOpacity activeOpacity={0.8} onPress={toggleSwitch}>
            <Animated.View style={[styles.switchContainer, { backgroundColor }]}>
                <Sun
                    size={20}
                    color="#ffb300"
                    style={styles.iconLeft}
                />

                <Moon
                    size={20}
                    color="#323232"
                    style={styles.iconRight}
                />

                <Animated.View
                    style={[
                        styles.circle,
                        { transform: [{ translateX }], backgroundColor: circleColor },
                    ]}
                />
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    switchContainer: {
        width: 70,
        height: 36,
        borderRadius: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        position: "relative",
        paddingHorizontal: 6,
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        position: "absolute",
        top: 3,
        left: 0,
    },
    iconLeft: {
        position: "absolute",
        left: 10,
        top: 8,
    },
    iconRight: {
        position: "absolute",
        right: 10,
        top: 8,
    },
});
