import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app from '../config/firebaseConfig';

const auth = getAuth(app);

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const login = () => {
        if (!email || !senha) {
            Alert.alert('Erro', 'E-mail e senha são obrigatórios');
            return;
        }

        signInWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                Alert.alert('Sucesso', `Bem-vindo ${userCredential.user.email}`);
                navigation.navigate('Home');
            })
            .catch((error) => {
                let mensagemErro = 'Erro ao fazer login';

                switch (error.code) {
                    case 'auth/user-not-found':
                        mensagemErro = 'Usuário não encontrado';
                        break;
                    case 'auth/wrong-password':
                        mensagemErro = 'Senha incorreta';
                        break;
                    case 'auth/invalid-email':
                        mensagemErro = 'E-mail inválido';
                        break;
                    case 'auth/too-many-requests':
                        mensagemErro = 'Muitas tentativas. Tente novamente mais tarde';
                        break;
                    default:
                        mensagemErro = error.message;
                }

                Alert.alert('Erro', mensagemErro);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                style={styles.input}
            />

            <Button title="Entrar" onPress={login} />

            <View style={styles.footer}>
                <Text style={styles.footerText}>Não tem uma conta?</Text>
                <Button
                    title="Criar Conta"
                    onPress={() => navigation.navigate('Register')}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    footer: {
        marginTop: 30,
        alignItems: 'center',
    },
    footerText: {
        marginBottom: 10,
        fontSize: 16,
    },
});