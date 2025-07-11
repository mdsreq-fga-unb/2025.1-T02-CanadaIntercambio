import  { useState, useEffect } from 'react'; // Adicionado 'useState' para gerenciar o estado do pop-up 
import { StyleSheet, Text, View, Pressable } from 'react-native';
import Popup from '../../components/PopupRN'; // Linha modificada: Importa o componente Popup adaptado para React Native, ajustando o caminho relativo
import { useRouter } from 'expo-router';
import { useQuiz } from '../../src/context/QuizContext';
import {gerarRecomendacao} from '../../src/utils/gerarRecomendacao'; // Importa a função de recomendação

export default function ResultadoQuiz() {
  const { answers } = useQuiz();
  const resultado = gerarRecomendacao(answers);
  const router = useRouter();

   ///Retornando o resultado do quiz no console
   useEffect(() => {
    console.log('Respostas selecionadas:');
    Object.entries(answers).forEach(([questao, resposta]) => {
      console.log(`Pergunta ${questao}: ${resposta}`);
    });

    console.log('Resultado sugerido:', resultado.titulo);
  }, [answers]);  

  // Linha adicionada: Declara um estado 'showPopup' para controlar a visibilidade do pop-up. Inicialmente é 'false' (oculto).
  const [showPopup, setShowPopup] = useState(false);

  // Linha adicionada: Função que será chamada quando o botão 'Saber mais sobre esse' for pressionado.
  // Ela define 'showPopup' como 'true', o que fará o pop-up aparecer.
  const handleSaberMais = () => {
    setShowPopup(true);
  };

  // Linha adicionada: Função que será chamada quando o pop-up precisar ser fechado (ex: clicando no botão 'Obrigada!').
  // Ela define 'showPopup' como 'false', o que fará o pop-up desaparecer.
  const handleClosePopup = () => {
    setShowPopup(false);
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
        <Text style={styles.title}>Resultado do Quiz!</Text>

        <Text style={styles.subtitle}>
        <Text style={styles.highlight}>{resultado.titulo}</Text> {'\n'}é o ideal para você!
      </Text>

        <View style={styles.list}>
          {resultado.descricao.map((item, index) => (
            <Text key={index} style={styles.listItem}>• {item}</Text>
          ))}
        </View>

        {/* Linha modificada: Adicionado o 'onPress' para chamar a função 'handleSaberMais' quando o botão for clicado. */}
        <Pressable style={styles.button} onPress={handleSaberMais}>
          <Text style={styles.buttonText}>Saber mais sobre esse</Text>
        </Pressable>


        <Pressable
                  style={styles.button}
                  onPress={() => router.push('./prog_detal')}
                >
          <Text style={styles.buttonText}>Explorar programas</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer} />

      {/* Linha adicionada: Renderiza o componente Popup. Sua visibilidade é controlada pelo estado 'showPopup'. */}
      {/* A função 'handleClosePopup' é passada para o Popup para que ele possa se fechar. */}
      <Popup visible={showPopup} onClose={handleClosePopup} />
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
    paddingTop: 40, // Adiciona mais espaço superior
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
    fontSize: 37,
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
    marginBottom: 10,
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

  highlight: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    gap: 4,
    marginBottom: 15,
    marginTop: 15
  },
  listItem: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },


  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
});