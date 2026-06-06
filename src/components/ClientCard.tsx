import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useClients, Client } from '../contexts/ClientsContext';
import { formatCurrency } from '../utils/helpers';

interface ClientCardProps {
  client: Client;
}

const ClientCard = ({ client }: ClientCardProps) => {
  const { updateClient, addItemToClient, removeItemFromClient } = useClients();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newItemPrice, setNewItemPrice] = useState('');

  const clientTotal = client.items.reduce((a, b) => a + b, 0);

  const handleAddItem = () => {
    const price = parseFloat(newItemPrice);
    if (isNaN(price) || price <= 0) {
      return;
    }

    addItemToClient(client.id, price);
    setNewItemPrice('');
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <View style={styles.headerContent}>
          <Text style={styles.clientName}>{client.name}</Text>
          {client.twoPlus && <Text style={styles.promoBadge}>★ 2+1</Text>}
          <Text style={styles.clientStats}>
            {client.items.length} poz. • {formatCurrency(clientTotal)}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#1e3a8a"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.details}>
          {/* Items List */}
          <View style={styles.itemsList}>
            {client.items.length === 0 ? (
              <Text style={styles.emptyItemsText}>Brak przedmiotów</Text>
            ) : (
              client.items.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemPrice}>{formatCurrency(item)}</Text>
                  <TouchableOpacity
                    onPress={() => removeItemFromClient(client.id, idx)}
                    style={styles.itemDeleteBtn}
                  >
                    <Ionicons name="close-circle" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Add Item */}
          <View style={styles.addItemContainer}>
            <TextInput
              style={styles.priceInput}
              placeholder="Cena"
              value={newItemPrice}
              onChangeText={setNewItemPrice}
              keyboardType="decimal-pad"
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.addItemBtn}
              onPress={handleAddItem}
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Shipping */}
          <View style={styles.shippingContainer}>
            <Text style={styles.shippingLabel}>Wysyłka</Text>
            <Switch
              value={client.shipping}
              onValueChange={(value) =>
                updateClient(client.id, { shipping: value })
              }
              trackColor={{ false: '#ddd', true: '#1e3a8a' }}
              thumbColor="white"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerContent: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  promoBadge: {
    fontSize: 12,
    color: '#ff6b6b',
    marginBottom: 4,
    fontWeight: '600',
  },
  clientStats: {
    fontSize: 12,
    color: '#888',
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#f0f2f7',
    paddingVertical: 12,
  },
  itemsList: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  emptyItemsText: {
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
  itemDeleteBtn: {
    padding: 4,
  },
  addItemContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
  },
  addItemBtn: {
    backgroundColor: '#1e3a8a',
    borderRadius: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shippingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f2f7',
  },
  shippingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111',
  },
});

export default ClientCard;