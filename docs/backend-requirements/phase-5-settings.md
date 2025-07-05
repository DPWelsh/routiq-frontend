# Phase 5: System Configuration - Backend Requirements

## Overview
**Priority**: Low  
**Estimated Effort**: 1-2 weeks  
**Phase Goal**: Replace static settings UI with real organization configuration management

## Current State
The frontend SettingsPage currently shows:
- Static UI with no real data persistence
- Hardcoded organization information
- No user preference management
- No configuration synchronization across users

## Critical API Endpoints Required

### 1. Organization Settings
**Endpoint**: `GET /api/v1/settings/{organizationId}`

**Purpose**: Load organization configuration and basic preferences

**Request Parameters**:
- `organizationId` (path parameter): Organization identifier

**Required Response Schema**:
```json
{
  "organization": {
    "id": string,
    "name": string,
    "display_name": string,
    "timezone": string,
    "locale": string,
    "currency": string,
    "created_at": string,
    "updated_at": string
  },
  "contact_info": {
    "address": {
      "street": string,
      "city": string,
      "state": string,
      "postal_code": string,
      "country": string
    },
    "phone": string,
    "email": string,
    "website": string
  },
  "basic_preferences": {
    "date_format": "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD",
    "time_format": "12h" | "24h",
    "first_day_of_week": "sunday" | "monday",
    "default_appointment_duration": number, // in minutes
    "notification_settings": {
      "email_enabled": boolean,
      "sms_enabled": boolean,
      "push_enabled": boolean,
      "digest_frequency": "daily" | "weekly" | "monthly"
    }
  }
}
```

### 2. Update Organization Settings
**Endpoint**: `PUT /api/v1/settings/{organizationId}`

**Purpose**: Save organization configuration changes

**Request Body**:
```json
{
  "organization": {
    "name": string,
    "display_name": string,
    "timezone": string,
    "locale": string,
    "currency": string
  },
  "contact_info": {
    "address": {
      "street": string,
      "city": string,
      "state": string,
      "postal_code": string,
      "country": string
    },
    "phone": string,
    "email": string,
    "website": string
  },
  "basic_preferences": {
    "date_format": string,
    "time_format": string,
    "first_day_of_week": string,
    "default_appointment_duration": number,
    "notification_settings": {
      "email_enabled": boolean,
      "sms_enabled": boolean,
      "push_enabled": boolean,
      "digest_frequency": string
    }
  }
}
```

**Response Schema**:
```json
{
  "success": boolean,
  "message": string,
  "updated_at": string,
  "validation_errors": [
    {
      "field": string,
      "message": string
    }
  ]
}
```

### 3. User Preferences
**Endpoint**: `GET /api/v1/settings/{organizationId}/user/{userId}`

**Purpose**: Load user-specific preferences and settings

**Required Response Schema**:
```json
{
  "user_preferences": {
    "theme": "light" | "dark" | "system",
    "language": string,
    "dashboard_layout": "compact" | "comfortable" | "spacious",
    "default_page": string,
    "notifications": {
      "desktop_enabled": boolean,
      "sound_enabled": boolean,
      "appointment_reminders": boolean,
      "message_alerts": boolean,
      "system_updates": boolean
    },
    "privacy": {
      "activity_tracking": boolean,
      "usage_analytics": boolean,
      "crash_reporting": boolean
    }
  }
}
```

## Nice-to-Have Enhancements (Can be deferred)

### 4. Advanced Organization Configuration
**Endpoint**: `GET /api/v1/settings/{organizationId}/advanced`

**Purpose**: Advanced configuration options and business rules

**Response Schema**:
```json
{
  "business_configuration": {
    "business_hours": {
      "timezone": string,
      "schedule": {
        "monday": { "open": string, "close": string, "closed": boolean },
        "tuesday": { "open": string, "close": string, "closed": boolean },
        "wednesday": { "open": string, "close": string, "closed": boolean },
        "thursday": { "open": string, "close": string, "closed": boolean },
        "friday": { "open": string, "close": string, "closed": boolean },
        "saturday": { "open": string, "close": string, "closed": boolean },
        "sunday": { "open": string, "close": string, "closed": boolean }
      },
      "holidays": [
        {
          "date": string,
          "name": string,
          "recurring": boolean
        }
      ]
    },
    "appointment_settings": {
      "booking_window": number, // days in advance
      "cancellation_policy": number, // hours before appointment
      "reminder_settings": [
        {
          "type": "email" | "sms" | "push",
          "timing": number, // hours before
          "enabled": boolean
        }
      ]
    },
    "automation_settings": {
      "ai_responses_enabled": boolean,
      "auto_booking_enabled": boolean,
      "follow_up_enabled": boolean,
      "sentiment_analysis_enabled": boolean
    }
  },
  "integration_configs": {
    "whatsapp": {
      "auto_reply_enabled": boolean,
      "business_hours_only": boolean,
      "greeting_message": string
    },
    "email": {
      "signature": string,
      "auto_reply_enabled": boolean,
      "out_of_office_message": string
    },
    "sms": {
      "sender_name": string,
      "opt_out_instructions": string
    }
  }
}
```

### 5. Team Management Settings
**Endpoint**: `GET /api/v1/settings/{organizationId}/team`

**Purpose**: Team roles, permissions, and user management

**Response Schema**:
```json
{
  "team_settings": {
    "user_roles": [
      {
        "role_id": string,
        "role_name": string,
        "permissions": [string],
        "user_count": number
      }
    ],
    "invitation_settings": {
      "auto_approve": boolean,
      "require_admin_approval": boolean,
      "default_role": string
    },
    "access_controls": {
      "ip_whitelist": [string],
      "two_factor_required": boolean,
      "session_timeout": number, // in minutes
      "password_policy": {
        "min_length": number,
        "require_uppercase": boolean,
        "require_lowercase": boolean,
        "require_numbers": boolean,
        "require_symbols": boolean
      }
    }
  }
}
```

### 6. Billing and Subscription Settings
**Endpoint**: `GET /api/v1/settings/{organizationId}/billing`

**Purpose**: Billing configuration and subscription management

**Response Schema**:
```json
{
  "billing_settings": {
    "subscription": {
      "plan_name": string,
      "plan_level": "basic" | "professional" | "enterprise",
      "billing_cycle": "monthly" | "yearly",
      "next_billing_date": string,
      "amount": number,
      "currency": string
    },
    "payment_method": {
      "type": "card" | "bank_transfer" | "invoice",
      "last_four": string,
      "expiry_date": string,
      "brand": string
    },
    "billing_contact": {
      "name": string,
      "email": string,
      "phone": string,
      "address": object
    },
    "usage_limits": {
      "monthly_messages": number,
      "current_usage": number,
      "api_calls": number,
      "storage_gb": number
    }
  }
}
```

### 7. Export and Backup Settings
**Endpoint**: `GET /api/v1/settings/{organizationId}/data-management`

**Purpose**: Data export, backup, and retention settings

**Response Schema**:
```json
{
  "data_management": {
    "backup_settings": {
      "auto_backup_enabled": boolean,
      "backup_frequency": "daily" | "weekly" | "monthly",
      "retention_period": number, // in days
      "include_attachments": boolean
    },
    "export_settings": {
      "available_formats": ["csv", "json", "pdf"],
      "scheduled_exports": [
        {
          "frequency": string,
          "format": string,
          "email_recipients": [string]
        }
      ]
    },
    "retention_policies": {
      "conversation_retention": number, // in days
      "log_retention": number, // in days
      "analytics_retention": number // in days
    }
  }
}
```

## Frontend Components Affected
- `SettingsPage` - Main settings interface
- `SettingsContent` - Settings content sections
- User profile components
- Organization management interfaces
- Theme and preference controls

## Data Sources Required
Your backend will need to manage:
- Organization master data
- User preferences and profiles
- System configuration settings
- Business rules and policies
- Integration configurations
- Billing and subscription data
- Access control and permissions

## Business Logic Requirements

### Settings Validation
- Validate timezone and locale settings
- Ensure business hours are logical (open < close)
- Validate email addresses and phone numbers
- Check currency and format compatibility
- Validate user permission assignments

### Configuration Inheritance
- Organization-level settings as defaults
- User-level overrides where appropriate
- Role-based permission enforcement
- Cascade changes to dependent settings

### Change Management
- Audit trail for all configuration changes
- Notification of setting changes to affected users
- Rollback capability for critical settings
- Validation before applying changes

## Success Criteria
- [ ] SettingsPage loads real organization data instead of static UI
- [ ] Settings changes persist correctly across sessions
- [ ] User preferences apply consistently across the application
- [ ] Organization settings affect all users appropriately
- [ ] Validation prevents invalid configurations
- [ ] Change history is maintained for auditing

## Dependencies
- Organization ID routing functional
- User authentication and authorization
- Role-based access control system
- Audit logging infrastructure
- Email/SMS service for notifications

## Testing Requirements
- Test settings persistence across sessions
- Verify user preference isolation
- Test organization-wide setting changes
- Validate configuration inheritance
- Test rollback functionality
- Verify audit trail accuracy

## Error Handling
- Graceful handling of invalid configurations
- Clear validation error messages
- Fallback to default values when needed
- Recovery from partial save failures
- Proper handling of concurrent modifications

## Security Considerations
- Validate user permissions for settings access
- Encrypt sensitive configuration data
- Audit all configuration changes
- Implement rate limiting for settings updates
- Secure storage of API keys and secrets

## Performance Considerations
- Cache frequently accessed settings
- Minimize database queries for settings lookup
- Efficient change propagation mechanisms
- Consider settings sync across multiple instances
- Optimize for read-heavy access patterns

## Validation Rules
- **Timezone**: Must be valid IANA timezone identifier
- **Email**: Must be valid email format
- **Phone**: Must be valid phone number format
- **Currency**: Must be valid ISO currency code
- **Business Hours**: Open time must be before close time
- **Retention Periods**: Must be positive integers within reasonable limits

## Change Notification
- Notify users when organization settings affect them
- Send confirmation emails for critical changes
- Update UI immediately after successful changes
- Provide clear feedback for validation failures
- Consider real-time sync for multi-user environments 