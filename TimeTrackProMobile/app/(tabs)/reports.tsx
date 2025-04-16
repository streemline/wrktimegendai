import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslations } from '../../contexts/TranslationContext';
import { database } from '../../database/db';
import { MonthlyReport } from '../../database/schema';
import { formatMinutesToHours } from '../../utils/timeFormatters';

export default function ReportsScreen() {
  const { user } = useAuth();
  const { t } = useTranslations();
  const [reports, setReports] = useState<MonthlyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadReports();
  }, [user, selectedYear]);

  const loadReports = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const userReports = await database.getMonthlyReportsByUser(user.id);
      // Filter by selected year
      const filteredReports = userReports.filter(report => report.year === selectedYear);
      // Sort by month in descending order
      setReports(filteredReports.sort((a, b) => b.month - a.month));
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const date = new Date(2000, month - 1, 1);
    return format(date, 'MMMM');
  };

  const renderReportItem = (report: MonthlyReport) => {
    const totalTargetHours = formatMinutesToHours(report.targetMinutes);
    const totalWorkedHours = formatMinutesToHours(report.workedMinutes);
    const overtimeHours = formatMinutesToHours(Math.abs(report.overtimeMinutes));
    const isOvertime = report.overtimeMinutes > 0;
    
    return (
      <TouchableOpacity 
        key={`${report.year}-${report.month}`}
        style={styles.reportCard}
        onPress={() => {
          // TODO: Implement view report details
        }}
      >
        <View style={styles.reportHeader}>
          <ThemedText type="defaultSemiBold">
            {getMonthName(report.month)} {report.year}
          </ThemedText>
          <IconSymbol name="chevron.right" size={16} color="#999" />
        </View>
        
        <View style={styles.reportSummary}>
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>{t('reports.workDays')}</ThemedText>
            <ThemedText>{report.workDays}</ThemedText>
          </View>
          
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>{t('reports.targetHours')}</ThemedText>
            <ThemedText>{totalTargetHours}</ThemedText>
          </View>
          
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>{t('reports.workedHours')}</ThemedText>
            <ThemedText>{totalWorkedHours}</ThemedText>
          </View>
          
          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel}>
              {isOvertime ? t('reports.overtime') : t('reports.undertime')}
            </ThemedText>
            <ThemedText style={{ color: isOvertime ? '#4CAF50' : '#FF3B30' }}>
              {isOvertime ? '+' : '-'}{overtimeHours}
            </ThemedText>
          </View>
          
          {report.vacationDays > 0 && (
            <View style={styles.summaryRow}>
              <ThemedText style={styles.summaryLabel}>{t('reports.vacationDays')}</ThemedText>
              <ThemedText>{report.vacationDays}</ThemedText>
            </View>
          )}
        </View>
        
        <View style={styles.reportFooter}>
          <IconSymbol name="doc.text.fill" size={16} color="#666" />
          <ThemedText style={styles.reportExportLabel}>
            {t('reports.exportReport')}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderYearSelector = () => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear, currentYear - 1, currentYear - 2];
    
    return (
      <View style={styles.yearSelector}>
        {years.map(year => (
          <TouchableOpacity
            key={year}
            style={[
              styles.yearButton,
              selectedYear === year && styles.selectedYearButton
            ]}
            onPress={() => setSelectedYear(year)}
          >
            <ThemedText
              style={[
                styles.yearText,
                selectedYear === year && styles.selectedYearText
              ]}
            >
              {year}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="doc.text.fill" size={64} color="#CCC" />
      <ThemedText style={styles.emptyText}>{t('reports.noReports')}</ThemedText>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">{t('reports.title')}</ThemedText>
        <TouchableOpacity 
          style={styles.generateButton}
          onPress={() => {
            // TODO: Implement generate new report
          }}
        >
          <IconSymbol name="plus.circle.fill" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      {renderYearSelector()}
      
      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {reports.length > 0 ? (
            reports.map(renderReportItem)
          ) : (
            renderEmptyList()
          )}
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
  generateButton: {
    padding: 8,
  },
  yearSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  yearButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  selectedYearButton: {
    backgroundColor: '#007AFF',
  },
  yearText: {
    color: '#555',
    fontWeight: '500',
  },
  selectedYearText: {
    color: '#FFFFFF',
  },
  loader: {
    marginTop: 32,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
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
  reportCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
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
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  reportSummary: {
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#666',
  },
  reportFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F9F9F9',
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  reportExportLabel: {
    marginLeft: 8,
    color: '#666',
  },
});