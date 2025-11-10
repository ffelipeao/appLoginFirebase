import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { Platform } from 'react-native';

// Nota: Usando a API legada do expo-file-system temporariamente
// A nova API (File/Directory) ainda está em desenvolvimento e pode ter problemas

/**
 * Solicita permissão para acessar a galeria de imagens
 * @returns {Promise<boolean>} - true se a permissão foi concedida
 */
export const solicitarPermissaoGaleria = async () => {
    if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Desculpe, precisamos de permissão para acessar suas fotos!');
            return false;
        }
    }
    return true;
};

/**
 * Seleciona uma imagem da galeria
 * @returns {Promise<string|null>} - URI da imagem selecionada ou null se cancelado
 */
export const selecionarImagem = async () => {
    const temPermissao = await solicitarPermissaoGaleria();
    if (!temPermissao) {
        return null;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
    });

    if (!resultado.canceled && resultado.assets && resultado.assets.length > 0) {
        return resultado.assets[0].uri;
    }

    return null;
};

/**
 * Salva uma imagem localmente na pasta imagens (apenas desenvolvimento)
 * @param {string} imageUri - URI da imagem a ser salva
 * @param {string} nomeArquivo - Nome do arquivo (sem extensão)
 * @returns {Promise<string>} - Caminho local da imagem salva
 */
export const salvarImagemLocal = async (imageUri, nomeArquivo) => {
    try {
        // Criar diretório imagens se não existir
        // Nota: As imagens são salvas no diretório de documentos do app no dispositivo,
        // não na pasta física do projeto. Isso é o comportamento esperado em React Native/Expo.
        const imagensDir = `${FileSystem.documentDirectory}imagens/`;
        const dirInfo = await FileSystem.getInfoAsync(imagensDir);

        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(imagensDir, { intermediates: true });
        }

        // Gerar nome único para o arquivo
        const timestamp = Date.now();
        // Extrair extensão do URI (pode estar no final do caminho ou no query string)
        let extensao = 'jpg';
        const uriParts = imageUri.split('.');
        if (uriParts.length > 1) {
            const lastPart = uriParts[uriParts.length - 1];
            // Remover query string se houver
            extensao = lastPart.split('?')[0].split('&')[0];
            if (!extensao || extensao.length > 5) {
                extensao = 'jpg';
            }
        }

        const nomeCompleto = `${nomeArquivo}_${timestamp}.${extensao}`;
        const caminhoDestino = `${imagensDir}${nomeCompleto}`;

        // Verificar se o arquivo de origem existe
        const origemInfo = await FileSystem.getInfoAsync(imageUri);
        if (!origemInfo.exists) {
            throw new Error('Arquivo de origem não existe: ' + imageUri);
        }

        // Copiar a imagem para o diretório usando a API legada
        await FileSystem.copyAsync({
            from: imageUri,
            to: caminhoDestino,
        });

        // Verificar se o arquivo foi salvo corretamente
        const destinoInfo = await FileSystem.getInfoAsync(caminhoDestino);
        if (!destinoInfo.exists) {
            throw new Error('Arquivo não foi salvo corretamente');
        }

        return caminhoDestino;
    } catch (error) {
        console.error('Erro ao salvar imagem localmente:', error);
        throw error;
    }
};

/**
 * Obtém a URI da imagem (local em desenvolvimento, URL em produção)
 * @param {string} imagemPath - Caminho ou URL da imagem
 * @returns {string} - URI da imagem
 */
export const obterUriImagem = (imagemPath) => {
    if (!imagemPath) {
        return null;
    }

    // Se já for uma URL completa (http/https), retorna como está
    if (imagemPath.startsWith('http://') || imagemPath.startsWith('https://')) {
        return imagemPath;
    }

    // Se for um caminho local, retorna como file://
    if (imagemPath.startsWith('file://')) {
        return imagemPath;
    }

    // Se for um caminho relativo, adiciona file://
    return `file://${imagemPath}`;
};

/**
 * Remove uma imagem local
 * @param {string} imagePath - Caminho da imagem a ser removida
 * @returns {Promise<void>}
 */
export const removerImagemLocal = async (imagePath) => {
    try {
        if (imagePath && !imagePath.startsWith('http')) {
            const fileInfo = await FileSystem.getInfoAsync(imagePath);
            if (fileInfo.exists) {
                await FileSystem.deleteAsync(imagePath, { idempotent: true });
            }
        }
    } catch (error) {
        console.error('Erro ao remover imagem local:', error);
    }
};

