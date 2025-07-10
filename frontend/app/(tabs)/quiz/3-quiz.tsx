import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useQuiz } from './QuizContext';
import { useRouter } from 'expo-router';

export default function QuizPergunta3() {
  const { setAnswer } = useQuiz();
  const router = useRouter();

  function handleSelect(option: string) {
    setAnswer(3, option); // 2 = número da pergunta
    router.push('/quiz/4-quiz'); // vá para a próxima pergunta
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
        <Text style={styles.title}>Por quanto tempo você gostaria de ficar?</Text>

        <Pressable style={styles.button} onPress={() => handleSelect('Ate 1 mês')}>
          <Text style={styles.buttonText}>Ate 1 mês</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleSelect('1 a 3 meses')}>
          <Text style={styles.buttonText}>1 a 3 meses</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleSelect('4 a 6 meses')}>
          <Text style={styles.buttonText}>4 a 6 meses</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleSelect('Mais de 6 meses')}>
          <Text style={styles.buttonText}>Mais de 6 meses</Text>
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