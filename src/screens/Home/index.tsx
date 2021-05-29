import React, { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { SearchBar } from '../../components/SearchBar';
import { LoginDataItem } from '../../components/LoginDataItem';

import {
  Container,
  LoginList,
  EmptyListContainer,
  EmptyListMessage,
} from './styles';
import { Alert } from 'react-native';
import { useStorageData } from '../../hooks/useStorageData';

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
}

type LoginListDataProps = LoginDataProps[];

export function Home() {
  const { getLogins } = useStorageData();

  const [searchListData, setSearchListData] = useState<LoginListDataProps>([]);
  const [data, setData] = useState<LoginListDataProps>([]);

  async function loadData() {
    // Get asyncStorage data, use setSearchListData and setData
    try {
      const loadedLogins = await getLogins();
      if (loadedLogins) {
        setData(loadedLogins);
        setSearchListData(loadedLogins);
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Não foi possível carregar os logins');
    }
  }
  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  function handleFilterLoginData(search: string) {
    // Filter results inside data, save with setSearchListData
    const updatedSearchListData = data.filter((current) =>
      current.title.includes(search)
    );

    setSearchListData(updatedSearchListData || []);
  }

  return (
    <Container>
      <SearchBar
        autoCapitalize='none'
        placeholder='Pesquise pelo nome do serviço'
        onChangeText={(value) => handleFilterLoginData(value)}
      />

      <LoginList
        keyExtractor={(item) => item.id}
        data={searchListData}
        ListEmptyComponent={
          <EmptyListContainer>
            <EmptyListMessage>Nenhum item a ser mostrado</EmptyListMessage>
          </EmptyListContainer>
        }
        renderItem={({ item: loginData }) => {
          return (
            <LoginDataItem
              title={loginData.title}
              email={loginData.email}
              password={loginData.password}
            />
          );
        }}
      />
    </Container>
  );
}
