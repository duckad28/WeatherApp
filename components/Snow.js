import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Snowing from "./Snowing";

const fullDimensions = Dimensions.get("window");

export default function Snow({
  rainCount = 100,
  fallSpeed = "medium",
  fullScreen = false,
}) {
  const [scene, setScene] = React.useState(() => {
    if (fullScreen) {
      return fullDimensions;
    }

    return null;
  });

  const dimensionsStyle = fullScreen
    ? fullDimensions
    : styles.stretchDimensions;

  const onLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }) => {
    if (!fullScreen) {
      setScene({ width, height });
    }
  };

  return (
    <View style={[styles.container, dimensionsStyle]} onLayout={onLayout}>
      {!!scene &&
        new Array(rainCount)
          .fill(true)
          .map((_, i) => <Snowing key={i} scene={scene} fallSpeed={fallSpeed} />)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
  },
  stretchDimensions: {
    width: "100%",
    height: "100%",
  },
});