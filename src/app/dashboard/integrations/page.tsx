"use client"

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
  MessageSquare,
  Webhook,
  Database,
  ExternalLink,
  Settings,
  Check,
  AlertTriangle,
  Clock,
  RefreshCw,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('connected')
  const [showApiKey, setShowApiKey] = useState(false)
  const [webhookEnabled, setWebhookEnabled] = useState(true)

  return (
    <div className="min-h-screen bg-routiq-cloud/5">
      <div className="max-w-8xl mx-auto space-y-6 p-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="bg-white p-6 rounded-lg">
              <h1 className="text-3xl font-bold text-routiq-core">Integrations</h1>
              <p className="text-routiq-blackberry/70 text-lg">Connect and manage your healthcare platform integrations</p>
            </div>
          </div>
        </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-routiq-cloud/10 p-1 h-12">
          <TabsTrigger value="connected" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm text-routiq-blackberry/70 hover:text-routiq-core transition-colors">
            <Check className="h-4 w-4" />
            <span className="font-medium">Connected</span>
          </TabsTrigger>
          <TabsTrigger value="available" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm text-routiq-blackberry/70 hover:text-routiq-core transition-colors">
            <ExternalLink className="h-4 w-4" />
            <span className="font-medium">Available</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm text-routiq-blackberry/70 hover:text-routiq-core transition-colors">
            <Settings className="h-4 w-4" />
            <span className="font-medium">API & Webhooks</span>
          </TabsTrigger>
        </TabsList>

        {/* Connected Services Tab */}
        <TabsContent value="connected" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-routiq-core">Connected Integrations</CardTitle>
              <CardDescription>Manage your active healthcare platform connections</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0 divide-y divide-gray-200">
                {/* Chatwoot */}
                <div className="flex items-start justify-between p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-routiq-core">Chatwoot</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Customer support conversations</p>
                      <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
                        <span>surf-rehab.chatwoot.com</span>
                        <span>47 conversations today</span>
                        <span>Last sync: 2 minutes ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </div>

                {/* n8n Workflows */}
                <div className="flex items-start justify-between p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <Webhook className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-routiq-core">n8n Workflows</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Automation and data processing</p>
                      <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
                        <span>routiq-workflows.n8n.cloud</span>
                        <span>12 active workflows</span>
                        <span>98.5% success rate</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open n8n
                    </Button>
                  </div>
                </div>

                {/* Twilio */}
                <div className="flex items-start justify-between p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-routiq-core">Twilio</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                      </div>
                      <p className="text-sm text-gray-600">SMS & voice communications</p>
                      <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
                        <span>+61 4 0000 0000</span>
                        <span>34 SMS sent today</span>
                        <span>99.2% delivery rate</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Console
                    </Button>
                  </div>
                </div>

                {/* Cliniko */}
                <div className="flex items-start justify-between p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                      <Database className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-routiq-core">Cliniko</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Practice management system</p>
                      <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
                        <span>Surf Rehab Clinic</span>
                        <span>247 patients synced</span>
                        <span>Last sync: 8 minutes ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync
                    </Button>
                  </div>
                </div>

                {/* Nookal */}
                <div className="flex items-start justify-between p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                      <Database className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-routiq-core">Nookal</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Appointment booking & management</p>
                      <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
                        <span>Surf Rehab Center</span>
                        <span>18 appointments today</span>
                        <span>Last sync: 12 minutes ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </div>

                {/* HICAPS */}
                <div className="flex items-start justify-between p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <ExternalLink className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-routiq-core">HICAPS</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Insurance claims & payments</p>
                      <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
                        <span>Terminal: SR-001-MEL</span>
                        <span>12 claims today</span>
                        <span>98.5% success rate</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                  </div>
                </div>

                {/* Coviu */}
                <div className="flex items-start justify-between p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <ExternalLink className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-routiq-core">Coviu</h3>
                        <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                      </div>
                      <p className="text-sm text-gray-600">Telehealth consultations</p>
                      <div className="flex items-center gap-6 mt-2 text-xs text-gray-500">
                        <span>Surf Rehab</span>
                        <span>3 sessions today</span>
                        <span>156 total sessions</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Available Integrations Tab */}
        <TabsContent value="available" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* WhatsApp Business */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">WhatsApp Business</CardTitle>
                    <CardDescription>Direct patient messaging</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Connect WhatsApp Business API to enable direct patient communication and automated responses.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Messaging</Badge>
                  <Badge variant="secondary">Automation</Badge>
                  <Badge variant="secondary">Media</Badge>
                </div>
                <Button className="w-full bg-routiq-core hover:bg-routiq-core/90">
                  Connect WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Instagram Messaging */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-pink-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Instagram</CardTitle>
                    <CardDescription>Social media outreach</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Manage Instagram Direct Messages and engage with patients through social media.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Social</Badge>
                  <Badge variant="secondary">DMs</Badge>
                  <Badge variant="secondary">Stories</Badge>
                </div>
                <Button className="w-full bg-routiq-core hover:bg-routiq-core/90">
                  Connect Instagram
                </Button>
              </CardContent>
            </Card>

            {/* Stripe Payments */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Stripe</CardTitle>
                    <CardDescription>Payment processing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Process patient payments, manage subscriptions, and handle billing automatically.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Payments</Badge>
                  <Badge variant="secondary">Invoicing</Badge>
                  <Badge variant="secondary">Subscriptions</Badge>
                </div>
                <Button className="w-full bg-routiq-core hover:bg-routiq-core/90">
                  Connect Stripe
                </Button>
              </CardContent>
            </Card>

            {/* Telegram */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Telegram</CardTitle>
                    <CardDescription>Encrypted messaging</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Secure patient communication through Telegram with bot automation support.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Encrypted</Badge>
                  <Badge variant="secondary">Bots</Badge>
                  <Badge variant="secondary">Files</Badge>
                </div>
                <Button className="w-full" variant="outline">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Calendly */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Calendly</CardTitle>
                    <CardDescription>Appointment scheduling</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Sync appointment bookings and manage patient scheduling automatically.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Scheduling</Badge>
                  <Badge variant="secondary">Calendar</Badge>
                  <Badge variant="secondary">Reminders</Badge>
                </div>
                <Button className="w-full" variant="outline">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>

            {/* Square */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Square</CardTitle>
                    <CardDescription>Point of sale & payments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Accept payments, process cards, and manage transactions at your clinic.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Payments</Badge>
                  <Badge variant="secondary">Card Terminal</Badge>
                  <Badge variant="secondary">Receipts</Badge>
                </div>
                <Button className="w-full bg-routiq-core hover:bg-routiq-core/90">
                  Connect Square
                </Button>
              </CardContent>
            </Card>

            {/* Physitrack */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Physitrack</CardTitle>
                    <CardDescription>Exercise prescription</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Prescribe exercises, track patient compliance, and monitor progress.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Exercise Library</Badge>
                  <Badge variant="secondary">Patient Portal</Badge>
                  <Badge variant="secondary">Compliance</Badge>
                </div>
                <Button className="w-full bg-routiq-core hover:bg-routiq-core/90">
                  Connect Physitrack
                </Button>
              </CardContent>
            </Card>

            {/* Google Calendar */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Google Calendar</CardTitle>
                    <CardDescription>Appointment scheduling</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Sync appointments with Google Calendar for seamless scheduling.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Sync</Badge>
                  <Badge variant="secondary">Reminders</Badge>
                  <Badge variant="secondary">Shared Calendars</Badge>
                </div>
                <Button className="w-full bg-routiq-core hover:bg-routiq-core/90">
                  Connect Google
                </Button>
              </CardContent>
            </Card>

            {/* Medicare Online */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Medicare Online</CardTitle>
                    <CardDescription>Medicare & DVA billing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Submit Medicare and DVA claims directly from your practice management system.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Medicare</Badge>
                  <Badge variant="secondary">DVA</Badge>
                  <Badge variant="secondary">Bulk Billing</Badge>
                </div>
                <Button className="w-full" variant="outline">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* API & Webhooks Tab */}
        <TabsContent value="api" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-routiq-core">API Configuration</CardTitle>
                <CardDescription>Manage your API keys and access settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value="rq_live_sk_1234567890abcdef..."
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Use this key to authenticate API requests
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhook-url"
                      value="https://routiq-frontend.vercel.app/api/webhooks"
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="webhook-enabled">Enable Webhooks</Label>
                    <p className="text-xs text-gray-500">Receive real-time event notifications</p>
                  </div>
                  <Switch
                    id="webhook-enabled"
                    checked={webhookEnabled}
                    onCheckedChange={setWebhookEnabled}
                  />
                </div>

                <Button className="w-full bg-routiq-core hover:bg-routiq-core/90">
                  Regenerate API Key
                </Button>
              </CardContent>
            </Card>

            {/* Webhook Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-routiq-core">Webhook Events</CardTitle>
                <CardDescription>Configure which events trigger webhooks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Conversation Created</p>
                      <p className="text-xs text-gray-500">New patient conversation started</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Message Received</p>
                      <p className="text-xs text-gray-500">New message from patient</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Appointment Booked</p>
                      <p className="text-xs text-gray-500">Patient books new appointment</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment Processed</p>
                      <p className="text-xs text-gray-500">Patient payment completed</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Data Export</p>
                      <p className="text-xs text-gray-500">Data export job completed</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-medium">Recent Webhook Deliveries</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>conversation.created</span>
                      <span className="text-green-600">200 OK</span>
                    </div>
                    <div className="flex justify-between">
                      <span>message.received</span>
                      <span className="text-green-600">200 OK</span>
                    </div>
                    <div className="flex justify-between">
                      <span>conversation.created</span>
                      <span className="text-red-600">500 Error</span>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View All Deliveries
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
} 