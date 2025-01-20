import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

type Props = {
  data?: Array<{
    title: string;
    poster: string;
    episodes: number;
    animeId: string;
  }>;
  navigation: any;
};

const CompletedAnimeList: React.FC<Props> = ({ data = [], navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Anime Selesai</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllAnime')}>
          <Text style={styles.viewAll}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.animeId}
        renderItem={({ item }) => (
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
              <Text style={styles.animeTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.episodeInfo}>
                {item.episodes} Episode
              </Text>
            </View>
          </TouchableOpacity>
        )}
        horizontal={false}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
      />
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
    fontFamily: 'Quicksand-Bold',
  },
  viewAll: {
    color: '#2196F3',
    fontSize: 14,
    fontFamily: 'Quicksand-Medium',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
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
    height: 150,
    backgroundColor: '#2a2a2a',
  },
  infoContainer: {
    padding: 8,
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'Quicksand-SemiBold',
    marginBottom: 4,
  },
  episodeInfo: {
    color: '#666666',
    fontSize: 12,
    fontFamily: 'Quicksand-Medium',
  },
});

export default CompletedAnimeList; 