import React, { useState, useCallback } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { searchAnime } from '../../services/api';

type Props = {
  route: {
    params: {
      keyword: string;
    };
  };
  navigation: any;
};

const SearchResult: React.FC<Props> = ({ route, navigation }) => {
  const { keyword } = route.params;
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    searchAnime(keyword)
      .then(response => {
        if (response.ok) {
          setResults(response.data.animeList || []);
        } else {
          setError('Gagal mencari anime');
        }
      })
      .catch(() => {
        setError('Terjadi kesalahan');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [keyword]);

  const renderAnimeItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.animeItem}
      onPress={() => navigation.navigate('AnimeDetail', { 
        animeId: item.animeId,
        title: item.title 
      })}
    >
      <Image 
        source={{ uri: item.poster }} 
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.animeInfo}>
        <Text style={styles.animeTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.episodeInfo}>
          {item.episodes} Episode
        </Text>
        {item.score && (
          <Text style={styles.scoreText}>⭐ {item.score}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>Tidak ada hasil</Text>
      <Text style={styles.emptyText}>
        Coba cari dengan kata kunci lain
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.searchInfo}>
        Hasil pencarian untuk "{keyword}"
      </Text>
      <FlatList
        data={results}
        renderItem={renderAnimeItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        getItemLayout={(data, index) => ({
          length: 280,
          offset: 280 * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInfo: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'QuicksandSemiBold',
    padding: 16,
  },
  listContent: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  animeItem: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 200,
    backgroundColor: '#2a2a2a',
  },
  animeInfo: {
    padding: 12,
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandSemiBold',
    marginBottom: 4,
  },
  episodeInfo: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
    marginBottom: 4,
  },
  scoreText: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'QuicksandBold',
    marginBottom: 8,
  },
  emptyText: {
    color: '#888888',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontFamily: 'QuicksandMedium',
  },
});

export default SearchResult; 