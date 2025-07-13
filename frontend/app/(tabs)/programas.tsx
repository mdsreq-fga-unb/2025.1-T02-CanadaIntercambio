import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';
import { programService, Program } from '../../services/programService';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';
import { ProtectedRoute } from '../../components/ProtectedRoute';

const torontoSkyline = require("../../assets/images/toronto.jpg");
const loginLogo = require("../../assets/images/login_logo.png");

interface ProgramCardProps {
  program: Program;
  onPress?: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({ program, onPress }) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.cardContent}>
      <Image 
        source={torontoSkyline} 
        style={styles.cardImage}
      />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{program.title}</Text>
        <Text style={styles.cardDescription}>
          {program.description || 'Clique para mais informações.'}
        </Text>
        <View style={styles.cardDetails}>
          <Text style={styles.cardPrice}>
            {programService.formatPrice(program.price)}
          </Text>
          <Text style={styles.cardDuration}>
            {program.country} • {programService.formatDuration(program.durationWeeks || 0)}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const ProgramasScreen: React.FC = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [recommendedPrograms, setRecommendedPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar todos os programas
      console.log('Carregando programas...');
      const allPrograms = await programService.getActivePrograms();
      console.log('Programas carregados:', allPrograms.length);
      setPrograms(allPrograms);

      // Buscar programas recomendados se há usuário logado
      if (user?.id) {
        try {
          console.log('Buscando recomendações para usuário:', user.id);
          const recommended = await programService.getRecommendedPrograms(user.id);
          console.log('Recomendações encontradas:', recommended.length);
          setRecommendedPrograms(recommended);
        } catch (err) {
          console.warn('Erro ao buscar recomendações:', err);
          // Usar primeiros programas como fallback
          setRecommendedPrograms(allPrograms.slice(0, 2));
        }
      } else {
        // Usar primeiros programas como fallback
        setRecommendedPrograms(allPrograms.slice(0, 2));
      }
    } catch (err: any) {
      console.error('Erro ao carregar programas:', err);
      setError('Erro ao carregar programas. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const handleProgramPress = (program: Program) => {
    // Navegar para a tela de detalhes
    router.push(`/programa-detalhes?id=${program.id}`);
  };

  const handleRetry = () => {
    loadPrograms();
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <View style={styles.container}>
          <View style={styles.header} />
          <View style={styles.content}>
            <ActivityIndicator size="large" color="#cb2328" />
            <Text style={styles.loadingText}>Carregando programas...</Text>
          </View>
          <View style={styles.footer} />
        </View>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <View style={styles.container}>
          <View style={styles.header} />
          <View style={styles.content}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer} />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/login_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <Text style={styles.title}>Programas</Text>
          </View>
          
          {/* Recommended Program Section */}
          {recommendedPrograms.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {user ? 'Programas recomendados para você' : 'Programas em destaque'}
              </Text>
              {recommendedPrograms.map((program: Program) => (
                <ProgramCard 
                  key={program.id}
                  program={program}
                  onPress={() => handleProgramPress(program)}
                />
              ))}
            </View>
          )}

          {/* Other Programs Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Outros programas</Text>
            {programs.length > 0 ? (
              programs
                .filter((p: Program) => !recommendedPrograms.find((r: Program) => r.id === p.id))
                .map((program: Program) => (
                  <ProgramCard 
                    key={program.id}
                    program={program}
                    onPress={() => handleProgramPress(program)}
                  />
                ))
            ) : (
              <Text style={styles.noProgramsText}>Nenhum programa disponível no momento.</Text>
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/programas')}>
            <MaterialCommunityIcons name="map-marker" size={24} color="white" />
            <Text style={styles.navText}>Programas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/perfil_principal')}>
            <FontAwesome name="user" size={24} color="white" />
            <Text style={styles.navText}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push('/inicio-quiz')}>
            <Ionicons name="chatbox" size={24} color="white" />
            <Text style={styles.navText}>Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ProtectedRoute>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: { 
    height: 70, 
    backgroundColor: '#cb2328', 
    justifyContent: 'center', 
    alignItems: 'center' 
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
    width: 250, 
    height: 60, 
    marginTop: 10, 
    marginBottom: 0, 
    maxWidth: undefined
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
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#DC2626',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  cardDescription: {
    color: '#4B5563',
    fontSize: 14,
    marginBottom: 8,
  },
  cardDetails: {
    marginTop: 4,
  },
  cardPrice: {
    color: '#059669',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  cardDuration: {
    color: '#6B7280',
    fontSize: 12,
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
  noProgramsText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  bottomNavigation: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
  },
});

export default ProgramasScreen;


