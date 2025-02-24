import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";

/* Importar las vistas */
import Home from "./src/views/home";
import Categories from "./src/views/categories";
import About from "./src/views/about";
import MisFavs from "./src/views/misFavs";
import GetPlaces from "./src/views/getPlaces";
import SpecificPlace from "./src/views/specificPlace";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen 
        name="GetPlaces" 
        component={GetPlaces}
        options={({ route }) => ({ 
          title: `${route.params.category.charAt(0).toUpperCase() + route.params.category.slice(1)}s in ${route.params.location}`
        })}
      />
      <Stack.Screen 
        name="SpecificPlace" 
        component={SpecificPlace}
        options={{ title: 'Place Details' }}
      />
    </Stack.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeStack} />
        <Drawer.Screen name="MisFavs" component={MisFavs} />
        <Drawer.Screen name="About" component={About} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
