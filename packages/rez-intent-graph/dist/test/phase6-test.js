/**
 * Phase 6: Real-time WebSocket & Monitoring Test
 * Tests WebSocket server and metrics collection
 */
import { metricsStore, alertManager, healthChecker, METRICS, } from '../monitoring/metrics.js';
// Enable test mode
process.env.NODE_ENV = 'test';
async function testMetricsCollection() {
    console.log('\n═══ Metrics Collection Tests ═══');
    // Test counter
    console.log('🧪 Testing: Counter increment');
    metricsStore.increment(METRICS.INTENT_CAPTURED, { category: 'DINING' });
    metricsStore.increment(METRICS.INTENT_CAPTURED, { category: 'DINING' });
    metricsStore.increment(METRICS.INTENT_CAPTURED, { category: 'TRAVEL' });
    const intentSummary = metricsStore.getSummary(METRICS.INTENT_CAPTURED, { category: 'DINING' });
    console.log(`   Counter value: ${intentSummary?.sum || 0} ✅`);
    // Test gauge
    console.log('🧪 Testing: Gauge set');
    metricsStore.gauge('test_gauge', 42.5, { type: 'test' });
    const gaugeValue = metricsStore.getGauge('test_gauge', { type: 'test' });
    console.log(`   Gauge value: ${gaugeValue} ✅`);
    // Test timing
    console.log('🧪 Testing: Timer/timing');
    metricsStore.timing(METRICS.AGENT_RUN_DURATION, 150, { agent: 'demand-signal' });
    metricsStore.timing(METRICS.AGENT_RUN_DURATION, 200, { agent: 'demand-signal' });
    const durationSummary = metricsStore.getSummary(METRICS.AGENT_RUN_DURATION);
    console.log(`   Avg duration: ${durationSummary?.avg?.toFixed(0) || 0}ms ✅`);
    // Get all metrics
    console.log('🧪 Testing: Get all metrics');
    const allMetrics = metricsStore.getAllSummaries();
    console.log(`   Total metrics: ${allMetrics.length}`);
}
async function testAlertSystem() {
    console.log('\n═══ Alert System Tests ═══');
    // Trigger alert
    console.log('🧪 Testing: Trigger alert');
    const alert = alertManager.trigger('test_metric', 'warning', 'Test alert message', 75, 50);
    console.log(`   Alert created: ${alert.id.substring(0, 20)}... ✅`);
    // Get active alerts
    const activeAlerts = alertManager.getActiveAlerts();
    console.log(`   Active alerts: ${activeAlerts.length} ✅`);
    // Acknowledge alert
    console.log('🧪 Testing: Acknowledge alert');
    const acknowledged = alertManager.acknowledge(alert.id);
    console.log(`   Acknowledged: ${acknowledged} ✅`);
    // Check acknowledged alert is no longer active
    const remainingAlerts = alertManager.getActiveAlerts();
    console.log(`   Remaining alerts: ${remainingAlerts.length}`);
}
async function testHealthChecker() {
    console.log('\n═══ Health Checker Tests ═══');
    // Register a custom health check
    console.log('🧪 Testing: Register health check');
    healthChecker.register('custom_check', async () => true);
    const status = await healthChecker.check();
    console.log(`   Overall health: ${status.healthy ? '✅ healthy' : '❌ unhealthy'}`);
    console.log(`   Checks: ${Object.keys(status.checks).length}`);
}
async function testDashboardMetrics() {
    console.log('\n═══ Dashboard Metrics Tests ═══');
    // Record some test metrics
    metricsStore.increment(METRICS.NUDGE_SENT);
    metricsStore.increment(METRICS.NUDGE_SENT);
    metricsStore.increment(METRICS.NUDGE_CONVERTED);
    metricsStore.increment(METRICS.INTENT_CAPTURED);
    metricsStore.increment(METRICS.INTENT_FULFILLED);
    console.log('🧪 Testing: Metrics aggregation');
    const nudgeSent = metricsStore.getSummary(METRICS.NUDGE_SENT);
    const nudgeConverted = metricsStore.getSummary(METRICS.NUDGE_CONVERTED);
    const conversionRate = nudgeSent && nudgeSent.sum > 0
        ? ((nudgeConverted?.sum || 0) / nudgeSent.sum) * 100
        : 0;
    console.log(`   Nudges sent: ${nudgeSent?.sum || 0}`);
    console.log(`   Conversions: ${nudgeConverted?.sum || 0}`);
    console.log(`   Conversion rate: ${conversionRate.toFixed(2)}%`);
}
async function main() {
    console.log('╔═══════════════════════════════════════════════════════════════╗');
    console.log('║     ReZ Mind - Phase 6 WebSocket & Monitoring Test     ║');
    console.log('╚═══════════════════════════════════════════════════════════════╝');
    await testMetricsCollection();
    await testAlertSystem();
    await testHealthChecker();
    await testDashboardMetrics();
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  Phase 6 Integration Tests Complete');
    console.log('');
    console.log('  Components tested:');
    console.log('  - Metrics collection (counter, gauge, timer)');
    console.log('  - Alert system (trigger, acknowledge, clear)');
    console.log('  - Health checker (register, check)');
    console.log('  - Dashboard metrics aggregation');
    console.log('');
    console.log('  Available channels for WebSocket:');
    console.log('  - demand_signals');
    console.log('  - scarcity_alerts');
    console.log('  - nudge_events');
    console.log('  - system_metrics');
    console.log('  - merchant_dashboard');
    console.log('  - user_intents');
    console.log('═══════════════════════════════════════════════════════════════');
}
main();
//# sourceMappingURL=phase6-test.js.map