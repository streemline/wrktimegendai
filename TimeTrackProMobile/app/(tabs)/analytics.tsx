import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslations } from '../../contexts/TranslationContext';
import { TimeEntry } from '../../database/schema';
import { database } from '../../database/db';
import { formatMinutesToHours } from '../../utils/timeFormatters';

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const { t } = useTranslations();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState({
    totalMinutes: 0,
    averageMood: 0,
    averageEnergy: 0,
    daysWorked: 0
  });

  useEffect(() => {
    loadData();
  }, [user, selectedMonth, selectedYear]);

  const loadData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const entries = await database.getTimeEntriesByUserAndMonth(
        user.id, 
        selectedYear, 
        selectedMonth
      );
      setTimeEntries(entries);
      
      // Calculate statistics
      if (entries.length > 0) {
        const normalDays = entries.filter(entry => entry.startTime !== "00:00" || entry.endTime !== "00:00");
        
        const totalMinutes = normalDays.reduce((total, entry) => {
          const startParts = entry.startTime.split(':');
          const endParts = entry.endTime.split(':');
          const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
          const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
          return total + (endMinutes - startMinutes);
        }, 0);
        
        const averageMood = entries.reduce((sum, entry) => sum + entry.moodRating, 0) / entries.length;
        const averageEnergy = entries.reduce((sum, entry) => sum + entry.energyLevel, 0) / entries.length;
        
        setStats({
          totalMinutes,
          averageMood,
          averageEnergy,
          daysWorked: normalDays.length
        });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMoodEmoji = (rating: number) => {
    const roundedRating = Math.round(rating);
    switch (roundedRating) {
      case 1: return '😞';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '😄';
      default: return '😐';
    }
  };

  const renderEnergyIndicator = (level: number) => {
    const roundedLevel = Math.round(level);
    const bars = [];
    for (let i = 1; i <= 5; i++) {
      bars.push(
        <View 
          key={i} 
          style={[
            styles.energyBar, 
            { 
              backgroundColor: i <= roundedLevel ? '#4CAF50' : '#E0E0E0',
              height: 4 + (i * 2) // Increasing heights
            }
          ]} 
        />
      );
    }
    return (
      <View style={styles.energyIndicator}>
        {bars}
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">{t('analytics.title')}</ThemedText>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : timeEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconSymbol name="chart.bar.xaxis" size={64} color="#CCC" />
          <ThemedText style={styles.emptyText}>{t('analytics.noData')}</ThemedText>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <IconSymbol name="clock.fill" size={24} color="#007AFF" />
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                {formatMinutesToHours(stats.totalMinutes)}
              </ThemedText>
              <ThemedText style={styles.statLabel}>{t('reports.totalHours')}</ThemedText>
            </View>
            
            <View style={styles.statCard}>
              <IconSymbol name="calendar.badge.clock" size={24} color="#FF9500" />
              <ThemedText type="defaultSemiBold" style={styles.statValue}>
                {stats.daysWorked}
              </ThemedText>
              <ThemedText style={styles.statLabel}>{t('reports.daysWorked')}</ThemedText>
            </View>
          </View>
          
          <View style={styles.moodEnergySection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {t('analytics.moodAnalysis')}
            </ThemedText>
            
            <View style={styles.moodCard}>
              <View style={styles.moodHeader}>
                <ThemedText style={styles.moodValue}>
                  {renderMoodEmoji(stats.averageMood)}
                </ThemedText>
                <ThemedText type="defaultSemiBold">
                  {t('analytics.averageMood')}: {stats.averageMood.toFixed(1)}/5
                </ThemedText>
              </View>
            </View>
            
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {t('analytics.energyAnalysis')}
            </ThemedText>
            
            <View style={styles.energyCard}>
              <View style={styles.energyHeader}>
                {renderEnergyIndicator(stats.averageEnergy)}
                <ThemedText type="defaultSemiBold">
                  {t('analytics.averageEnergy')}: {stats.averageEnergy.toFixed(1)}/5
                </ThemedText>
              </View>
            </View>
          </View>
          
          <View style={styles.advancedSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              {t('analytics.advancedAnalytics')}
            </ThemedText>
            
            <View style={styles.comingSoonCard}>
              <IconSymbol name="chart.xyaxis.line" size={32} color="#8E8E93" />
              <ThemedText style={styles.comingSoonText}>
                Advanced analytics features coming soon
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      )}
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
  loader: {
    marginTop: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 64,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 20,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
  moodEnergySection: {
    marginBottom: 24,
  },
  moodCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  moodValue: {
    fontSize: 32,
  },
  energyCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  energyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  energyIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 20,
  },
  energyBar: {
    width: 8,
    borderRadius: 2,
  },
  advancedSection: {
    marginBottom: 24,
  },
  comingSoonCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    marginTop: 8,
    color: '#8E8E93',
    textAlign: 'center',
  },
});