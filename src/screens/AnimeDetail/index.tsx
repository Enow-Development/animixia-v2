import React, { useEffect, useCallback, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAnimeDetail } from '../../services/api';

type AnimeDetailProps = {
  route: {
    params: {
      animeId: string;
    };
  };
  navigation: any;
};

const AnimeDetail: React.FC<AnimeDetailProps> = ({ route, navigation }) => {
  const { animeId } = route.params;
  const [animeData, setAnimeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnimeDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAnimeDetail(animeId);
      if (response.ok) {
        setAnimeData(response.data);
      } else {
        setError('Gagal memuat detail anime');
      }
    } catch (error) {
      setError('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, [animeId]);

  useEffect(() => {
    loadAnimeDetail();
  }, [loadAnimeDetail]);

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
        <TouchableOpacity style={styles.retryButton} onPress={loadAnimeDetail}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: animeData?.poster }} 
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{animeData?.title}</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Status:</Text>
          <Text style={styles.infoText}>{animeData?.status}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Score:</Text>
          <Text style={styles.infoText}>{animeData?.score}</Text>
        </View>

        <View style={styles.genreContainer}>
          {animeData?.genreList?.map((genre: any) => (
            <TouchableOpacity 
              key={genre.genreId}
              style={styles.genreTag}
              onPress={() => navigation.navigate('GenreAnime', { 
                genreId: genre.genreId,
                title: genre.title 
              })}
            >
              <Text style={styles.genreText}>{genre.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.episodeList}>
          <Text style={styles.sectionTitle}>Episode List</Text>
          {animeData?.episodeList?.map((episode: any) => (
            <TouchableOpacity 
              key={episode.episodeId}
              style={styles.episodeItem}
              onPress={() => navigation.navigate('WatchAnime', { 
                episodeId: episode.episodeId,
                title: `Episode ${episode.title}`
              })}
            >
              <Text style={styles.episodeText}>Episode {episode.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
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
  poster: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'QuicksandBold',
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
    width: 80,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
    flex: 1,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginBottom: 24,
  },
  genreTag: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'QuicksandBold',
    marginBottom: 16,
  },
  episodeList: {
    marginTop: 24,
  },
  episodeItem: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  episodeText: {
    color: '#ffffff',
    fontSize: 14,
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
});

export default AnimeDetail; 