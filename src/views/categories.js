import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Categories = ({ route }) => {
  const { selectedLocation } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Selected Location: {selectedLocation}</Text>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F26B24',
  },
});