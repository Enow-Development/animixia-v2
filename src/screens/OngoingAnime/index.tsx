import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { fetchOngoingAnime } from '../../services/api';

type Props = {
  navigation: any;
};

const OngoingAnime: React.FC<Props> = ({ navigation }) => {
  const [animeList, setAnimeList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnimeList = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const response = await fetchOngoingAnime(pageNum);
      if (response.ok) {
        const newData = response.data.animeList;
        setAnimeList(prev => append ? [...prev, ...newData] : newData);
        setHasNextPage(response.data.pagination?.hasNextPage || false);
        setPage(pageNum);
      } else {
        setError('Gagal memuat daftar anime');
      }
    } catch (error) {
      setError('Terjadi kesalahan');
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadAnimeList();
  }, [loadAnimeList]);

  const handleLoadMore = () => {
    if (!loadingMore && hasNextPage) {
      loadAnimeList(page + 1, true);
    }
  };

  const renderAnimeItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.animeCard}
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
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.episodeInfo}>
          Episode {item.episodes} • {item.releaseDay}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color="#2196F3" />
      </View>
    );
  };

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
        <TouchableOpacity style={styles.retryButton} onPress={() => loadAnimeList()}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={animeList}
      renderItem={renderAnimeItem}
      keyExtractor={(item) => item.animeId}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
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
  columnWrapper: {
    justifyContent: 'space-between',
    padding: 8,
  },
  animeCard: {
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
  infoContainer: {
    padding: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandSemiBold',
    marginBottom: 4,
  },
  episodeInfo: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontFamily: 'QuicksandMedium',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
  },
  loadingMore: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});

export default OngoingAnime; 