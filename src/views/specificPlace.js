import React, { useEffect, useState, useRef } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Map of colors by category to maintain consistent styling
const categoryColors = {
  'accommodation': ['#FF6B6B', '#FF8E8E'],
  'attraction': ['#4ECDC4', '#45B7AF'],
  'restaurant': ['#FFE66D', '#FFD93D'],
  'poi': ['#95E1D3', '#81C7BB'],
  'default': ['#786FA6', '#574B90'],
};

const SpecificPlace = ({ route, navigation }) => {
  const { placeId } = route.params;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const reviewsAnim = useRef(new Animated.Value(0)).current;

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
        
        // Start animations when content is loaded
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          })
        ]).start();
        
        // Delay reviews animation
        setTimeout(() => {
          Animated.timing(reviewsAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 300);
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
  
  const getCategoryColors = (category) => {
    if (!category) return categoryColors.default;
    
    const normalizedCategory = category.toLowerCase();
    for (const [key, value] of Object.entries(categoryColors)) {
      if (normalizedCategory.includes(key)) {
        return value;
      }
    }
    
    return categoryColors.default;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#574B90" />
          <Text style={styles.loadingText}>Loading place details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !place) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={60} color="#FF6B6B" />
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
            <LinearGradient
              colors={['#786FA6', '#574B90']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const placeColors = getCategoryColors(place.category);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.headerSection, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={placeColors}
            style={styles.headerGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.headerTitleRow}>
              <View style={styles.headerTitleContent}>
                <Text style={styles.categoryBadge}>{place.category}</Text>
                <Text style={styles.placeName}>{place.name}</Text>
              </View>
              <TouchableOpacity 
                style={styles.favoriteButton} 
                onPress={toggleFavorite}
              >
                <MaterialIcons
                  name={isFavorite ? 'favorite' : 'favorite-border'}
                  size={28}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View 
          style={[
            styles.cardContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="location-on" size={22} color={placeColors[0]} />
              <Text style={styles.infoText}>{place.address}</Text>
            </View>
            
            {place.phone_number && (
              <View style={styles.infoRow}>
                <MaterialIcons name="phone" size={22} color={placeColors[0]} />
                <Text style={styles.infoText}>{place.international_phone_number}</Text>
              </View>
            )}

            {place.website && (
              <TouchableOpacity 
                style={styles.infoRow}
                onPress={() => Linking.openURL(place.website)}
              >
                <MaterialIcons name="language" size={22} color={placeColors[0]} />
                <Text style={[styles.infoText, styles.link]}>Visit Website</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        <Animated.View 
          style={[
            styles.cardContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.socialCard}>
            <Text style={styles.sectionTitle}>Connect</Text>
            <View style={styles.socialButtons}>
              {place.external_urls?.Facebook && (
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => Linking.openURL(place.external_urls.Facebook)}
                >
                  <LinearGradient
                    colors={['#3B5998', '#2D4373']}
                    style={styles.socialGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="facebook" size={20} color="#FFFFFF" />
                    <Text style={styles.socialButtonText}>Facebook</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {place.external_urls?.Foursquare && (
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => Linking.openURL(place.external_urls.Foursquare)}
                >
                  <LinearGradient
                    colors={['#F94877', '#D4145A']}
                    style={styles.socialGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="place" size={20} color="#FFFFFF" />
                    <Text style={styles.socialButtonText}>Foursquare</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {place.external_urls?.GooglePlaces && (
                <TouchableOpacity 
                  style={styles.socialButton}
                  onPress={() => Linking.openURL(place.external_urls.GooglePlaces)}
                >
                  <LinearGradient
                    colors={['#4285F4', '#34A853']}
                    style={styles.socialGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="map" size={20} color="#FFFFFF" />
                    <Text style={styles.socialButtonText}>Google</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>

        {place.statistics?.Foursquare && (
          <Animated.View 
            style={[
              styles.cardContainer, 
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.statsCard}>
              <Text style={styles.sectionTitle}>Statistics</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={placeColors}
                    style={styles.statCircle}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="person" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.statNumber}>{place.statistics.Foursquare.usersCount || 0}</Text>
                  <Text style={styles.statLabel}>Visitors</Text>
                </View>
                
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={placeColors}
                    style={styles.statCircle}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="check-circle" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.statNumber}>{place.statistics.Foursquare.checkinsCount || 0}</Text>
                  <Text style={styles.statLabel}>Check-ins</Text>
                </View>
                
                <View style={styles.statItem}>
                  <LinearGradient
                    colors={placeColors}
                    style={styles.statCircle}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialIcons name="favorite" size={24} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.statNumber}>{place.statistics.Foursquare.likes || 0}</Text>
                  <Text style={styles.statLabel}>Likes</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {!loadingReviews && reviews.length > 0 && (
          <Animated.View style={{ opacity: reviewsAnim }}>
            <View style={styles.reviewsSection}>
              <Text style={styles.reviewsHeader}>
                Reviews ({reviews.length})
              </Text>
              {reviews.map((review, index) => (
                <View key={index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewMeta}>
                      <MaterialIcons name="comment" size={16} color="#64748B" />
                      <Text style={styles.reviewSource}>{review.source}</Text>
                      <Text style={styles.reviewLanguage}>
                        {getLanguageEmoji(review.language)}
                      </Text>
                    </View>
                    <View style={[
                      styles.reviewRating,
                      { backgroundColor: review.polarity >= 5 ? '#E6F9F1' : '#FEE4E2' }
                    ]}>
                      <MaterialIcons 
                        name={review.polarity >= 5 ? "thumb-up" : "thumb-down"} 
                        size={14} 
                        color={review.polarity >= 5 ? "#10B981" : "#F43F5E"} 
                      />
                      <Text style={[
                        styles.reviewPolarity,
                        { color: review.polarity >= 5 ? "#10B981" : "#F43F5E" }
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
          </Animated.View>
        )}

        {place.external_urls?.Booking && (
          <Animated.View 
            style={[
              styles.bookingButtonContainer, 
              { opacity: fadeAnim }
            ]}
          >
            <TouchableOpacity 
              onPress={() => Linking.openURL(place.external_urls.Booking)}
            >
              <LinearGradient
                colors={['#003580', '#00224F']}
                style={styles.bookingGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialIcons name="bed" size={22} color="#FFFFFF" />
                <Text style={styles.bookingButtonText}>Book on Booking.com</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748B',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 20,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gradientButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSection: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  headerGradient: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitleContent: {
    flex: 1,
    marginRight: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    alignSelf: 'flex-start',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  placeName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#334155',
    marginLeft: 12,
    flex: 1,
  },
  link: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  socialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  socialButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  socialButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 4,
  },
  socialGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  reviewsSection: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  reviewsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewSource: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginHorizontal: 6,
  },
  reviewLanguage: {
    fontSize: 14,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  reviewPolarity: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviewText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    marginBottom: 10,
  },
  reviewDate: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
  },
  bookingButtonContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  bookingGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  bottomPadding: {
    height: 28,
  }
});

export default SpecificPlace;