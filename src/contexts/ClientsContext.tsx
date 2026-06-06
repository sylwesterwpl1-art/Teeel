import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Client {
  id: string;
  name: string;
  items: number[];
  shipping: boolean;
  show: boolean;
  twoPlus: boolean;
}

export interface ClientsContextType {
  clients: Client[];
  addClient: (client: Client) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addItemToClient: (clientId: string, itemPrice: number) => Promise<void>;
  removeItemFromClient: (clientId: string, itemIndex: number) => Promise<void>;
  clearAllClients: () => Promise<void>;
  isLoading: boolean;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

const STORAGE_KEY = 'as_clients';

export function ClientsProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        setClients(JSON.parse(data));
      }
    } catch (error) {
      console.error('Błąd ładowania klientek:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveClients = async (newClients: Client[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newClients));
      setClients(newClients);
    } catch (error) {
      console.error('Błąd zapisywania klientek:', error);
    }
  };

  const addClient = async (client: Client) => {
    const newClients = [...clients, { ...client, id: Date.now().toString() }];
    await saveClients(newClients);
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    const newClients = clients.map((c) => (c.id === id ? { ...c, ...updates } : c));
    await saveClients(newClients);
  };

  const deleteClient = async (id: string) => {
    const newClients = clients.filter((c) => c.id !== id);
    await saveClients(newClients);
  };

  const addItemToClient = async (clientId: string, itemPrice: number) => {
    const newClients = clients.map((c) =>
      c.id === clientId ? { ...c, items: [...c.items, itemPrice] } : c
    );
    await saveClients(newClients);
  };

  const removeItemFromClient = async (clientId: string, itemIndex: number) => {
    const newClients = clients.map((c) =>
      c.id === clientId
        ? { ...c, items: c.items.filter((_, i) => i !== itemIndex) }
        : c
    );
    await saveClients(newClients);
  };

  const clearAllClients = async () => {
    await saveClients([]);
  };

  return (
    <ClientsContext.Provider
      value={{
        clients,
        addClient,
        updateClient,
        deleteClient,
        addItemToClient,
        removeItemFromClient,
        clearAllClients,
        isLoading,
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients musi być użyty w ClientsProvider');
  }
  return context;
}