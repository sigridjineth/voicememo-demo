import { useState } from 'react';
import { Save, User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/stores';
import { CATEGORIES, DEFAULTS } from '@/lib/constants';

export function Settings() {
  const { user, updateProfile } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [preferences, setPreferences] = useState({
    language: user?.settings?.language || DEFAULTS.LANGUAGE,
    autoTranscribe: user?.settings?.autoTranscribe ?? true,
    defaultCategory: user?.settings?.defaultCategory || DEFAULTS.MEMO_CATEGORY,
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    reminderNotifications: true,
  });

  const [appearance, setAppearance] = useState({
    theme: 'system',
    compactMode: false,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: profile.name,
        settings: {
          ...user?.settings,
          ...preferences,
        },
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Globe className="h-4 w-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>
                Customize how the app works for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, language: value })
                  }
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko-KR">한국어</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                    <SelectItem value="ja-JP">日本語</SelectItem>
                    <SelectItem value="zh-CN">中文</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-transcribe">Auto-transcribe</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically transcribe audio recordings
                  </p>
                </div>
                <Switch
                  id="auto-transcribe"
                  checked={preferences.autoTranscribe}
                  onCheckedChange={(checked) =>
                    setPreferences({ ...preferences, autoTranscribe: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-category">Default Category</Label>
                <Select
                  value={preferences.defaultCategory}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, defaultCategory: value })
                  }
                >
                  <SelectTrigger id="default-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProfile} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Control how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates and reminders via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications in your browser
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="reminder-notifications">Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about unfinished memos
                  </p>
                </div>
                <Switch
                  id="reminder-notifications"
                  checked={notifications.reminderNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, reminderNotifications: checked })
                  }
                />
              </div>

              <Button disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the app
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={appearance.theme}
                  onValueChange={(value) =>
                    setAppearance({ ...appearance, theme: value })
                  }
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-mode">Compact Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduce spacing and make UI more compact
                  </p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={appearance.compactMode}
                  onCheckedChange={(checked) =>
                    setAppearance({ ...appearance, compactMode: checked })
                  }
                />
              </div>

              <Button disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                Save Appearance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}