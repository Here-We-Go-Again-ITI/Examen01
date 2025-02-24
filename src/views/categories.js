import { StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';

const categories = [
  { id: '1', name: 'Accommodation', value: 'accommodation' },
  { id: '2', name: 'Attraction', value: 'attraction' },
  { id: '3', name: 'POI', value: 'poi' },
  { id: '4', name: 'Restaurant', value: 'restaurant' },
];

const Categories = ({ route, navigation }) => {
  const { selectedLocation } = route.params;

  const handleCategoryPress = (category) => {
    navigation.navigate('GetPlaces', {
      location: selectedLocation,
      category: category.value
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.div}
      onPress={() => handleCategoryPress(item)}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Categories in {selectedLocation}</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

export default Categories;

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
  div: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 70,
    backgroundColor: '#F26B24',
    marginTop: 20,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});