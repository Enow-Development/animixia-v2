import React, { useState, useCallback } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import debounce from 'lodash/debounce';

type Props = {
  onSearch: (keyword: string) => void;
};

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      onSearch(text);
    }, 500),
    [onSearch]
  );

  const handleChangeText = (text: string) => {
    setKeyword(text);
    debouncedSearch(text);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={24} color="#666666" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Cari anime..."
          placeholderTextColor="#666666"
          value={keyword}
          onChangeText={handleChangeText}
          returnKeyType="search"
        />
        {keyword.length > 0 && (
          <TouchableOpacity 
            onPress={() => {
              setKeyword('');
              onSearch('');
            }}
            style={styles.clearButton}
          >
            <Icon name="close" size={20} color="#666666" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'QuicksandMedium',
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
  },
});

export default SearchBar; 