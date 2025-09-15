# Real Intelligence Investor Portal Template - Customization Guide

This template is based on a fully functional investor portal and contains placeholder data that needs to be customized for your specific use case.

## 🔧 Required Configurations

### 1. Supabase Setup
1. Create a new Supabase project
2. Update the following files with your Supabase credentials:
   - `src/integrations/supabase/client.ts` - Update SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY
   - `.env` - Update all VITE_SUPABASE_* variables

### 2. Tracking Service Configuration
**File:** `supabase/functions/track-document-action/index.ts`
- Replace the tracking endpoint with your service
- Update the FormData fields to match your tracking service API
- Set the `TRACKING_SERVICE_ENDPOINT` environment variable in Supabase

### 3. Company Branding & Content

#### Company Information
**Files to Update:**
- `src/data/companyUpdates.ts` - Replace all company updates with your content
- All component files containing "Template Company" references

**Search & Replace Needed:**
- "Template Company" → Your Company Name
- "portal.example-company.com" → Your portal URL
- "example-" URLs → Your actual service URLs

#### Media & Documents
**Files to Update:**
- `src/data/companyUpdates.ts` - Replace all document URLs
- `public/lovable-uploads/` - Replace all images with your company images

**Placeholder URLs to Replace:**
- `https://example-podcast.com/` → Your podcast service
- `https://example-docs.com/` → Your document hosting service  
- `https://example-videos.com/` → Your video hosting service
- `https://example-partner.com/` → Your partner websites

### 4. Contact Information
**Files to Update:**
- Search for "template-" email addresses and replace with real contact emails
- Update any phone numbers or addresses
- Replace social media links

### 5. Authentication & User Management
**Files to Check:**
- `src/services/loginService.ts` - Verify tracking integration
- `src/services/googleAuthService.ts` - Configure Google OAuth if needed
- `src/contexts/UserContext.tsx` - Review user data structure

## 🎨 Design Customization

### Color Scheme
**File:** `src/index.css`
- Update CSS custom properties in `:root` section
- Modify `--primary`, `--secondary`, `--accent` colors
- Adjust gradients and shadows to match your brand

### Typography
**File:** `tailwind.config.ts`
- Update font families
- Modify font sizes and spacing if needed

## 📊 Data Structure

### Company Updates Structure
**File:** `src/types/companyUpdates.ts`
```typescript
interface CompanyUpdate {
  title: string;
  date: string;
  description: string;
  category: string;
  documentUrl?: string;
  documentType?: "document" | "video" | "audio";
  embedCode?: string;
  url?: string;
}
```

### User Data Structure
Review `src/contexts/UserContext.tsx` for user data requirements.

## 🔐 Environment Variables Template

Create a `.env` file with:
```
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
```

## 🚀 Deployment Checklist

- [ ] Update all company branding
- [ ] Replace all placeholder URLs
- [ ] Configure Supabase project
- [ ] Set up tracking service
- [ ] Replace media assets
- [ ] Update contact information
- [ ] Test all forms and integrations
- [ ] Configure custom domain
- [ ] Set up SSL certificates
- [ ] Test authentication flows

## 📝 Content Areas to Customize

1. **Homepage Hero Section** - Company tagline and description
2. **About Section** - Company story and mission
3. **Investment Highlights** - Key selling points
4. **Contact Information** - Support details
5. **Footer** - Links and legal information
6. **Dashboard Content** - Investment data and metrics
7. **Document Library** - Investment documents and media

## 🛠 Technical Notes

- All external service integrations use placeholder endpoints
- Authentication flows are functional but need proper service configuration
- Database schema may need adjustments based on your data requirements
- The template includes comprehensive error handling and loading states
- All components are responsive and accessibility-compliant

## 📞 Support

For technical support with this template:
1. Check the Lovable documentation
2. Review Supabase integration guides  
3. Test with placeholder data first before connecting real services

---

**Important:** This template contains no sensitive data from the original project. All URLs, credentials, and business information have been replaced with placeholders.