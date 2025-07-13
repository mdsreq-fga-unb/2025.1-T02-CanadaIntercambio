import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { programService, Program } from '../../services/programService';

const loginLogo = require("../../assets/images/login_logo.png");
const torontoSkyline = require("../../assets/images/toronto.jpg");

export default function ProgramaDetalhesScreen() {
  const { id } = useLocalSearchParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProgram();
    }
  }, [id]);

  const loadProgram = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const programData = await programService.getProgramById(parseInt(id as string));
      setProgram(programData);
    } catch (err: any) {
      console.error('Erro ao carregar programa:', err);
      setError('Erro ao carregar programa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoltar = () => {
    router.back();
  };

  const handleInteresse = () => {
    if (program) {
      Alert.alert(
        'Interesse no Programa',
        `Você demonstrou interesse no programa "${program.title}". Em breve entraremos em contato!`,
        [{ text: 'OK' }]
      );
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        
        <View style={styles.content}>
          <Text style={styles.welcome}>Detalhes do Programa</Text>
          
          <Image
            source={loginLogo}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#DC2626" />
            <Text style={styles.loadingText}>Carregando programa...</Text>
          </View>
        </View>
        
        <View style={styles.footer} />
      </View>
    );
  }

  if (error || !program) {
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        
        <View style={styles.content}>
          <Text style={styles.welcome}>Detalhes do Programa</Text>
          
          <Image
            source={loginLogo}
            style={styles.logo}
            resizeMode="contain"
          />
          
          <View style={styles.errorContainer}>
            <MaterialCommunityIcons name="alert-circle" size={48} color="#DC2626" />
            <Text style={styles.errorText}>{error || 'Programa não encontrado'}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleVoltar}>
              <Text style={styles.retryButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#cb2328" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>{program.title}</Text>
          
          <Image 
            source={torontoSkyline} 
            style={styles.programImage}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.detailsSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              {programService.formatPrice(program.price)}
            </Text>
            <Text style={styles.duration}>
              {programService.formatDuration(program.durationWeeks)} • {program.country}
            </Text>
          </View>
          
          <Text style={styles.description}>{program.description}</Text>
          
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informações Gerais</Text>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="target" size={20} color="#DC2626" />
              <Text style={styles.infoLabel}>Foco:</Text>
              <Text style={styles.infoValue}>{program.focus || 'Não especificado'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="book-open" size={20} color="#DC2626" />
              <Text style={styles.infoLabel}>Método:</Text>
              <Text style={styles.infoValue}>{program.method || 'Não especificado'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="school" size={20} color="#DC2626" />
              <Text style={styles.infoLabel}>Tipo:</Text>
              <Text style={styles.infoValue}>{program.type || 'Não especificado'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="clock" size={20} color="#DC2626" />
              <Text style={styles.infoLabel}>Carga Horária:</Text>
              <Text style={styles.infoValue}>{program.workload || 'Não especificado'}</Text>
            </View>
            
            <View style={styles.infoItem}>
              <MaterialCommunityIcons name="translate" size={20} color="#DC2626" />
              <Text style={styles.infoLabel}>Nível de Idioma:</Text>
              <Text style={styles.infoValue}>{program.languageLevel || 'Não especificado'}</Text>
            </View>
          </View>
          
          <View style={styles.requirementsSection}>
            <Text style={styles.sectionTitle}>Requisitos</Text>
            <Text style={styles.requirementsText}>{program.requirements}</Text>
          </View>
          
          <TouchableOpacity style={styles.interesseButton} onPress={handleInteresse}>
            <Text style={styles.interesseButtonText}>Tenho Interesse</Text>
            <MaterialCommunityIcons name="heart" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 60,
    backgroundColor: '#cb2328',
  },
  footer: {
    height: 40,
    backgroundColor: '#cb2328',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cb2328',
    marginBottom: 20,
    textAlign: 'center',
  },
  logo: {
    width: '80%',
    maxWidth: 300,
    height: 90,
    marginBottom: 30,
  },
  scrollContainer: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#cb2328',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#cb2328',
    marginBottom: 20,
    textAlign: 'center',
  },
  programImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 5,
  },
  duration: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  infoSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cb2328',
    marginBottom: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 10,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
    marginLeft: 10,
  },
  requirementsSection: {
    marginBottom: 30,
  },
  requirementsText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  interesseButton: {
    backgroundColor: '#cb2328',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  interesseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
