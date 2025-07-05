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
  Zap,
  MessageSquare,
  Webhook,
  Database,
  ExternalLink,
  Settings,
  Check,
  AlertTriangle,
  Clock,
  Activity,
  RefreshCw,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react'

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [showApiKey, setShowApiKey] = useState(false)
  const [webhookEnabled, setWebhookEnabled] = useState(true)

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-routiq-core">Integrations</h1>
        <p className="text-gray-600">Connect and manage your healthcare platform integrations</p>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-routiq-cloud/10 p-1 h-12">
          <TabsTrigger value="overview" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-routiq-core data-[state=active]:shadow-sm text-routiq-blackberry/70 hover:text-routiq-core transition-colors">
            <Zap className="h-4 w-4" />
            <span className="font-medium">Overview</span>
          </TabsTrigger>
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

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Connected Services</CardTitle>
                <Check className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-routiq-core">3</div>
                <p className="text-xs text-muted-foreground">+1 from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls Today</CardTitle>
                <Activity className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-routiq-core">1,247</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Webhook Status</CardTitle>
                <Webhook className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground">All endpoints healthy</p>
              </CardContent>
            </Card>
          </div>

          {/* Integration Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-routiq-core">Integration Health</CardTitle>
              <CardDescription>Real-time status of your connected services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">Chatwoot Integration</h4>
                      <p className="text-sm text-gray-600">Last sync: 2 minutes ago</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Healthy</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">n8n Workflows</h4>
                      <p className="text-sm text-gray-600">Last execution: 5 minutes ago</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium">Supabase Database</h4>
                      <p className="text-sm text-gray-600">Connection pool at 80%</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Connected Services Tab */}
        <TabsContent value="connected" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chatwoot */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Chatwoot</CardTitle>
                      <CardDescription>Customer support conversations</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Account</p>
                    <p className="font-medium">surf-rehab.chatwoot.com</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Sync</p>
                    <p className="font-medium">2 minutes ago</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Conversations Today</p>
                    <p className="font-medium">47</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* n8n */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Webhook className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">n8n Workflows</CardTitle>
                      <CardDescription>Automation and data processing</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Connected</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Instance</p>
                    <p className="font-medium">routiq-workflows.n8n.cloud</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Execution</p>
                    <p className="font-medium">5 minutes ago</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Active Workflows</p>
                    <p className="font-medium">12</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Success Rate</p>
                    <p className="font-medium text-green-600">98.5%</p>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open n8n
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Supabase */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Database className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Supabase</CardTitle>
                      <CardDescription>Database and real-time data</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Warning</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Project</p>
                    <p className="font-medium">routiq-production</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Region</p>
                    <p className="font-medium">ap-southeast-1</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Connection Pool</p>
                    <p className="font-medium text-yellow-600">80% used</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium text-green-600">Healthy</p>
                  </div>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">Connection pool usage is high</p>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Console
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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

            {/* Zoom */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Zoom</CardTitle>
                    <CardDescription>Video consultations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Enable video consultations and telemedicine appointments with patients.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Video</Badge>
                  <Badge variant="secondary">Recording</Badge>
                  <Badge variant="secondary">Scheduling</Badge>
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
  )
} 