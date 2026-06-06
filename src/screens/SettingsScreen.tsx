import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useClients } from '../contexts/ClientsContext';
import { useData } from '../contexts/DataContext';

const SettingsScreen = () => {
  const { clearAllClients, clients } = useClients();
  const { clearNames, savedNames } = useData();
  const [appVersion] = useState('1.0.0');

  const handleClearAllData = () => {
    Alert.alert(
      'Wyczyść wszystkie dane',
      'Czy na pewno chcesz usunąć WSZYSTKIE dane? Tej operacji nie można cofnąć!',
      [
        { text: 'Anuluj', onPress: () => {} },
        {
          text: 'Wyczyść',
          onPress: async () => {
            await clearAllClients();
            await clearNames();
            Alert.alert('Sukces', 'Wszystkie dane zostały usunięte');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleExportAllData = async () => {
    try {
      const exportData = {
        version: '1',
        exportedAt: new Date().toISOString(),
        clients,
        savedNames,
      };

      const fileName = `anielski-styl-backup-${new Date().getTime()}.json`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(exportData, null, 2),
        { encoding: FileSystem.EncodingType.UTF8 }
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
        Alert.alert('Sukces', 'Backup został wyeksportowany');
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie można wyeksportować danych');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>O aplikacji</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nazwa:</Text>
            <Text style={styles.infoValue}>Anielski Styl</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Wersja:</Text>
            <Text style={styles.infoValue}>{appVersion}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Klientki:</Text>
            <Text style={styles.infoValue}>{clients.length}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Zapisane nazwy:</Text>
            <Text style={styles.infoValue}>{savedNames.length}</Text>
          </View>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zarządzanie danymi</Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleExportAllData}>
          <Ionicons name="cloud-download" size={20} color="#1e3a8a" />
          <Text style={styles.actionButtonText}>Backup - Eksportuj dane</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </View>

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Niebezpieczna strefa</Text>
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={handleClearAllData}
        >
          <Ionicons name="trash" size={20} color="#e74c3c" />
          <Text style={[styles.actionButtonText, styles.dangerText]}>
            Wyczyść wszystkie dane
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>
            Anielski Styl to aplikacja do zarządzania sprzedażą live boutique.
          </Text>
          <Text style={styles.aboutText}>
            Wszystkie dane przechowywane są lokalnie na Twoim urządzeniu.
          </Text>
          <Text style={styles.aboutText}>© 2024 Anielski Styl</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f7',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f7',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  actionButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dangerButton: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  actionButtonText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
    marginLeft: 12,
  },
  dangerText: {
    color: '#e74c3c',
  },
  aboutCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  aboutText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
});

export default SettingsScreen;