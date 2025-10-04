import { create } from "zustand"

export interface TempleSettings {
  // General Temple Information
  templeName: string
  templeAddress: string
  templePhone: string
  templeEmail: string
  templeWebsite: string
  establishedYear: string
  timezone: string
  language: string
  currency: string

  // Temple Hours
  openingHours: {
    monday: { open: string; close: string; closed: boolean }
    tuesday: { open: string; close: string; closed: boolean }
    wednesday: { open: string; close: string; closed: boolean }
    thursday: { open: string; close: string; closed: boolean }
    friday: { open: string; close: string; closed: boolean }
    saturday: { open: string; close: string; closed: boolean }
    sunday: { open: string; close: string; closed: boolean }
  }

  // Security Settings
  security: {
    sessionTimeout: number // minutes
    passwordPolicy: {
      minLength: number
      requireUppercase: boolean
      requireLowercase: boolean
      requireNumbers: boolean
      requireSpecialChars: boolean
    }
    twoFactorAuth: boolean
    loginAttempts: number
    lockoutDuration: number // minutes
  }

  // Communication Settings
  communication: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    emailProvider: "smtp" | "sendgrid" | "mailgun"
    smtpSettings?: {
      host: string
      port: number
      username: string
      password: string
      encryption: "none" | "ssl" | "tls"
    }
    smsProvider: "twilio" | "aws-sns" | "custom"
    smsSettings?: {
      apiKey: string
      apiSecret: string
      fromNumber: string
    }
  }

  // Donation Settings
  donations: {
    enableOnlineDonations: boolean
    paymentGateway: "razorpay" | "stripe" | "paypal" | "custom"
    paymentSettings?: {
      apiKey: string
      apiSecret: string
      webhookSecret: string
    }
    donationCategories: string[]
    minimumDonationAmount: number
    maximumDonationAmount: number
    autoReceiptGeneration: boolean
    taxDeductible: boolean
    taxId: string
  }

  // Event Settings
  events: {
    enableEventRegistration: boolean
    requireApproval: boolean
    maxEventCapacity: number
    allowWaitlist: boolean
    reminderSettings: {
      daysBefore: number[]
      emailReminder: boolean
      smsReminder: boolean
    }
  }

  // Library Settings
  library: {
    enablePublicAccess: boolean
    maxFileSize: number // MB
    allowedFileTypes: string[]
    enableDownload: boolean
    enableSharing: boolean
    autoBackup: boolean
    backupFrequency: "daily" | "weekly" | "monthly"
  }

  // Backup Settings
  backup: {
    enableAutoBackup: boolean
    backupFrequency: "daily" | "weekly" | "monthly"
    backupRetention: number // days
    backupLocation: "local" | "cloud" | "both"
    cloudProvider?: "aws" | "google" | "azure"
    cloudSettings?: {
      bucketName: string
      accessKey: string
      secretKey: string
      region: string
    }
  }

  // System Settings
  system: {
    maintenanceMode: boolean
    debugMode: boolean
    logLevel: "error" | "warn" | "info" | "debug"
    maxFileUploadSize: number // MB
    sessionStorage: "memory" | "redis" | "database"
    cacheEnabled: boolean
    cacheTTL: number // minutes
  }
}

export interface NotificationSettings {
  // Email Notifications
  emailNotifications: {
    newUserRegistration: boolean
    userStatusChange: boolean
    donationReceived: boolean
    eventRegistration: boolean
    eventReminder: boolean
    systemAlerts: boolean
    securityAlerts: boolean
    weeklyReport: boolean
    monthlyReport: boolean
  }

  // SMS Notifications
  smsNotifications: {
    newUserRegistration: boolean
    userStatusChange: boolean
    donationReceived: boolean
    eventRegistration: boolean
    eventReminder: boolean
    systemAlerts: boolean
    securityAlerts: boolean
  }

  // Push Notifications
  pushNotifications: {
    newUserRegistration: boolean
    userStatusChange: boolean
    donationReceived: boolean
    eventRegistration: boolean
    eventReminder: boolean
    systemAlerts: boolean
    securityAlerts: boolean
  }

  // Notification Templates
  templates: {
    welcomeEmail: string
    donationReceipt: string
    eventReminder: string
    passwordReset: string
    accountActivation: string
    weeklyReport: string
    monthlyReport: string
  }

  // Notification Schedules
  schedules: {
    weeklyReportDay: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
    weeklyReportTime: string
    monthlyReportDay: number // 1-31
    monthlyReportTime: string
    eventReminderDays: number[] // days before event
    eventReminderTime: string
  }
}

interface SettingsState {
  templeSettings: TempleSettings
  notificationSettings: NotificationSettings
  isLoading: boolean
  hasUnsavedChanges: boolean
  lastSaved: string | null

  // Actions
  updateTempleSettings: (settings: Partial<TempleSettings>) => void
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void
  saveSettings: () => Promise<void>
  resetSettings: () => void
  setLoading: (loading: boolean) => void
  setUnsavedChanges: (hasChanges: boolean) => void
}

const defaultTempleSettings: TempleSettings = {
  templeName: "Shree Sai Nath Temple",
  templeAddress: "123 Temple Street, Mumbai, Netherlands 400001, India",
  templePhone: "+91 22 1234 5678",
  templeEmail: "info@shreesainathtemple.org",
  templeWebsite: "https://shreesainathtemple.org",
  establishedYear: "1995",
  timezone: "Asia/Kolkata",
  language: "en",
  currency: "INR",

  openingHours: {
    monday: { open: "05:00", close: "22:00", closed: false },
    tuesday: { open: "05:00", close: "22:00", closed: false },
    wednesday: { open: "05:00", close: "22:00", closed: false },
    thursday: { open: "05:00", close: "22:00", closed: false },
    friday: { open: "05:00", close: "22:00", closed: false },
    saturday: { open: "05:00", close: "22:00", closed: false },
    sunday: { open: "05:00", close: "22:00", closed: false },
  },

  security: {
    sessionTimeout: 60,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    twoFactorAuth: false,
    loginAttempts: 5,
    lockoutDuration: 15,
  },

  communication: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    emailProvider: "smtp",
    smtpSettings: {
      host: "smtp.gmail.com",
      port: 587,
      username: "",
      password: "",
      encryption: "tls",
    },
    smsProvider: "twilio",
    smsSettings: {
      apiKey: "",
      apiSecret: "",
      fromNumber: "",
    },
  },

  donations: {
    enableOnlineDonations: true,
    paymentGateway: "razorpay",
    paymentSettings: {
      apiKey: "",
      apiSecret: "",
      webhookSecret: "",
    },
    donationCategories: ["General", "Festival", "Maintenance", "Education", "Charity"],
    minimumDonationAmount: 10,
    maximumDonationAmount: 100000,
    autoReceiptGeneration: true,
    taxDeductible: true,
    taxId: "80G/123456789",
  },

  events: {
    enableEventRegistration: true,
    requireApproval: false,
    maxEventCapacity: 500,
    allowWaitlist: true,
    reminderSettings: {
      daysBefore: [7, 3, 1],
      emailReminder: true,
      smsReminder: true,
    },
  },

  library: {
    enablePublicAccess: false,
    maxFileSize: 50,
    allowedFileTypes: ["pdf", "doc", "docx", "jpg", "jpeg", "png", "mp3", "mp4"],
    enableDownload: true,
    enableSharing: true,
    autoBackup: true,
    backupFrequency: "weekly",
  },

  backup: {
    enableAutoBackup: true,
    backupFrequency: "daily",
    backupRetention: 30,
    backupLocation: "cloud",
    cloudProvider: "aws",
    cloudSettings: {
      bucketName: "",
      accessKey: "",
      secretKey: "",
      region: "ap-south-1",
    },
  },

  system: {
    maintenanceMode: false,
    debugMode: false,
    logLevel: "info",
    maxFileUploadSize: 100,
    sessionStorage: "database",
    cacheEnabled: true,
    cacheTTL: 60,
  },
}

const defaultNotificationSettings: NotificationSettings = {
  emailNotifications: {
    newUserRegistration: true,
    userStatusChange: true,
    donationReceived: true,
    eventRegistration: true,
    eventReminder: true,
    systemAlerts: true,
    securityAlerts: true,
    weeklyReport: true,
    monthlyReport: true,
  },

  smsNotifications: {
    newUserRegistration: false,
    userStatusChange: false,
    donationReceived: true,
    eventRegistration: false,
    eventReminder: true,
    systemAlerts: true,
    securityAlerts: true,
  },

  pushNotifications: {
    newUserRegistration: true,
    userStatusChange: true,
    donationReceived: true,
    eventRegistration: true,
    eventReminder: true,
    systemAlerts: true,
    securityAlerts: true,
  },

  templates: {
    welcomeEmail: "Welcome to {templeName}! We're glad to have you as part of our community.",
    donationReceipt: "Thank you for your generous donation of {amount} to {templeName}. Your contribution helps us serve the community.",
    eventReminder: "Reminder: {eventName} is scheduled for {eventDate} at {eventTime}. We look forward to seeing you!",
    passwordReset: "Your password reset link for {templeName} account. This link will expire in 24 hours.",
    accountActivation: "Please activate your {templeName} account by clicking the link below.",
    weeklyReport: "Weekly report for {templeName} - {weekDate}",
    monthlyReport: "Monthly report for {templeName} - {monthDate}",
  },

  schedules: {
    weeklyReportDay: "monday",
    weeklyReportTime: "09:00",
    monthlyReportDay: 1,
    monthlyReportTime: "09:00",
    eventReminderDays: [7, 3, 1],
    eventReminderTime: "10:00",
  },
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  templeSettings: defaultTempleSettings,
  notificationSettings: defaultNotificationSettings,
  isLoading: false,
  hasUnsavedChanges: false,
  lastSaved: null,

  updateTempleSettings: (settings) =>
    set((state) => ({
      templeSettings: { ...state.templeSettings, ...settings },
      hasUnsavedChanges: true,
    })),

  updateNotificationSettings: (settings) =>
    set((state) => ({
      notificationSettings: { ...state.notificationSettings, ...settings },
      hasUnsavedChanges: true,
    })),

  saveSettings: async () => {
    set({ isLoading: true })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      set({
        hasUnsavedChanges: false,
        lastSaved: new Date().toISOString(),
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  resetSettings: () =>
    set({
      templeSettings: defaultTempleSettings,
      notificationSettings: defaultNotificationSettings,
      hasUnsavedChanges: false,
      lastSaved: null,
    }),

  setLoading: (loading) => set({ isLoading: loading }),
  setUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
}))
