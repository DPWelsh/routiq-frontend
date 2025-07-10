"use client"

import { useUser, useClerk } from '@clerk/nextjs'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Bell, 
  Shield, 
  Zap,
  Settings as SettingsIcon,
  Save,
  Download,
  Trash2,
  AlertTriangle,
  MessageSquare,
  Webhook,
  Database,
  ExternalLink,
  Building2,
  Search,
  Upload,
  UserPlus
} from 'lucide-react'

export default function SettingsContent() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  
  const [activeTab, setActiveTab] = useState('account')
  const [searchTerm, setSearchTerm] = useState('')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  })

  // Search functionality across all settings
  const searchableContent = {
    account: ['clinic', 'staff', 'billing', 'profile', 'team', 'practice'],
    integrations: ['cliniko', 'chatwoot', 'api', 'webhook', 'sync', 'connection'],
    security: ['password', '2fa', 'roles', 'permissions', 'access', 'privacy'],
    notifications: ['alerts', 'reports', 'roi', 'email', 'sms', 'booking'],
    advanced: ['theme', 'backup', 'timezone', 'language', 'preferences']
  }

  const filteredTabs = searchTerm 
    ? Object.entries(searchableContent)
        .filter(([tab, keywords]) => 
          keywords.some(keyword => 
            keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tab.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .map(([tab]) => tab)
    : ['account', 'integrations', 'security', 'notifications', 'advanced']

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-routiq-core"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-routiq-cloud/5">
      <div className="max-w-8xl mx-auto space-y-6 p-6">
        {/* Header with Search */}
        <div className="space-y-4 bg-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-routiq-core">Settings</h1>
              <p className="text-routiq-blackberry/70 text-lg">Manage your clinic and system preferences</p>
            </div>
          
          {/* Settings Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-routiq-blackberry/50 h-4 w-4" />
            <Input
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-50 border-routiq-cloud/30 focus:border-routiq-core"
            />
          </div>
        </div>


      </div>

      {/* Enhanced 5-Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-routiq-cloud/10 h-12 rounded-lg p-1">
          {filteredTabs.includes('account') && (
            <TabsTrigger 
              value="account" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm"
            >
              <Building2 className="h-4 w-4" />
              Account
            </TabsTrigger>
          )}
          {filteredTabs.includes('integrations') && (
            <TabsTrigger 
              value="integrations" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm"
            >
              <Zap className="h-4 w-4" />
              Integrations
            </TabsTrigger>
          )}
          {filteredTabs.includes('security') && (
            <TabsTrigger 
              value="security" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm"
            >
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          )}
          {filteredTabs.includes('notifications') && (
            <TabsTrigger 
              value="notifications" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          )}
          {filteredTabs.includes('advanced') && (
            <TabsTrigger 
              value="advanced" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm"
            >
              <SettingsIcon className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          )}
        </TabsList>

        {/* Account Tab - Clinic & Staff Management */}
        <TabsContent value="account" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Clinic Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-routiq-cloud/20">
                <Building2 className="h-5 w-5 text-routiq-core" />
                <h2 className="text-lg font-semibold text-routiq-core">Clinic Details</h2>
              </div>
              
              <Card className="border-routiq-cloud/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-routiq-core">Practice Information</CardTitle>
                  <CardDescription>Manage your clinic&apos;s core details and branding</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Clinic Logo Upload Placeholder */}
                  <div className="flex items-center gap-4 p-4 border-2 border-dashed border-routiq-cloud/30 rounded-lg">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-routiq-core to-routiq-energy flex items-center justify-center text-white font-bold text-xl">
                      {user?.firstName?.[0] || 'C'}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-routiq-core">Clinic Logo</h4>
                      <p className="text-sm text-routiq-blackberry/60 mb-2">Upload your practice logo (recommended: 200x200px)</p>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload Logo
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinicName" className="text-sm font-medium">Clinic Name</Label>
                      <Input 
                        id="clinicName" 
                        placeholder="Your Practice Name"
                        className="border-routiq-cloud/30 focus:border-routiq-core"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="practiceType" className="text-sm font-medium">Practice Type</Label>
                      <Input 
                        id="practiceType" 
                        placeholder="e.g., Physiotherapy, Osteopathy"
                        className="border-routiq-cloud/30 focus:border-routiq-core"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clinicAddress" className="text-sm font-medium">Address</Label>
                    <Input 
                      id="clinicAddress" 
                      placeholder="Full practice address"
                      className="border-routiq-cloud/30 focus:border-routiq-core"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinicPhone" className="text-sm font-medium">Phone</Label>
                      <Input 
                        id="clinicPhone" 
                        placeholder="+1 (555) 123-4567"
                        className="border-routiq-cloud/30 focus:border-routiq-core"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinicEmail" className="text-sm font-medium">Business Email</Label>
                      <Input 
                        id="clinicEmail" 
                        type="email"
                        placeholder="contact@yourpractice.com"
                        className="border-routiq-cloud/30 focus:border-routiq-core"
                      />
                    </div>
                  </div>

                  <Button className="w-full bg-routiq-core hover:bg-routiq-core/90 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save Clinic Details
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Staff Management Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-routiq-cloud/20">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-routiq-core" />
                  <h2 className="text-lg font-semibold text-routiq-core">Staff Management</h2>
                </div>
                <Button size="sm" className="bg-routiq-core hover:bg-routiq-core/90 text-white">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Invite Staff
                </Button>
              </div>
              
              <Card className="border-routiq-cloud/30">
                <CardHeader className="pb-4">
                  <CardTitle className="text-routiq-core">Team Members</CardTitle>
                  <CardDescription>Manage staff access and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Current User */}
                  <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg bg-routiq-cloud/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-routiq-core to-routiq-energy flex items-center justify-center text-white text-sm font-semibold">
                        {user?.firstName?.[0] || user?.emailAddresses[0]?.emailAddress[0]?.toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium text-routiq-core">
                          {user?.firstName} {user?.lastName}
                        </h4>
                        <p className="text-sm text-routiq-blackberry/60">
                          {user?.emailAddresses[0]?.emailAddress}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-routiq-core text-white">Owner</Badge>
                      <p className="text-xs text-routiq-blackberry/60 mt-1">Full Access</p>
                    </div>
                  </div>

                  {/* Placeholder for additional staff */}
                  <div className="text-center py-6 border-2 border-dashed border-routiq-cloud/30 rounded-lg">
                    <User className="h-8 w-8 text-routiq-blackberry/40 mx-auto mb-2" />
                    <p className="text-routiq-blackberry/60 mb-3">No additional staff members</p>
                    <Button variant="outline" size="sm">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Invite First Staff Member
                    </Button>
                  </div>

                  {/* Role Overview */}
                  <div className="grid grid-cols-3 gap-2 pt-4 border-t border-routiq-cloud/20">
                    <div className="text-center p-2">
                      <Badge variant="outline" className="w-full justify-center mb-1">Owner</Badge>
                      <p className="text-xs text-routiq-blackberry/60">Full access</p>
                    </div>
                    <div className="text-center p-2">
                      <Badge variant="outline" className="w-full justify-center mb-1">Receptionist</Badge>
                      <p className="text-xs text-routiq-blackberry/60">Booking & admin</p>
                    </div>
                    <div className="text-center p-2">
                      <Badge variant="outline" className="w-full justify-center mb-1">Practitioner</Badge>
                      <p className="text-xs text-routiq-blackberry/60">Patient care</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Integrations Tab - Enhanced with Health Monitoring */}
        <TabsContent value="integrations" className="space-y-6 mt-6">
          <div className="flex items-center gap-3 pb-2 border-b border-routiq-cloud/20">
            <Zap className="h-5 w-5 text-routiq-core" />
            <h2 className="text-lg font-semibold text-routiq-core">Integrations</h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Healthcare Platform Integrations */}
            <Card className="border-routiq-cloud/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-routiq-core">Healthcare Platforms</CardTitle>
                <CardDescription>Connect your practice management systems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cliniko Integration */}
                <div className="flex items-center justify-between p-4 border border-routiq-cloud/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-routiq-core">Cliniko</h4>
                      <p className="text-sm text-routiq-blackberry/60">Practice management system</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-700">Connected • Last sync: 2 min ago</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>

                {/* Chatwoot Integration */}
                <div className="flex items-center justify-between p-4 border border-routiq-cloud/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-routiq-core">Chatwoot</h4>
                      <p className="text-sm text-routiq-blackberry/60">Customer conversations</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-700">Connected • Webhook active</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Communication Channels */}
            <Card className="border-routiq-cloud/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-routiq-core">Communication Channels</CardTitle>
                <CardDescription>Manage patient communication platforms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* WhatsApp */}
                <div className="flex items-center justify-between p-4 border border-routiq-cloud/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-routiq-core">WhatsApp Business</h4>
                      <p className="text-sm text-routiq-blackberry/60">Direct patient messaging</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-yellow-700">Setup required</span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-routiq-core hover:bg-routiq-core/90 text-white" size="sm">
                    Connect
                  </Button>
                </div>

                {/* Instagram */}
                <div className="flex items-center justify-between p-4 border border-routiq-cloud/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-pink-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-routiq-core">Instagram</h4>
                      <p className="text-sm text-routiq-blackberry/60">Social media outreach</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-gray-600">Not connected</span>
                      </div>
                    </div>
                  </div>
                  <Button className="bg-routiq-core hover:bg-routiq-core/90 text-white" size="sm">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab - Enhanced Role Management */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <div className="flex items-center gap-3 pb-2 border-b border-routiq-cloud/20">
            <Shield className="h-5 w-5 text-routiq-core" />
            <h2 className="text-lg font-semibold text-routiq-core">Security & Access</h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Authentication Security */}
            <Card className="border-routiq-cloud/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-routiq-core">Authentication</CardTitle>
                <CardDescription>Protect your account with advanced security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-routiq-core">Two-Factor Authentication</h4>
                    <p className="text-sm text-routiq-blackberry/60">Add extra security to your account</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Setup 2FA
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-routiq-core">Password</h4>
                    <p className="text-sm text-routiq-blackberry/60">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-routiq-core">Active Sessions</h4>
                    <p className="text-sm text-routiq-blackberry/60">Manage logged-in devices</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data & Privacy */}
            <Card className="border-routiq-cloud/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-routiq-core">Data & Privacy</CardTitle>
                <CardDescription>Control your data and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-routiq-core">Export Data</h4>
                    <p className="text-sm text-routiq-blackberry/60">Download your account data</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-routiq-core">Data Retention</h4>
                    <p className="text-sm text-routiq-blackberry/60">Manage data storage policies</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-routiq-core">Privacy Settings</h4>
                    <p className="text-sm text-routiq-blackberry/60">Control data sharing preferences</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab - Smart Healthcare Alerts */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <div className="flex items-center gap-3 pb-2 border-b border-routiq-cloud/20">
            <Bell className="h-5 w-5 text-routiq-core" />
            <h2 className="text-lg font-semibold text-routiq-core">Notifications & Alerts</h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Smart Healthcare Alerts */}
            <Card className="border-routiq-cloud/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-routiq-core">Smart Alerts</CardTitle>
                <CardDescription>Automated alerts for your practice KPIs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-routiq-core">Rebooking Rate Alert</h4>
                      <p className="text-sm text-routiq-blackberry/60">Alert when rate drops below threshold</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-routiq-core">Patient NPS Monitoring</h4>
                      <p className="text-sm text-routiq-blackberry/60">Alert when satisfaction falls below 3.5/5</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-routiq-core">Booking Volume Alert</h4>
                      <p className="text-sm text-routiq-blackberry/60">Alert when no bookings in 24 hours</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reports & Communication */}
            <Card className="border-routiq-cloud/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-routiq-core">Reports & Communication</CardTitle>
                <CardDescription>Delivery preferences for reports and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-routiq-core">Weekly ROI Reports</h4>
                      <p className="text-sm text-routiq-blackberry/60">Automated email delivery every Monday</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-routiq-core">Email Notifications</h4>
                      <p className="text-sm text-routiq-blackberry/60">Important updates via email</p>
                    </div>
                    <Switch 
                      checked={notifications.email}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                    <div>
                      <h4 className="font-medium text-routiq-core">Push Notifications</h4>
                      <p className="text-sm text-routiq-blackberry/60">Browser alerts for urgent items</p>
                    </div>
                    <Switch 
                      checked={notifications.push}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, push: checked }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Advanced Tab - System Preferences */}
        <TabsContent value="advanced" className="space-y-6 mt-6">
          <div className="flex items-center gap-3 pb-2 border-b border-routiq-cloud/20">
            <SettingsIcon className="h-5 w-5 text-routiq-core" />
            <h2 className="text-lg font-semibold text-routiq-core">Advanced Settings</h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* System Preferences */}
            <Card className="border-routiq-cloud/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-routiq-core">System Preferences</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Timezone</Label>
                    <select className="w-full p-2 border border-routiq-cloud/30 rounded-md text-sm">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (GMT)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Date Format</Label>
                    <select className="w-full p-2 border border-routiq-cloud/30 rounded-md text-sm">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Language</Label>
                  <select className="w-full p-2 border border-routiq-cloud/30 rounded-md text-sm">
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Spanish</option>
                    <option>French</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Backup & Maintenance */}
            <Card className="border-routiq-cloud/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-routiq-core">Backup & Maintenance</CardTitle>
                <CardDescription>Manage data backup and system maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-routiq-core">Automatic Backups</h4>
                    <p className="text-sm text-routiq-blackberry/60">Last backup: 2 hours ago</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-routiq-core">Manual Backup</h4>
                    <p className="text-sm text-routiq-blackberry/60">Create an immediate backup</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Backup Now
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-routiq-cloud/20 rounded-lg">
                  <div>
                    <h4 className="font-medium text-routiq-core">Maintenance Window</h4>
                    <p className="text-sm text-routiq-blackberry/60">Schedule system updates</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

        {/* Save Settings Footer */}
        <div className="border-t border-routiq-cloud/20 pt-4 flex justify-between items-center">
          <p className="text-sm text-routiq-blackberry/60">
            Settings are automatically saved when changed
          </p>
          <Button className="bg-routiq-core hover:bg-routiq-core/90 text-white">
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>
    </div>
  )
} 