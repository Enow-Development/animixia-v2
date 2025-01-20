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

const HistoryTab = ({ navigation }) => {
  // TODO: Implement history state management
  const history = [];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="history" size={48} color="#888888" />
      <Text style={styles.emptyTitle}>Belum ada Riwayat</Text>
      <Text style={styles.emptyText}>
        Anime yang kamu tonton akan muncul di sini
      </Text>
    </View>
  );

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => navigation.navigate('WatchAnime', {
        episodeId: item.episodeId,
        title: `Episode ${item.episodeNumber}`
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
          Episode {item.episodeNumber}
        </Text>
        <Text style={styles.timestamp}>
          {item.lastWatched}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => {/* TODO: Implement remove from history */}}
      >
        <Icon name="close" size={24} color="#888888" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {history.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => {/* TODO: Implement clear history */}}
        >
          <Icon name="delete-sweep" size={20} color="#ffffff" />
          <Text style={styles.clearButtonText}>Hapus Riwayat</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={history}
        renderItem={renderHistoryItem}
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 8,
    backgroundColor: '#E91E63',
    margin: 16,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandSemiBold',
  },
  historyItem: {
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
    color: '#2196F3',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
    marginBottom: 4,
  },
  timestamp: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
  },
});

export default HistoryTab;
