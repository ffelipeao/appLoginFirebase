import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const COLLECTION_NAME = 'produtos';

/**
 * Cria um novo produto no Firestore
 * @param {Object} produto - Objeto com os dados do produto (nome, descricao, preco, quantidade)
 * @returns {Promise<string>} - ID do documento criado
 */
export const criarProduto = async (produto) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            nome: produto.nome,
            descricao: produto.descricao || '',
            preco: parseFloat(produto.preco) || 0,
            quantidade: parseInt(produto.quantidade) || 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
    }
};

/**
 * Lista todos os produtos do Firestore
 * @returns {Promise<Array>} - Array de produtos com seus IDs
 */
export const listarProdutos = async () => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const produtos = [];

        querySnapshot.forEach((doc) => {
            produtos.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return produtos;
    } catch (error) {
        console.error('Erro ao listar produtos:', error);
        throw error;
    }
};

/**
 * Atualiza um produto existente no Firestore
 * @param {string} id - ID do documento do produto
 * @param {Object} produto - Objeto com os dados atualizados do produto
 * @returns {Promise<void>}
 */
export const atualizarProduto = async (id, produto) => {
    try {
        const produtoRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(produtoRef, {
            nome: produto.nome,
            descricao: produto.descricao || '',
            preco: parseFloat(produto.preco) || 0,
            quantidade: parseInt(produto.quantidade) || 0,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        throw error;
    }
};

/**
 * Deleta um produto do Firestore
 * @param {string} id - ID do documento do produto
 * @returns {Promise<void>}
 */
export const deletarProduto = async (id) => {
    try {
        const produtoRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(produtoRef);
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw error;
    }
};

