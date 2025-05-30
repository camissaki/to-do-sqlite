import { SQLiteDatabase } from "expo-sqlite";
import _tarefa from "../types/tarefa";

import { Pressable, StyleSheet, Text, View } from "react-native";

type _propsTarefa = {
  dados: _tarefa,
  db: SQLiteDatabase,
  recarregar: any
};

export default function Tarefa(props: _propsTarefa) {

  const alternarConcluido = async () => {
    const novoStatus = props.dados.concluido ? 0 : 1;
    await props.db.runAsync(
  "UPDATE tarefas SET concluido=? WHERE id=?",
  [novoStatus, props.dados.id]
);

    await props.recarregar();
  };

  const excluir = async () => {
   await props.db.runAsync(
  "DELETE FROM tarefas WHERE id=?",
  [props.dados.id]
);

    await props.recarregar();
  };

  return (
    <View style={styles.tarefa}>
      <View style={styles.linha}>
        <Pressable onPress={alternarConcluido} style={styles.checkbox}>
          {props.dados.concluido && <Text style={styles.check}>✔</Text>}
        </Pressable>
        <Text
          style={[
            styles.texto,
            props.dados.concluido ? styles.textoConcluido : {}
          ]}
        >
          {props.dados.texto}
        </Text>
      </View>

      <Pressable style={styles.botaoExcluir} onPress={excluir}>
        <Text style={styles.textoBotao}>Excluir</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tarefa: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  texto: {
    fontSize: 18,
    color: '#5a189a',
    fontWeight: '500',
    flexShrink: 1,
  },
  textoConcluido: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#7209b7',
    borderRadius: 6,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3c4fb',
  },
  check: {
    color: '#7209b7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoExcluir: {
    backgroundColor: '#f72585',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
