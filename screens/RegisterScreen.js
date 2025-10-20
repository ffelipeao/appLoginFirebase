import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app from '../config/firebaseConfig';

const auth = getAuth(app);

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const validarCampos = () => {
        if (!email || !senha || !confirmarSenha) {
            Alert.alert('Erro', 'Todos os campos são obrigatórios');
            return false;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return false;
        }

        if (senha.length < 6) {
            Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
            return false;
        }

        return true;
    };

    const registrar = () => {
        if (!validarCampos()) {
            return;
        }

        createUserWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => {
                Alert.alert(
                    'Sucesso!',
                    'Conta criada com sucesso!',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('Home')
                        }
                    ]
                );
            })
            .catch((error) => {
                let mensagemErro = 'Erro ao criar conta';

                switch (error.code) {
                    case 'auth/email-already-in-use':
                        mensagemErro = 'Este e-mail já está em uso';
                        break;
                    case 'auth/invalid-email':
                        mensagemErro = 'E-mail inválido';
                        break;
                    case 'auth/weak-password':
                        mensagemErro = 'Senha muito fraca';
                        break;
                    default:
                        mensagemErro = error.message;
                }

                Alert.alert('Erro', mensagemErro);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Criar Conta</Text>

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

            <TextInput
                placeholder="Confirmar Senha"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                secureTextEntry
                style={styles.input}
            />

            <Button title="Criar Conta" onPress={registrar} />

            <View style={styles.footer}>
                <Text style={styles.footerText}>Já tem uma conta?</Text>
                <Button
                    title="Fazer Login"
                    onPress={() => navigation.navigate('Login')}
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
