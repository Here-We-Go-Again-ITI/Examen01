import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MisFavs = ({ navigation }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites !== null) {
        setFavorites(JSON.parse(storedFavorites));
      } else {
        setFavorites([]);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites');
      Alert.alert('Error', 'Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const removeFavorite = async (id) => {
    try {
      const newFavorites = favorites.filter(fav => fav.id !== id);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
      Alert.alert('Success', 'Place removed from favorites');
    } catch (err) {
      console.error('Error removing favorite:', err);
      Alert.alert('Error', 'Failed to remove from favorites');
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const renderItem = ({ item }) => {
    const place = item.placeData;
    return (
      <TouchableOpacity
        style={styles.placeCard}
        onPress={() => navigation.navigate('SpecificPlace', { placeId: item.id })}
      >
        <View style={styles.placeInfo}>
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.placeAddress}>{place.address}</Text>
          <View style={styles.placeDetails}>
            <Text style={styles.placeCategory}>Category: {place.category}</Text>
            <Text style={styles.placeRating}>Rating: {place.polarity}/10</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            Alert.alert(
              'Remove Favorite',
              'Are you sure you want to remove this place from favorites?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Remove', 
                  onPress: () => removeFavorite(item.id), 
                  style: 'destructive' 
                }
              ]
            );
          }}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#F26B24" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadFavorites}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Favorite Places</Text>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No favorite places yet</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Explore Places</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  placeCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  placeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeCategory: {
    fontSize: 14,
    color: '#444',
  },
  placeRating: {
    fontSize: 14,
    color: '#F26B24',
  },
  removeButton: {
    backgroundColor: '#FF4444',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#F26B24',
    padding: 15,
    borderRadius: 10,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#F26B24',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MisFavs;