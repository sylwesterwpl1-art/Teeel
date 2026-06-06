import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { useClients } from '../contexts/ClientsContext';
import { useData } from '../contexts/DataContext';
import { formatCurrency, getDayOfWeek } from '../utils/helpers';

const ReportsScreen = () => {
  const { clients } = useClients();
  const { liveStartedAt } = useData();

  const generateSummaryHTML = () => {
    const startDate = new Date(liveStartedAt);
    const dateStr = startDate.toLocaleDateString('pl-PL');
    const timeStr = startDate.toLocaleTimeString('pl-PL');
    const dayOfWeek = getDayOfWeek(startDate);

    let totalSales = 0;
    let totalShipping = 0;

    const clientsHTML = clients
      .map((client, idx) => {
        const clientTotal = client.items.reduce((a, b) => a + b, 0);
        totalSales += clientTotal;
        if (client.shipping) totalShipping += 15;

        return `
          <tr>
            <td>${idx + 1}</td>
            <td>${client.name}</td>
            <td>${client.items.map((p) => `${p}`).join(', ')}</td>
            <td>${formatCurrency(clientTotal)}</td>
            <td>${client.shipping ? 'TAK' : 'NIE'}</td>
          </tr>
        `;
      })
      .join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial; margin: 20px; }
          h1 { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background: #eee; }
          .summary { margin-top: 20px; text-align: right; }
        </style>
      </head>
      <body>
        <h1>Podsumowanie Live</h1>
        <p><strong>Data:</strong> ${dateStr} (${dayOfWeek})</p>
        <p><strong>Godzina:</strong> ${timeStr}</p>
        <table>
          <tr>
            <th>Lp.</th>
            <th>Klientka</th>
            <th>Pozycje</th>
            <th>Razem</th>
            <th>Wysyłka</th>
          </tr>
          ${clientsHTML}
        </table>
        <div class="summary">
          <p><strong>Suma Live:</strong> ${formatCurrency(totalSales)}</p>
          <p><strong>Wysyłka:</strong> ${formatCurrency(totalShipping)}</p>
          <p><strong>Razem:</strong> ${formatCurrency(totalSales + totalShipping)}</p>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrintSummary = async () => {
    try {
      await Print.printAsync({
        html: generateSummaryHTML(),
      });
    } catch (error) {
      Alert.alert('Błąd', 'Nie można wydrukować podsumowania');
    }
  };

  const handleExportJSON = async () => {
    try {
      const exportData = {
        version: '1',
        exportedAt: new Date().toISOString(),
        clients,
        liveStartedAt,
      };

      const fileName = `anielski-styl-${new Date().getTime()}.json`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(
        filePath,
        JSON.stringify(exportData, null, 2),
        { encoding: FileSystem.EncodingType.UTF8 }
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath);
        Alert.alert('Sukces', 'Plik został wyeksportowany');
      }
    } catch (error) {
      Alert.alert('Błąd', 'Nie można wyeksportować danych');
    }
  };

  const totalRevenue = clients.reduce((sum, client) => {
    return sum + client.items.reduce((a, b) => a + b, 0);
  }, 0);

  const clientsWithPurchases = clients.filter((c) => c.items.length > 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Podsumowanie Live</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Klientki (z zakupami):</Text>
          <Text style={styles.value}>{clientsWithPurchases.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.label}>Przychód:</Text>
          <Text style={styles.value}>{formatCurrency(totalRevenue)}</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handlePrintSummary}>
          <Ionicons name="print" size={20} color="white" />
          <Text style={styles.actionButtonText}>Wydrukuj podsumowanie</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleExportJSON}>
          <Ionicons name="download" size={20} color="white" />
          <Text style={styles.actionButtonText}>Eksportuj JSON</Text>
        </TouchableOpacity>
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
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f7',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  actionContainer: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ReportsScreen;