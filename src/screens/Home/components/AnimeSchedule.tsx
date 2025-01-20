import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

// Sesuaikan dengan format dari API
const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

type Props = {
  data?: Array<{
    day: string;
    animeList: Array<{
      title: string;
      animeId: string;
    }>;
  }>;
  navigation: any;
};

const AnimeSchedule: React.FC<Props> = ({ data = [], navigation }) => {
  const currentDay = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const selectedDayData = data.find(
    schedule => schedule.day === DAYS[selectedDay]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jadwal Rilis</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {DAYS.map((day, index) => (
          <TouchableOpacity 
            key={day}
            style={[
              styles.dayCard,
              selectedDay === index && styles.activeDayCard
            ]}
            onPress={() => setSelectedDay(index)}
          >
            <Text 
              style={[
                styles.dayText,
                selectedDay === index && styles.activeDayText
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.animeList}>
        {selectedDayData?.animeList.map((anime) => (
          <TouchableOpacity 
            key={anime.animeId} 
            style={styles.animeItem}
            onPress={() => navigation.navigate('AnimeDetail', {
              animeId: anime.animeId,
              title: anime.title
            })}
          >
            <Text style={styles.animeTitle} numberOfLines={1}>
              {anime.title}
            </Text>
          </TouchableOpacity>
        ))}
        {(!selectedDayData?.animeList.length) && (
          <Text style={styles.noAnimeText}>
            Tidak ada anime yang rilis hari ini
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'QuicksandBold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  dayCard: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeDayCard: {
    backgroundColor: '#2196F3',
  },
  dayText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
  },
  activeDayText: {
    color: '#ffffff',
  },
  animeList: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  animeItem: {
    backgroundColor: '#1a1a1a',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  animeTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'QuicksandSemiBold',
    marginBottom: 4,
  },
  noAnimeText: {
    color: '#666666',
    fontSize: 14,
    fontFamily: 'QuicksandMedium',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default AnimeSchedule; 