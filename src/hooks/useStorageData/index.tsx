import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext } from 'react';

interface StorageDataContextData {
  getLogins(): Promise<LoginDataProps[] | null>;
  setLogin(data: SetLoginData): void;
}

interface StorageDataProviderProps {
  children: ReactNode;
}

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
}

type SetLoginData = {
  newLoginData: LoginDataProps;
};

const StorageDataContext = createContext<StorageDataContextData>(
  {} as StorageDataContextData
);

export const StorageDataProvider = ({ children }: StorageDataProviderProps) => {
  const storageKey = '@passmanager:logins';

  async function getLogins(): Promise<LoginDataProps[] | null> {
    try {
      const response = await AsyncStorage.getItem(storageKey);

      return response ? JSON.parse(response) : null;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  async function setLogin({ newLoginData }: SetLoginData): Promise<void> {
    const loadedData = await getLogins();

    // Save data on AsyncStorage
    if (loadedData) {
      const updatedData = [...loadedData, newLoginData];

      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
    } else {
      await AsyncStorage.setItem(storageKey, JSON.stringify([newLoginData]));
    }
  }

  return (
    <StorageDataContext.Provider value={{ getLogins, setLogin }}>
      {children}
    </StorageDataContext.Provider>
  );
};

export function useStorageData() {
  const context = useContext(StorageDataContext);
  if (!context) {
    throw new Error(
      'useStorageData must be used within an StorageDataProvider'
    );
  }
  return context;
}
