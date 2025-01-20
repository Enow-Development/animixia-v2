import React from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFavorites } from '../../../contexts/FavoriteContext';

const FavoriteTab = ({ navigation }) => {
  const { favorites, removeFromFavorites } = useFavorites();

  const handleRemove = async (animeId: string) => {
    await removeFromFavorites(animeId);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="heart-outline" size={48} color="#888888" />
      <Text style={styles.emptyTitle}>Belum ada Favorit</Text>
      <Text style={styles.emptyText}>
        Anime yang kamu tambahkan ke favorit akan muncul di sini
      </Text>
    </View>
  );

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
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemove(item.animeId)}
      >
        <Icon name="heart" size={24} color="#E91E63" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        renderItem={renderAnimeItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        getItemLayout={(data, index) => ({
          length: 174, // tinggi item (150 poster + 12 padding atas + 12 padding bawah)
          offset: 174 * index,
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
  listContent: {
    flexGrow: 1,
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
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#888888',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
    textAlign: 'center',
  },
  animeItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
  },
  animeInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'QuicksandSemiBold',
    marginBottom: 4,
  },
  episodeInfo: {
    color: '#888888',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
  },
});

export default FavoriteTab;
