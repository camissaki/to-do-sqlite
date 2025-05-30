import { StatusBar } from 'expo-status-bar';
import { Alert, Button, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import _tarefa from './types/tarefa';
import Tarefa from './components/Tarefa';


const db = SQLite.openDatabaseSync("to-do.sqlite");

export default function App() {

  const [novaTarefa, setNovaTarefa] = useState<string>('');
  const [tarefas, setTarefas] = useState<_tarefa[]>([]);

  useEffect(() => {
    db.execSync(`CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY NOT NULL,
        texto VARCHAR(100),
        concluido INTEGER DEFAULT 0
    )`);
    recarregar();
  }, []);

  const recarregar = async () => {
    let temp: _tarefa[] = await db.getAllAsync("SELECT * FROM tarefas");
    setTarefas(temp);
  };

  const adicionar = async () => {
    if (novaTarefa == "") {
      Alert.alert("Insira um texto!");
      return;
    }

    await db.runAsync(`INSERT INTO tarefas (texto) VALUES (?)`, novaTarefa);
    setNovaTarefa('');
    await recarregar();
  };

  const renderLista = () => {
    return tarefas.map(t =>
      <Tarefa
        dados={t}
        db={db}
        recarregar={recarregar}
        key={t.id}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Tarefas</Text>

      <View style={styles.areaInput}>
        <TextInput
          style={styles.input}
          placeholder='Digite sua tarefa...'
          value={novaTarefa}
          onChangeText={setNovaTarefa}
        />
        <Button onPress={adicionar} title='Adicionar' />
      </View>

      <ScrollView style={styles.lista}>
        {renderLista()}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3c4fb',
    padding: 20,
    paddingTop: 50,
  },
  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#7209b7',
    textAlign: 'center',
    marginBottom: 20,
  },
  areaInput: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#7209b7',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  lista: {
    flex: 1,
  },


});
