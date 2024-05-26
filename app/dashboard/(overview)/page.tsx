import { Suspense } from 'react';
import { Card } from '../../ui/dashboard/cards';
import LatestInvoices from '../../ui/dashboard/latest-invoices';
import RevenueChart from '../../ui/dashboard/revenue-chart';
import { lusitana } from '../../ui/fonts';
import { fetchCardData } from '@/app/lib/data';
import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';

/**
 * This file must always exist in any nested directory to show it as a page
 * This is an async page since it will fetch data
 *
 * Path: www.example.com/dashboard
 * @returns
 */
export default async function Page() {
  return (
    // Fetching the revenue data
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* This is used to load async */}
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>

        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
