import { useState, useEffect, forwardRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useTheme } from './ThemeComponent';


const emojis = [
    '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐱', '🐾',
    '🦁', '🐯', '🐅', '🐆', '🐶', '🐕', '🐩', '🦮', '🐕‍🦺', '🐺', '🦊',
];

const getRandomEmoji = () => {
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
};

const CustomTextInput = forwardRef(({
    value,
    onChangeText,
    placeholder = '',
    mask = false,
    keyboardType = 'default',
    style,
    returnKeyType = 'done',
    blurOnSubmit,
    onSubmitEditing,
}, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [currentEmoji, setCurrentEmoji] = useState(getRandomEmoji());

    useEffect(() => {
        // No masking logic currently needed
    }, [value, mask]);

    const showPlaceholder = !value;

    const handleFocus = () => {
        setIsFocused(true);
        setCurrentEmoji(getRandomEmoji());
    };

    const { currentTheme } = useTheme();
    return (
        <View style={[styles.container, style]}>
            <View style={styles.inputWrapper}>
                <TextInput
                    ref={ref}
                    style={[styles.input, { color: currentTheme.color }]}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    caretHidden={!value}
                    scrollEnabled={false}
                    multiline={false}
                    textAlign="center"
                    blurOnSubmit={blurOnSubmit}
                    onFocus={handleFocus}
                    onBlur={() => setIsFocused(false)}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                />
                {showPlaceholder && (
                    <Text style={[styles.placeholderText, { color: currentTheme.color }]}>{placeholder}</Text>
                )}
                {isFocused && (
                    <Text style={styles.customCaret}>{currentEmoji}</Text>
                )}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    inputWrapper: {
        position: 'relative',
    },
    input: {
        alignItems: 'center',
        paddingHorizontal: 25,
        marginHorizontal: 15,
        fontSize: 20,
        height: 48,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#676767',
    },
    placeholderText: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        fontSize: 16,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight: 48,
    },
    customCaret: {
        position: 'absolute',
        left: 25,
        top: 10,
        fontSize: 15,
        lineHeight: 25,
    },
});

export default CustomTextInput;