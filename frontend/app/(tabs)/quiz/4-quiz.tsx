import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useQuiz } from './QuizContext';
import { useRouter } from 'expo-router';

export default function QuizPergunta4() {
  const { setAnswer } = useQuiz();
  const router = useRouter();

  function handleSelect(option: string) {
    setAnswer(4, option); // 4 = número da pergunta
    router.push('/quiz/5-quiz'); // vá para a próxima pergunta
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
        <Text style={styles.title}>Com quem você pretende ou gostaria de viajar?</Text>

        <Pressable style={styles.button} onPress={() => handleSelect('Sozinho')}>
          <Text style={styles.buttonText}>Sozinho</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleSelect('Amigos')}>
          <Text style={styles.buttonText}>Amigos</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleSelect('Grupo')}>
          <Text style={styles.buttonText}>Grupo</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => handleSelect('Familia')}>
          <Text style={styles.buttonText}>Familia</Text>
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