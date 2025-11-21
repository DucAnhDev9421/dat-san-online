import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useTournament } from "./TournamentContext";

// Lazy load các component tabs
const OverviewTab = lazy(() => import("./tabs/OverviewTab"));
const ScheduleTab = lazy(() => import("./tabs/ScheduleTab"));
const StandingsTab = lazy(() => import("./tabs/StandingsTab"));
const TeamsTab = lazy(() => import("./tabs/TeamsTab"));
const TeamEditPage = lazy(() => import("./tabs/TeamEditPage"));
const CustomTab = lazy(() => import("./tabs/CustomTab"));

// Loading component
const PageLoader = () => (
  <>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#6b7280' }}>Đang tải...</p>
      </div>
    </div>
  </>
);

const TournamentRoutes = () => {
  const { tournament } = useTournament()
  
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewTab tournament={tournament} />} />
        <Route path="schedule" element={<ScheduleTab tournament={tournament} />} />
        <Route path="standings" element={<StandingsTab tournament={tournament} />} />
        <Route path="teams/:teamId" element={<TeamEditPage />} />
        <Route path="teams" element={<TeamsTab tournament={tournament} />} />
        <Route path="custom/*" element={<CustomTab tournament={tournament} />} />
        <Route path="*" element={<Navigate to="overview" replace />} />
      </Routes>
    </Suspense>
  );
};

export default TournamentRoutes;

