# 🔥 Configuração do Firebase - Guia Passo a Passo

## 📋 Pré-requisitos
- Conta no Google (Gmail)
- Projeto React Native/Expo criado

## 🚀 Passo 1: Criar Projeto Firebase

1. **Acesse o Firebase Console**
   - Vá para: https://console.firebase.google.com/
   - Faça login com sua conta Google

2. **Criar Novo Projeto**
   - Clique em "Adicionar projeto" ou "Create a project"
   - Digite o nome do projeto (ex: "meu-app-firebase")
   - Clique em "Continuar"

3. **Configurar Google Analytics (Opcional)**
   - Escolha se deseja habilitar o Google Analytics
   - Para projetos de aprendizado, pode desabilitar
   - Clique em "Criar projeto"

## 🔐 Passo 2: Configurar Autenticação

1. **Acessar Authentication**
   - No painel lateral esquerdo, clique em "Authentication"
   - Clique em "Começar" ou "Get started"

2. **Habilitar Email/Senha**
   - Vá para a aba "Sign-in method"
   - Clique em "Email/Password"
   - Ative a primeira opção "Email/Password"
   - Clique em "Salvar"

## ⚙️ Passo 3: Obter Configurações do Projeto

1. **Acessar Configurações**
   - Clique no ícone de engrenagem ⚙️ no canto superior esquerdo
   - Selecione "Configurações do projeto"

2. **Adicionar Aplicativo Web**
   - Role para baixo até a seção "Seus aplicativos"
   - Clique no ícone "</>" (Web)
   - Digite um nome para o app (ex: "Meu App Web")
   - **NÃO** marque "Também configure o Firebase Hosting"
   - Clique em "Registrar app"

3. **Copiar Configurações**
   - Copie o objeto `firebaseConfig` que aparece na tela
   - Exemplo:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyC...",
     authDomain: "meu-projeto.firebaseapp.com",
     projectId: "meu-projeto",
     storageBucket: "meu-projeto.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abc123"
   };
   ```

## 📱 Passo 4: Configurar no React Native

1. **Instalar Dependências**
   ```bash
   npm install firebase @react-native-async-storage/async-storage
   ```

2. **Criar Arquivo de Configuração**
   - Crie o arquivo `config/firebaseConfig.js`
   - Copie o conteúdo do arquivo de exemplo: `config/firebaseConfig.example.js`
   - Substitua as configurações pelas suas

3. **Estrutura do Arquivo**
   ```javascript
   import { initializeApp } from "firebase/app";
   import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
   import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

   const firebaseConfig = {
     // Suas configurações aqui
   };

   const app = initializeApp(firebaseConfig);
   const auth = initializeAuth(app, {
     persistence: getReactNativePersistence(ReactNativeAsyncStorage),
   });

   export { app, auth };
   ```

## ✅ Passo 5: Testar Configuração

1. **Importar no Seu App**
   ```javascript
   import { auth } from './config/firebaseConfig';
   ```

2. **Testar Conexão**
   ```javascript
   console.log('Firebase Auth:', auth);
   ```

## 🚨 Problemas Comuns

### Erro: "Firebase not initialized"
- Verifique se o arquivo `firebaseConfig.js` está correto
- Confirme se todas as dependências estão instaladas

### Erro: "Auth domain not authorized"
- Verifique se o domínio está correto no Firebase Console
- Confirme se a autenticação está habilitada

### Erro: "Invalid API key"
- Verifique se a API key está correta
- Confirme se o projeto está ativo no Firebase Console

### Erro: "java.lang.String cannot be cast to java.lang.Boolean"
- Desabilite a Nova Arquitetura no `app.json`: `"newArchEnabled": false`
- Limpe o cache: `npx expo start --clear`

## 📚 Recursos Adicionais

- [Documentação Oficial Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Expo Firebase Guide](https://docs.expo.dev/guides/using-firebase/)

## 🔒 Segurança

⚠️ **IMPORTANTE**: 
- Nunca commite suas chaves reais no Git
- Use variáveis de ambiente em produção
- Mantenha suas configurações seguras
- Para projetos de aprendizado, pode usar as chaves diretamente

## 📝 Checklist Final

- [ ] Projeto Firebase criado
- [ ] Autenticação Email/Senha habilitada
- [ ] Configurações copiadas
- [ ] Arquivo `firebaseConfig.js` criado
- [ ] Dependências instaladas
- [ ] Teste de conexão realizado
- [ ] App funcionando corretamente

---

**Dica**: Mantenha este arquivo como referência para futuros projetos!
