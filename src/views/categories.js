import { StyleSheet, Text, SafeAreaView, FlatList, TouchableOpacity, View, Dimensions, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const categories = [
  { id: '1', name: 'Accommodation', value: 'accommodation', color: ['#4F46E5', '#7C3AED'], icon: '🏨' },
  { id: '2', name: 'Attraction', value: 'attraction', color: ['#059669', '#10B981'], icon: '🎡' },
  { id: '3', name: 'POI', value: 'poi', color: ['#EA580C', '#F97316'], icon: '📍' },
  { id: '4', name: 'Restaurant', value: 'restaurant', color: ['#BE185D', '#DB2777'], icon: '🍽️' },
];

const Categories = ({ route, navigation }) => {
  const { selectedLocation } = route.params;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef(categories.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Animate header
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Animate items sequentially
    categories.forEach((_, index) => {
      Animated.timing(itemAnimations[index], {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleCategoryPress = (category) => {
    navigation.navigate('GetPlaces', {
      location: selectedLocation,
      category: category.value,
    });
  };

  const renderItem = ({ item, index }) => (
    <Animated.View style={[styles.cardContainer, { opacity: itemAnimations[index] }]}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.92}
      >
        <LinearGradient
          colors={item.color}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.categoryIcon}>{item.icon}</Text>
          <Text style={styles.categoryText}>{item.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <Text style={styles.subtitle}>Explore</Text>
        <Text style={styles.title}>{selectedLocation}</Text>
      </Animated.View>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default Categories;

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
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  categoryText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});