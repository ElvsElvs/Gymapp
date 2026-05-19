import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  deleteSession,
  ExerciseWithSets,
  getSessionExercises,
  getWorkoutHistory,
  SessionWithStats,
} from '../db/database';

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('lv-LV', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function SessionCard({
  session,
  onDeleted,
}: {
  session: SessionWithStats;
  onDeleted: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [exercises, setExercises] = useState<ExerciseWithSets[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleExpand() {
    if (!expanded && exercises.length === 0) {
      setLoading(true);
      try {
        setExercises(await getSessionExercises(session.id));
      } finally {
        setLoading(false);
      }
    }
    setExpanded(v => !v);
  }

  function handleDelete() {
    Alert.alert(
      'Dzēst treniņu?',
      `"${session.name}" tiks neatgriezeniski dzēsts.`,
      [
        { text: 'Atcelt', style: 'cancel' },
        {
          text: 'Dzēst',
          style: 'destructive',
          onPress: async () => {
            await deleteSession(session.id);
            onDeleted();
          },
        },
      ]
    );
  }

  return (
    <View style={styles.card}>
      <Pressable onPress={handleExpand} style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.sessionName}>{session.name}</Text>
          <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
        </View>
        <View style={styles.cardHeaderRight}>
          <Text style={styles.statBadge}>
            {session.exercise_count} vingroj.
          </Text>
          <Text style={styles.statBadge}>{session.set_count} seti</Text>
          <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </Pressable>

      {expanded && (
        <View style={styles.cardBody}>
          {loading ? (
            <ActivityIndicator color="#f0b429" style={{ marginVertical: 12 }} />
          ) : (
            exercises.map(exercise => (
              <View key={exercise.id} style={styles.exerciseBlock}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                {exercise.sets.length > 0 ? (
                  <>
                    <View style={styles.setHeaderRow}>
                      <Text style={[styles.setCol, styles.setColNum, styles.setColLabel]}>#</Text>
                      <Text style={[styles.setCol, styles.setColLabel]}>Atk.</Text>
                      <Text style={[styles.setCol, styles.setColLabel]}>Svars</Text>
                    </View>
                    {exercise.sets.map(s => (
                      <View key={s.set_number} style={styles.setRow}>
                        <Text style={[styles.setCol, styles.setColNum, styles.setColText]}>
                          {s.set_number}
                        </Text>
                        <Text style={[styles.setCol, styles.setColText]}>{s.reps}</Text>
                        <Text style={[styles.setCol, styles.setColText]}>{s.weight_kg} kg</Text>
                      </View>
                    ))}
                  </>
                ) : (
                  <Text style={styles.noSets}>Nav setu</Text>
                )}
              </View>
            ))
          )}
          <Pressable onPress={handleDelete} style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>Dzēst treniņu</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function ProgressScreen() {
  const [sessions, setSessions] = useState<SessionWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setSessions(await getWorkoutHistory());
    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#f0b429" size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f0b429" />}
    >
      <Text style={styles.heading}>Treniņu vēsture</Text>

      {sessions.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyText}>Nav reģistrētu treniņu.</Text>
          <Text style={styles.emptyHint}>Pievieno pirmo treniņu Log cilnē.</Text>
        </View>
      ) : (
        sessions.map(session => (
          <SessionCard key={session.id} session={session} onDeleted={load} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#0d0f14' },
  container: { padding: 16, paddingBottom: 48 },
  center: { flex: 1, backgroundColor: '#0d0f14', justifyContent: 'center', alignItems: 'center' },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f0b429',
    marginBottom: 16,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
    gap: 8,
  },
  emptyIcon: { fontSize: 48 },
  emptyText: { color: '#f0f0f0', fontSize: 17 },
  emptyHint: { color: '#555', fontSize: 14 },
  card: {
    backgroundColor: '#13161e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2330',
    marginBottom: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  cardHeaderLeft: { flex: 1, gap: 2 },
  cardHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sessionName: { color: '#f0f0f0', fontSize: 16, fontWeight: 'bold' },
  sessionDate: { color: '#888', fontSize: 13 },
  statBadge: {
    color: '#f0b429',
    fontSize: 12,
    backgroundColor: '#1f2330',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  chevron: { color: '#555', fontSize: 12, marginLeft: 4 },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: '#1f2330',
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 10,
    gap: 12,
  },
  exerciseBlock: { gap: 4 },
  exerciseName: { color: '#f0b429', fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  setHeaderRow: { flexDirection: 'row', marginBottom: 2 },
  setRow: { flexDirection: 'row', paddingVertical: 2 },
  setCol: { flex: 1 },
  setColNum: { flex: 0, width: 28 },
  setColLabel: { color: '#555', fontSize: 12, fontWeight: 'bold' },
  setColText: { color: '#ccc', fontSize: 14 },
  noSets: { color: '#555', fontSize: 13 },
  deleteBtn: {
    marginTop: 4,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#5a1a1a',
    backgroundColor: '#1a0d0d',
  },
  deleteBtnText: { color: '#e05555', fontSize: 14 },
});
