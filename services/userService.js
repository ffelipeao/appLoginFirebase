import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, app } from '../config/firebaseConfig';

const auth = getAuth(app);

/**
 * Verifica se o usuário atual é administrador
 * @returns {Promise<boolean>} - true se for admin, false caso contrário
 */
export const isAdmin = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            return false;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            return false;
        }

        const userData = userDoc.data();
        return userData.role === 'admin';
    } catch (error) {
        console.error('Erro ao verificar role do usuário:', error);
        return false;
    }
};

/**
 * Obtém os dados do usuário atual
 * @returns {Promise<Object|null>} - Dados do usuário ou null se não encontrado
 */
export const getCurrentUserData = async () => {
    try {
        const user = auth.currentUser;
        if (!user) {
            return null;
        }

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
            return null;
        }

        return {
            id: userDoc.id,
            ...userDoc.data()
        };
    } catch (error) {
        console.error('Erro ao obter dados do usuário:', error);
        return null;
    }
};

