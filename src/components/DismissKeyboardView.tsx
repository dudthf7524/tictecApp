import React, { ReactNode } from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  [key: string]: any;
}

const DismissKeyboardView = ({ children, style, ...props }: Props) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <KeyboardAwareScrollView
      style={{ flex: 1 }} // 전체 배경 채우기 (외부 스타일 무시 방지)
      contentContainerStyle={[style, { flexGrow: 1 }]} // 정렬/배경용 style 적용
      keyboardShouldPersistTaps="handled"
      {...props}
    >
      {children}
    </KeyboardAwareScrollView>
  </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
