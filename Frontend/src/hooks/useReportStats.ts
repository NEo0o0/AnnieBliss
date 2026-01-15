"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase/client';

interface MonthlyReportStats {
  total_bookings: number;
  total_revenue: number;
  total_dropins: number;
  total_package_bookings: number;
  unique_members: number;
  avg_attendance_rate?: number;
  top_class_type?: string;
}

interface MonthlyFinancials {
  total_revenue: number;
  dropin_revenue: number;
  package_revenue: number;
  total_expenses?: number;
  net_profit?: number;
  payment_breakdown?: {
    cash: number;
    bank_transfer: number;
    credit_card: number;
    promptpay: number;
  };
}

interface YearlyReportStats {
  total_bookings: number;
  total_revenue: number;
  total_members: number;
  monthly_breakdown?: Array<{
    month: number;
    bookings: number;
    revenue: number;
  }>;
}

export function useReportStats() {
  const [monthlyStats, setMonthlyStats] = useState<MonthlyReportStats | null>(null);
  const [monthlyFinancials, setMonthlyFinancials] = useState<MonthlyFinancials | null>(null);
  const [yearlyStats, setYearlyStats] = useState<YearlyReportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // AbortController refs to cancel stale requests
  const monthlyStatsAbortController = useRef<AbortController | null>(null);
  const monthlyFinancialsAbortController = useRef<AbortController | null>(null);
  const yearlyStatsAbortController = useRef<AbortController | null>(null);

  const fetchMonthlyStats = useCallback(async (year: number, month: number, isBackgroundRefresh = false) => {
    // Cancel any pending request
    if (monthlyStatsAbortController.current) {
      monthlyStatsAbortController.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    monthlyStatsAbortController.current = controller;

    try {
      // Stale-while-revalidate: Only show loading spinner on initial load
      setMonthlyStats((prev) => {
        if (!prev || !isBackgroundRefresh) {
          setLoading(true);
        } else {
          setIsValidating(true);
        }
        return prev;
      });
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('get_monthly_report_stats', {
        target_year: year,
        target_month: month,
      });

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (rpcError) throw rpcError;

      setMonthlyStats(data as unknown as MonthlyReportStats);
    } catch (err) {
      // Ignore abort errors
      if (controller.signal.aborted) return;
      
      setError(err as Error);
      console.error('Error fetching monthly stats:', err);
    } finally {
      // Only reset loading if this request wasn't aborted
      if (!controller.signal.aborted) {
        setLoading(false);
        setIsValidating(false);
      }
    }
  }, []);

  const fetchMonthlyFinancials = useCallback(async (year: number, month: number, isBackgroundRefresh = false) => {
    // Cancel any pending request
    if (monthlyFinancialsAbortController.current) {
      monthlyFinancialsAbortController.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    monthlyFinancialsAbortController.current = controller;

    try {
      // Stale-while-revalidate: Only show loading spinner on initial load
      setMonthlyFinancials((prev) => {
        if (!prev || !isBackgroundRefresh) {
          setLoading(true);
        } else {
          setIsValidating(true);
        }
        return prev;
      });
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('get_monthly_financials', {
        year_input: year,
        month_input: month,
      });

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (rpcError) throw rpcError;

      setMonthlyFinancials(data as unknown as MonthlyFinancials);
    } catch (err) {
      // Ignore abort errors
      if (controller.signal.aborted) return;
      
      setError(err as Error);
      console.error('Error fetching monthly financials:', err);
    } finally {
      // Only reset loading if this request wasn't aborted
      if (!controller.signal.aborted) {
        setLoading(false);
        setIsValidating(false);
      }
    }
  }, []);

  const fetchYearlyStats = useCallback(async (year: number, isBackgroundRefresh = false) => {
    // Cancel any pending request
    if (yearlyStatsAbortController.current) {
      yearlyStatsAbortController.current.abort();
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    yearlyStatsAbortController.current = controller;

    try {
      // Stale-while-revalidate: Only show loading spinner on initial load
      setYearlyStats((prev) => {
        if (!prev || !isBackgroundRefresh) {
          setLoading(true);
        } else {
          setIsValidating(true);
        }
        return prev;
      });
      setError(null);

      const { data, error: rpcError } = await supabase.rpc('get_yearly_report_stats', {
        target_year: year,
      });

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (rpcError) throw rpcError;

      setYearlyStats(data as unknown as YearlyReportStats);
    } catch (err) {
      // Ignore abort errors
      if (controller.signal.aborted) return;
      
      setError(err as Error);
      console.error('Error fetching yearly stats:', err);
    } finally {
      // Only reset loading if this request wasn't aborted
      if (!controller.signal.aborted) {
        setLoading(false);
        setIsValidating(false);
      }
    }
  }, []);

  useEffect(() => {
    // Cleanup: Abort all pending requests on unmount
    return () => {
      if (monthlyStatsAbortController.current) {
        monthlyStatsAbortController.current.abort();
      }
      if (monthlyFinancialsAbortController.current) {
        monthlyFinancialsAbortController.current.abort();
      }
      if (yearlyStatsAbortController.current) {
        yearlyStatsAbortController.current.abort();
      }
    };
  }, []);

  return {
    monthlyStats,
    monthlyFinancials,
    yearlyStats,
    loading,
    isValidating,
    error,
    fetchMonthlyStats,
    fetchMonthlyFinancials,
    fetchYearlyStats,
  };
}
