import React from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ProgressBarAndroid 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const DownloadTab = ({ navigation }) => {
  // TODO: Implement download state management
  const downloads = [];

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="download" size={48} color="#888888" />
      <Text style={styles.emptyTitle}>Belum ada Unduhan</Text>
      <Text style={styles.emptyText}>
        Episode yang kamu unduh akan muncul di sini
      </Text>
    </View>
  );

  const renderDownloadItem = ({ item }) => (
    <View style={styles.downloadItem}>
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
        {item.status === 'downloading' && (
          <View style={styles.progressContainer}>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              progress={item.progress}
              color="#2196F3"
            />
            <Text style={styles.progressText}>
              {Math.round(item.progress * 100)}%
            </Text>
          </View>
        )}
        {item.status === 'completed' && (
          <Text style={styles.completedText}>
            {item.size}
          </Text>
        )}
      </View>
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => {/* TODO: Implement download actions */}}
      >
        <Icon 
          name={item.status === 'downloading' ? 'pause' : 'play'} 
          size={24} 
          color="#2196F3" 
        />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => {/* TODO: Implement remove download */}}
      >
        <Icon name="delete" size={24} color="#E91E63" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={downloads}
        renderItem={renderDownloadItem}
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
  downloadItem: {
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
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    color: '#888888',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
  completedText: {
    color: '#4CAF50',
    fontSize: 12,
    fontFamily: 'QuicksandMedium',
  },
  actionButton: {
    padding: 8,
    justifyContent: 'center',
  },
  removeButton: {
    padding: 8,
    justifyContent: 'center',
  },
});

export default DownloadTab;