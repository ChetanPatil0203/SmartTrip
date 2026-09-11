import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function MobileShell({ children, style }) {
  return (
    <View style={[styles.shell, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
