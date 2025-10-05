import { ExpoConfig, ConfigContext } from '@expo/config';
import 'dotenv/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: process.env.APP_NAME || 'calculadora Vet',
  slug: process.env.EAS_SLUG || 'calculadora-Vet',
  scheme: process.env.EAS_SLUG || 'calculadora-Vet',
  version: process.env.APP_VERSION || '0.0.3',
  orientation: 'default',
  icon: './src/images/logo.png',
  newArchEnabled: true,

  owner: process.env.EAS_PROJECT_OWNER,

  extra: {
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    },
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
  },

  android: {
    googleServicesFile: './src/firebase/google-services.json',
    package: process.env.ANDROID_PACKAGE || 'com.cfranceschini00.calculadoraVet',
  },

  plugins: [
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
        },
      },
    ],
  ],
});
