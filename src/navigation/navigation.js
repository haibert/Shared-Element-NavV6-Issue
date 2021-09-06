import React, { useMemo } from "react";
import { Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";

import FeedScreen from "../screens/FeedScreen";
import OtherGalleryView from "../screens/OtherGalleryView";

//----------------------------------------------------------------TRANSITION SPEC----------------------------------------------------------------
const iosTransitionSpec = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 1000,
    mass: Platform.OS === "android" ? 3 : 1.9,
    overshootClamping: true,
    restDisplacementThreshold: 10,
    restSpeedThreshold: 10,
  },
};
//----------------------------------------------------------------TRANSITION SPEC----------------------------------------------------------------

//----------------------------------------------------------------CHANGING NAV OPTIONS----------------------------------------------------------------
const cardStyleInterpolatorFunc = ({ current }) => {
  return {
    cardStyle: {
      opacity: current.progress,
    },
  };
};
//----------------------------------------------------------------CHANGING NAV OPTIONS----------------------------------------------------------------

const FeedSEStack = createSharedElementStackNavigator();
const FeedSharedElementStack = () => {
  const platformAnimation = useMemo(
    () => (Platform.OS === "android" ? "fade-out" : "move"),
    []
  );

  return (
    <FeedSEStack.Navigator
      initialRouteName="DashboardScreen"
      screenOptions={{
        transitionSpec: {
          open: iosTransitionSpec,
          close: iosTransitionSpec,
        },
      }}
      // detachInactiveScreens={false}
    >
      <FeedSEStack.Screen
        name="DashboardScreen"
        component={FeedScreen}
        options={{
          animationEnabled: false,
        }}
      />
      <FeedSEStack.Screen
        name="OtherGalleryView"
        component={OtherGalleryView}
        options={() => ({
          cardStyleInterpolator: cardStyleInterpolatorFunc,
          // presentation: "transparentModal",
          transitionSpec: {
            open: iosTransitionSpec,
            close: iosTransitionSpec,
          },
        })}
        sharedElements={(route) => {
          const { galleryID } = route.params;
          return [
            {
              id: galleryID,
              // animation: platformAnimation,
              // resize: "auto",
              // align: "auto",
            },
          ];
        }}
      />
    </FeedSEStack.Navigator>
  );
};

const MainStack = createStackNavigator();
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <MainStack.Navigator initialRouteName="DrawerNav">
        <MainStack.Screen
          name="DrawerNav"
          component={FeedSharedElementStack}
          options={{
            headerShown: false,
            // animationEnabled: false,
          }}
        />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
