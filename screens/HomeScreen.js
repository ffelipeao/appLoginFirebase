import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import app from '../config/firebaseConfig';

const auth = getAuth(app);

export default function HomeScreen({ navigation }) {
    const user = auth.currentUser;

    const logout = () => {
        Alert.alert(
            'Logout',
            'Tem certeza que deseja sair?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: () => {
                        signOut(auth)
                            .then(() => {
                                navigation.navigate('Login');
                            })
                            .catch((error) => {
                                Alert.alert('Erro', 'Erro ao fazer logout: ' + error.message);
                            });
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>
                Olá, {user?.email || 'Usuário'}!
            </Text>
            <Text style={styles.message}>
                Você está logado com sucesso no aplicativo Firebase.
            </Text>

            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Informações da conta:</Text>
                <Text style={styles.infoText}>E-mail: {user?.email}</Text>
                <Text style={styles.infoText}>
                    Verificado: {user?.emailVerified ? 'Sim' : 'Não'}
                </Text>
                <Text style={styles.infoText}>
                    Criado em: {user?.metadata?.creationTime ?
                        new Date(user.metadata.creationTime).toLocaleDateString('pt-BR') :
                        'N/A'
                    }
                </Text>
            </View>

            <Button
                title="Sair"
                onPress={logout}
                color="#dc3545"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
        color: '#555',
        lineHeight: 24,
    },
    infoContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    infoText: {
        fontSize: 16,
        marginBottom: 8,
        color: '#666',
    },
});
