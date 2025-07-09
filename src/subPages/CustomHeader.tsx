import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Menu, Button, Provider } from 'react-native-paper';

const CustomHeader = ({ title }: { title: string }) => {
  const [visible, setVisible] = useState(false);
  const [selectedLang, setSelectedLang] = useState('🌐');

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const onSelectLanguage = (lang: string) => {
    setSelectedLang(lang === 'ko' ? '🇰🇷' : '🇺🇸');
    closeMenu();
    // TODO: i18n.changeLanguage(lang);
  };

  return (
    <Provider>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button onPress={openMenu} compact>{selectedLang}</Button>
          }
        >
          <Menu.Item onPress={() => onSelectLanguage('ko')} title="🇰🇷 한국어" />
          <Menu.Item onPress={() => onSelectLanguage('en')} title="🇺🇸 English" />
        </Menu>
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
