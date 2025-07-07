import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'Pergunta',
    answer: 'O Milus canadense é mais barato que a mercadoria, e que torna a vida de um intercambista mais acessível.',
  },
  {
    id: 2,
    question: 'Pergunta',
    answer: 'O Milus canadense é mais barato que a mercadoria, e que torna a vida de um intercambista mais acessível.',
  },
  {
    id: 3,
    question: 'Pergunta',
    answer: 'O Milus canadense é mais barato que a mercadoria, e que torna a vida de um intercambista mais acessível.',
  },
  {
    id: 4,
    question: 'Pergunta',
    answer: 'O Milus canadense é mais barato que a mercadoria, e que torna a vida de um intercambista mais acessível.',
  },
  {
    id: 5,
    question: 'Pergunta',
    answer: 'O Milus canadense é mais barato que a mercadoria, e que torna a vida de um intercambista mais acessível.',
  },
  {
    id: 6,
    question: 'Pergunta',
    answer: 'O Milus canadense é mais barato que a mercadoria, e que torna a vida de um intercambista mais acessível.',
  },
];

export default function FAQ() {
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const renderFAQItem = (item: FAQItem) => {
    const isExpanded = expandedItems.includes(item.id);
    
    return (
      <View key={item.id} style={styles.faqItem}>
        <TouchableOpacity 
          style={styles.questionContainer}
          onPress={() => toggleExpanded(item.id)}
        >
          <Text style={styles.questionText}>{item.question}</Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#C41E3A" 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.answerContainer}>
            <Text style={styles.answerText}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={require("@/assets/images/canada_leaf.png")} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>
          Canada <Text style={styles.headerLight}>Intercâmbio</Text>
        </Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Encontre aqui a sua dúvida!</Text>
        </View>

        <View style={styles.faqContainer}>
          {faqData.map(renderFAQItem)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#CC2027',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginTop: 40,
    marginRight: 8,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#C41E3A',
    textAlign: 'center',
  },
  faqContainer: {
    paddingBottom: 100,
  },
  faqItem: {
    backgroundColor: 'white',
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C41E3A',
    flex: 1,
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  answerText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginTop: 10,
  },
  bottomNavigation: {
    backgroundColor: '#CC2027',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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


