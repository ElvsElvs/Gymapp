import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BUILTIN_PROGRAMS } from '../data/programs';
import { ProgramGroup } from '../types';

const GROUP_ICONS: Record<string, string> = {
  'Chest + Triceps': '🏋️',
  'Mugura + Biceps': '🔙',
  'Kājas': '🦵',
  'Pleči + Rokas': '💪',
};

function GroupCard({ group }: { group: ProgramGroup }) {
  const [expanded, setExpanded] = useState(false);
  const icon = GROUP_ICONS[group.name] ?? '•';

  return (
    <View style={styles.card}>
      <Pressable style={styles.cardHeader} onPress={() => setExpanded(v => !v)}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.groupIcon}>{icon}</Text>
          <View>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupCount}>{group.exercises.length} vingrojumi</Text>
          </View>
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </Pressable>

      {expanded && (
        <View style={styles.exerciseList}>
          {group.exercises.map((name, i) => (
            <View key={i} style={styles.exerciseRow}>
              <Text style={styles.exerciseIndex}>{i + 1}</Text>
              <Text style={styles.exerciseName}>{name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ProgramsScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {BUILTIN_PROGRAMS.map(program => (
        <View key={program.id}>
          <View style={styles.programHeader}>
            <Text style={styles.programName}>{program.name}</Text>
            <View style={styles.programBadge}>
              <Text style={styles.programBadgeText}>Iebūvēta</Text>
            </View>
          </View>
          <Text style={styles.programMeta}>
            {program.groups.length} muskuļu grupas •{' '}
            {program.groups.reduce((n, g) => n + g.exercises.length, 0)} vingrojumi
          </Text>

          {program.groups.map((group, i) => (
            <GroupCard key={i} group={group} />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#0d0f14' },
  container: { padding: 16, paddingBottom: 48 },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  programName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#f0b429',
  },
  programBadge: {
    backgroundColor: '#1f2330',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  programBadgeText: {
    color: '#888',
    fontSize: 11,
    fontWeight: 'bold',
  },
  programMeta: {
    color: '#555',
    fontSize: 13,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#13161e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1f2330',
    marginBottom: 10,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  groupIcon: { fontSize: 24 },
  groupName: {
    color: '#f0f0f0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  groupCount: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  chevron: { color: '#555', fontSize: 12 },
  exerciseList: {
    borderTopWidth: 1,
    borderTopColor: '#1f2330',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  exerciseIndex: {
    width: 22,
    color: '#f0b429',
    fontSize: 13,
    fontWeight: 'bold',
  },
  exerciseName: {
    color: '#d0d0d0',
    fontSize: 15,
  },
});
