import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useQuiz } from '../../../src/context/QuizContext'; // ajuste o caminho se necessário
import { useRouter } from 'expo-router';

export default function QuizInicial() {
  const { setAnswer } = useQuiz();
  const router = useRouter();

  function handleSelect(option: string) {
    setAnswer(6, option); // 6 = número da pergunta
    router.push('../resultado-quiz'); // vai para a tela de resultado do quiz
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoPlaceholder} />
        <Text style={styles.headerText}>
          Canada <Text style={styles.headerLight}>Intercâmbio</Text>
        </Text>
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title}>Qual o orçamento (em reais) disponível?</Text>

        <Pressable style={styles.button} onPress={() => handleSelect('Ate 15.000 reais')}>
          <Text style={styles.buttonText}>Ate 15.000 reais</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleSelect('Entre 15.000 e 80.000 reais')}>
          <Text style={styles.buttonText}>Entre 15.000 e 80.000 reais</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleSelect('Entre 80.000 e 120.000 reais')}>
          <Text style={styles.buttonText}>Entre 80.000 e 120.000 reais</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleSelect('Acima de 120.000 reais')}>
          <Text style={styles.buttonText}>Acima de 120.000 reais</Text>
        </Pressable>
      </View>

      {/* Footer */}
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
    backgroundColor: '#DC2626',
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoPlaceholder: {
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 40 
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 40, // ✅ Adiciona mais espaço superior
  },
  headerLight: {
    fontWeight: '300',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 40

  },
  title: {
    color: '#DC2626',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 44,
  },
  button: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 20,
  },
  subtext: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10
  },
  footer: {
    backgroundColor: '#DC2626',
    height: 24,
  },
});