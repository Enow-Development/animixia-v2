import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { fetchAllAnime } from '../../services/api';

type Props = {
  navigation: any;
};

const AllAnime: React.FC<Props> = ({ navigation }) => {
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

      console.log('Loading page:', pageNum);

      const response = await fetchAllAnime(pageNum);
      if (response.ok) {
        const pagination = response.pagination;
        console.log('Pagination info:', pagination);

        const newData = response.data.animeList?.map((anime: any, index: number) => ({
          animeId: anime.animeId,
          title: anime.title.replace(/\([^)]*\)/g, '').trim(),
          poster: anime.poster,
          episodes: anime.episodes,
          score: anime.score,
          key: `${anime.animeId}-${pageNum}-${index}`
        })) || [];
        
        setAnimeList(prev => append ? [...prev, ...newData] : newData);
        setHasNextPage(pagination?.hasNextPage || false);
        setPage(pagination?.currentPage || pageNum);

        console.log('Current page:', pagination?.currentPage);
        console.log('Has next page:', pagination?.hasNextPage);
        console.log('Total pages:', pagination?.totalPages);
      } else {
        setError('Gagal memuat daftar anime');
      }
    } catch (error) {
      setError('Terjadi kesalahan');
      console.error('Error loading anime list:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadAnimeList(1, false);
  }, [loadAnimeList]);

  const handleLoadMore = useCallback(() => {
    console.log('handleLoadMore called');
    console.log('loadingMore:', loadingMore);
    console.log('hasNextPage:', hasNextPage);
    console.log('current page:', page);

    if (!loadingMore && hasNextPage) {
      console.log('Loading next page:', page + 1);
      loadAnimeList(page + 1, true);
    }
  }, [loadingMore, hasNextPage, page, loadAnimeList]);

  const renderAnimeItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.animeCard}
      onPress={() => navigation.navigate('AnimeDetail', { 
        animeId: item.animeId,
        title: item.title 
      })}
    >
      <Image 
        source={{ 
          uri: item.poster || 'https://via.placeholder.com/200x300?text=No+Image'
        }} 
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.metaContainer}>
          {item.episodes && (
            <Text style={styles.episodeInfo}>
              {item.episodes} Episode
            </Text>
          )}
          {item.score && (
            <Text style={styles.scoreText}>
              ⭐ {item.score}
            </Text>
          )}
        </View>
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
      keyExtractor={(item) => item.key}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
      initialNumToRender={10}
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
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  poster: {
    width: '100%',
    height: 250,
    backgroundColor: '#2a2a2a',
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandSemiBold',
    marginBottom: 4,
    lineHeight: 20,
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
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  episodeInfo: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
  scoreText: {
    color: '#FFD700',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
});

export default AllAnime; 