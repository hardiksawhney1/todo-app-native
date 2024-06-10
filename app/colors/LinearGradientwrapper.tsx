import React, { ReactNode } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface LinearGradientProps {
  colors: string[];
  children: ReactNode;
}

const LinearGradientWrapper: React.FC<LinearGradientProps> = ({ colors, children }) => {
  return (
    <LinearGradient
      colors={colors}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LinearGradientWrapper;
