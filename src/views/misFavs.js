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
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';

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

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'restaurant':
        return 'restaurant-outline';
      case 'cafe':
        return 'cafe-outline';
      case 'bar':
        return 'wine-outline';
      case 'hotel':
        return 'bed-outline';
      case 'park':
        return 'leaf-outline';
      case 'museum':
        return 'easel-outline';
      default:
        return 'location-outline';
    }
  };

  // Get color based on rating
  const getRatingColor = (rating) => {
    if (rating >= 8) return ['#00b09b', '#96c93d']; // High rating
    if (rating >= 6) return ['#FFA500', '#FFC04D']; // Medium rating
    return ['#FF512F', '#F09819']; // Low rating
  };

  const renderItem = ({ item }) => {
    const place = item.placeData;
    return (
      <View style={styles.placeCard}>
        <View style={styles.categoryIconContainer}>
          <Ionicons name={getCategoryIcon(place.category)} size={28} color="#fff" />
        </View>
        
        <TouchableOpacity
          style={styles.placeInfo}
          onPress={() => navigation.navigate('SpecificPlace', { placeId: place.place_id })}
        >
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.placeAddress}>{place.address}</Text>
          
          <View style={styles.placeDetails}>
            <View style={styles.categoryContainer}>
              <Text style={styles.placeCategory}>{place.category}</Text>
            </View>
            
            <LinearGradient
              colors={getRatingColor(place.polarity)}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.ratingContainer}
            >
              <Text style={styles.placeRating}>{place.polarity}/10</Text>
              <Ionicons name="star" size={14} color="#fff" style={styles.starIcon} />
            </LinearGradient>
          </View>
        </TouchableOpacity>
        
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
          <Ionicons name="heart-dislike" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
        <Text style={styles.loadingText}>Loading your favorites...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF6F61" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadFavorites}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6C63FF', '#4834DF']}
        style={styles.header}
      >
        <Text style={styles.title}>My Favorite Places</Text>
      </LinearGradient>
      
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#6C63FF" />
          <Text style={styles.emptyText}>No favorite places yet</Text>
          <Text style={styles.emptySubText}>Start exploring and add some places to your favorites!</Text>
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
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  categoryIconContainer: {
    backgroundColor: '#6C63FF',
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  placeInfo: {
    flex: 1,
    padding: 15,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  placeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  categoryContainer: {
    backgroundColor: '#EDF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  placeCategory: {
    fontSize: 12,
    color: '#4834DF',
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  placeRating: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginRight: 3,
  },
  starIcon: {
    marginLeft: 2,
  },
  removeButton: {
    backgroundColor: '#FF6F61',
    padding: 14,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6F61',
    textAlign: 'center',
    marginVertical: 10,
  },
  retryButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  exploreButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MisFavs;