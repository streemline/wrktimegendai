import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslations } from '../../contexts/TranslationContext';
import { SupportedLanguage } from '../../contexts/TranslationContext';

export default function SettingsScreen() {
  const { user, logout, updateProfile } = useAuth();
  const { t, currentLanguage, changeLanguage, availableLanguages } = useTranslations();
  const [autoBreak, setAutoBreak] = useState(user?.auto_break || false);

  const handleLogout = () => {
    Alert.alert(
      t('settings.logoutTitle'),
      t('settings.logoutConfirm'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel'
        },
        {
          text: t('common.yes'),
          onPress: () => logout()
        }
      ]
    );
  };

  const toggleAutoBreak = async () => {
    if (!user?.id) return;
    
    const newValue = !autoBreak;
    setAutoBreak(newValue);
    
    try {
      await updateProfile(user.id, { auto_break: newValue });
    } catch (error) {
      console.error('Failed to update auto break setting:', error);
      // Revert UI state if update fails
      setAutoBreak(!newValue);
    }
  };

  const renderLanguageItem = (lang: { code: SupportedLanguage; name: string }) => {
    const isSelected = currentLanguage === lang.code;
    
    return (
      <TouchableOpacity
        key={lang.code}
        style={[styles.languageItem, isSelected && styles.selectedLanguage]}
        onPress={() => changeLanguage(lang.code)}
      >
        <ThemedText type={isSelected ? 'defaultSemiBold' : 'default'}>
          {lang.name}
        </ThemedText>
        {isSelected && (
          <IconSymbol name="checkmark" size={18} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">{t('settings.title')}</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {user && (
          <View style={styles.profileSection}>
            <View style={styles.profileImagePlaceholder}>
              <ThemedText type="title" style={styles.profileInitials}>
                {user.full_name.split(' ').map(name => name[0]).join('')}
              </ThemedText>
            </View>
            <ThemedText type="defaultSemiBold" style={styles.userName}>
              {user.full_name}
            </ThemedText>
            <ThemedText style={styles.userPosition}>
              {user.position}
            </ThemedText>
          </View>
        )}
        
        <View style={styles.settingSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('settings.preferences')}
          </ThemedText>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <IconSymbol name="timer" size={20} color="#666" />
              <ThemedText>{t('settings.autoBreak')}</ThemedText>
            </View>
            <Switch
              value={autoBreak}
              onValueChange={toggleAutoBreak}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={autoBreak ? "#007AFF" : "#f4f3f4"}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <IconSymbol name="hourglass" size={20} color="#666" />
              <ThemedText>{t('settings.workHoursPerDay')}</ThemedText>
            </View>
            <ThemedText>{user?.work_hours_per_day || 8}</ThemedText>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <IconSymbol name="timer" size={20} color="#666" />
              <ThemedText>{t('settings.breakMinutes')}</ThemedText>
            </View>
            <ThemedText>{user?.break_minutes || 30}</ThemedText>
          </View>
        </View>
        
        <View style={styles.settingSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('settings.language')}
          </ThemedText>
          
          <View style={styles.languagesList}>
            {availableLanguages.map(renderLanguageItem)}
          </View>
        </View>
        
        <View style={styles.settingSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            {t('settings.account')}
          </ThemedText>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.buttonItem]}
            onPress={() => {
              // TODO: Implement edit profile
            }}
          >
            <View style={styles.settingLabel}>
              <IconSymbol name="person.fill" size={20} color="#007AFF" />
              <ThemedText style={{ color: "#007AFF" }}>
                {t('settings.editProfile')}
              </ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={16} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.settingItem, styles.buttonItem]}
            onPress={handleLogout}
          >
            <View style={styles.settingLabel}>
              <IconSymbol name="arrow.right.circle" size={20} color="#FF3B30" />
              <ThemedText style={{ color: "#FF3B30" }}>
                {t('settings.logout')}
              </ThemedText>
            </View>
          </TouchableOpacity>
        </View>
        
        <View style={styles.versionInfo}>
          <ThemedText style={styles.versionText}>
            TimeTrackPro v1.0.0
          </ThemedText>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitials: {
    color: '#FFFFFF',
    fontSize: 28,
  },
  userName: {
    fontSize: 18,
    marginBottom: 4,
  },
  userPosition: {
    color: '#666',
  },
  settingSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  sectionTitle: {
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  settingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonItem: {
    borderRadius: 8,
  },
  languagesList: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    overflow: 'hidden',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  selectedLanguage: {
    backgroundColor: '#E5F1FF',
  },
  versionInfo: {
    alignItems: 'center',
    padding: 24,
  },
  versionText: {
    color: '#999',
    fontSize: 14,
  },
});