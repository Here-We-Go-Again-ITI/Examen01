import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, Linking, TouchableOpacity } from "react-native";
import { Card, Avatar } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from 'react-native-vector-icons/Ionicons';

const DevelopersList = () => {
  const developers = [
    {
      name: "Kevin Córdoba",
      photo: require("../assets/images/Kevin xd.jpg"),
      description:
        "Ansioso Desarrollador Full Stack necesitado de constante lavado de manos. Se caracteriza por su supervivencia a base de alcohol (el de echarse en las manos) y halls. 😎 ",
      gradientColors: ["#4facfe", "#00f2fe"],
      github: "https://github.com/Kevinndcr",
    },
    {
      name: "Susan Guzmán",
      photo: require("../assets/images/Susan xd.jpg"),
      description:
        "Especialista en ser impuntual, se baña no muy seguido pero es una gran persona. 💅",
      gradientColors: ["#fa709a", "#fee140"],
      github: "https://github.com/Suguzmanve",
    },
    {
      name: "Sebastián Pereza",
      photo: require("../assets/images/Sebas xd.jpg"),
      description:
        "Gymrat, experto en siembra de remolachas (TCU). Por lo general, se comporta como Golden Retriever. 💪🐀",
      gradientColors: ["#6a11cb", "#2575fc"],
      github: "https://github.com/Sebasprzd",
    },
    {
      name: "Génesis Vallejo",
      photo: require("../assets/images/Genesis xd.jpg"),
      description:
        "Bailarina dormila o también conocida como mini-toreta en moto. Su supervivencia se basa en comer y dormir mucho. ☝️🤓",
      gradientColors: ["#ff9a9e", "#fad0c4"],
    },
  ];

  const windowWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Universidad Técnica Nacional</Text>
          <View style={styles.divider} />
          <Text style={styles.subtitle}>Examen 01</Text>
        </View>
        
        <Text style={styles.teamTitle}>Equipo de Desarrollo</Text>

        {developers.map((developer, index) => (
          <Card key={index} style={[styles.card, { width: windowWidth * 0.9 }]}>
            <TouchableOpacity 
              onPress={() => developer.github && Linking.openURL(developer.github)}
              activeOpacity={developer.github ? 0.7 : 1}
            >
              <LinearGradient
                colors={developer.gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientHeader}
              />
              
              <Card.Content style={styles.cardContent}>
                <Avatar.Image 
                  size={80} 
                  source={developer.photo} 
                  style={styles.avatar}
                />
                <Text style={styles.name}>{developer.name}</Text>
                <Text style={styles.description}>{developer.description}</Text>
                {developer.github && (
                  <View style={styles.githubLink}>
                    <Ionicons name="logo-github" size={16} color="#333" />
                    <Text style={styles.githubText}>View GitHub Profile</Text>
                  </View>
                )}
              </Card.Content>
            </TouchableOpacity>
          </Card>
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Desarrollado con ❤️ - 2025</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#121212",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  headerContainer: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  divider: {
    height: 3,
    width: 60,
    backgroundColor: "#ff6b6b",
    marginVertical: 10,
    borderRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
  },
  teamTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 15,
    textAlign: "center",
  },
  card: {
    marginBottom: 25,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: "#fff",
  },
  gradientHeader: {
    height: 40,
  },
  avatar: {
    alignSelf: "center",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fff",
    marginTop: -25,
  },
  cardContent: {
    paddingVertical: 20,
    alignItems: "center",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    lineHeight: 22,
  },
  footer: {
    marginTop: 20,
    marginBottom: 30,
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 30,
  },
  footerText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
  },
  githubLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 20,
  },
  githubText: {
    marginLeft: 6,
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default DevelopersList;