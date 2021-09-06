import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Image,
  FlatList,
  Pressable,
} from "react-native";
//shared elements
import { SharedElement } from "react-navigation-shared-element";

//safe area
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const OtherGalleryView = ({ route, navigation }) => {
  const { galleryID, thumbnail, galName, index } = route.params;

  //insets
  const insets = useSafeAreaInsets();

  let tabBarBottomPosition = insets.bottom > 0 ? insets.bottom / 2 + 2 : 10;

  if (tabBarBottomPosition === 10 && Platform.OS === "android") {
    tabBarBottomPosition = 55;
  }

  const picturePressedHandler = useCallback(
    (scrollIndex, picID, fullPathNav) => {},
    []
  );

  //----------------------------------------------------------------LOAD PICS--------------------------------------------------------
  const pics = [
    {
      id: "226",
      galleryID: "255",
      userID: "123",
      fullPath: "http://144.126.212.5/uploads/thumb/6117ee5d9b958.webp",
      thumbPath: "http://144.126.212.5/uploads/thumb/6117ee5d9b958.webp",
      ownerIsMe: "true",
    },
    /* {
            id: '226',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60cccb5ee6d77.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60cccb5ee6d77.webp',
            ownerIsMe: 'true',
        },
        {
            id: '235',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd2e3ceb4b.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd2e3ceb4b.webp',
            ownerIsMe: 'true',
        },
        {
            id: '236',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd5da0ca7d.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd5da0ca7d.webp',
            ownerIsMe: 'true',
        },
        {
            id: '239',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd782e25d2.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd782e25d2.webp',
            ownerIsMe: 'true',
        },
        {
            id: '240',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd78a42082.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd78a42082.webp',
            ownerIsMe: 'true',
        },
        {
            id: '242',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd92c63edc.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd92c63edc.webp',
            ownerIsMe: 'true',
        },
        {
            id: '245',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccd98bd7cf4.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccd98bd7cf4.webp',
            ownerIsMe: 'true',
        },
        {
            id: '248',
            galleryID: '189',
            userID: '123',
            fullPath: 'http://164.90.246.1/uploads/60ccda58d66f6.jpeg',
            thumbPath: 'http://164.90.246.1/uploads/thumb/60ccda58d66f6.webp',
            ownerIsMe: 'true',
        }, */
  ];
  const ThumbnailSmall = ({ images }) => {
    return (
      <Pressable onPress={picturePressedHandler} style={styles.cont}>
        <SharedElement id={images.galleryID}>
          <Image
            style={styles.image}
            source={{
              uri: images.thumbPath,
            }}
            resizeMode="cover"
          />
        </SharedElement>
      </Pressable>
    );
  };
  //----------------------------------------------------------------LOAD PICS--------------------------------------------------------
  const keyExtractor = useCallback((item) => item.id, []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: width / 2,
      offset: (width / 2) * index,
      index: index,
    }),
    []
  );

  const renderItem = useCallback(({ item, index }) => {
    return <ThumbnailSmall key={item.id} images={item} />;
  }, []);
  //----------------------------------------------------------------FLAT LIST OPTIMIZATION--------------------------------------------------------

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      {/* <SharedElement id={`${galleryID}`} style={styles.sharedElement}>
        <Image
          style={styles.imageBg}
          source={{
            uri: thumbnail,
          }}
          resizeMode="cover"
        />
        </SharedElement> */}
      <FlatList
        data={pics}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        style={styles.flatList}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        contentContainerStyle={{
          paddingBottom: tabBarBottomPosition + 60,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sharedElement: {
    position: "absolute",
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    height: height,
    width: width,
  },
  imageBg: {
    flex: 1,
    opacity: 0,
    height: height,
    width: width,
  },
  flatList: {
    flex: 1,
  },
  cont: {
    borderRadius: 8,
    overflow: "hidden",
    width: width / 3,
    height: width / 2,
    borderColor: "white",
    overflow: "hidden",
  },
  image: {
    width: width / 3,
    height: width / 2,
    borderWidth: 1,
    borderColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default OtherGalleryView;
