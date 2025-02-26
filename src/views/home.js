import React, { useRef, useEffect } from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

const locations = [
  { id: '1', name: 'Barcelona', color: ['#FF6B6B', '#FF8E8E'], emoji: '🇪🇸' },
  { id: '2', name: 'Amsterdam', color: ['#4ECDC4', '#45B7AF'], emoji: '🇳🇱' },
  { id: '3', name: 'Berlin', color: ['#FFE66D', '#FFD93D'], emoji: '🇩🇪' },
  { id: '4', name: 'Dubai', color: ['#95E1D3', '#81C7BB'], emoji: '🇦🇪' },
  { id: '5', name: 'London', color: ['#F7D794', '#F5CD79'], emoji: '🇬🇧' },
  { id: '6', name: 'Paris', color: ['#786FA6', '#574B90'], emoji: '🇫🇷' },
  { id: '7', name: 'Rome', color: ['#F8A5C2', '#F78FB3'], emoji: '🇮🇹' },
  { id: '8', name: 'Tuscany', color: ['#63CDC5', '#5AB9B0'], emoji: '🇮🇹' },
];

const { width } = Dimensions.get('window');

const Home = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef(locations.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Animate header
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Animate items sequentially
    locations.forEach((_, index) => {
      Animated.timing(itemAnimations[index], {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const renderItem = ({ item, index }) => (
    <Animated.View style={[styles.cardContainer, { opacity: itemAnimations[index] }]}>
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Categories', { selectedLocation: item.name })}
        activeOpacity={0.92}
      >
        <LinearGradient
          colors={item.color}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={styles.locationText}>{item.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: fadeAnim }]}>
        <Text style={styles.subtitle}>Welcome to</Text>
        <Text style={styles.title}>Travel Guide</Text>
      </Animated.View>
      <FlatList
        data={locations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    color: "#64748B",
    fontWeight: "600",
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F172A",
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
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 32,
    marginRight: 16,
  },
  locationText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
});

export default Home;
