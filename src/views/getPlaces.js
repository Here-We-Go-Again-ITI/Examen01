import { StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity, View, ActivityIndicator, Animated } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const GetPlaces = ({ route, navigation }) => {
  const { location, category } = route.params;
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef([]).current;

  useEffect(() => {
    fetchPlaces();
    // Animate header
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const fetchPlaces = async () => {
    try {
      const url = `https://wafi.iit.cnr.it/openervm/api/getPlaces?location=${location}&category=${category}&limit=10`;
      const response = await fetch(url);
      const data = await response.json();
      setPlaces(data);
      // Initialize animations for new items
      itemAnimations.length = 0;
      data.forEach(() => {
        itemAnimations.push(new Animated.Value(0));
      });
      // Animate items sequentially
      data.forEach((_, index) => {
        Animated.timing(itemAnimations[index], {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }).start();
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch places');
      setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => (
    <Animated.View style={[styles.cardContainer, { opacity: itemAnimations[index] }]}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('SpecificPlace', { placeId: item.id })}
        activeOpacity={0.92}
      >
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.cardContent}>
            <View style={styles.headerRow}>
              <Text style={styles.placeName}>{item.name}</Text>
              <View style={styles.ratingContainer}>
                <MaterialIcons name="star" size={20} color="#FFD700" />
                <Text style={styles.ratingText}>{item.polarity}/10</Text>
              </View>
            </View>
            <Text style={styles.placeAddress}>{item.address}</Text>
            <View style={styles.placeDetails}>
              <View style={styles.detailItem}>
                <MaterialIcons name="rate-review" size={16} color="#E5E7EB" />
                <Text style={styles.detailText}>Reviews: {item.numReviews}</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#E5E7EB" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <Text style={styles.subtitle}>{category.charAt(0).toUpperCase() + category.slice(1)}s</Text>
        <Text style={styles.title}>{location}</Text>
      </Animated.View>
      <FlatList
        data={places}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default GetPlaces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  gradient: {
    minHeight: 140,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '600',
  },
  placeAddress: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 12,
  },
  placeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    color: '#E5E7EB',
    marginLeft: 4,
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});