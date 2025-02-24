import { StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';

const GetPlaces = ({ route, navigation }) => {
  const { location, category } = route.params;
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const url = `https://wafi.iit.cnr.it/openervm/api/getPlaces?location=${location}&category=${category}&limit=10`;
      const response = await fetch(url);
      const data = await response.json();
      setPlaces(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch places');
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.placeCard}
      onPress={() => navigation.navigate('SpecificPlace', { placeId: item.id })}
    >
      <Text style={styles.placeName}>{item.name}</Text>
      <Text style={styles.placeAddress}>{item.address}</Text>
      <View style={styles.placeDetails}>
        <Text style={styles.placeReviews}>Reviews: {item.numReviews}</Text>
        <Text style={styles.placePolarity}>Rating: {item.polarity}/10</Text>
      </View>
    </TouchableOpacity>
  );

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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{category.charAt(0).toUpperCase() + category.slice(1)}s in {location}</Text>
      <FlatList
        data={places}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default GetPlaces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  placeCard: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F26B24',
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F26B24',
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  placeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  placeReviews: {
    fontSize: 14,
    color: '#333',
  },
  placePolarity: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});