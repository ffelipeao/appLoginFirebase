import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import app from '../config/firebaseConfig';
import { getCurrentUserData } from '../services/userService';

const auth = getAuth(app);

export default function HomeScreen({ navigation }) {
    const user = auth.currentUser;
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarPerfil();
    }, []);

    const carregarPerfil = async () => {
        try {
            setLoading(true);
            const profile = await getCurrentUserData();
            setUserProfile(profile);
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const formatarData = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'N/A';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin':
                return 'Administrador';
            case 'user':
                return 'Usuário';
            default:
                return role || 'Não definido';
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin':
                return '#dc3545';
            case 'user':
                return '#007bff';
            default:
                return '#6c757d';
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>
                Olá, {userProfile?.nome || userProfile?.email || user?.email || 'Usuário'}!
            </Text>
            <Text style={styles.message}>
                Você está logado com sucesso no aplicativo Firebase.
            </Text>

            {/* Perfil do Usuário */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Perfil do Usuário</Text>
                
                {userProfile?.nome && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nome:</Text>
                        <Text style={styles.infoValue}>{userProfile.nome}</Text>
                    </View>
                )}

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>E-mail:</Text>
                    <Text style={styles.infoValue}>{user?.email}</Text>
                </View>

                {userProfile?.role && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Perfil:</Text>
                        <View style={[styles.roleBadge, { backgroundColor: getRoleBadgeColor(userProfile.role) }]}>
                            <Text style={styles.roleBadgeText}>
                                {getRoleLabel(userProfile.role)}
                            </Text>
                        </View>
                    </View>
                )}

                {userProfile?.telefone && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Telefone:</Text>
                        <Text style={styles.infoValue}>{userProfile.telefone}</Text>
                    </View>
                )}

                {userProfile?.createdAt && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Perfil criado em:</Text>
                        <Text style={styles.infoValue}>{formatarData(userProfile.createdAt)}</Text>
                    </View>
                )}

                {userProfile?.updatedAt && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Última atualização:</Text>
                        <Text style={styles.infoValue}>{formatarData(userProfile.updatedAt)}</Text>
                    </View>
                )}
            </View>

            {/* Informações da Conta Firebase */}
            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Informações da Conta</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>E-mail verificado:</Text>
                    <Text style={[styles.infoValue, { color: user?.emailVerified ? '#28a745' : '#dc3545' }]}>
                        {user?.emailVerified ? 'Sim' : 'Não'}
                    </Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Conta criada em:</Text>
                    <Text style={styles.infoValue}>
                        {user?.metadata?.creationTime ?
                            new Date(user.metadata.creationTime).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) :
                            'N/A'
                        }
                    </Text>
                </View>
                {user?.metadata?.lastSignInTime && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Último acesso:</Text>
                        <Text style={styles.infoValue}>
                            {new Date(user.metadata.lastSignInTime).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </View>
                )}
            </View>

            {!userProfile && (
                <View style={styles.warningContainer}>
                    <Text style={styles.warningText}>
                        ⚠️ Perfil não encontrado no banco de dados. Algumas informações podem não estar disponíveis.
                    </Text>
                </View>
            )}

            <View style={styles.actionsContainer}>
                <Button
                    title="Gerenciar Produtos"
                    onPress={() => navigation.navigate('ListaProdutos')}
                    color="#007bff"
                />
            </View>

            <Button
                title="Sair"
                onPress={logout}
                color="#dc3545"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContent: {
        padding: 20,
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
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    infoContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
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
        borderBottomWidth: 2,
        borderBottomColor: '#007bff',
        paddingBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        flex: 1,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        flex: 2,
        textAlign: 'right',
    },
    roleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    roleBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    warningContainer: {
        backgroundColor: '#fff3cd',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
    },
    warningText: {
        fontSize: 14,
        color: '#856404',
        lineHeight: 20,
    },
    actionsContainer: {
        marginBottom: 15,
    },
});
