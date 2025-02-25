import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SpecificPlace = ({ route, navigation }) => {
  const { placeId } = route.params;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        setLoading(true);
        await fetchPlaceDetails();
        await checkIfFavorite();
      } catch (err) {
        console.error('Setup error:', err);
        Alert.alert('Error', 'Failed to initialize. Please try again.');
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    setup();
  }, []);

  const checkIfFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);
        setIsFavorite(favorites.some(fav => fav.id === placeId));
      }
    } catch (err) {
      console.error('Error checking favorites:', err);
    }
  };

  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];
      
      if (isFavorite) {
        favorites = favorites.filter(fav => fav.id !== placeId);
        Alert.alert('Success', 'Removed from favorites');
      } else {
        favorites.push({
          id: placeId,
          placeData: {
            name: place.name,
            address: place.address,
            category: place.category,
            polarity: place.polarity || 'N/A'
          }
        });
        Alert.alert('Success', 'Added to favorites');
      }
      
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  const fetchPlaceDetails = async () => {
    try {
      const response = await fetch(`http://tour-pedia.org/api/getPlaceDetails?id=${placeId}`);
      const data = await response.json();
      setPlace(data);
      fetchReviews(placeId);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch place details');
      throw err;
    }
  };

  const fetchReviews = async (placeId) => {
    try {
      const response = await fetch(`http://tour-pedia.org/api/getReviewsByPlaceId?placeId=${placeId}`);
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const getLanguageEmoji = (lang) => {
    const flags = {
      'en': '🇬🇧',
      'es': '🇪🇸',
      'ca': '🏴',
      'fr': '🇫🇷',
      'it': '🇮🇹',
      'de': '🇩🇪',
      'lt': '🇱🇹',
    };
    return flags[lang] || '🌐';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#F26B24" />
      </SafeAreaView>
    );
  }

  if (error || !place) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error || 'Failed to load place details'}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={async () => {
            setLoading(true);
            setError(null);
            try {
              await fetchPlaceDetails();
            } catch (err) {
              setError(err.message);
            } finally {
              setLoading(false);
            }
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          {place.icon && (
            <Image 
              source={{ uri: place.icon }} 
              style={styles.placeIcon}
              resizeMode="contain"
            />
          )}
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.category}>{place.category}</Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={30}
              color="#F26B24"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={24} color="#F26B24" />
            <Text style={styles.infoText}>{place.address}</Text>
          </View>
          
          {place.phone_number && (
            <View style={styles.infoRow}>
              <MaterialIcons name="phone" size={24} color="#F26B24" />
              <Text style={styles.infoText}>{place.international_phone_number}</Text>
            </View>
          )}

          {place.website && (
            <TouchableOpacity 
              style={styles.infoRow}
              onPress={() => Linking.openURL(place.website)}
            >
              <MaterialIcons name="language" size={24} color="#F26B24" />
              <Text style={[styles.infoText, styles.link]}>Visit Website</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.socialSection}>
          {place.external_urls?.Facebook && (
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => Linking.openURL(place.external_urls.Facebook)}
            >
              <MaterialIcons name="facebook" size={24} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          )}

          {place.external_urls?.Foursquare && (
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => Linking.openURL(place.external_urls.Foursquare)}
            >
              <MaterialIcons name="place" size={24} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Foursquare</Text>
            </TouchableOpacity>
          )}

          {place.external_urls?.GooglePlaces && (
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => Linking.openURL(place.external_urls.GooglePlaces)}
            >
              <MaterialIcons name="map" size={24} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          )}
        </View>

        {place.statistics?.Foursquare && (
          <View style={styles.statsSection}>
            <Text style={styles.statsHeader}>Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{place.statistics.Foursquare.checkinsCount || 0}</Text>
                <Text style={styles.statLabel}>Check-ins</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{place.statistics.Foursquare.usersCount || 0}</Text>
                <Text style={styles.statLabel}>Users</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{place.statistics.Foursquare.likes || 0}</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>
          </View>
        )}

        {!loadingReviews && reviews.length > 0 && (
          <View style={styles.reviewsSection}>
            <Text style={styles.reviewsHeader}>
              Reviews ({reviews.length})
            </Text>
            {reviews.map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewMeta}>
                    <Text style={styles.reviewSource}>{review.source}</Text>
                    <Text style={styles.reviewLanguage}>
                      {getLanguageEmoji(review.language)}
                    </Text>
                  </View>
                  <View style={styles.reviewRating}>
                    <MaterialIcons 
                      name={review.polarity >= 5 ? "thumb-up" : "thumb-down"} 
                      size={18} 
                      color={review.polarity >= 5 ? "#4CAF50" : "#F44336"} 
                    />
                    <Text style={[
                      styles.reviewPolarity,
                      { color: review.polarity >= 5 ? "#4CAF50" : "#F44336" }
                    ]}>
                      {review.polarity}/10
                    </Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.time).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {place.external_urls?.Booking && (
          <TouchableOpacity 
            style={styles.bookingButton}
            onPress={() => Linking.openURL(place.external_urls.Booking)}
          >
            <Text style={styles.bookingButtonText}>Book on Booking.com</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 10,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  placeIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  placeName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    flex: 1,
  },
  category: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
    marginTop: 5,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 10,
    padding: 15,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    flex: 1,
  },
  link: {
    color: '#F26B24',
    textDecorationLine: 'underline',
  },
  socialSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    margin: 10,
    gap: 10,
  },
  socialButton: {
    backgroundColor: '#F26B24',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    minWidth: 100,
    justifyContent: 'center',
    marginVertical: 5,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  statsSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 10,
    padding: 15,
    elevation: 3,
  },
  statsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F26B24',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  reviewsSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 10,
    padding: 15,
    elevation: 3,
  },
  reviewsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  reviewCard: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewSource: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginRight: 8,
  },
  reviewLanguage: {
    fontSize: 16,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewPolarity: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  reviewText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  bookingButton: {
    backgroundColor: '#003580',
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  retryButton: {
    backgroundColor: '#F26B24',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default SpecificPlace;