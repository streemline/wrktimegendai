import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslations } from '../../contexts/TranslationContext';
import { TimeEntry } from '../../database/schema';
import { database } from '../../database/db';
import { formatMinutesToHours, calculateTotalMinutes } from '../../utils/timeFormatters';

export default function TimeEntriesScreen() {
  const { user } = useAuth();
  const { t } = useTranslations();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadTimeEntries();
  }, [user, selectedMonth, selectedYear]);

  const loadTimeEntries = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const entries = await database.getTimeEntriesByUserAndMonth(
        user.id, 
        selectedYear, 
        selectedMonth
      );
      setTimeEntries(entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error('Failed to load time entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTimeEntry = ({ item }: { item: TimeEntry }) => {
    const date = new Date(item.date);
    const formattedDate = format(date, 'dd MMM yyyy');
    const dayOfWeek = format(date, 'EEEE');
    
    const totalMinutes = calculateTotalMinutes(item.startTime, item.endTime);
    const duration = formatMinutesToHours(totalMinutes);
    const earnings = (totalMinutes / 60 * item.hourlyRate).toFixed(2);
    
    const isSpecialDay = item.startTime === "00:00" && item.endTime === "00:00";

    return (
      <TouchableOpacity 
        style={styles.entryCard}
        onPress={() => {
          // TODO: Implement edit entry
        }}
      >
        <View style={styles.entryHeader}>
          <View>
            <ThemedText type="defaultSemiBold">{formattedDate}</ThemedText>
            <ThemedText style={styles.dayOfWeek}>{dayOfWeek}</ThemedText>
          </View>
          
          <TouchableOpacity 
            style={styles.deleteButton}
            onPress={() => {
              // TODO: Implement delete entry
            }}
          >
            <IconSymbol name="trash" size={16} color="#FF3B30" />
          </TouchableOpacity>
        </View>
        
        {isSpecialDay ? (
          <View style={styles.specialDay}>
            <ThemedText type="defaultSemiBold">{item.notes}</ThemedText>
          </View>
        ) : (
          <View style={styles.entryDetails}>
            <View style={styles.timeContainer}>
              <IconSymbol name="clock" size={16} color="#666" />
              <ThemedText style={styles.timeText}>
                {`${item.startTime} - ${item.endTime}`}
              </ThemedText>
            </View>
            
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <IconSymbol name="hourglass" size={16} color="#666" />
                <ThemedText style={styles.infoText}>{duration}</ThemedText>
              </View>
              
              <View style={styles.infoItem}>
                <IconSymbol name="dollarsign.circle" size={16} color="#666" />
                <ThemedText style={styles.infoText}>{earnings}</ThemedText>
              </View>
              
              <View style={styles.infoItem}>
                <IconSymbol name="face.smiling" size={16} color="#666" />
                <ThemedText style={styles.infoText}>{item.moodRating}/5</ThemedText>
              </View>
              
              <View style={styles.infoItem}>
                <IconSymbol name="bolt" size={16} color="#666" />
                <ThemedText style={styles.infoText}>{item.energyLevel}/5</ThemedText>
              </View>
            </View>
            
            {item.notes && (
              <View style={styles.notesContainer}>
                <IconSymbol name="text.bubble" size={16} color="#666" />
                <ThemedText numberOfLines={2} style={styles.notes}>{item.notes}</ThemedText>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="calendar.badge.clock" size={64} color="#CCC" />
      <ThemedText style={styles.emptyText}>{t('timeEntries.noEntries')}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">{t('timeEntries.title')}</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            // TODO: Implement add new entry
          }}
        >
          <IconSymbol name="plus.circle.fill" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {/* Month/Year selector would go here */}
      
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={timeEntries}
          renderItem={renderTimeEntry}
          keyExtractor={item => item.id?.toString() || `${item.date}-${item.startTime}`}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
        />
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
  addButton: {
    padding: 8,
  },
  loader: {
    marginTop: 32,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
    flexGrow: 1,
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
  entryCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  dayOfWeek: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
  },
  entryDetails: {
    gap: 12,
  },
  specialDay: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
  },
  notesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginTop: 4,
  },
  notes: {
    fontSize: 14,
    flex: 1,
    color: '#666',
  },
});
