import React from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const locations = [
  { id: '1', name: 'Barcelona' },
  { id: '2', name: 'Amsterdam' },
  { id: '3', name: 'Berlin' },
  { id: '4', name: 'Dubay' },
  { id: '5', name: 'London' },
  { id: '6', name: 'Paris' },
  { id: '7', name: 'Rome' },
  { id: '8', name: 'Tuscany' },
];

const Home = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.div}
      onPress={() => navigation.navigate('Categories', { selectedLocation: item.name })}
    >
      <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Locations</Text>
      <FlatList
        data={locations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    width: "100%",
    height: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  div: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 70,
    backgroundColor: "#F26B24",
    color: "#fff",
    marginTop: 20,
    borderRadius: 10,
  },
});

export default Home;
