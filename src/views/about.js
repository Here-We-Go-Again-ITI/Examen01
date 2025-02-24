import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { List, Avatar, Card } from "react-native-paper";

const DevelopersList = () => {
  const developers = [
    {
      name: "Kevin Córdoba",
      photo: require("../assets/images/Kevin xd.jpg"),
      description:
        "Ansioso Desarrollador Full Stack necesitado de constante lavado de manos. Se caracteriza por su supervivencia a base de alcohol (el de echarse en las manos) y halls. 😎 ",
    },
    {
      name: "Susan Guzmán",
      photo: require("../assets/images/Susan xd.jpg"),
      description:
        "Especialista en ser impuntual, se baña no muy seguido pero es una gran persona. 💅",
    },
    {
      name: "Sebastián Pereza",
      photo: require("../assets/images/Sebas xd.jpg"),
      description:
        "Gymrat, experto en siembra de remolachas (TCU). Por lo general, se comporta como Golden Retriever. 💪🐀",
    },
    {
      name: "Génesis Vallejo",
      photo: require("../assets/images/Genesis xd.jpg"),
      description:
        "Bailarina dormila o también conocida como mini-toreta en moto. Su supervivencia se basa en comer y dormir mucho. ☝️🤓",
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Universidad Técnica Nacional</Text>
      <Text style={styles.subtitle}>Examen 01</Text>

      {developers.map((developer, index) => (
        <Card key={index} style={styles.card}>
          <Card.Title
            title={developer.name}
            titleStyle={styles.name} // Adjusting the title style here
            left={() => <Avatar.Image size={50} source={developer.photo} />}
          />
          <Card.Content>
            <Text style={styles.description}>{developer.description}</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "normal",
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    elevation: 5,
  },

  name: {
    fontSize: 22, // Making the name a bit larger
    fontWeight: "bold",
  },
  description: {
    fontSize: 16, // Making the description larger
    color: "#555",
    marginTop: 10,
  },
});

export default DevelopersList;
