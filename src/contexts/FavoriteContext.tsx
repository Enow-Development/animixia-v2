import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoriteContextType = {
  favorites: any[];
  addToFavorites: (anime: any) => Promise<void>;
  removeFromFavorites: (animeId: string) => Promise<void>;
  isFavorite: (animeId: string) => boolean;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    // Load favorites from storage when app starts
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const addToFavorites = async (anime: any) => {
    try {
      const newFavorites = [...favorites, {
        animeId: anime.animeId,
        title: anime.title,
        poster: anime.poster,
        episodes: anime.episodes,
        score: anime.score,
        addedAt: new Date().toISOString()
      }];
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (animeId: string) => {
    try {
      const newFavorites = favorites.filter(item => item.animeId !== animeId);
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const isFavorite = (animeId: string) => {
    return favorites.some(item => item.animeId === animeId);
  };

  return (
    <FavoriteContext.Provider value={{ 
      favorites, 
      addToFavorites, 
      removeFromFavorites,
      isFavorite 
    }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}; 