import ActivityPanel from "../panels/ActivityPanel";
import CashflowPanel from "../panels/CashflowPanel";
import ConversionPanel from "../panels/ConversionPanel";
import DashboardPanel from "../panels/DashboardPanel";
import DealsPanel from "../panels/DealsPanel";
import EodPanel from "../panels/EodPanel";
import ForecastPanel from "../panels/ForecastPanel";
import PerformancePanel from "../panels/PerformancePanel";
import PipelinePanel from "../panels/PipelinePanel";
import PlannerPanel from "../panels/PlannerPanel";
import UsersPanel from "../panels/UsersPanel";
import WipPanel from "../panels/WipPanel";
import AppHeader from "./AppHeader";
import AppTabs from "./AppTabs";

export default function MainAppShell() {
  return (
    <div id="main-app" style={{ display: "none" }}>
      <div className="shell">
        <AppHeader />
        <div className="card">
          <AppTabs />
          <DashboardPanel />
          <DealsPanel />
          <ForecastPanel />
          <EodPanel />
          <ConversionPanel />
          <ActivityPanel />
          <PipelinePanel />
          <WipPanel />
          <CashflowPanel />
          <PlannerPanel />
          <PerformancePanel />
          <UsersPanel />
        </div>
      </div>
    </div>
  );
}
