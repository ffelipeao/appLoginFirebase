# 📦 CRUD de Produtos - Guia de Implementação

Este documento descreve o passo a passo para incluir o CRUD (Create, Read, Update, Delete) de produtos no projeto, mantendo o padrão arquitetural existente.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquivos Criados/Modificados](#arquivos-criadosmodificados)
3. [Configuração do Firestore](#configuração-do-firestore)
4. [Estrutura de Dados](#estrutura-de-dados)
5. [Funcionalidades Implementadas](#funcionalidades-implementadas)
6. [Passo a Passo da Implementação](#passo-a-passo-da-implementação)
7. [Como Usar](#como-usar)
8. [Testes](#testes)

## 🎯 Visão Geral

O CRUD de produtos foi implementado utilizando:
- **Firebase Firestore** para armazenamento de dados
- **React Navigation** para navegação entre telas
- **React Native** seguindo o padrão do projeto existente
- **Padrão de Serviços** para separação de lógica de negócio

## 📁 Arquivos Criados/Modificados

### Arquivos Criados

1. **`services/produtoService.js`**
   - Serviço com todas as operações CRUD
   - Funções: `criarProduto`, `listarProdutos`, `atualizarProduto`, `deletarProduto`

2. **`services/userService.js`**
   - Serviço para verificar permissões de usuário
   - Funções: `isAdmin()`, `getCurrentUserData()`
   - Verifica se o usuário tem role de administrador

3. **`services/imageService.js`**
   - Serviço para gerenciar upload e manipulação de imagens
   - Funções: `selecionarImagem()`, `salvarImagemLocal()`, `obterUriImagem()`, `removerImagemLocal()`
   - **Atenção**: Usa API legada do `expo-file-system` (`expo-file-system/legacy`) para compatibilidade
   - Em desenvolvimento: salva imagens localmente no sandbox do app (apenas para fins educacionais)
   - Em produção: deve ser configurado para usar storage online (Firebase Storage, AWS S3, etc.)

4. **`screens/ListaProdutosScreen.js`**
   - Tela para listar todos os produtos
   - Funcionalidades: visualizar, editar e excluir produtos
   - Verifica permissões e oculta/mostra botões baseado no role do usuário

5. **`screens/FormProdutoScreen.js`**
   - Tela para criar e editar produtos
   - Formulário com validação de campos
   - Bloqueia acesso para usuários não-admin

6. **`readme_produtos.md`**
   - Este arquivo de documentação

### Arquivos Modificados

1. **`config/firebaseConfig.js`**
   - Adicionada configuração do Firestore
   - Exportado `db` (instância do Firestore)

2. **`navigation/AppNavigator.js`**
   - Adicionadas rotas para `ListaProdutos` e `FormProduto`

3. **`screens/HomeScreen.js`**
   - Adicionado botão "Gerenciar Produtos" para navegar à lista

## 🔥 Configuração do Firestore

### Passo 1: Habilitar Firestore no Firebase Console

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Selecione seu projeto
3. No menu lateral, clique em **"Firestore Database"**
4. Clique em **"Criar banco de dados"**
5. Escolha o modo:
   - **Modo de teste** (para desenvolvimento) - permite leitura/escrita por 30 dias
   - **Modo de produção** (para produção) - requer regras de segurança
6. Selecione a localização do banco de dados
7. Clique em **"Ativar"**

### Passo 2: Configurar Regras de Segurança

O projeto utiliza regras de segurança que exigem permissões de administrador para operações de escrita em produtos. As regras implementadas são:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Função auxiliar para verificar se o usuário é admin
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Regras para a coleção de usuários
    match /users/{userId} {
      // Permite leitura se o usuário estiver autenticado e for o próprio usuário ou admin
      allow read: if request.auth != null && (request.auth.uid == userId || isAdmin());
      
      // Permite criação do próprio perfil durante o registro
      allow create: if request.auth != null && request.auth.uid == userId;
      
      // Permite atualização se for o próprio usuário ou admin
      allow update: if request.auth != null && (request.auth.uid == userId || isAdmin());
      
      // Permite deleção apenas para admin
      allow delete: if request.auth != null && isAdmin();
    }
    
    // Regras para a coleção de produtos
    match /produtos/{productId} {
      // Permite leitura para usuários autenticados
      allow read: if request.auth != null;
      
      // Permite escrita apenas para admins
      allow write: if request.auth != null && isAdmin();
    }
  }
}
```

**⚠️ IMPORTANTE**: 
- Apenas usuários com `role: 'admin'` na coleção `users` podem criar, editar ou excluir produtos
- Todos os usuários autenticados podem visualizar produtos
- É necessário criar documentos na coleção `users` com o campo `role` definido como `'admin'` para usuários administradores

### Passo 3: Verificar Configuração no Código

O arquivo `config/firebaseConfig.js` já foi atualizado com:

```javascript
import { getFirestore } from 'firebase/firestore';
const db = getFirestore(app);
export { app, auth, db };
```

## 📊 Estrutura de Dados

### Coleção: `produtos`

Cada documento na coleção `produtos` possui a seguinte estrutura:

```javascript
{
  nome: string,           // Nome do produto (obrigatório)
  descricao: string,      // Descrição do produto (opcional)
  preco: number,          // Preço do produto (obrigatório)
  quantidade: number,     // Quantidade em estoque (obrigatório)
  imagemUrl: string,      // URL ou caminho da imagem (opcional)
  createdAt: timestamp,   // Data de criação
  updatedAt: timestamp    // Data da última atualização
}
```

### Exemplo de Documento

```json
{
  "nome": "Notebook Dell",
  "descricao": "Notebook Dell Inspiron 15",
  "preco": 3500.00,
  "quantidade": 10,
  "imagemUrl": "file:///path/to/imagens/produto_1234567890.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## ✨ Funcionalidades Implementadas

### 1. Criar Produto (Create)
- Formulário com validação
- Campos: nome, descricao, preco, quantidade, imagem
- Validação de campos obrigatórios
- Validação de tipos (número para preço e quantidade)
- Upload de imagem (salva localmente em desenvolvimento)

### 2. Listar Produtos (Read)
- Lista todos os produtos cadastrados
- Exibe imagens dos produtos (se disponíveis)
- Ordenação por data de criação (mais recentes primeiro)
- Formatação de preço em Real (R$)
- Pull-to-refresh para atualizar a lista
- Indicador de carregamento
- Mensagem quando não há produtos

### 3. Editar Produto (Update)
- Formulário pré-preenchido com dados do produto
- Validação igual ao formulário de criação
- Atualização do campo `updatedAt` automaticamente

### 4. Excluir Produto (Delete)
- Confirmação antes de excluir
- Alert de confirmação
- Atualização automática da lista após exclusão

## 🛠️ Passo a Passo da Implementação

### 0. Instalar Dependências

Antes de começar, instale os pacotes necessários:

```bash
# Navegue até a pasta do projeto
cd appLoginFirebase

# Instale as dependências
npm install firebase @react-navigation/native @react-navigation/stack expo-image-picker
```

**Nota**: Se você já tem o projeto configurado com Firebase e React Navigation, pode instalar apenas o `expo-image-picker`:

```bash
npm install expo-image-picker
```

### 1. Atualizar Configuração do Firebase

**Arquivo**: `config/firebaseConfig.js`

**Mudanças realizadas**:
- Importado `getFirestore` do Firebase
- Criada instância `db` do Firestore
- Exportado `db` junto com `app` e `auth`

### 2. Criar Serviço de Produtos

**Arquivo**: `services/produtoService.js`

**Funções criadas**:
- `criarProduto(produto)`: Cria um novo produto
- `listarProdutos()`: Retorna todos os produtos
- `atualizarProduto(id, produto)`: Atualiza um produto existente
- `deletarProduto(id)`: Remove um produto

**Características**:
- Tratamento de erros com try/catch
- Conversão de tipos (string para number)
- Timestamps automáticos

### 3. Criar Tela de Lista de Produtos

**Arquivo**: `screens/ListaProdutosScreen.js`

**Funcionalidades**:
- Carregamento inicial com indicador
- Lista com FlatList otimizada
- Pull-to-refresh
- Botão de adicionar no header
- Cards de produtos com informações
- Botões de editar e excluir
- Confirmação antes de excluir
- Estado vazio quando não há produtos

**Estilo**:
- Cards com sombra
- Cores consistentes com o projeto
- Layout responsivo

### 4. Criar Tela de Formulário de Produto

**Arquivo**: `screens/FormProdutoScreen.js`

**Funcionalidades**:
- Modo criação e edição
- Validação de campos obrigatórios
- Validação de tipos numéricos
- Indicador de carregamento durante salvamento
- Mensagens de sucesso/erro
- Navegação automática após salvar

**Campos**:
- Nome (obrigatório, texto)
- Descrição (opcional, texto multilinha)
- Preço (obrigatório, numérico decimal)
- Quantidade (obrigatório, número inteiro)
- Imagem (opcional, seleção da galeria)

### 5. Adicionar Rotas de Navegação

**Arquivo**: `navigation/AppNavigator.js`

**Rotas adicionadas**:
- `ListaProdutos`: Tela de lista de produtos
- `FormProduto`: Tela de formulário (criação/edição)

### 6. Adicionar Botão na Home

**Arquivo**: `screens/HomeScreen.js`

**Mudanças**:
- Botão "Gerenciar Produtos" adicionado
- Navegação para `ListaProdutos`
- Estilo consistente com o restante da tela

## 📱 Como Usar

### Acessar o CRUD de Produtos

1. Faça login no aplicativo
2. Na tela Home, clique em **"Gerenciar Produtos"**
3. Você será redirecionado para a lista de produtos

### Criar um Novo Produto (Apenas Admin)

**⚠️ Requer permissão de administrador**

1. Na lista de produtos, clique no botão **"+ Adicionar"** (canto superior direito)
   - Este botão só aparece para administradores
2. Preencha o formulário:
   - **Nome**: Nome do produto (obrigatório)
   - **Descrição**: Descrição detalhada (opcional)
   - **Preço**: Preço do produto em reais (obrigatório)
   - **Quantidade**: Quantidade em estoque (obrigatório)
   - **Imagem**: Selecione uma imagem da galeria (opcional)
3. Clique em **"Criar Produto"**
4. Uma mensagem de sucesso será exibida e você retornará à lista

**Nota**: Se você não for administrador, verá uma mensagem de "Acesso Negado" ao tentar acessar o formulário.

### Editar um Produto (Apenas Admin)

**⚠️ Requer permissão de administrador**

1. Na lista de produtos, encontre o produto desejado
2. Clique no botão **"Editar"** no card do produto
   - Este botão só aparece para administradores
3. Modifique os campos desejados
4. Clique em **"Atualizar Produto"**
5. Uma mensagem de sucesso será exibida e você retornará à lista

**Nota**: Usuários não-admin não verão os botões de ação nos cards de produtos.

### Excluir um Produto (Apenas Admin)

**⚠️ Requer permissão de administrador**

1. Na lista de produtos, encontre o produto desejado
2. Clique no botão **"Excluir"** no card do produto
   - Este botão só aparece para administradores
3. Confirme a exclusão no alerta exibido
4. O produto será removido e a lista será atualizada

### Atualizar a Lista

- **Pull-to-refresh**: Arraste a lista para baixo para atualizar
- A lista é atualizada automaticamente após criar, editar ou excluir

## 🧪 Testes

### Testes Manuais Recomendados

1. **Criar Produto**:
   - ✅ Criar com todos os campos preenchidos
   - ✅ Criar sem descrição (deve funcionar)
   - ✅ Tentar criar sem nome (deve mostrar erro)
   - ✅ Tentar criar com preço inválido (deve mostrar erro)
   - ✅ Tentar criar com quantidade inválida (deve mostrar erro)

2. **Listar Produtos**:
   - ✅ Verificar se produtos aparecem corretamente
   - ✅ Verificar formatação de preço
   - ✅ Testar pull-to-refresh
   - ✅ Verificar mensagem quando não há produtos

3. **Editar Produto**:
   - ✅ Verificar se campos são pré-preenchidos
   - ✅ Editar e salvar alterações
   - ✅ Validar campos ao editar

4. **Excluir Produto**:
   - ✅ Confirmar exclusão
   - ✅ Cancelar exclusão
   - ✅ Verificar se produto foi removido da lista

### Cenários de Erro

- Sem conexão com internet
- Firestore não configurado
- Regras de segurança bloqueando acesso
- Dados inválidos no formulário

## 🔒 Segurança e Permissões

### Sistema de Permissões

O sistema implementa controle de acesso baseado em roles:

- **Usuários Comuns**: Podem apenas visualizar produtos
- **Administradores**: Podem criar, editar e excluir produtos

### Como Criar um Usuário Administrador

Para que um usuário possa criar, editar ou excluir produtos, é necessário:

1. O usuário deve estar autenticado no Firebase Auth
2. Deve existir um documento na coleção `users` com o ID igual ao `uid` do usuário
3. O documento deve conter o campo `role` com valor `'admin'`

**Exemplo de documento na coleção `users`:**

```javascript
// Documento ID: [uid-do-usuario]
{
  email: "admin@exemplo.com",
  role: "admin",
  createdAt: Timestamp,
  // outros campos...
}
```

### Verificação de Permissões no Código

O código verifica permissões em dois níveis:

1. **Interface (UI)**: Botões de ação são ocultados para usuários não-admin
2. **Servidor (Firestore Rules)**: As regras do Firestore bloqueiam operações não autorizadas

Mesmo que um usuário não-admin tente fazer uma operação, as regras do Firestore impedirão a execução.

## 📚 Dependências

### Instalação dos Pacotes

Para instalar todas as dependências necessárias para o CRUD de produtos, execute os seguintes comandos:

```bash
# Instalar dependências básicas (se ainda não instaladas)
npm install firebase @react-navigation/native @react-navigation/stack

# Instalar pacote para seleção de imagens
npm install expo-image-picker

# O expo-file-system já está incluído no Expo, não precisa instalação separada
```

**Comando completo para instalar tudo de uma vez:**

```bash
npm install firebase @react-navigation/native @react-navigation/stack expo-image-picker
```

### Dependências do Projeto

Todas as dependências necessárias para o CRUD de produtos:

- `firebase`: ^12.4.0 - SDK do Firebase para autenticação e Firestore
- `@react-navigation/native`: ^7.1.18 - Biblioteca de navegação
- `@react-navigation/stack`: ^7.4.10 - Navegador em pilha
- `expo-image-picker`: Para seleção de imagens da galeria
- `expo-file-system`: Para gerenciamento de arquivos locais (já incluído no Expo, não precisa instalação)
  - **Nota**: O código usa a API legada (`expo-file-system/legacy`) para evitar problemas de compatibilidade
  - A nova API (File/Directory) ainda está em desenvolvimento e pode apresentar instabilidades

## 📸 Gerenciamento de Imagens

### Desenvolvimento (Local) - Apenas para Projeto de Aula

**⚠️ ATENÇÃO: Esta implementação é APENAS para fins educacionais e desenvolvimento local. NÃO use esta abordagem em produção!**

Em desenvolvimento, as imagens dos produtos são salvas localmente no **sandbox do aplicativo** no dispositivo:

- **Localização Real**: Diretório de documentos do app no dispositivo (sandbox)
  - **Android**: `/data/user/0/[seu-app]/files/imagens/`
  - **iOS**: `Documents/imagens/` (no sandbox do app)
- **Formato**: As imagens são copiadas do dispositivo para o diretório de documentos do app
- **Acesso**: As imagens são acessadas via URI local (`file://`)
- **Nome do arquivo**: `produto_[nome]_[timestamp].[extensao]`

**Por que não aparece na pasta física do projeto?**

Em React Native/Expo, os arquivos são salvos no **sandbox do app** no dispositivo, não na pasta física do projeto. Isso é o comportamento esperado e garante:
- ✅ **Segurança**: Cada app tem seu próprio espaço isolado
- ✅ **Isolamento**: Outros apps não podem acessar os arquivos
- ✅ **Funcionamento offline**: Arquivos disponíveis mesmo sem conexão

**⚠️ LIMITAÇÕES DESTA ABORDAGEM (Apenas para Aula):**

1. ❌ **Não funciona entre dispositivos**: As imagens ficam apenas no dispositivo onde foram salvas
2. ❌ **Perda de dados**: Se o app for desinstalado, as imagens são perdidas
3. ❌ **Não escalável**: Não funciona para múltiplos usuários
4. ❌ **Não sincronizado**: Não há backup ou sincronização
5. ❌ **Acesso limitado**: Apenas o app pode acessar os arquivos

**✅ Para Produção, você DEVE usar um Storage Online:**

1. **Usar um Storage Online** (recomendado):
   - **Firebase Storage**: Integração nativa com Firebase
   - **AWS S3**: Solução robusta e escalável
   - **Cloudinary**: Especializado em imagens
   - **Outros serviços**: Azure Blob Storage, Google Cloud Storage, etc.

2. **Configurar o Upload**:
   - Modificar `services/imageService.js` para fazer upload para o storage escolhido
   - Retornar a URL pública da imagem ao invés do caminho local
   - Atualizar `salvarImagemLocal()` para fazer upload e retornar URL
   - **Remover** a lógica de salvamento local (sandbox) em produção

3. **Exemplo de Integração com Firebase Storage**:

```javascript
// Exemplo de como modificar imageService.js para produção
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebaseConfig';

export const uploadImagemFirebase = async (imageUri, produtoId) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const storageRef = ref(storage, `produtos/${produtoId}_${Date.now()}.jpg`);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};
```

4. **Configurar Regras de Segurança do Storage** (Firebase Storage):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /produtos/{productId} {
      // Apenas admins podem fazer upload
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Todos autenticados podem ler
      allow read: if request.auth != null;
    }
  }
}
```

### Estrutura de Pastas

**No Projeto (Física):**
```
appLoginFirebase/
├── imagens/              # Pasta de referência (vazia no projeto)
├── services/
│   └── imageService.js   # Serviço de gerenciamento de imagens
└── ...
```

**No Dispositivo (Sandbox do App):**
```
[Sandbox do App]/
└── files/
    └── imagens/          # Pasta criada automaticamente
        └── produto_*.jpg # Imagens dos produtos (salvas aqui)
```

**⚠️ IMPORTANTE**: 
- A pasta `imagens/` no projeto é apenas uma referência e permanece vazia
- As imagens são salvas no **sandbox do app no dispositivo**, não na pasta do projeto
- Isso é o comportamento esperado em React Native/Expo
- **Esta abordagem é APENAS para fins educacionais e desenvolvimento local**
- **NÃO use em produção!** Use um storage online (Firebase Storage, AWS S3, etc.)

## 🐛 Troubleshooting

### Erro: "Firestore is not initialized"

**Solução**: Verifique se o Firestore está habilitado no Firebase Console e se a configuração em `firebaseConfig.js` está correta.

### Erro: "Missing or insufficient permissions" ou "permission-denied"

**Solução**: 
1. Verifique se o usuário tem um documento na coleção `users` com o campo `role: 'admin'`
2. Confirme que o ID do documento é igual ao `uid` do usuário autenticado
3. Verifique as regras de segurança do Firestore no Firebase Console
4. Certifique-se de que o usuário está autenticado

**Para criar um usuário admin:**
1. Após o usuário se registrar, vá ao Firestore Console
2. Crie um documento na coleção `users` com ID = `uid` do usuário
3. Adicione o campo `role: 'admin'`

### Erro: "Network request failed"

**Solução**: Verifique sua conexão com a internet e se o Firebase está acessível.

### Produtos não aparecem na lista

**Solução**: 
1. Verifique se há produtos cadastrados no Firestore Console
2. Verifique se as regras de segurança permitem leitura
3. Verifique o console para erros

### Imagens não aparecem ou não são salvas

**Solução**:
1. Verifique se as permissões de galeria foram concedidas
2. Verifique o console para erros de salvamento
3. Lembre-se: as imagens são salvas no **sandbox do app no dispositivo**, não na pasta do projeto
4. Para verificar se a imagem foi salva, verifique os logs no console durante o salvamento
5. **Em produção**: Use um storage online (Firebase Storage, AWS S3, etc.) ao invés de salvamento local

## 📝 Notas Adicionais

### Sobre o Projeto

- Os produtos são ordenados por data de criação (mais recentes primeiro)
- O preço é formatado em Real brasileiro (R$)
- Todos os timestamps são salvos automaticamente
- A validação é feita no cliente antes de enviar ao servidor
- O código segue o padrão do projeto existente (componentes funcionais, hooks, StyleSheet)

### Sobre o Salvamento de Imagens

**⚠️ ATENÇÃO - APENAS PARA FINS EDUCACIONAIS:**

Este projeto foi desenvolvido para fins **educacionais e de aprendizado**. A implementação de salvamento de imagens no sandbox do app é **apenas para demonstração** e **NÃO deve ser usada em produção** pelos seguintes motivos:

1. **Limitações Técnicas**:
   - Imagens ficam apenas no dispositivo onde foram salvas
   - Não há sincronização entre dispositivos
   - Dados são perdidos se o app for desinstalado
   - Não escalável para múltiplos usuários

2. **Requisitos de Produção**:
   - Imagens devem estar acessíveis de qualquer dispositivo
   - Deve haver backup e redundância
   - Deve suportar múltiplos usuários simultâneos
   - Deve ter CDN para performance global

3. **Recomendação para Produção**:
   - Use **Firebase Storage** (recomendado para projetos Firebase)
   - Ou **AWS S3** para soluções mais robustas
   - Ou **Cloudinary** para otimização automática de imagens
   - Configure regras de segurança adequadas
   - Implemente compressão e otimização de imagens

**Este projeto serve como base de aprendizado. Para produção, sempre use um storage online profissional.**

## 🎉 Conclusão

O CRUD de produtos foi implementado seguindo o padrão arquitetural do projeto, utilizando Firebase Firestore para persistência de dados e mantendo a consistência visual e funcional com o restante da aplicação.

Para dúvidas ou problemas, consulte a documentação do Firebase Firestore: https://firebase.google.com/docs/firestore

