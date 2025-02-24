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
} from 'react-native';
import { initDatabase, addToFavorites, removeFromFavorites, isInFavorites } from '../database/db';

const SpecificPlace = ({ route, navigation }) => {
  const { placeId } = route.params;
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        setLoading(true);
        await initDatabase();
        setDbInitialized(true);
        await fetchPlaceDetails();
        const favoriteStatus = await isInFavorites(placeId);
        setIsFavorite(favoriteStatus);
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

  const fetchPlaceDetails = async () => {
    try {
      const response = await fetch(`http://tour-pedia.org/api/getPlaceDetails?id=${placeId}`);
      const data = await response.json();
      setPlace(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch place details');
      throw err;
    }
  };

  const toggleFavorite = async () => {
    if (!dbInitialized) {
      Alert.alert('Error', 'Database not initialized. Please try again.');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(placeId);
        setIsFavorite(false);
        Alert.alert('Success', 'Removed from favorites');
      } else {
        await addToFavorites(placeId, place);
        setIsFavorite(true);
        Alert.alert('Success', 'Added to favorites');
      }
    } catch (err) {
      console.error('Toggle favorite error:', err);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
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
              const favoriteStatus = await isInFavorites(placeId);
              setIsFavorite(favoriteStatus);
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
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.name}>{place.name}</Text>
        <Text style={styles.address}>{place.address}</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          {place.phone_number && (
            <Text style={styles.info}>Phone: {place.phone_number}</Text>
          )}
          {place.website && (
            <TouchableOpacity onPress={() => Linking.openURL(place.website)}>
              <Text style={styles.link}>Website</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Details</Text>
          <Text style={styles.info}>Category: {place.category}</Text>
          <Text style={styles.info}>Location: {place.location}</Text>
          <Text style={styles.info}>Rating: {place.polarity}/10</Text>
          <Text style={styles.info}>Number of Reviews: {place.numReviews}</Text>
        </View>

        {place.external_urls?.Booking?.en && (
          <TouchableOpacity 
            style={styles.bookingButton}
            onPress={() => Linking.openURL(place.external_urls.Booking.en)}
          >
            <Text style={styles.bookingButtonText}>Book on Booking.com</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
          onPress={toggleFavorite}
        >
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F26B24',
    marginBottom: 10,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginBottom: 5,
  },
  link: {
    fontSize: 16,
    color: '#F26B24',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  bookingButton: {
    backgroundColor: '#003580',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteButton: {
    backgroundColor: '#F26B24',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#333',
  },
  favoriteButtonText: {
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