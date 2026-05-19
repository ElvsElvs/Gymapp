import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { saveWorkout } from '../db/database';

type SetDraft = { reps: string; weight: string };
type ExerciseDraft = { name: string; sets: SetDraft[] };

const emptyExercise = (): ExerciseDraft => ({
  name: '',
  sets: [{ reps: '', weight: '' }],
});

export default function LogScreen() {
  const [sessionName, setSessionName] = useState('');
  const [exercises, setExercises] = useState<ExerciseDraft[]>([emptyExercise()]);
  const [saving, setSaving] = useState(false);

  function updateExerciseName(exIdx: number, name: string) {
    setExercises(prev => prev.map((e, i) => (i === exIdx ? { ...e, name } : e)));
  }

  function updateSet(exIdx: number, setIdx: number, field: 'reps' | 'weight', value: string) {
    setExercises(prev =>
      prev.map((e, i) => {
        if (i !== exIdx) return e;
        return { ...e, sets: e.sets.map((s, j) => (j === setIdx ? { ...s, [field]: value } : s)) };
      })
    );
  }

  function addSet(exIdx: number) {
    setExercises(prev =>
      prev.map((e, i) => (i === exIdx ? { ...e, sets: [...e.sets, { reps: '', weight: '' }] } : e))
    );
  }

  function removeSet(exIdx: number, setIdx: number) {
    setExercises(prev =>
      prev.map((e, i) =>
        i === exIdx ? { ...e, sets: e.sets.filter((_, j) => j !== setIdx) } : e
      )
    );
  }

  function removeExercise(exIdx: number) {
    setExercises(prev => prev.filter((_, i) => i !== exIdx));
  }

  async function handleSave() {
    if (!sessionName.trim()) {
      Alert.alert('Kļūda', 'Ievadi treniņa nosaukumu.');
      return;
    }
    const validExercises = exercises.filter(e => e.name.trim());
    if (validExercises.length === 0) {
      Alert.alert('Kļūda', 'Pievieno vismaz vienu vingrojumu.');
      return;
    }

    setSaving(true);
    try {
      await saveWorkout(
        sessionName.trim(),
        validExercises.map(e => ({
          name: e.name.trim(),
          sets: e.sets
            .filter(s => s.reps.trim() && s.weight.trim())
            .map(s => ({ reps: parseInt(s.reps, 10), weight: parseFloat(s.weight) })),
        }))
      );
      Alert.alert('Saglabāts!', 'Treniņš veiksmīgi reģistrēts.');
      setSessionName('');
      setExercises([emptyExercise()]);
    } catch {
      Alert.alert('Kļūda', 'Neizdevās saglabāt treniņu.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Reģistrēt treniņu</Text>

        <TextInput
          style={styles.input}
          placeholder="Treniņa nosaukums"
          placeholderTextColor="#555"
          value={sessionName}
          onChangeText={setSessionName}
        />

        {exercises.map((exercise, exIdx) => (
          <View key={exIdx} style={styles.card}>
            <View style={styles.cardHeader}>
              <TextInput
                style={[styles.input, styles.exerciseInput]}
                placeholder="Vingrojuma nosaukums"
                placeholderTextColor="#555"
                value={exercise.name}
                onChangeText={name => updateExerciseName(exIdx, name)}
              />
              {exercises.length > 1 && (
                <Pressable onPress={() => removeExercise(exIdx)} style={styles.removeBtn}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.setHeaderRow}>
              <Text style={[styles.colLabel, styles.colNum]}>#</Text>
              <Text style={[styles.colLabel, styles.colField]}>Atkārtojumi</Text>
              <Text style={[styles.colLabel, styles.colField]}>Svars (kg)</Text>
              <View style={styles.colAction} />
            </View>

            {exercise.sets.map((set, setIdx) => (
              <View key={setIdx} style={styles.setRow}>
                <Text style={[styles.setNum, styles.colNum]}>{setIdx + 1}</Text>
                <TextInput
                  style={[styles.input, styles.setInput, styles.colField]}
                  placeholder="0"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={set.reps}
                  onChangeText={v => updateSet(exIdx, setIdx, 'reps', v)}
                />
                <TextInput
                  style={[styles.input, styles.setInput, styles.colField]}
                  placeholder="0"
                  placeholderTextColor="#555"
                  keyboardType="decimal-pad"
                  value={set.weight}
                  onChangeText={v => updateSet(exIdx, setIdx, 'weight', v)}
                />
                {exercise.sets.length > 1 ? (
                  <Pressable onPress={() => removeSet(exIdx, setIdx)} style={[styles.removeBtn, styles.colAction]}>
                    <Text style={styles.removeBtnText}>✕</Text>
                  </Pressable>
                ) : (
                  <View style={styles.colAction} />
                )}
              </View>
            ))}

            <Pressable onPress={() => addSet(exIdx)} style={styles.addSetBtn}>
              <Text style={styles.addSetBtnText}>+ Pievienot setu</Text>
            </Pressable>
          </View>
        ))}

        <Pressable onPress={() => setExercises(prev => [...prev, emptyExercise()])} style={styles.addExerciseBtn}>
          <Text style={styles.addExerciseBtnText}>+ Pievienot vingrojumu</Text>
        </Pressable>

        <Pressable onPress={handleSave} disabled={saving} style={[styles.saveBtn, saving && styles.saveBtnDisabled]}>
          <Text style={styles.saveBtnText}>{saving ? 'Saglabā...' : 'Saglabāt treniņu'}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0d0f14' },
  scroll: { flex: 1 },
  container: {
    padding: 16,
    paddingBottom: 48,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f0b429',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1a1d25',
    color: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2d38',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#13161e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1f2330',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  exerciseInput: {
    flex: 1,
    marginBottom: 10,
  },
  removeBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 34,
    height: 40,
  },
  removeBtnText: {
    color: '#666',
    fontSize: 16,
  },
  setHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  colLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: 'bold',
  },
  colNum: { width: 28 },
  colField: { flex: 1, marginRight: 8 },
  colAction: { width: 34 },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  setNum: {
    color: '#888',
    fontSize: 14,
  },
  setInput: {
    marginBottom: 8,
    textAlign: 'center',
  },
  addSetBtn: {
    marginTop: 4,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2a2d38',
    borderStyle: 'dashed',
  },
  addSetBtnText: {
    color: '#888',
    fontSize: 13,
  },
  addExerciseBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f0b429',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  addExerciseBtnText: {
    color: '#f0b429',
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveBtn: {
    backgroundColor: '#f0b429',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
  saveBtnText: {
    color: '#0d0f14',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
