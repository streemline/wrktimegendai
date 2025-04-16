import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { User, TimeEntry, MonthlyReport, userInitialData } from './schema';

// Database constants
const DB_NAME = 'timetrackpro.db';
const DB_VERSION = 1;

// Helper to hash passwords (simplified for the demo)
export const hashPassword = async (password: string): Promise<string> => {
  // In a real app, use proper crypto library like bcrypt
  // This is a simplified hash for demonstration
  return password;
};

// Helper to compare passwords
export const comparePasswords = async (supplied: string, stored: string): Promise<boolean> => {
  // In a real app, this would use bcrypt.compare
  return supplied === stored;
};

// Database class
export class Database {
  private db: SQLite.SQLiteDatabase;
  private initialized: boolean = false;

  constructor() {
    if (Platform.OS === 'web') {
      this.db = {
        transaction: (callback: any) => {
          console.warn('SQLite is not supported on web platform');
          // Mock successful transaction
          callback({
            executeSql: (query: string, args: any[], success: Function) => {
              success && success({}, { rows: { length: 0, item: () => ({}) }});
            }
          });
        }
      } as any;
    } else {
      this.db = SQLite.openDatabase(DB_NAME);
    }
  }

  // Initialize database tables
  async init(): Promise<void> {
    if (this.initialized) return;

    return new Promise((resolve, reject) => {
      this.db.transaction(
        tx => {
          // Create Users table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL,
              full_name TEXT,
              email TEXT,
              phone TEXT,
              position TEXT,
              profile_image TEXT,
              work_hours_per_day REAL DEFAULT 8,
              break_minutes INTEGER DEFAULT 60,
              auto_break INTEGER DEFAULT 1,
              work_days TEXT DEFAULT '[1,2,3,4,5]'
            );
          `);

          // Create TimeEntries table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS time_entries (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId INTEGER NOT NULL,
              date TEXT NOT NULL,
              startTime TEXT NOT NULL,
              endTime TEXT NOT NULL,
              hourlyRate REAL DEFAULT 0,
              notes TEXT,
              moodRating INTEGER DEFAULT 3,
              energyLevel INTEGER DEFAULT 3,
              FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
            );
          `);

          // Create MonthlyReports table
          tx.executeSql(`
            CREATE TABLE IF NOT EXISTS monthly_reports (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              userId INTEGER NOT NULL,
              year INTEGER NOT NULL,
              month INTEGER NOT NULL,
              workDays INTEGER NOT NULL,
              workedMinutes INTEGER NOT NULL,
              targetMinutes INTEGER NOT NULL,
              overtimeMinutes INTEGER DEFAULT 0,
              vacationDays INTEGER DEFAULT 0,
              carriedFromMinutes INTEGER DEFAULT 0,
              carriedToMinutes INTEGER DEFAULT 0,
              FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE,
              UNIQUE(userId, year, month)
            );
          `);

          // Check if initial user exists
          tx.executeSql(
            'SELECT * FROM users LIMIT 1',
            [],
            async (_, result) => {
              if (result.rows.length === 0) {
                // Create default user
                const hashedPassword = await hashPassword(userInitialData.password);
                tx.executeSql(
                  'INSERT INTO users (username, password, full_name, email, phone, position, profile_image, work_hours_per_day, break_minutes, auto_break, work_days) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  [
                    userInitialData.username,
                    hashedPassword,
                    userInitialData.full_name,
                    userInitialData.email,
                    userInitialData.phone,
                    userInitialData.position,
                    userInitialData.profile_image,
                    userInitialData.work_hours_per_day,
                    userInitialData.break_minutes,
                    userInitialData.auto_break ? 1 : 0,
                    userInitialData.work_days,
                  ]
                );
              }
            }
          );
        },
        (error) => {
          console.error('Database initialization error:', error);
          reject(error);
        },
        () => {
          this.initialized = true;
          resolve();
        }
      );
    });
  }

  // USER METHODS

  async getUser(id: number): Promise<User | undefined> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM users WHERE id = ?',
          [id],
          (_, result) => {
            if (result.rows.length > 0) {
              const userData = result.rows.item(0);
              resolve({
                ...userData,
                auto_break: !!userData.auto_break
              });
            } else {
              resolve(undefined);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM users WHERE username = ?',
          [username],
          (_, result) => {
            if (result.rows.length > 0) {
              const userData = result.rows.item(0);
              resolve({
                ...userData,
                auto_break: !!userData.auto_break
              });
            } else {
              resolve(undefined);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async createUser(user: User): Promise<User> {
    await this.init();
    const hashedPassword = await hashPassword(user.password);
    
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO users (username, password, full_name, email, phone, position, profile_image, work_hours_per_day, break_minutes, auto_break, work_days) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            user.username,
            hashedPassword,
            user.full_name,
            user.email,
            user.phone,
            user.position,
            user.profile_image,
            user.work_hours_per_day,
            user.break_minutes,
            user.auto_break ? 1 : 0,
            user.work_days,
          ],
          (_, result) => {
            this.getUser(result.insertId).then(newUser => {
              if (newUser) {
                resolve(newUser);
              } else {
                reject(new Error('Failed to retrieve created user'));
              }
            });
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    await this.init();
    
    // Generate dynamic SQL based on provided fields
    const updateFields: string[] = [];
    const values: any[] = [];
    
    Object.entries(userData).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        updateFields.push(`${key} = ?`);
        
        if (key === 'password') {
          // Hash password before storing
          values.push(hashPassword(value as string));
        } else if (key === 'auto_break') {
          values.push(value ? 1 : 0);
        } else {
          values.push(value);
        }
      }
    });
    
    if (updateFields.length === 0) {
      return this.getUser(id);
    }
    
    values.push(id);
    
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
          values,
          (_, result) => {
            if (result.rowsAffected > 0) {
              this.getUser(id).then(updatedUser => {
                resolve(updatedUser);
              });
            } else {
              resolve(undefined);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // TIME ENTRY METHODS

  async getTimeEntry(id: number): Promise<TimeEntry | undefined> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM time_entries WHERE id = ?',
          [id],
          (_, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows.item(0));
            } else {
              resolve(undefined);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async getTimeEntriesByUser(userId: number): Promise<TimeEntry[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM time_entries WHERE userId = ? ORDER BY date',
          [userId],
          (_, result) => {
            const entries: TimeEntry[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              entries.push(result.rows.item(i));
            }
            resolve(entries);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async getTimeEntriesByUserAndMonth(userId: number, year: number, month: number): Promise<TimeEntry[]> {
    await this.init();
    // SQLite date filtering with date strings
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endMonth = month === 12 ? 1 : month + 1;
    const endYear = month === 12 ? year + 1 : year;
    const endDate = `${endYear}-${endMonth.toString().padStart(2, '0')}-01`;
    
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM time_entries WHERE userId = ? AND date >= ? AND date < ? ORDER BY date',
          [userId, startDate, endDate],
          (_, result) => {
            const entries: TimeEntry[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              entries.push(result.rows.item(i));
            }
            resolve(entries);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async createTimeEntry(entry: TimeEntry): Promise<TimeEntry> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO time_entries (userId, date, startTime, endTime, hourlyRate, notes, moodRating, energyLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            entry.userId,
            entry.date,
            entry.startTime,
            entry.endTime,
            entry.hourlyRate,
            entry.notes,
            entry.moodRating,
            entry.energyLevel
          ],
          (_, result) => {
            this.getTimeEntry(result.insertId).then(newEntry => {
              if (newEntry) {
                resolve(newEntry);
              } else {
                reject(new Error('Failed to retrieve created time entry'));
              }
            });
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async updateTimeEntry(id: number, entryData: Partial<TimeEntry>): Promise<TimeEntry | undefined> {
    await this.init();
    
    // Generate dynamic SQL based on provided fields
    const updateFields: string[] = [];
    const values: any[] = [];
    
    Object.entries(entryData).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (updateFields.length === 0) {
      return this.getTimeEntry(id);
    }
    
    values.push(id);
    
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `UPDATE time_entries SET ${updateFields.join(', ')} WHERE id = ?`,
          values,
          (_, result) => {
            if (result.rowsAffected > 0) {
              this.getTimeEntry(id).then(updatedEntry => {
                resolve(updatedEntry);
              });
            } else {
              resolve(undefined);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async deleteTimeEntry(id: number): Promise<boolean> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM time_entries WHERE id = ?',
          [id],
          (_, result) => {
            resolve(result.rowsAffected > 0);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  // MONTHLY REPORT METHODS

  async getMonthlyReport(id: number): Promise<MonthlyReport | undefined> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM monthly_reports WHERE id = ?',
          [id],
          (_, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows.item(0));
            } else {
              resolve(undefined);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async getMonthlyReportByUserAndMonth(userId: number, year: number, month: number): Promise<MonthlyReport | undefined> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM monthly_reports WHERE userId = ? AND year = ? AND month = ?',
          [userId, year, month],
          (_, result) => {
            if (result.rows.length > 0) {
              resolve(result.rows.item(0));
            } else {
              resolve(undefined);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async getMonthlyReportsByUser(userId: number): Promise<MonthlyReport[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM monthly_reports WHERE userId = ? ORDER BY year DESC, month DESC',
          [userId],
          (_, result) => {
            const reports: MonthlyReport[] = [];
            for (let i = 0; i < result.rows.length; i++) {
              reports.push(result.rows.item(i));
            }
            resolve(reports);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async createMonthlyReport(report: MonthlyReport): Promise<MonthlyReport> {
    await this.init();
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO monthly_reports (userId, year, month, workDays, workedMinutes, targetMinutes, overtimeMinutes, vacationDays, carriedFromMinutes, carriedToMinutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            report.userId,
            report.year,
            report.month,
            report.workDays,
            report.workedMinutes,
            report.targetMinutes,
            report.overtimeMinutes || 0,
            report.vacationDays || 0,
            report.carriedFromMinutes || 0,
            report.carriedToMinutes || 0
          ],
          (_, result) => {
            this.getMonthlyReport(result.insertId).then(newReport => {
              if (newReport) {
                resolve(newReport);
              } else {
                reject(new Error('Failed to retrieve created monthly report'));
              }
            });
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }

  async updateMonthlyReport(id: number, reportData: Partial<MonthlyReport>): Promise<MonthlyReport | undefined> {
    await this.init();
    
    // Generate dynamic SQL based on provided fields
    const updateFields: string[] = [];
    const values: any[] = [];
    
    Object.entries(reportData).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        updateFields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (updateFields.length === 0) {
      return this.getMonthlyReport(id);
    }
    
    values.push(id);
    
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql(
          `UPDATE monthly_reports SET ${updateFields.join(', ')} WHERE id = ?`,
          values,
          (_, result) => {
            if (result.rowsAffected > 0) {
              this.getMonthlyReport(id).then(updatedReport => {
                resolve(updatedReport);
              });
            } else {
              resolve(undefined);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }
}

// Export singleton instance
export const database = new Database();