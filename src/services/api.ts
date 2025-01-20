const BASE_URL = 'https://apis.enowdev.site/otakudesu';

export const fetchHomeData = async () => {
  try {
    const response = await fetch(`${BASE_URL}/home`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching home data:', error);
    throw error;
  }
};

export const fetchSchedule = async () => {
  try {
    const response = await fetch(`${BASE_URL}/schedule`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genres`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const searchAnime = async (keyword: string) => {
  try {
    const response = await fetch(`${BASE_URL}/search?q=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching anime:', error);
    throw error;
  }
};

export const getAnimeDetail = async (animeId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/anime/${animeId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching anime detail:', error);
    throw error;
  }
};

export const getAnimeByGenre = async (genreId: string, page: number = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/genres/${genreId}?page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching anime by genre:', error);
    throw error;
  }
};

export const fetchAllAnime = async (page: number = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/completed?page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching all anime:', error);
    throw error;
  }
};

export const fetchOngoingAnime = async (page: number = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/ongoing?page=${page}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ongoing anime:', error);
    throw error;
  }
}; 