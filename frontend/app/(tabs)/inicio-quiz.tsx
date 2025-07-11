import { StyleSheet, Text, View, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function QuizInicial() {
  const handleStartQuiz = () => {
    router.push('/quiz');
  };

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
        <Text style={styles.title}>
          Descubra o programa {'\n'}
          de intercâmbio ideal {'\n'}
          para você!
        </Text>

        <Pressable style={styles.button} onPress={handleStartQuiz}>
          <Text style={styles.buttonText}>Começar</Text>
        </Pressable>

        <Text style={styles.subtext}>
          São apenas 6 perguntinhas, {'\n'}
          prometemos que será bem rapidinho!
        </Text>
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
    marginBottom: 24,
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

