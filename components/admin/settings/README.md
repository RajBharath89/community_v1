# Settings Module

A comprehensive settings management system for the ABC temple management application, providing administrators with complete control over temple configuration, security, communication, and system preferences.

## Features

### 🏛️ **Temple Settings**
- **General Information**: Temple name, address, contact details, website
- **Regional Settings**: Timezone, language, currency configuration
- **Temple Hours**: Opening and closing hours for each day of the week
- **Established Year**: Temple founding date and historical information

### 🔒 **Security Settings**
- **Session Management**: Timeout duration, login attempts, lockout duration
- **Two-Factor Authentication**: Enable/disable 2FA for enhanced security
- **Password Policy**: Configurable password complexity requirements
  - Minimum length
  - Uppercase/lowercase requirements
  - Number and special character requirements

### 📧 **Communication Settings**
- **Notification Preferences**: Email, SMS, and push notification toggles
- **Email Provider Configuration**: SMTP, SendGrid, Mailgun support
- **SMS Provider Configuration**: Twilio, AWS SNS, custom providers
- **SMTP Settings**: Host, port, authentication, encryption options

### 💰 **Donation Settings**
- **Online Donations**: Enable/disable online donation functionality
- **Payment Gateway**: Razorpay, Stripe, PayPal, custom gateway support
- **Donation Limits**: Minimum and maximum donation amounts
- **Receipt Generation**: Automatic receipt generation and tax ID configuration
- **Donation Categories**: Customizable categories for better organization

### 📅 **Event Settings**
- **Event Registration**: Enable/disable event registration system
- **Approval Requirements**: Require admin approval for registrations
- **Capacity Management**: Maximum event capacity and waitlist options
- **Reminder System**: Configurable email and SMS reminders

### 📚 **Library Settings**
- **Access Control**: Public access, download, and sharing permissions
- **File Management**: Maximum file size, allowed file types
- **Backup Configuration**: Automatic backup frequency and settings
- **File Type Restrictions**: Customizable allowed file extensions

### 💾 **Backup Settings**
- **Auto Backup**: Enable/disable automatic backup system
- **Backup Frequency**: Daily, weekly, or monthly backup schedules
- **Retention Policy**: Configurable backup retention period
- **Storage Options**: Local, cloud, or both storage locations
- **Cloud Providers**: AWS, Google Cloud, Azure support

### ⚙️ **System Settings**
- **Maintenance Mode**: System maintenance and debug mode toggles
- **Performance Settings**: Log levels, cache configuration, file upload limits
- **Session Storage**: Memory, Redis, or database session storage
- **Cache Management**: TTL settings and cache enable/disable

## Notification Management

### 📧 **Email Notifications**
- New user registration alerts
- User status change notifications
- Donation received confirmations
- Event registration and reminder emails
- System and security alerts
- Weekly and monthly reports

### 📱 **SMS Notifications**
- Critical event notifications
- Donation confirmations
- Event reminders
- Security alerts
- System notifications

### 🔔 **Push Notifications**
- Real-time mobile app notifications
- Event updates and reminders
- System alerts and security notifications
- User activity notifications

### 📝 **Notification Templates**
- **Email Templates**: Welcome, donation receipt, password reset, account activation
- **Event Templates**: Event reminders and notifications
- **Report Templates**: Weekly and monthly report formats
- **Variable Support**: Dynamic content with placeholders

### ⏰ **Notification Schedules**
- **Report Schedules**: Weekly and monthly report timing
- **Event Reminders**: Configurable reminder days and times
- **Automated Notifications**: Scheduled notification delivery

## Components

### Main Components
- `SettingsManagement`: Main settings container with tabbed interface
- `NotificationsManagement`: Notification settings with comprehensive controls

### Settings Components
- `GeneralSettings`: Temple information and regional settings
- `SecuritySettings`: Security and password policy configuration
- `CommunicationSettings`: Email and SMS provider setup
- `DonationSettings`: Payment gateway and donation configuration
- `EventSettings`: Event management and reminder settings
- `LibrarySettings`: File management and access control
- `BackupSettings`: Backup configuration and cloud storage
- `SystemSettings`: System performance and maintenance options

### Notification Components
- `EmailNotifications`: Email notification trigger configuration
- `SmsNotifications`: SMS notification trigger configuration
- `PushNotifications`: Push notification trigger configuration
- `NotificationTemplates`: Template customization with variables
- `NotificationSchedules`: Automated notification scheduling

## Data Structure

### TempleSettings Interface
```typescript
interface TempleSettings {
  // General temple information
  templeName: string
  templeAddress: string
  templePhone: string
  templeEmail: string
  templeWebsite: string
  establishedYear: string
  timezone: string
  language: string
  currency: string
  
  // Opening hours for each day
  openingHours: {
    [day: string]: { open: string; close: string; closed: boolean }
  }
  
  // Security configuration
  security: {
    sessionTimeout: number
    passwordPolicy: PasswordPolicy
    twoFactorAuth: boolean
    loginAttempts: number
    lockoutDuration: number
  }
  
  // Communication settings
  communication: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    emailProvider: string
    smtpSettings?: SmtpSettings
    smsProvider: string
    smsSettings?: SmsSettings
  }
  
  // And more configuration sections...
}
```

### NotificationSettings Interface
```typescript
interface NotificationSettings {
  // Email notification triggers
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
  
  // SMS and push notification triggers
  smsNotifications: { /* similar structure */ }
  pushNotifications: { /* similar structure */ }
  
  // Notification templates
  templates: {
    welcomeEmail: string
    donationReceipt: string
    eventReminder: string
    passwordReset: string
    accountActivation: string
    weeklyReport: string
    monthlyReport: string
  }
  
  // Notification schedules
  schedules: {
    weeklyReportDay: string
    weeklyReportTime: string
    monthlyReportDay: number
    monthlyReportTime: string
    eventReminderDays: number[]
    eventReminderTime: string
  }
}
```

## State Management

The module uses Zustand for state management with the `useSettingsStore` hook, providing:
- Settings CRUD operations
- Unsaved changes tracking
- Save/reset functionality
- Loading state management
- Real-time updates

## Usage

1. Navigate to the Settings section from the Hub module
2. Use the tabbed interface to access different setting categories
3. Modify settings as needed - changes are tracked automatically
4. Use the "Save Changes" button to persist modifications
5. Use the "Reset" button to restore default values

## Integration

The settings module integrates with:
- Application header navigation
- Consistent UI components and design system
- Toast notifications for user feedback
- Real-time change tracking
- Responsive design for all screen sizes

## Security Features

- **Password Policy Enforcement**: Configurable complexity requirements
- **Session Management**: Automatic timeout and lockout protection
- **Two-Factor Authentication**: Enhanced security for admin accounts
- **Security Alerts**: Real-time notifications for security events
- **Access Control**: Granular permissions for different user roles

## Future Enhancements

Potential improvements could include:
- **API Integration**: Real-time synchronization with external services
- **Audit Logging**: Track all setting changes with timestamps
- **Role-Based Access**: Different setting access levels for different roles
- **Import/Export**: Backup and restore setting configurations
- **Advanced Scheduling**: More complex notification scheduling options
- **Multi-Language Support**: Settings interface in multiple languages
- **Theme Customization**: Visual appearance and branding settings
