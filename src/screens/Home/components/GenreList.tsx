import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

type Props = {
  data?: Array<{
    title: string;
    genreId: string;
  }>;
  navigation: any;
};

const GenreList: React.FC<Props> = ({ data = [], navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Genre</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((genre) => (
          <TouchableOpacity 
            key={genre.genreId}
            style={styles.genreCard}
            onPress={() => navigation.navigate('GenreAnime', {
              genreId: genre.genreId,
              title: genre.title
            })}
          >
            <Text style={styles.genreTitle}>{genre.title}</Text>
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
  scrollContent: {
    paddingHorizontal: 12,
  },
  genreCard: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  genreTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
  },
});

export default GenreList; 