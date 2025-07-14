import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Posso pagar a faculdade por mês, como é no Brasil?",
    answer:
      "As instituições de ensino canadenses pedem que o valor integral do período seja pago antes do início. Alunos canadenses costumam financiar com o banco.",
  },
  {
    id: 2,
    question: "Como faço para conseguir uma bolsa de estudos?",
    answer:
      "A maioria das bolsas são para canadenses. Algumas instituições oferecem bolsas parciais para brasileiros. Fale com nossa equipe para saber mais.",
  },
  {
    id: 3,
    question: "Posso trabalhar enquanto estudo?",
    answer:
      "Sim, estudantes de College público podem trabalhar até 24h semanais. Os trabalhos geralmente são em serviços, com salário mínimo da província.",
  },
  {
    id: 4,
    question: "Posso continuar no Canadá depois de terminar meu curso?",
    answer:
      "Sim! Com cursos superiores a 9 meses, é possível solicitar um visto de trabalho (PGWP) por até 3 anos, dependendo da duração do curso.",
  },
  {
    id: 5,
    question: "O que é um curso de Pathway?",
    answer:
      "Um Pathway é um programa preparatório para desenvolver inglês/francês e/ou habilidades acadêmicas antes de iniciar a graduação no Canadá.",
  },
  {
    id: 6,
    question: "Posso trabalhar enquanto faço um curso de Pathway?",
    answer:
      "Normalmente não. Verifique as condições específicas do seu visto com um especialista da Canada Intercambio.",
  },
    {
    id: 7,
    question: "Preciso ter inglês fluente para estudar no Canadá?",
    answer:
      "Sim, é necessário comprovar proficiência com testes como TOEFL ou IELTS. Algumas instituições aceitam cursos de inglês preparatórios antes da graduação.",
  },
  {
    id: 8,
    question: "O que é um Career College?",
    answer:
      "Career Colleges são instituições privadas com foco em capacitação prática e rápida para o mercado de trabalho, com duração de até 2 anos.",
  },
  {
    id: 9,
    question: "Career College dá direito ao PGWP?",
    answer:
      "Não. Programas em Career Colleges não são elegíveis ao PGWP. Apenas alguns programas de colleges públicos oferecem essa possibilidade.",
  },
  {
    id: 10,
    question: "Posso transferir minha faculdade do Brasil para o Canadá?",
    answer:
      "É possível em cursos como Administração, TI e Design, mas depende da análise da grade curricular pela instituição canadense e de tradução juramentada dos documentos.",
  },
  {
    id: 11,
    question: "Quando começa o ano letivo no Canadá?",
    answer:
      "Geralmente em setembro, com entradas adicionais em janeiro ou maio para alguns cursos. Consulte a instituição de interesse.",
  },
  {
    id: 12,
    question: "O que é PGWP (Post-Graduation Work Permit)?",
    answer:
      "É uma permissão de trabalho concedida após a graduação em instituições elegíveis, válida por até 3 anos, proporcional ao tempo do curso.",
  },
  {
    id: 13,
    question: "Quanto custa estudar em um Career College?",
    answer:
      "Os valores variam entre CAD 8.000 e CAD 25.000, dependendo da área, duração e localização do curso.",
  },
  {
    id: 14,
    question: "Pathway isenta do IELTS ou TOEFL?",
    answer:
      "Sim. Ao concluir um programa de Pathway com desempenho satisfatório, muitas instituições dispensam o teste de proficiência.",
  },
  {
    id: 15,
    question: "Quais são os países com menor custo de vida para intercâmbio?",
    answer:
      "Argentina, África do Sul, Malta e cidades menores na Espanha costumam oferecer menor custo de vida para estudantes."
  },
];

export default function FAQ() {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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

        <View style={styles.faqContainer}>{faqData.map(renderFAQItem)}</View>
      </ScrollView>

      {/* Navbar */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/programas")}
        >
          <MaterialCommunityIcons name="map-marker" size={24} color="white" />
          <Text style={styles.navText}>Programas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/perfil_principal")}
        >
          <FontAwesome name="user" size={24} color="white" />
          <Text style={styles.navText}>Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/faq")}
        >
        <Ionicons name="chatbox" size={24} color="white" />
          <Text style={styles.navText}>FAQ</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#CC2027",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    paddingTop: 40,
  },
  headerLight: {
    fontWeight: "300",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    paddingVertical: 30,
    alignItems: "center",
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#C41E3A",
    textAlign: "center",
  },
  faqContainer: {
    paddingBottom: 100,
  },
  faqItem: {
    backgroundColor: "white",
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C41E3A",
    flex: 1,
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  answerText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginTop: 10,
  },
  bottomNavigation: {
    backgroundColor: "#CC2027",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingBottom: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    color: "white",
    fontSize: 10,
    marginTop: 4,
  },
});
