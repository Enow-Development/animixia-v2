import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

type AnimeItem = {
  title: string;
  poster: string;
  episodes: number;
  releaseDay: string;
  latestReleaseDate: string;
  animeId: string;
};

type Props = {
  data?: AnimeItem[];
  navigation: any;
};

const OngoingAnimeList: React.FC<Props> = ({ data = [], navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sedang Tayang</Text>
        <TouchableOpacity onPress={() => navigation.navigate('OngoingAnime')}>
          <Text style={styles.viewAll}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((anime) => (
          <TouchableOpacity 
            key={anime.animeId} 
            style={styles.animeCard}
            onPress={() => navigation.navigate('AnimeDetail', {
              animeId: anime.animeId,
              title: anime.title
            })}
          >
            <Image 
              source={{ uri: anime.poster }} 
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.infoContainer}>
              <Text style={styles.animeTitle} numberOfLines={2}>
                {anime.title}
              </Text>
              <Text style={styles.episodeInfo}>
                Episode {anime.episodes} • {anime.releaseDay}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'QuicksandBold',
  },
  viewAll: {
    color: '#2196F3',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  animeCard: {
    width: 140,
    marginHorizontal: 4,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 190,
    backgroundColor: '#2a2a2a',
  },
  infoContainer: {
    padding: 8,
  },
  animeTitle: {
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
});

export default OngoingAnimeList; 