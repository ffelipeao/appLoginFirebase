// Importe as funções que você precisa dos SDKs que você precisa
import { initializeApp } from "firebase/app";
// TODO: Adicione SDKs para produtos do Firebase que você quer usar
// https://firebase.google.com/docs/web/setup#available-libraries

// Inicialize a Autenticação do Firebase e obtenha uma referência ao serviço
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ IMPORTANTE: Substitua estas configurações pelas suas próprias!
// Para obter suas configurações:
// 1. Acesse https://console.firebase.google.com/
// 2. Selecione seu projeto
// 3. Clique no ícone de engrenagem → "Configurações do projeto"
// 4. Role para baixo até "Seus aplicativos"
// 5. Clique em "Adicionar aplicativo" → Web
// 6. Copie as configurações abaixo

const firebaseConfig = {
    // ⚠️ SUBSTITUA PELAS SUAS CONFIGURAÇÕES:
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Auth com persistência local para React Native
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

// Exporta as instâncias para uso em outros arquivos
export { app, auth };

// 📚 DOCUMENTAÇÃO:
// - Firebase Console: https://console.firebase.google.com/
// - Documentação Firebase Auth: https://firebase.google.com/docs/auth/web/start
// - Configuração React Native: https://firebase.google.com/docs/auth/web/start#web-version_9
