import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

//verificar header e como os programas vão se relacionar com o adm

const torontoSkyline = require("../../assets/images/toronto.jpg");


interface ProgramCardProps {
  title: string;
  description: string;
  image: any; // Use 'any' ou um tipo mais específico para imagens do React Native
}

const ProgramCard: React.FC<ProgramCardProps> = ({ title, description, image }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardContent}>
      <Image 
        source={image} 
        style={styles.cardImage}
      />
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </View>
  </View>
);

const ProgramasScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
  <View style={styles.logoPlaceholder} />
  <Text style={styles.headerText}>
    Canada <Text style={styles.headerLight}>Intercâmbio</Text>
  </Text>
</View>


      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        {/* Recommended Program Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Programa recomendado por você</Text>
          <ProgramCard 
            title="High School" 
            description="Clique para mais informações." 
            image={torontoSkyline} 
          />
        </View>

        {/* Other Programs Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Outros programas</Text>
          <ProgramCard 
            title="High School" 
            description="Clique para mais informações." 
            image={torontoSkyline} 
          />
          <ProgramCard 
            title="High School" 
            description="Clique para mais informações." 
            image={torontoSkyline} 
          />
          <ProgramCard 
            title="High School" 
            description="Clique para mais informações." 
            image={torontoSkyline} 
          />
          <ProgramCard 
            title="High School" 
            description="Clique para mais informações." 
            image={torontoSkyline} 
          />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavigation}>
        <View style={styles.navItem}>
          <MaterialCommunityIcons name="map-marker" size={24} color="white" />
          <Text style={styles.navText}>Programas</Text>
        </View>
        <View style={styles.navItem}>
          <FontAwesome name="user" size={24} color="white" />
          <Text style={styles.navText}>Perfil</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="chatbox" size={24} color="white" />
          <Text style={styles.navText}>Quiz</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
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
  },
  bottomNavigation: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 20, // Ajuste para a safe area em dispositivos com notch
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: 'white',
    fontSize: 10,
    marginTop: 4,
  },
  header: {
  backgroundColor: '#DC2626',
  height: 100,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8, // ❗️ Se der erro, troque por marginRight
},
logoPlaceholder: {
  width: 32,
  height: 32,
  backgroundColor: '#fff',
  borderRadius: 16,
  marginTop: 40,
  marginRight: 8, // Substitui o `gap`
},
headerText: {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  paddingTop: 40,
},
headerLight: {
  fontWeight: '300',
},

});

export default ProgramasScreen;


