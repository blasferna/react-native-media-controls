import React from "react";
import { TouchableOpacity, View, Text, Image, ViewStyle, StyleSheet } from "react-native";
import {Slider as RNSlider} from '@miblanchard/react-native-slider';
import styles from "./MediaControls.style";
import { humanizeVideoDuration } from "./utils";
import { Props as MediaControlsProps } from "./MediaControls";
import { PLAYER_STATES } from "./constants/playerStates";

export type CustomSliderStyle = {
  containerStyle: ViewStyle;
  trackStyle: ViewStyle;
  thumbStyle: ViewStyle;
};

type Props = Pick<
  MediaControlsProps,
  | "progress"
  | "duration"
  | "mainColor"
  | "onFullScreen"
  | "playerState"
  | "onSeek"
  | "onSeeking"
  | "trackClickable"
> & {
  onPause: () => void;
  customSliderStyle?: CustomSliderStyle;
};

const fullScreenImage = require("./assets/ic_fullscreen.png");

const Slider = (props: Props) => {
  const {
    customSliderStyle,
    duration,
    mainColor,
    onFullScreen,
    onPause,
    progress,
    trackClickable
  } = props;

  const containerStyle = customSliderStyle?.containerStyle || {};
  const customTrackStyle = customSliderStyle?.trackStyle || {};
  const customThumbStyle = customSliderStyle?.thumbStyle || {};

  const thumbStyle = {
    ...styles.thumb,
    customThumbStyle,
    borderColor: mainColor
  };

  const dragging = (value: any) => {
    const { onSeeking, playerState } = props;
    onSeeking(value);

    if (playerState === PLAYER_STATES.PAUSED) {
      return;
    }

    onPause();
  };

  const seekVideo = (value: any) => {
    props.onSeek(value);
    onPause();
  };

  return (
    <View
      style={[styles.controlsRow, styles.progressContainer, containerStyle]}
    >
      <View style={styles.progressColumnContainer}>
        <View style={[styles.timerLabelsContainer]}>
          <Text style={styles.timerLabel}>
            {humanizeVideoDuration(progress)}
          </Text>
          <Text style={styles.timerLabel}>
            {humanizeVideoDuration(duration)}
          </Text>
        </View>
        <RNSlider
          //style={[styles.progressSlider]}
          animateTransitions
          onValueChange={dragging}
          onSlidingComplete={seekVideo}
          maximumValue={Math.floor(duration)}
          value={Math.floor(progress)}
          trackStyle={[styles.track, customTrackStyle] as ViewStyle}
          thumbStyle={thumbStyle}
          minimumTrackTintColor={mainColor}
          trackClickable={trackClickable}
        />
      </View>
      {Boolean(onFullScreen) && (
        <TouchableOpacity
          style={styles.fullScreenContainer}
          onPress={onFullScreen}
        >
          <Image source={fullScreenImage} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export { Slider };
