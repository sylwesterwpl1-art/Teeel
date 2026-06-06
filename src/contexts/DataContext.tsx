import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DataContextType {
  savedNames: string[];
  addName: (name: string) => Promise<void>;
  removeName: (name: string) => Promise<void>;
  clearNames: () => Promise<void>;
  liveStartedAt: string;
  setLiveStartedAt: (date: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const NAMES_KEY = 'as_savedNames';
const STARTED_KEY = 'started';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [savedNames, setSavedNames] = useState<string[]>([]);
  const [liveStartedAt, setLiveStartedAtState] = useState<string>(new Date().toISOString());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const namesData = await AsyncStorage.getItem(NAMES_KEY);
      const startedData = await AsyncStorage.getItem(STARTED_KEY);

      if (namesData) {
        setSavedNames(JSON.parse(namesData));
      }
      if (startedData) {
        setLiveStartedAtState(startedData);
      }
    } catch (error) {
      console.error('Błąd ładowania danych:', error);
    }
  };

  const addName = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || savedNames.includes(trimmed)) return;

    const newNames = [...savedNames, trimmed];
    setSavedNames(newNames);
    await AsyncStorage.setItem(NAMES_KEY, JSON.stringify(newNames));
  };

  const removeName = async (name: string) => {
    const newNames = savedNames.filter((n) => n !== name);
    setSavedNames(newNames);
    await AsyncStorage.setItem(NAMES_KEY, JSON.stringify(newNames));
  };

  const clearNames = async () => {
    setSavedNames([]);
    await AsyncStorage.removeItem(NAMES_KEY);
  };

  const setLiveStartedAt = async (date: string) => {
    setLiveStartedAtState(date);
    await AsyncStorage.setItem(STARTED_KEY, date);
  };

  return (
    <DataContext.Provider
      value={{
        savedNames,
        addName,
        removeName,
        clearNames,
        liveStartedAt,
        setLiveStartedAt,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData musi być użyty w DataProvider');
  }
  return context;
}