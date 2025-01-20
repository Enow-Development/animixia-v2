import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity, Image } from 'react-native';
import SearchBar from './components/SearchBar';
import Banner from './components/Banner';
import OngoingAnimeList from './components/OngoingAnimeList';
import AnimeSchedule from './components/AnimeSchedule';
import GenreList from './components/GenreList';
import CompletedAnimeList from './components/CompletedAnimeList';
import { fetchHomeData, fetchSchedule, fetchGenres, searchAnime } from '../../services/api';
import Header from './components/Header';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [homeData, setHomeData] = useState<any>(null);
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [genreData, setGenreData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [homeResponse, scheduleResponse, genreResponse] = await Promise.all([
        fetchHomeData(),
        fetchSchedule(),
        fetchGenres()
      ]);
      if (homeResponse.ok && scheduleResponse.ok && genreResponse.ok) {
        setHomeData(homeResponse.data);
        setScheduleData(scheduleResponse.data);
        setGenreData(genreResponse.data);
      } else {
        setError('Terjadi kesalahan');
      }
    } catch (error) {
      console.error(error);
      setError('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (keyword: string) => {
    setSearchKeyword(keyword);
    
    if (keyword.trim()) {
      setSearching(true);
      try {
        const response = await searchAnime(keyword.trim());
        if (response.ok) {
          setSearchResults(response.data.animeList.map((anime: any) => ({
            ...anime,
            title: anime.title,
            poster: anime.poster,
            score: anime.score,
            animeId: anime.animeId
          })));
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const renderSearchResults = () => (
    <View style={styles.searchResultsContainer}>
      {searching ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.searchResultItem}
              onPress={() => navigation.navigate('AnimeDetail', {
                animeId: item.animeId,
                title: item.title
              })}
            >
              <Image 
                source={{ uri: item.poster }} 
                style={styles.searchResultPoster}
                resizeMode="cover"
              />
              <View style={styles.searchResultInfo}>
                <Text style={styles.searchResultTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.score && (
                  <Text style={styles.searchResultScore}>
                    Score: {item.score}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.animeId}
        />
      ) : searchKeyword ? (
        <Text style={styles.noResultText}>
          Tidak ada hasil untuk "{searchKeyword}"
        </Text>
      ) : null}
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
        <TouchableOpacity style={styles.retryButton} onPress={loadData}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: { item: string }) => {
    if (searchKeyword && item !== 'search') {
      return null;
    }

    switch (item) {
      case 'header':
        return <Header />;
      case 'banner':
        return <Banner data={homeData?.ongoing?.animeList?.slice(0, 5)} navigation={navigation} />;
      case 'search':
        return (
          <>
            <SearchBar onSearch={handleSearch} />
            {searchKeyword && renderSearchResults()}
          </>
        );
      case 'ongoing':
        return <OngoingAnimeList data={homeData?.ongoing?.animeList} navigation={navigation} />;
      case 'schedule':
        return <AnimeSchedule data={scheduleData?.days} navigation={navigation} />;
      case 'genre':
        return <GenreList data={genreData?.genreList} navigation={navigation} />;
      case 'completed':
        return <CompletedAnimeList data={homeData?.completed?.animeList} navigation={navigation} />;
      default:
        return null;
    }
  };

  return (
    <FlatList
      style={styles.container}
      data={['header', 'banner', 'search', 'ongoing', 'schedule', 'genre', 'completed']}
      renderItem={renderItem}
      keyExtractor={(item) => item}
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
  searchResultsContainer: {
    padding: 16,
    flex: 1,
  },
  searchResultItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  searchResultPoster: {
    width: 80,
    height: 120,
    backgroundColor: '#2a2a2a',
  },
  searchResultInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  searchResultTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'QuicksandSemiBold',
    marginBottom: 4,
  },
  searchResultScore: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
  },
  noResultText: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'QuicksandMedium',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default HomeScreen; 