import React, { ReactNode } from 'react';
import { TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, View } from 'react-native';

export default function StaticKeyboardView({ children }: { children: ReactNode }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // 헤더가 있으면 그 높이로 보정
      >
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {children}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
