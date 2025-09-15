# Client Setup Parameters Guide

## 🏢 Client Information Parameters

### Basic Company Information
```
COMPANY_NAME: "Your Company Name"
COMPANY_TAGLINE: "Your company tagline/mission"
COMPANY_DESCRIPTION: "Brief company description"
COMPANY_LOGO_URL: "URL to company logo"
COMPANY_WEBSITE: "https://yourcompany.com"
INVESTOR_PORTAL_URL: "https://portal.yourcompany.com"
```

### Contact Information
```
SUPPORT_EMAIL: "support@yourcompany.com"
INFO_EMAIL: "info@yourcompany.com"
PHONE_NUMBER: "+1 (555) 123-4567"
ADDRESS_LINE_1: "123 Business Street"
ADDRESS_LINE_2: "Suite 100"
CITY: "Business City"
STATE: "State/Province"
ZIP_CODE: "12345"
COUNTRY: "Country"
```

## 🔗 Salesforce Integration Parameters

### Salesforce Organization Configuration
```
SALESFORCE_ORG_ID: "00D5e000000XXXXX"  # Replace with client's org ID
SALESFORCE_INSTANCE_URL: "https://yourorg.my.salesforce.com"
SALESFORCE_API_VERSION: "v58.0"  # or latest version
```

### Real Intelligence Tracking Configuration
```
TRACKING_SERVICE_ENDPOINT: "https://realintelligence.com/customers/expos/[ORG_ID]/exhibitors/engine/w2x-engine.php"
TRACKING_ORG_ID: "00D5e000000XXXXX"  # Client's Salesforce Org ID
TRACKING_CUSTOMER_ID: "[CUSTOMER_ID]"  # Real Intelligence customer ID
```

### Salesforce Object Field Mappings
```
# Portal Tracking Object Fields
PORTAL_OBJECT_API_NAME: "ri__Portal__c"
CONTACT_LOOKUP_FIELD: "ri__Contact__c"
LOGIN_URL_FIELD: "ri__Login_URL__c"
ACTION_FIELD: "ri__Action__c"
IP_ADDRESS_FIELD: "ri__IP_Address__c"
LOGIN_COUNTRY_FIELD: "ri__Login_Country__c"
LOGIN_CITY_FIELD: "ri__Login_City__c"
DOCUMENT_TITLE_FIELD: "text_Document_Title__c"
```

### Custom Field Mappings (if different)
```
# If client uses different field API names, update these:
CUSTOM_FIELD_1: "Custom_Field_1__c"
CUSTOM_FIELD_2: "Custom_Field_2__c"
CUSTOM_FIELD_3: "Custom_Field_3__c"
```

## 🗄️ Supabase Configuration Parameters

### Supabase Project Settings
```
SUPABASE_PROJECT_ID: "your-project-id"
SUPABASE_URL: "https://your-project-id.supabase.co"
SUPABASE_ANON_KEY: "your-anon-key"
SUPABASE_SERVICE_ROLE_KEY: "your-service-role-key"  # For edge functions
```

### Database Configuration
```
# If using custom table names or schemas
USER_TABLE_NAME: "users"  # or custom name
PROFILE_TABLE_NAME: "profiles"  # or custom name
AUDIT_TABLE_NAME: "audit_logs"  # or custom name
```

## 📊 Tracking Actions Configuration

### Standard Tracking Actions
```
LOGIN_ACTION: "LOGIN"
LOGOUT_ACTION: "LOGOUT"  
DOCUMENT_CLICK_ACTION: "DOCUMENT_CLICKED"
AUDIO_CLICK_ACTION: "AUDIO_CLICKED"
VIDEO_CLICK_ACTION: "VIDEO_CLICKED"
FORM_SUBMIT_ACTION: "FORM_SUBMITTED"
PAGE_VIEW_ACTION: "PAGE_VIEWED"
```

### Custom Tracking Actions (if needed)
```
CUSTOM_ACTION_1: "CUSTOM_ACTION_1"
CUSTOM_ACTION_2: "CUSTOM_ACTION_2"
INVESTMENT_INTEREST_ACTION: "INVESTMENT_INTEREST"
DOCUMENT_DOWNLOAD_ACTION: "DOCUMENT_DOWNLOADED"
```

## 📁 Content & Media Parameters

### Document Storage Configuration
```
DOCUMENT_STORAGE_SERVICE: "google_drive" | "s3" | "supabase_storage"
DOCUMENT_BASE_URL: "https://docs.yourcompany.com"
VIDEO_STORAGE_SERVICE: "youtube" | "vimeo" | "custom"
VIDEO_BASE_URL: "https://videos.yourcompany.com"
```

### Podcast Integration (if applicable)
```
PODCAST_PLATFORM: "buzzsprout" | "anchor" | "spotify" | "custom"
PODCAST_SHOW_ID: "your-show-id"
PODCAST_BASE_URL: "https://podcasts.yourcompany.com"
```

## 🎨 Branding & Design Parameters

### Color Scheme
```
PRIMARY_COLOR: "hsl(224, 71%, 14%)"  # Main brand color
SECONDARY_COLOR: "hsl(220, 13%, 91%)"  # Secondary color
ACCENT_COLOR: "hsl(142, 76%, 36%)"  # Success/accent color
ERROR_COLOR: "hsl(0, 84%, 60%)"  # Error color
WARNING_COLOR: "hsl(38, 92%, 50%)"  # Warning color
```

### Typography
```
PRIMARY_FONT: "'Inter', sans-serif"
HEADING_FONT: "'Inter', sans-serif"
MONO_FONT: "'JetBrains Mono', monospace"
```

### Logo & Assets
```
COMPANY_LOGO: "/assets/logo.png"
COMPANY_FAVICON: "/favicon.ico"
HERO_IMAGE: "/assets/hero-image.jpg"
BACKGROUND_PATTERN: "/assets/bg-pattern.svg"
```

## 🔐 Authentication Parameters

### OAuth Configuration (if using)
```
GOOGLE_CLIENT_ID: "your-google-client-id"
GOOGLE_CLIENT_SECRET: "your-google-client-secret"  # Store in Supabase secrets
MICROSOFT_CLIENT_ID: "your-microsoft-client-id"  # If needed
MICROSOFT_CLIENT_SECRET: "your-microsoft-client-secret"  # Store in Supabase secrets
```

### Authentication Settings
```
ENABLE_GOOGLE_OAUTH: true | false
ENABLE_MICROSOFT_OAUTH: true | false
ENABLE_EMAIL_PASSWORD: true | false
PASSWORD_MIN_LENGTH: 8
REQUIRE_EMAIL_CONFIRMATION: true | false
```

## 📧 Email Configuration Parameters

### SMTP Settings (for Supabase Auth emails)
```
SMTP_HOST: "smtp.yourprovider.com"
SMTP_PORT: 587
SMTP_USER: "noreply@yourcompany.com"
SMTP_PASS: "your-smtp-password"  # Store in Supabase secrets
```

### Email Templates
```
WELCOME_EMAIL_TEMPLATE: "Custom welcome message"
PASSWORD_RESET_TEMPLATE: "Custom password reset message"
EMAIL_CONFIRMATION_TEMPLATE: "Custom email confirmation message"
```

## 🌐 Environment Variables Template

### Production Environment
```
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"

# Company Information
VITE_COMPANY_NAME="Your Company Name"
VITE_COMPANY_WEBSITE="https://yourcompany.com"
VITE_SUPPORT_EMAIL="support@yourcompany.com"

# Analytics & Tracking
VITE_GOOGLE_ANALYTICS_ID="GA-XXXXXXXXX"  # If using GA
VITE_TRACKING_ENABLED="true"

# Feature Flags
VITE_ENABLE_GOOGLE_OAUTH="true"
VITE_ENABLE_DOCUMENT_TRACKING="true"
VITE_ENABLE_AUDIO_TRACKING="true"
```

### Supabase Edge Function Environment Variables
```
# Store these in Supabase Dashboard > Settings > Secrets
TRACKING_SERVICE_ENDPOINT="https://realintelligence.com/customers/expos/[ORG_ID]/exhibitors/engine/w2x-engine.php"
SALESFORCE_ORG_ID="00D5e000000XXXXX"
SMTP_PASSWORD="your-smtp-password"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 📋 Setup Checklist

### Pre-Setup Requirements
- [ ] Salesforce Org ID obtained
- [ ] Real Intelligence account configured
- [ ] Supabase project created
- [ ] Domain/hosting configured
- [ ] Brand assets prepared (logos, images, etc.)

### Configuration Steps
- [ ] Update all company branding parameters
- [ ] Configure Salesforce integration endpoints
- [ ] Set up Supabase project and tables
- [ ] Configure authentication providers
- [ ] Upload and replace media assets
- [ ] Update tracking service configuration
- [ ] Set environment variables
- [ ] Test all integrations
- [ ] Deploy to production

### Post-Setup Validation
- [ ] Login/logout tracking works
- [ ] Document click tracking works
- [ ] Audio/video tracking works
- [ ] Form submissions track properly
- [ ] Email notifications work
- [ ] All links and media load correctly
- [ ] Responsive design works on all devices
- [ ] SSL certificate configured
- [ ] Custom domain working

## 📞 Technical Support

### Required Access for Setup
- Salesforce org admin access
- Supabase project owner access
- Domain DNS management access
- Hosting platform admin access

### Common Integration Points
1. **Salesforce Custom Objects**: Ensure `ri__Portal__c` object exists with required fields
2. **Real Intelligence Setup**: Verify tracking endpoint and field mappings
3. **Supabase RLS Policies**: Configure proper row-level security
4. **Authentication Flow**: Test login/logout with tracking
5. **Media Storage**: Ensure document/video URLs are accessible

---

**Note**: This template requires both Salesforce admin privileges and technical setup. Coordinate with both teams during implementation.