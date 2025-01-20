import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Image, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { getAnimeDetail } from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFavorites } from '../../contexts/FavoriteContext';

const { width } = Dimensions.get('window');

const AnimeDetail = ({ route, navigation }) => {
  const { animeId } = route.params;
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAscending, setIsAscending] = useState(true);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  useEffect(() => {
    loadAnimeDetail();
  }, []);

  const loadAnimeDetail = async () => {
    try {
      setLoading(true);
      const response = await getAnimeDetail(animeId);
      if (response.ok) {
        setAnime(response.data);
      } else {
        setError('Gagal memuat detail anime');
      }
    } catch (error) {
      setError('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const sortedEpisodes = React.useMemo(() => {
    if (!anime?.episodeList) return [];
    return [...anime.episodeList].sort((a, b) => {
      return isAscending ? 
        Number(a.title) - Number(b.title) : 
        Number(b.title) - Number(a.title);
    });
  }, [anime?.episodeList, isAscending]);

  const handleFavoritePress = async () => {
    if (isFavorite(anime.animeId)) {
      await removeFromFavorites(anime.animeId);
    } else {
      await addToFavorites(anime);
    }
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
        <TouchableOpacity style={styles.retryButton} onPress={loadAnimeDetail}>
          <Text style={styles.retryText}>Coba Lagi</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header dengan Poster dan Info Utama */}
      <View style={styles.header}>
        <Image 
          source={{ uri: anime.poster }} 
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.title}>{anime.title}</Text>
          {anime.japanese && (
            <Text style={styles.japaneseTitle}>{anime.japanese}</Text>
          )}
          {anime.score && (
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>⭐ {anime.score}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status</Text>
          <Text style={styles.infoValue}>{anime.status}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Episode</Text>
          <Text style={styles.infoValue}>{anime.episodes} Episode</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Durasi</Text>
          <Text style={styles.infoValue}>{anime.duration}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Studio</Text>
          <Text style={styles.infoValue}>{anime.studios}</Text>
        </View>

        {/* Genre List */}
        <View style={styles.genreContainer}>
          {anime.genreList?.map((genre: any) => (
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

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.watchButton]}
            onPress={() => navigation.navigate('WatchAnime', { 
              episodeId: sortedEpisodes[0]?.episodeId,
              title: `Episode ${sortedEpisodes[0]?.title}`
            })}
          >
            <Icon name="play-circle" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Tonton Sekarang</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.favoriteButton]}
            onPress={handleFavoritePress}
          >
            <Icon 
              name={isFavorite(anime.animeId) ? "heart" : "heart-outline"} 
              size={20} 
              color="#ffffff" 
            />
            <Text style={styles.actionButtonText}>
              {isFavorite(anime.animeId) ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Synopsis */}
      {anime.synopsis?.paragraphs?.length > 0 && (
        <View style={styles.synopsisContainer}>
          <Text style={styles.sectionTitle}>Sinopsis</Text>
          {anime.synopsis.paragraphs.map((paragraph: string, index: number) => (
            <Text key={index} style={styles.synopsisText}>
              {paragraph}
            </Text>
          ))}
        </View>
      )}

      {/* Episode List Section */}
      {anime.episodeList?.length > 0 && (
        <View style={styles.episodeSection}>
          <View style={styles.episodeHeader}>
            <Text style={styles.sectionTitle}>Episode List</Text>
            <View style={styles.episodeActions}>
              <TouchableOpacity 
                style={styles.sortButton}
                onPress={() => setIsAscending(!isAscending)}
              >
                <Icon 
                  name={isAscending ? 'sort-numeric-ascending' : 'sort-numeric-descending'} 
                  size={24} 
                  color="#2196F3" 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.downloadAllButton}>
                <Icon name="download-multiple" size={20} color="#ffffff" />
                <Text style={styles.downloadAllText}>Download All</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.episodeList}>
            {sortedEpisodes.map((episode) => (
              <View key={episode.episodeId} style={styles.episodeItem}>
                <Text style={styles.episodeNumber}>Episode {episode.title}</Text>
                <View style={styles.episodeButtons}>
                  <TouchableOpacity 
                    style={[styles.episodeButton, styles.playButton]}
                    onPress={() => navigation.navigate('WatchAnime', { 
                      episodeId: episode.episodeId,
                      title: `Episode ${episode.title}`
                    })}
                  >
                    <Icon name="play" size={16} color="#ffffff" />
                    <Text style={styles.buttonText}>Play</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.episodeButton, styles.downloadButton]}
                  >
                    <Icon name="download" size={16} color="#ffffff" />
                    <Text style={styles.buttonText}>Download</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
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
  header: {
    height: width * 0.8,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'QuicksandBold',
    marginBottom: 4,
  },
  japaneseTitle: {
    color: '#cccccc',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    color: '#FFD700',
    fontSize: 16,
    fontFamily: 'QuicksandBold',
  },
  infoSection: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  infoLabel: {
    color: '#888888',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandSemiBold',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    gap: 8,
  },
  genreTag: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  genreText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
  synopsisContainer: {
    marginTop: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontFamily: 'QuicksandBold',
    marginBottom: 8,
  },
  synopsisText: {
    color: '#cccccc',
    fontSize: 14,
    fontFamily: 'QuicksandRegular',
    lineHeight: 20,
    marginBottom: 12,
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
  episodeSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  episodeActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sortButton: {
    padding: 4,
  },
  downloadAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  downloadAllText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
  episodeList: {
    gap: 8,
  },
  episodeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 8,
  },
  episodeNumber: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandSemiBold',
  },
  episodeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  episodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  downloadButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2a2a2a',
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  watchButton: {
    backgroundColor: '#4CAF50',
  },
  favoriteButton: {
    backgroundColor: '#E91E63',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandSemiBold',
  },
});

export default AnimeDetail;