# AppFirebase - Sistema de Autenticação

## 📚 Projeto Acadêmico

Este projeto foi desenvolvido como parte de uma aula acadêmica para demonstrar a implementação de autenticação de usuários utilizando Firebase Authentication em React Native com Expo.

## 🎯 Objetivo

O objetivo deste projeto é fornecer uma base sólida para entender como implementar:
- Autenticação de usuários com Firebase
- Navegação entre telas em React Native
- Gerenciamento de estado de autenticação
- Interface de usuário responsiva

## 🚀 Funcionalidades

### ✅ Implementadas
- **Tela de Login**: Autenticação com email e senha
- **Tela de Registro**: Criação de novas contas com validação
- **Tela Home**: Dashboard com informações do usuário logado
- **Navegação**: Sistema de navegação entre telas
- **Logout**: Funcionalidade para sair da conta
- **Validações**: Validação de campos obrigatórios e senhas
- **Tratamento de Erros**: Mensagens de erro específicas do Firebase

### 🔧 Tecnologias Utilizadas
- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **Firebase Authentication** - Serviço de autenticação
- **React Navigation** - Biblioteca de navegação
- **JavaScript ES6+** - Linguagem de programação

## 📱 Estrutura do Projeto

```
appFirebase/
├── App.js                 # Componente principal
├── app.json              # Configuração do Expo
├── package.json          # Dependências do projeto
├── README.md             # Documentação do projeto
├── FIREBASE_SETUP.md     # Guia de configuração do Firebase
├── config/
│   ├── firebaseConfig.js      # Configuração do Firebase (real)
│   └── firebaseConfig.example.js # Exemplo de configuração
├── navigation/
│   └── AppNavigator.js   # Configuração de navegação
├── screens/
│   ├── LoginScreen.js    # Tela de login
│   ├── RegisterScreen.js # Tela de registro
│   └── HomeScreen.js    # Tela principal (dashboard)
└── assets/              # Recursos visuais (ícones, splash)
```

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Firebase
- Android Studio (para emulador Android) ou Xcode (para iOS)

### Passos para Executar

1. **Clone o repositório**
   ```bash
   git clone [url-do-repositorio]
   cd appFirebase
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Firebase**
   - Siga o guia detalhado em [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Use o arquivo de exemplo: `config/firebaseConfig.example.js`
   - Copie as configurações para `config/firebaseConfig.js`

4. **Execute o projeto**
   ```bash
   npx expo start
   ```

5. **Teste no dispositivo**
   - Escaneie o QR code com o app Expo Go
   - Ou execute no emulador: `npm run android` ou `npm run ios`

## 🔐 Configuração do Firebase

### 1. Criar Projeto Firebase
1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Siga as instruções para criar o projeto

### 2. Configurar Autenticação
1. No painel lateral, clique em "Authentication"
2. Clique em "Começar"
3. Vá para a aba "Sign-in method"
4. Ative "Email/senha"

### 3. Obter Configurações
1. Clique no ícone de engrenagem → "Configurações do projeto"
2. Role para baixo até "Seus aplicativos"
3. Clique em "Adicionar aplicativo" → Web
4. Copie as configurações para `firebaseConfig.js`

## 📚 Conceitos Aprendidos

### Firebase Authentication
- **createUserWithEmailAndPassword()**: Criar novos usuários
- **signInWithEmailAndPassword()**: Autenticar usuários existentes
- **signOut()**: Deslogar usuário
- **onAuthStateChanged()**: Monitorar estado de autenticação

### React Navigation
- **NavigationContainer**: Container principal de navegação
- **createStackNavigator()**: Criar navegador em pilha
- **navigation.navigate()**: Navegar entre telas
- **navigation.reset()**: Resetar histórico de navegação

### React Native
- **Componentes**: View, Text, TextInput, Button, Alert
- **Estilos**: StyleSheet para estilização
- **Estado**: useState para gerenciar estado local
- **Efeitos**: useEffect para efeitos colaterais

## 🎓 Objetivos Pedagógicos

Este projeto foi desenvolvido para ensinar:

1. **Integração com Firebase**: Como conectar aplicações React Native com serviços Firebase
2. **Autenticação**: Implementação de sistemas de login/registro seguros
3. **Navegação**: Gerenciamento de fluxo entre diferentes telas
4. **Validação**: Implementação de validações de formulário
5. **Tratamento de Erros**: Como lidar com erros de forma elegante
6. **UX/UI**: Criação de interfaces intuitivas e responsivas

## 📝 Notas Importantes

- Este é um projeto **educacional** desenvolvido em ambiente de aula
- O código está comentado para facilitar o aprendizado
- As configurações do Firebase devem ser mantidas seguras
- Recomenda-se testar em dispositivos físicos para melhor experiência

## 🤝 Contribuições

Este projeto foi desenvolvido como material de estudo. Sugestões e melhorias são bem-vindas para enriquecer o aprendizado da turma.

---

**Desenvolvido para fins acadêmicos**
