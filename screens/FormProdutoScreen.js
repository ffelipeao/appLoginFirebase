import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    StyleSheet, 
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { criarProduto, atualizarProduto } from '../services/produtoService';
import { isAdmin } from '../services/userService';

export default function FormProdutoScreen({ route, navigation }) {
    const produto = route.params?.produto;
    const isEdit = !!produto;

    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [loading, setLoading] = useState(false);
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
});

