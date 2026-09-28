import { getAdminDashboardMetrics } from '@/lib/data-service';
import AdminCharts from '@/components/AdminCharts';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const metrics = await getAdminDashboardMetrics();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold font-serif text-slate-900">
          Institutional Analytics & Performance Reporting
        </h1>
        <p className="text-xs text-slate-500">
          Longitudinal participation trends, pass rates, competency improvements, and departmental
          benchmarks.
        </p>
      </div>

      <AdminCharts
        monthlyTrends={metrics.monthlyTrends}
        roleDistribution={metrics.roleDistribution}
        competencyAverages={metrics.competencyAverages}
      />
    </div>
  );
}
