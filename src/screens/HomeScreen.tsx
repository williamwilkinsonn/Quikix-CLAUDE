import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { subscribeToProjects } from '@/services/firestore';
import type { Project } from '@/types';

export default function HomeScreen() {
  const { user } = useAuth();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToProjects(user.uid, (projects) => {
      setRecentProjects(projects.slice(0, 5));
    });
    return unsubscribe;
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          Hello, {user?.displayName ?? 'there'} 👋
        </Text>
        <Text style={styles.subtitle}>Here&apos;s what&apos;s happening</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Projects</Text>
        {recentProjects.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No projects yet.</Text>
            <Text style={styles.emptyHint}>
              Head to the Projects tab to create one!
            </Text>
          </View>
        ) : (
          <FlatList
            data={recentProjects}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.projectCard}>
                <Text style={styles.projectTitle}>{item.title}</Text>
                <Text style={styles.projectDesc} numberOfLines={2}>
                  {item.description}
                </Text>
                <View
                  style={[
                    styles.badge,
                    item.status === 'active' && styles.badgeActive,
                    item.status === 'completed' && styles.badgeCompleted,
                    item.status === 'archived' && styles.badgeArchived,
                  ]}
                >
                  <Text style={styles.badgeText}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6C63FF',
    padding: 24,
    paddingTop: 32,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  emptyHint: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 4,
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  projectDesc: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  badgeActive: { backgroundColor: '#d4edda' },
  badgeCompleted: { backgroundColor: '#cce5ff' },
  badgeArchived: { backgroundColor: '#f8d7da' },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#444',
    textTransform: 'capitalize',
  },
});
