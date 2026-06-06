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
import { useClients } from '../contexts/ClientsContext';
import { formatCurrency } from '../utils/helpers';

const ClientsScreen = () => {
  const { clients, updateClient, deleteClient } = useClients();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleDeleteClient = (id: string, name: string) => {
    Alert.alert('Usuń klientkę', `Czy na pewno chcesz usunąć ${name}?`, [
      { text: 'Anuluj', onPress: () => {} },
      {
        text: 'Usuń',
        onPress: () => deleteClient(id),
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.listContainer}>
        {clients.length === 0 ? (
          <Text style={styles.emptyText}>Brak klientek do wyświetlenia</Text>
        ) : (
          clients.map((client) => (
            <View key={client.id} style={styles.clientItem}>
              <TouchableOpacity
                style={styles.clientHeader}
                onPress={() =>
                  setSelectedClientId(selectedClientId === client.id ? null : client.id)
                }
              >
                <View style={styles.clientInfo}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  <Text style={styles.clientMeta}>
                    {client.items.length} przedmiotów • {formatCurrency(client.items.reduce((a, b) => a + b, 0))}
                  </Text>
                </View>
                <Ionicons
                  name={selectedClientId === client.id ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color="#1e3a8a"
                />
              </TouchableOpacity>

              {selectedClientId === client.id && (
                <View style={styles.clientDetails}>
                  <View style={styles.itemsList}>
                    {client.items.length === 0 ? (
                      <Text style={styles.noItems}>Brak przedmiotów</Text>
                    ) : (
                      client.items.map((item, idx) => (
                        <View key={idx} style={styles.itemRow}>
                          <Text style={styles.itemPrice}>{formatCurrency(item)}</Text>
                          <TouchableOpacity
                            onPress={() => {
                              const newItems = client.items.filter((_, i) => i !== idx);
                              updateClient(client.id, { items: newItems });
                            }}
                          >
                            <Ionicons name="trash" size={18} color="#e74c3c" />
                          </TouchableOpacity>
                        </View>
                      ))
                    )}
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.button, styles.buttonDanger]}
                      onPress={() => handleDeleteClient(client.id, client.name)}
                    >
                      <Ionicons name="trash" size={16} color="white" />
                      <Text style={styles.buttonText}>Usuń klientkę</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
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
  listContainer: {
    gap: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 40,
    fontSize: 16,
  },
  clientItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  clientMeta: {
    fontSize: 12,
    color: '#888',
  },
  clientDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f2f7',
    paddingVertical: 12,
  },
  itemsList: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  noItems: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fb',
    padding: 10,
    borderRadius: 8,
  },
  itemPrice: {
    fontWeight: '600',
    color: '#1e3a8a',
    fontSize: 14,
  },
  actionButtons: {
    paddingHorizontal: 16,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  buttonDanger: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ClientsScreen;