import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/hooks/use-auth';

// Analytics Dashboard components
const Overview = () => {
  interface OverviewData {
    user: {
      id: number;
      username: string;
      email: string;
      name: string | null;
    };
    stats: {
      totalSpent: number;
      totalPurchases: number;
      activePurchases: number;
      accessibleMuseums: number;
      totalMuseums: number;
    };
  }

  const { data, isLoading, error } = useQuery<OverviewData>({
    queryKey: ['/api/analytics/overview'],
    enabled: true,
  });

  if (isLoading) return <div className="flex justify-center p-8">Loading overview data...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading overview data</div>;
  if (!data) return <div className="text-red-500 p-4">No data available</div>;
  
  const { stats } = data;

  // Data for the pie chart
  const accessData = [
    { name: 'Accessible', value: stats.accessibleMuseums },
    { name: 'Not Accessible', value: stats.totalMuseums - stats.accessibleMuseums }
  ];
  
  const COLORS = ['#0088FE', '#CCCCCC'];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(stats.totalSpent / 100).toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Lifetime expenditure on museum tours</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPurchases}</div>
          <p className="text-xs text-muted-foreground">
            {stats.activePurchases} active, {stats.totalPurchases - stats.activePurchases} expired
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Access Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {Math.round((stats.accessibleMuseums / stats.totalMuseums) * 100)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.accessibleMuseums} of {stats.totalMuseums} museums accessible
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Museum Access</CardTitle>
        </CardHeader>
        <CardContent className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={accessData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {accessData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const PurchaseHistory = () => {
  interface PurchaseItem {
    id: number;
    type: 'museum' | 'bundle';
    itemName: string;
    price: number;
    purchaseDate: string;
    expiryDate: string;
    isActive: boolean;
    [key: string]: any; // To allow for additional fields without explicit typing
  }

  const { data, isLoading, error } = useQuery<PurchaseItem[]>({
    queryKey: ['/api/analytics/purchases'],
    enabled: true,
  });

  if (isLoading) return <div className="flex justify-center p-8">Loading purchase data...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading purchase data</div>;
  if (!data) return <div className="text-red-500 p-4">No purchase data available</div>;

  // Convert dates to formatted strings
  const formattedData = data.map((purchase: PurchaseItem) => ({
    ...purchase,
    purchaseDate: new Date(purchase.purchaseDate).toLocaleDateString(),
    expiryDate: new Date(purchase.expiryDate).toLocaleDateString(),
  }));

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <h3 className="text-lg font-semibold">Purchase History</h3>
        <p className="text-sm text-muted-foreground">Your complete purchase history with expiration dates</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">Item</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
              <th className="px-4 py-3 text-right text-sm font-medium">Price</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Purchase Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Expiry Date</th>
              <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {formattedData.map((purchase: any) => (
              <tr key={`${purchase.type}-${purchase.id}`} className="border-b">
                <td className="px-4 py-3 text-sm">{purchase.itemName}</td>
                <td className="px-4 py-3 text-sm capitalize">{purchase.type}</td>
                <td className="px-4 py-3 text-right text-sm">${(purchase.price / 100).toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">{purchase.purchaseDate}</td>
                <td className="px-4 py-3 text-sm">{purchase.expiryDate}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${purchase.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {purchase.isActive ? 'Active' : 'Expired'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MuseumStats = () => {
  interface MuseumStat {
    id: number;
    name: string;
    rating: number;
    price: number;
    popularity: number;
  }

  const { data, isLoading, error } = useQuery<MuseumStat[]>({
    queryKey: ['/api/analytics/museums'],
    enabled: true,
  });

  if (isLoading) return <div className="flex justify-center p-8">Loading museum statistics...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading museum statistics</div>;
  if (!data) return <div className="text-red-500 p-4">No museum statistics available</div>;

  // Format data for the charts
  const barChartData = data.map((museum: MuseumStat) => ({
    name: museum.name,
    price: museum.price / 100, // Convert cents to dollars
    rating: museum.rating / 10, // Convert 0-50 scale to 0-5 scale
    popularity: museum.popularity,
  }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Museum Ratings & Pricing</CardTitle>
          <CardDescription>Comparing ratings and prices across all museums</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="rating" name="Rating (0-5)" fill="#8884d8" />
              <Bar yAxisId="right" dataKey="price" name="Price ($)" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Museum Popularity</CardTitle>
          <CardDescription>Relative popularity of different museums</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="popularity" name="Popularity Score" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

const ActivityTracker = () => {
  interface ActivityData {
    museumId: number;
    visitDate: string;
    duration: number;
  }
  
  interface Museum {
    id: number;
    name: string;
    [key: string]: any;
  }

  const { data, isLoading, error } = useQuery<ActivityData[]>({
    queryKey: ['/api/analytics/user-activity'],
    enabled: true,
  });

  const { data: museumsData, isLoading: museumsLoading } = useQuery<Museum[]>({
    queryKey: ['/api/museums'],
    enabled: true,
  });

  if (isLoading || museumsLoading) return <div className="flex justify-center p-8">Loading activity data...</div>;
  if (error) return <div className="text-red-500 p-4">Error loading activity data</div>;
  if (!data || !museumsData) return <div className="text-red-500 p-4">No activity data available</div>;

  // Create a map of museumId to name for easier reference
  const museumMap = Object.fromEntries(museumsData.map((museum: Museum) => [museum.id, museum.name]));

  // Format data for the charts with museum names
  const activityData = data.map((activity: ActivityData) => ({
    ...activity,
    museumName: museumMap[activity.museumId] || `Museum ${activity.museumId}`,
    visitDateFormatted: new Date(activity.visitDate).toLocaleDateString(),
  }));

  // Sort by date
  activityData.sort((a: any, b: any) => new Date(a.visitDate).getTime() - new Date(b.visitDate).getTime());

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Visit Duration by Museum</CardTitle>
          <CardDescription>How much time you spent in each museum</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={activityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="museumName" angle={-45} textAnchor="end" height={70} />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="duration" name="Duration (minutes)" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Visit Timeline</CardTitle>
          <CardDescription>Your museum visits over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="visitDateFormatted" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
              />
              <YAxis label={{ value: 'Duration (min)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="duration" name="Visit Duration" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Analytics Dashboard Component
export default function AnalyticsDashboard() {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-sm">
          <p className="font-bold">Authentication Required</p>
          <p>Please log in to view your analytics dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || user?.username}. Here's your museum activity analytics.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
          <TabsTrigger value="museums">Museum Stats</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Overview />
        </TabsContent>
        
        <TabsContent value="purchases" className="space-y-4">
          <PurchaseHistory />
        </TabsContent>
        
        <TabsContent value="museums" className="space-y-4">
          <MuseumStats />
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <ActivityTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}