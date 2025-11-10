import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableOpacity
} from 'react-native';
import { criarProduto, atualizarProduto } from '../services/produtoService';
import { isAdmin } from '../services/userService';
import { selecionarImagem, salvarImagemLocal, obterUriImagem, removerImagemLocal } from '../services/imageService';

export default function FormProdutoScreen({ route, navigation }) {
    const produto = route.params?.produto;
    const isEdit = !!produto;

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [imagemUri, setImagemUri] = useState(null);
    const [imagemUrl, setImagemUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingImagem, setLoadingImagem] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false);

    useEffect(() => {
        verificarPermissoes();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: isEdit ? 'Editar Produto' : 'Novo Produto',
        });

        if (isEdit) {
            setNome(produto.nome || '');
            setDescricao(produto.descricao || '');
            setPreco(produto.preco?.toString() || '');
            setQuantidade(produto.quantidade?.toString() || '');
            if (produto.imagemUrl) {
                setImagemUrl(produto.imagemUrl);
                setImagemUri(obterUriImagem(produto.imagemUrl));
            }
        }
    }, [isEdit, produto]);

    const verificarPermissoes = async () => {
        const admin = await isAdmin();
        setUserIsAdmin(admin);

        if (!admin) {
            Alert.alert(
                'Acesso Negado',
                'Apenas administradores podem criar ou editar produtos.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]
            );
        }
    };

    const validarCampos = () => {
        if (!nome.trim()) {
            Alert.alert('Erro', 'O nome do produto é obrigatório');
            return false;
        }

        if (!preco.trim()) {
            Alert.alert('Erro', 'O preço é obrigatório');
            return false;
        }

        const precoNum = parseFloat(preco);
        if (isNaN(precoNum) || precoNum < 0) {
            Alert.alert('Erro', 'O preço deve ser um número válido maior ou igual a zero');
            return false;
        }

        if (!quantidade.trim()) {
            Alert.alert('Erro', 'A quantidade é obrigatória');
            return false;
        }

        const quantidadeNum = parseInt(quantidade);
        if (isNaN(quantidadeNum) || quantidadeNum < 0) {
            Alert.alert('Erro', 'A quantidade deve ser um número inteiro válido maior ou igual a zero');
            return false;
        }

        return true;
    };

    const selecionarImagemProduto = async () => {
        try {
            setLoadingImagem(true);
            const uri = await selecionarImagem();

            if (uri) {
                // Salvar imagem localmente (desenvolvimento)
                const nomeArquivo = `produto_${nome.trim().replace(/\s+/g, '_') || 'sem_nome'}`;
                const caminhoLocal = await salvarImagemLocal(uri, nomeArquivo);

                setImagemUri(obterUriImagem(caminhoLocal));
                setImagemUrl(caminhoLocal);
            }
        } catch (error) {
            Alert.alert('Erro', 'Erro ao selecionar imagem: ' + error.message);
        } finally {
            setLoadingImagem(false);
        }
    };

    const removerImagem = async () => {
        if (imagemUrl && !imagemUrl.startsWith('http')) {
            await removerImagemLocal(imagemUrl);
        }
        setImagemUri(null);
        setImagemUrl(null);
    };

    const salvarProduto = async () => {
        if (!userIsAdmin) {
            Alert.alert('Acesso Negado', 'Apenas administradores podem criar ou editar produtos.');
            return;
        }

        if (!validarCampos()) {
            return;
        }

        setLoading(true);

        try {
            const dadosProduto = {
                nome: nome.trim(),
                descricao: descricao.trim(),
                preco: preco.trim(),
                quantidade: quantidade.trim(),
                imagemUrl: imagemUrl || null,
            };

            if (isEdit) {
                await atualizarProduto(produto.id, dadosProduto);
                Alert.alert('Sucesso', 'Produto atualizado com sucesso!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]);
            } else {
                await criarProduto(dadosProduto);
                Alert.alert('Sucesso', 'Produto criado com sucesso!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ]);
            }
        } catch (error) {
            let mensagemErro = 'Erro ao salvar produto';

            if (error.code === 'permission-denied') {
                mensagemErro = 'Você não tem permissão para realizar esta ação. Apenas administradores podem criar ou editar produtos.';
            } else {
                mensagemErro = error.message;
            }

            Alert.alert('Erro', mensagemErro);
        } finally {
            setLoading(false);
        }
    };

    if (!userIsAdmin) {
        return (
            <View style={styles.container}>
                <View style={styles.accessDeniedContainer}>
                    <Text style={styles.accessDeniedText}>
                        Acesso Negado
                    </Text>
                    <Text style={styles.accessDeniedMessage}>
                        Apenas administradores podem criar ou editar produtos.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Nome do Produto *</Text>
                <TextInput
                    placeholder="Digite o nome do produto"
                    value={nome}
                    onChangeText={setNome}
                    style={styles.input}
                    autoCapitalize="words"
                />

                <Text style={styles.label}>Descrição</Text>
                <TextInput
                    placeholder="Digite a descrição do produto (opcional)"
                    value={descricao}
                    onChangeText={setDescricao}
                    style={[styles.input, styles.textArea]}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />

                <Text style={styles.label}>Preço *</Text>
                <TextInput
                    placeholder="0.00"
                    value={preco}
                    onChangeText={setPreco}
                    style={styles.input}
                    keyboardType="decimal-pad"
                />

                <Text style={styles.label}>Quantidade em Estoque *</Text>
                <TextInput
                    placeholder="0"
                    value={quantidade}
                    onChangeText={setQuantidade}
                    style={styles.input}
                    keyboardType="number-pad"
                />

                <Text style={styles.label}>Imagem do Produto</Text>
                <View style={styles.imageContainer}>
                    {imagemUri ? (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: imagemUri }} style={styles.imagePreview} />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={removerImagem}
                            >
                                <Text style={styles.removeImageText}>Remover</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.selectImageButton}
                            onPress={selecionarImagemProduto}
                            disabled={loadingImagem}
                        >
                            {loadingImagem ? (
                                <ActivityIndicator size="small" color="#007bff" />
                            ) : (
                                <Text style={styles.selectImageText}>Selecionar Imagem</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.imageHelperText}>
                    Em desenvolvimento, a imagem é salva localmente. Em produção, será enviada para um storage online.
                </Text>

                <View style={styles.buttonContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#007bff" />
                    ) : (
                        <Button
                            title={isEdit ? 'Atualizar Produto' : 'Criar Produto'}
                            onPress={salvarProduto}
                            color="#007bff"
                        />
                    )}
                </View>

                <Text style={styles.helperText}>
                    * Campos obrigatórios
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        marginTop: 15,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 100,
        paddingTop: 12,
    },
    buttonContainer: {
        marginTop: 30,
        marginBottom: 15,
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    accessDeniedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    accessDeniedText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#dc3545',
        marginBottom: 15,
    },
    accessDeniedMessage: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    imageContainer: {
        marginBottom: 15,
    },
    selectImageButton: {
        borderWidth: 2,
        borderColor: '#007bff',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
    },
    selectImageText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: '600',
    },
    imagePreviewContainer: {
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover',
    },
    removeImageButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#dc3545',
        borderRadius: 8,
        alignItems: 'center',
    },
    removeImageText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    imageHelperText: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 5,
    },
});

