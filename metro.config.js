// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);


////////////////////// NAO ESTAVA CONECTANDO, FIZ ISSO:


// rm -rf .expo
// rm -rf ios
// rm -rf android
// eas build:configure --platform android


// // Configura o Metro para usar o IP da sua máquina
// config.server = {
//   ...config.server,
//   host: '192.168.15.143', // Substitua pelo IP da sua máquina
// };

module.exports = config;