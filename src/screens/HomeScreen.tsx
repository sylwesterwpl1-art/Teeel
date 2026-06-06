import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useClients } from '../contexts/ClientsContext';
import { useData } from '../contexts/DataContext';
import ClientCard from '../components/ClientCard';
import { formatCurrency } from '../utils/helpers';

const HomeScreen = () => {
  const { clients, addClient } = useClients();
  const { savedNames } = useData();
  const [showForm, setShowForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [promoEnabled, setPromoEnabled] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleNameChange = (text: string) => {
    setNewClientName(text);
    if (text.trim().length > 0) {
      const filtered = savedNames.filter((name) =>
        name.toLowerCase().includes(text.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleAddClient = () => {
    if (!newClientName.trim()) {
      Alert.alert('Błąd', 'Wpisz imię klientki');
      return;
    }

    addClient({
      id: '',
      name: newClientName,
      items: [],
      shipping: false,
      show: true,
      twoPlus: promoEnabled,
    });

    setNewClientName('');
    setPromoEnabled(false);
    setShowForm(false);
    setShowSuggestions(false);
  };

  const selectSuggestion = (name: string) => {
    setNewClientName(name);
    setShowSuggestions(false);
  };

  const totalRevenue = clients.reduce((sum, client) => {
    return sum + client.items.reduce((a, b) => a + b, 0);
  }, 0);

  const freeCount = Math.floor(clients.length / 3);
  const clientsWithPurchases = clients.filter((c) => c.items.length > 0);

  return (
    <ScrollView style={styles.container}>
      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Klientki</Text>
          <Text style={styles.statValue}>{clientsWithPurchases.length}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Przychód</Text>
          <Text style={styles.statValue}>{formatCurrency(totalRevenue)}</Text>
        </View>
        {promoEnabled && (
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Darmowe</Text>
            <Text style={styles.statValue}>{freeCount}</Text>
          </View>
        )}
      </View>

      {/* Add Client Form */}
      {showForm ? (
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Dodaj klientkę</Text>
          <TextInput
            style={styles.input}
            placeholder="Imię klientki"
            value={newClientName}
            onChangeText={handleNameChange}
            placeholderTextColor="#999"
            autoFocus
          />
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsBox}>
              {suggestions.map((name, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionItem}
                  onPress={() => selectSuggestion(name)}
                >
                  <Text style={styles.suggestionText}>{name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setPromoEnabled(!promoEnabled)}
          >
            <View style={[styles.checkbox, promoEnabled && styles.checkboxChecked]}>
              {promoEnabled && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={styles.checkboxLabel}>Promocja 2+1</Text>
          </TouchableOpacity>
          <View style={styles.formButtons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={() => {
                setShowForm(false);
                setShowSuggestions(false);
              }}
            >
              <Text style={styles.buttonTextSecondary}>Anuluj</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleAddClient}>
              <Text style={styles.buttonText}>Dodaj</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Dodaj klientkę</Text>
        </TouchableOpacity>
      )}

      {/* Clients List */}
      <View style={styles.clientsList}>
        {clients.length === 0 ? (
          <Text style={styles.emptyText}>Brak klientek. Zacznij dodawać!</Text>
        ) : (
          clients.map((client) => <ClientCard key={client.id} client={client} />)
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e3a8a',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    color: '#111',
  },
  suggestionsBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f8f9fb',
    maxHeight: 150,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 14,
    color: '#111',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1e3a8a',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#1e3a8a',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#111',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#1e3a8a',
  },
  buttonSecondary: {
    backgroundColor: '#f0f2f7',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  buttonTextSecondary: {
    color: '#111',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  clientsList: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default HomeScreen;