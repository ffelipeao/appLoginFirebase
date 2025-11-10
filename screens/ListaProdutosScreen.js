import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    Alert,
    ActivityIndicator,
    RefreshControl,
    Image
} from 'react-native';
import { listarProdutos, deletarProduto } from '../services/produtoService';
import { isAdmin } from '../services/userService';
import { obterUriImagem } from '../services/imageService';

export default function ListaProdutosScreen({ navigation }) {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userIsAdmin, setUserIsAdmin] = useState(false);

    useEffect(() => {
        verificarPermissoes();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: userIsAdmin ? () => (
                <TouchableOpacity
                    onPress={() => navigation.navigate('FormProduto')}
                    style={styles.addButton}
                >
                    <Text style={styles.addButtonText}>+ Adicionar</Text>
                </TouchableOpacity>
            ) : null,
        });
    }, [navigation, userIsAdmin]);

    useEffect(() => {
        carregarProdutos();
    }, []);

    const verificarPermissoes = async () => {
        const admin = await isAdmin();
        setUserIsAdmin(admin);
    };

    const carregarProdutos = async () => {
        try {
            setLoading(true);
            const produtosLista = await listarProdutos();
            setProdutos(produtosLista);
        } catch (error) {
            Alert.alert('Erro', 'Erro ao carregar produtos: ' + error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        carregarProdutos();
    };

    const confirmarDeletar = (produto) => {
        Alert.alert(
            'Confirmar Exclusão',
            `Deseja realmente excluir o produto "${produto.nome}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: () => deletarProdutoHandler(produto.id),
                },
            ]
        );
    };

    const deletarProdutoHandler = async (id) => {
        if (!userIsAdmin) {
            Alert.alert('Acesso Negado', 'Apenas administradores podem excluir produtos.');
            return;
        }

        try {
            await deletarProduto(id);
            Alert.alert('Sucesso', 'Produto excluído com sucesso!');
            carregarProdutos();
        } catch (error) {
            let mensagemErro = 'Erro ao excluir produto';
            
            if (error.code === 'permission-denied') {
                mensagemErro = 'Você não tem permissão para excluir produtos. Apenas administradores podem realizar esta ação.';
            } else {
                mensagemErro = error.message;
            }
            
            Alert.alert('Erro', mensagemErro);
        }
    };

    const editarProduto = (produto) => {
        if (!userIsAdmin) {
            Alert.alert('Acesso Negado', 'Apenas administradores podem editar produtos.');
            return;
        }
        navigation.navigate('FormProduto', { produto });
    };

    const formatarPreco = (preco) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(preco);
    };

    const renderProduto = ({ item }) => {
        const imagemUri = item.imagemUrl ? obterUriImagem(item.imagemUrl) : null;

        return (
            <View style={styles.produtoCard}>
                {imagemUri && (
                    <Image source={{ uri: imagemUri }} style={styles.produtoImagem} />
                )}
                <View style={styles.produtoInfo}>
                    <Text style={styles.produtoNome}>{item.nome}</Text>
                    {item.descricao ? (
                        <Text style={styles.produtoDescricao}>{item.descricao}</Text>
                    ) : null}
                    <View style={styles.produtoDetalhes}>
                        <Text style={styles.produtoPreco}>{formatarPreco(item.preco)}</Text>
                        <Text style={styles.produtoQuantidade}>
                            Estoque: {item.quantidade}
                        </Text>
                    </View>
                </View>
                {userIsAdmin && (
                    <View style={styles.produtoAcoes}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.editButton]}
                            onPress={() => editarProduto(item)}
                        >
                            <Text style={styles.actionButtonText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.deleteButton]}
                            onPress={() => confirmarDeletar(item)}
                        >
                            <Text style={styles.actionButtonText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    if (loading && produtos.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Carregando produtos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {produtos.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhum produto cadastrado</Text>
                    {userIsAdmin && (
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => navigation.navigate('FormProduto')}
                        >
                            <Text style={styles.emptyButtonText}>Adicionar Primeiro Produto</Text>
                        </TouchableOpacity>
                    )}
                    {!userIsAdmin && (
                        <Text style={styles.infoText}>
                            Apenas administradores podem adicionar produtos.
                        </Text>
                    )}
                </View>
            ) : (
                <FlatList
                    data={produtos}
                    renderItem={renderProduto}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={['#007bff']}
                        />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    listContainer: {
        padding: 15,
    },
    produtoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    produtoImagem: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 15,
        resizeMode: 'cover',
    },
    produtoInfo: {
        marginBottom: 15,
    },
    produtoNome: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    produtoDescricao: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    produtoDetalhes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    produtoPreco: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#28a745',
    },
    produtoQuantidade: {
        fontSize: 14,
        color: '#666',
    },
    produtoAcoes: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    actionButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 5,
    },
    editButton: {
        backgroundColor: '#007bff',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    addButton: {
        marginRight: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    addButtonText: {
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    emptyButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
    },
    emptyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 10,
        fontStyle: 'italic',
    },
});

