import React, { useCallback, useMemo } from "react";
import { StyleSheet, Dimensions, View, FlatList, Image } from "react-native";

//shared elements
import { SharedElement } from "react-navigation-shared-element";

import { Pressable } from "react-native";

//dimensions
const { width } = Dimensions.get("screen");

const FeedScreen = (props) => {
  //----------------------------------------------------------------LOAD GALLERIES----------------------------------------------------------------

  const galleries = [
    {
      eventDate: "2021-08-14",
      galleryID: "255",
      galleryName: "Rob + Haib",
      thumbnail: "http://144.126.212.5/uploads/thumb/6117ee5d9b958.webp",
    },
    /* {
            eventDate: '2021-08-13',
            galleryID: '253',
            galleryName: 'Pizza',
            thumbnail: 'http://144.126.212.5/uploads/thumb/6116d40a2c814.webp',
        },
        {
            eventDate: '2021-08-13',
            galleryID: '252',
            galleryName: 'Test',
            thumbnail: 'http://144.126.212.5/uploads/thumb/6116d1481c387.webp',
        },
        {
            eventDate: '2021-08-13',
            galleryID: '251',
            galleryName: 'Test',
            thumbnail: 'http://144.126.212.5/uploads/thumb/6116ac47d21e9.webp',
        },
        {
            eventDate: '2021-08-12',
            galleryID: '248',
            galleryName: 'Robs Public Gallery',
            thumbnail: 'http://144.126.212.5/uploads/thumb/6115833f7dc6d.webp',
        },
        {
            eventDate: '2021-07-06',
            galleryID: '206',
            galleryName: 'Gggg',
            thumbnail: 'http://164.90.246.1/uploads/thumb/60e4d95a12181.webp',
        },
        {
            eventDate: '2021-07-01',
            galleryID: '203',
            galleryName: 'Art',
            thumbnail: 'http://164.90.246.1/uploads/thumb/60dd1584ab3b8.webp',
        },
        {
            eventDate: '2021-06-13',
            galleryID: '115',
            galleryName: 'Test',
            thumbnail: 'http://164.90.246.1/uploads/thumb/60c6483da80b2.jpeg',
        },
        {
            eventDate: '2021-06-12',
            galleryID: '106',
            galleryName: 'Hiking',
            thumbnail: 'http://164.90.246.1/uploads/thumb/60c53b30a1098.jpeg',
        },
        {
            eventDate: '2021-06-12',
            galleryID: '97',
            galleryName: 'Family',
            thumbnail: 'http://164.90.246.1/uploads/thumb/60c52e7319378.jpeg',
        }, */
  ];

  const FeedCell = (props) => {
    return (
      <Pressable onPress={props.galleryPressedHandler}>
        <SharedElement
          id={`${props.galleryData.galleryID}`}
          style={styles.sharedElement}
        >
          <Image
            style={styles.image}
            source={{
              uri: props.galleryData.thumbnail,
            }}
            resizeMode="cover"
          />
        </SharedElement>
      </Pressable>
    );
  };

  //----------------------------------------------------------------FLAT LIST FUNCTIONS--------------------------------------------------------------
  const render = useCallback(
    ({ item, index }) => {
      return (
        <FeedCell
          galleryData={item}
          galleryPressedHandler={() => {
            galleryPressedHandler(
              item.galleryID,
              item.thumbnail,
              item.galleryName,
              index
            );
          }}
          galleryName={item.galleryName}
          oneEllipsisPressed={() => {
            oneEllipsisPressed(item.galleryID, index);
          }}
          key={item.galleryID}
        />
      );
    },
    [galleries]
  );

  const galleryPressedHandler = useCallback(
    (galleryID, thumbnail, galName, index) => {
      props.navigation.navigate("OtherGalleryView", {
        galleryID,
        thumbnail,
        galName,
        index,
      });
    },
    []
  );

  const oneEllipsisPressed = useCallback((galleryID, index) => {}, []);

  const itemHeight = useMemo(() => width + 40, []);

  const layOut = useCallback(
    (data, index) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    []
  );

  const keyExtractor = useCallback((item) => `${item.galleryID}`, []);

  //----------------------------------------------------------------FLAT LIST FUNCTIONS--------------------------------------------------------------

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={styles.flatList}
        data={galleries}
        renderItem={render}
        layOut={layOut}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          paddingLeft: 20,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  sharedElement: {
    height: width * 0.9,
    width: width * 0.9,
    borderRadius: width * 0.9 * 0.05,
    backgroundColor: "white",
    marginTop: 10,
  },
  image: {
    height: width * 0.9 - 70 - 20,
    width: width * 0.9 - 20,
    borderRadius: width * 0.9 * 0.033,
    top: 10,
    left: 10,
    right: 10,
    borderColor: "white",
  },
});

export default FeedScreen;
