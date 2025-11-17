# 📱 Guia de Build - AppLoginFirebase

Este documento contém instruções detalhadas para fazer o build do aplicativo tanto localmente quanto usando o EAS (Expo Application Services).

---

## 📋 Índice

1. [Verificação de Pré-requisitos](#verificação-de-pré-requisitos)
2. [Opção 1: Build Local](#opção-1-build-local)
3. [Opção 2: Build com EAS (Expo Application Services)](#opção-2-build-com-eas-expo-application-services)

---

## ✅ Verificação de Pré-requisitos

Antes de iniciar o build, verifique se todos os programas necessários estão instalados:

### 1. Node.js e npm

**Verificar instalação:**
```bash
node --version
npm --version
```

**Versão recomendada:** Node.js 18.x ou superior

**Instalar (se necessário):**
- Baixe em: https://nodejs.org/
- Ou use um gerenciador de versões como `nvm` (Windows: `nvm-windows`)

### 2. Expo CLI

**Verificar instalação:**
```bash
npx expo --version
```

**Instalar (se necessário):**
```bash
npm install -g expo-cli
```

### 3. EAS CLI (para builds na nuvem)

**Verificar instalação:**
```bash
eas --version
```

**Instalar (se necessário):**
```bash
npm install -g eas-cli
```

**Fazer login no EAS:**
```bash
eas login
```

### 4. Para Build Local Android

#### 4.1. Java JDK

**Verificar instalação:**
```bash
java -version
javac -version
```

**Versão recomendada:** JDK 17 ou superior

**Instalar (se necessário):**
- Windows: Baixe em https://adoptium.net/ ou use Chocolatey: `choco install openjdk17`
- macOS: `brew install openjdk@17`
- Linux: `sudo apt install openjdk-17-jdk`

**Configurar JAVA_HOME:**
- Windows: Adicione a variável de ambiente `JAVA_HOME` apontando para a pasta do JDK
- macOS/Linux: Adicione ao `~/.bashrc` ou `~/.zshrc`:
  ```bash
  export JAVA_HOME=/caminho/para/jdk
  export PATH=$JAVA_HOME/bin:$PATH
  ```

#### 4.2. Android Studio

**Verificar instalação:**
- Abra o Android Studio e verifique se está instalado

**Instalar (se necessário):**
- Baixe em: https://developer.android.com/studio

**Configurações necessárias no Android Studio:**
1. Abra o Android Studio
2. Vá em **Tools > SDK Manager**
3. Instale os seguintes componentes:
   - Android SDK Platform 33 ou superior
   - Android SDK Build-Tools
   - Android SDK Command-line Tools
   - Android Emulator (opcional, para testar)

**Configurar variáveis de ambiente (ANDROID_HOME):**
- Windows:
  ```powershell
  # Adicione ao sistema:
  ANDROID_HOME = C:\Users\SeuUsuario\AppData\Local\Android\Sdk
  PATH = %ANDROID_HOME%\platform-tools;%ANDROID_HOME%\tools;%PATH%
  ```
- macOS/Linux:
  ```bash
  export ANDROID_HOME=$HOME/Library/Android/sdk
  export PATH=$PATH:$ANDROID_HOME/emulator
  export PATH=$PATH:$ANDROID_HOME/platform-tools
  export PATH=$PATH:$ANDROID_HOME/tools
  export PATH=$PATH:$ANDROID_HOME/tools/bin
  ```

**Verificar instalação do Android SDK:**
```bash
adb --version
```

### 5. Para Build Local iOS (apenas macOS)

#### 5.1. Xcode

**Verificar instalação:**
```bash
xcode-select --version
```

**Instalar (se necessário):**
- Baixe na App Store do macOS
- Instale as ferramentas de linha de comando:
  ```bash
  xcode-select --install
  ```

#### 5.2. CocoaPods

**Verificar instalação:**
```bash
pod --version
```

**Instalar (se necessário):**
```bash
sudo gem install cocoapods
```

### 6. Git (opcional, mas recomendado)

**Verificar instalação:**
```bash
git --version
```

**Instalar (se necessário):**
- Baixe em: https://git-scm.com/

---

## 🔨 Opção 1: Build Local

### Pré-requisitos para Build Local

- ✅ Node.js e npm instalados
- ✅ Expo CLI instalado
- ✅ Para Android: Java JDK e Android Studio configurados
- ✅ Para iOS: Xcode instalado (apenas macOS)

### Passo 1: Instalar Dependências

```bash
npm install
```

### Passo 2: Configurar Firebase

Certifique-se de que o arquivo `config/firebaseConfig.js` está configurado corretamente. Se não existir, copie o exemplo:

```bash
cp config/firebaseConfig.example.js config/firebaseConfig.js
```

Edite o arquivo `config/firebaseConfig.js` com suas credenciais do Firebase.

### Passo 3: Gerar Projeto Nativo (se necessário)

Se você ainda não tem as pastas `android/` e `ios/`, gere-as com:

```bash
npx expo prebuild
```

**Nota:** Isso criará as pastas nativas. Se você já as tem, pode pular este passo.

### Passo 4: Build Android Local

#### 4.1. Build APK de Debug

```bash
cd android
./gradlew assembleDebug
```

O APK será gerado em: `android/app/build/outputs/apk/debug/app-debug.apk`

#### 4.2. Build APK de Release

**Antes do build de release, configure a assinatura:**

1. Gere uma keystore (se ainda não tiver):
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Configure o `android/app/build.gradle` com as informações da keystore:
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               storeFile file('my-release-key.keystore')
               storePassword 'sua-senha'
               keyAlias 'my-key-alias'
               keyPassword 'sua-senha'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. Execute o build:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

O APK será gerado em: `android/app/build/outputs/apk/release/app-release.apk`

#### 4.3. Build AAB (Android App Bundle) para Google Play

```bash
cd android
./gradlew bundleRelease
```

O AAB será gerado em: `android/app/build/outputs/bundle/release/app-release.aab`

### Passo 5: Build iOS Local (apenas macOS)

#### 5.1. Instalar Dependências do iOS

```bash
cd ios
pod install
cd ..
```

#### 5.2. Abrir no Xcode

```bash
npx expo run:ios
```

Ou abra manualmente:
```bash
open ios/AppFirebase.xcworkspace
```

#### 5.3. Build no Xcode

1. Selecione o dispositivo ou simulador
2. Vá em **Product > Archive**
3. Após o build, você pode distribuir via App Store Connect ou TestFlight

### Passo 6: Executar no Emulador/Simulador

**Android:**
```bash
npx expo run:android
```

**iOS:**
```bash
npx expo run:ios
```

---

## ☁️ Opção 2: Build com EAS (Expo Application Services)

O EAS Build é a forma recomendada pela Expo para fazer builds na nuvem, sem precisar configurar todo o ambiente local.

### Pré-requisitos para Build com EAS

- ✅ Node.js e npm instalados
- ✅ EAS CLI instalado e logado
- ✅ Conta Expo (gratuita ou paga)

### Passo 1: Fazer Login no EAS

```bash
eas login
```

Se você não tem uma conta Expo, crie uma em: https://expo.dev/

### Passo 2: Configurar o Projeto

O arquivo `eas.json` já está configurado com os perfis:
- `development`: Build de desenvolvimento com development client
- `preview`: Build para testes internos
- `production`: Build para produção

### Passo 3: Build de Desenvolvimento

Este build cria um cliente de desenvolvimento que permite usar o Expo Go ou desenvolvimento customizado:

```bash
eas build --profile development --platform android
```

ou

```bash
eas build --profile development --platform ios
```

ou para ambas as plataformas:

```bash
eas build --profile development --platform all
```

### Passo 4: Build de Preview (Testes Internos)

Este build cria um APK/AAB (Android) ou IPA (iOS) para distribuição interna:

**Android:**
```bash
eas build --profile preview --platform android
```

**iOS:**
```bash
eas build --profile preview --platform ios
```

**Ambas as plataformas:**
```bash
eas build --profile preview --platform all
```

### Passo 5: Build de Produção

Este build cria a versão final para publicação nas lojas:

**Android:**
```bash
eas build --profile production --platform android
```

**iOS:**
```bash
eas build --profile production --platform ios
```

**Ambas as plataformas:**
```bash
eas build --profile production --platform all
```

### Passo 6: Acompanhar o Build

Você pode acompanhar o progresso do build em:
- Terminal: O EAS CLI mostra o progresso
- Dashboard: https://expo.dev/accounts/[seu-usuario]/projects/AppFirebase/builds

### Passo 7: Baixar o Build

Após o build ser concluído, você pode baixar o arquivo:

```bash
eas build:list
```

Ou baixe diretamente pelo link fornecido no terminal ou no dashboard.

### Configurações Adicionais do EAS

#### Configurar Credenciais

O EAS pode gerenciar automaticamente as credenciais de assinatura:

```bash
eas credentials
```

#### Configurar Variáveis de Ambiente

Crie um arquivo `.env` ou configure no dashboard do EAS:

```bash
eas secret:create --scope project --name FIREBASE_API_KEY --value sua-chave
```

#### Build Local com EAS (opcional)

Você também pode fazer build local usando o EAS:

```bash
eas build --profile production --platform android --local
```

**Nota:** Isso requer que você tenha todo o ambiente configurado (Android Studio, JDK, etc.)

---

## 🐛 Solução de Problemas Comuns

### Erro: "ANDROID_HOME não está definido"

**Solução:**
1. Verifique se o Android Studio está instalado
2. Configure a variável de ambiente `ANDROID_HOME`
3. Reinicie o terminal

### Erro: "JAVA_HOME não está definido"

**Solução:**
1. Instale o JDK 17 ou superior
2. Configure a variável de ambiente `JAVA_HOME`
3. Reinicie o terminal

### Erro: "Gradle build failed"

**Solução:**
1. Limpe o cache do Gradle:
   ```bash
   cd android
   ./gradlew clean
   ```
2. Verifique se todas as dependências estão instaladas
3. Verifique se o `build.gradle` está configurado corretamente

### Erro: "EAS build failed"

**Solução:**
1. Verifique os logs no dashboard do EAS
2. Certifique-se de que o `eas.json` está configurado corretamente
3. Verifique se todas as credenciais estão configuradas:
   ```bash
   eas credentials
   ```

### Erro: "Firebase não configurado"

**Solução:**
1. Certifique-se de que o arquivo `config/firebaseConfig.js` existe
2. Verifique se as credenciais do Firebase estão corretas
3. Certifique-se de que o arquivo não está no `.gitignore` (mas as credenciais não devem ser commitadas)

---

## 📚 Recursos Adicionais

- [Documentação do Expo](https://docs.expo.dev/)
- [Documentação do EAS Build](https://docs.expo.dev/build/introduction/)
- [Documentação do React Native](https://reactnative.dev/)
- [Documentação do Firebase](https://firebase.google.com/docs)

---

## 📝 Notas Importantes

1. **Segurança:** Nunca commite arquivos com credenciais (como `firebaseConfig.js` com dados reais). Use variáveis de ambiente ou arquivos de exemplo.

2. **Performance:** Builds locais podem ser mais rápidos, mas requerem mais configuração. Builds com EAS são mais fáceis, mas dependem da conexão com a internet.

3. **Custos:** Builds com EAS têm limites na conta gratuita. Consulte: https://expo.dev/pricing

4. **Versões:** Sempre verifique se está usando versões compatíveis do Node.js, Expo SDK e outras dependências.

---

## ✅ Checklist Rápido

Antes de fazer o build, verifique:

- [ ] Node.js instalado e na versão correta
- [ ] npm/yarn funcionando
- [ ] Expo CLI instalado
- [ ] EAS CLI instalado e logado (para builds na nuvem)
- [ ] Firebase configurado (`config/firebaseConfig.js`)
- [ ] Dependências instaladas (`npm install`)
- [ ] Para Android: Java JDK e Android Studio configurados
- [ ] Para iOS: Xcode instalado (apenas macOS)
- [ ] Variáveis de ambiente configuradas (ANDROID_HOME, JAVA_HOME)

---

**Última atualização:** 2024

