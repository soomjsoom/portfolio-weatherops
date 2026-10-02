/* All identifiers, people, weather observations and operational records are fictional. */
(function () {
  'use strict';
  function create() {
    const now = new Date();
    const at = now.toISOString();
    const date = new Date(now.getTime() + 9 * 3600000).toISOString().slice(0, 10);
    const levels = ['Red', 'Orange', 'Yellow', 'Green', 'Green', 'Yellow', 'Green'];
    const rainNow = [7.2, 3.8, .4, 0, 0, 1.5, 0];
    const rainMax = [19, 8, 2.6, .2, 0, 4.8, .1];
    const processed = [[52, 71, 85], [64, 86, 93], [78, 91, 102], [94, 101, 108], [96, 103, 112], [68, 88, 96], [91, 98, 105]];
    const revenue = [[43, 60, 74], [59, 78, 88], [72, 88, 99], [89, 98, 104], [92, 100, 108], [63, 81, 90], [86, 96, 101]];
    const stores = levels.map((level, i) => {
      const name = String.fromCharCode(65 + i) + '지점';
      const id = 'demo-' + String.fromCharCode(97 + i);
      return {
        id, name, region: '가상 권역 ' + String.fromCharCode(65 + i), dri: '운영 담당 ' + String.fromCharCode(65 + i),
        prodStatus: level, signalStatus: level, status: level, riskScore: [100, 84, 58, 20, 20, 64, 20][i],
        signalMode: 'prod', signalObservedAt: at, signalDataStatus: 'complete',
        signalReason: i < 3 || i === 5 ? '가상 강수 예보에 따른 현장 점검' : '가상 실황과 예보 정상 범위',
        signalRiskType: '강수', trigger: i < 3 || i === 5 ? '강수' : '정상',
        weather: `현재 ${rainNow[i]}mm / 예보 최대 ${rainMax[i]}mm`,
        weatherValues: { observedRain1h: rainNow[i], forecastMaxPcp1h: rainMax[i], observedAt: at,
          forecastMaxPop: [90, 85, 65, 20, 10, 70, 15][i], observedTemperature: 19 + i * .4,
          observedWind: 2.1 + i * .3, forecastMaxWind: 4.3 + i * .2,
          forecastMaxTemperature: 23 + i * .2, forecastMinTemperature: 16 + i * .2,
          forecastPeakTime: '16:00', forecastBaseAt: at, airObservedAt: at, pm10: 24 + i * 3, pm25: 12 + i },
        enhancedSignal: { available: true, validationMode: 'shadow', operationalImpact: 'none_validation_only',
          affectsProdActions: false, managerInputRequired: false, fusionStatus: level,
          sourceStatus: 'complete', awsStationId: 'DEMO-AWS-' + (i + 1), awsStationName: '가상 관측소 ' + (i + 1),
          awsObservedAt: at, awsRain15m: +(rainNow[i] / 4).toFixed(1), awsRain1h: rainNow[i],
          awsTemperature: 19 + i * .4, awsWind: 2.1 + i * .3,
          radarObservedAt: at, radarRainRate: rainNow[i] + .2,
          weatherWarningActiveSevere: false, weatherWarningSummary: '가상 기상특보 없음', weatherWarningIssuedAt: at,
          fusionReason: '가상 예보, 실황, 레이더 비교 검증', alertCount: 0, sourceErrors: [], sourceWarnings: '' },
        siteVulnerability: { provided: true, rainPoolingPoints: i % 2 ? '가상 출차 구간' : '가상 진입 구간',
          rainDrainageMinMinutes: 8 + i, rainDrainageMaxMinutes: 18 + i,
          rainRouteRisk: i < 3, rainEquipmentRisk: i === 0 ? '가상 배수 설비 점검' : '없음',
          rainOperationalHistory: '가상 현장 점검 이력', rainPriorityActions: ['배수 확인', '고객 동선 안전 확인'],
          windPriorityActions: ['외부 안내물 고정 확인'], source: 'synthetic', updatedAt: at },
        openIssueCount: level === 'Green' ? 0 : 1,
        asStatus: i === 0 ? 'AS 차단' : '정상', normalizationBlocker: i === 0 ? '가상 배수 설비 점검' : '',
        vendorStatus: i === 0 ? '가상 점검 진행' : '정상', vendorEta: i === 0 ? '17:00' : '',
        asReportedAt: i === 0 ? at : '', asReportId: i === 0 ? 'DEMO-AS-001' : '',
        downtimeMinutes: i === 0 ? 48 : 0, downtimeStartedAt: i === 0 ? new Date(now.getTime() - 48 * 60000).toISOString() : '',
        customerNoticeStatus: i < 2 ? '안내 완료' : '정상', customerImpact: i < 2 ? '가상 운영 제한 안내' : '영향 없음',
        recoveryStatus: i === 0 ? 'AS 차단' : processed[i][2] < 100 ? '회복 조치 필요' : '회복 완료',
        crmReady: i !== 0 && processed[i][2] < 100,
        nextAction: i === 0 ? '현장 안전 확인 후 정상화 승인' : processed[i][2] < 100 ? '가상 고객 회복 안내 검토' : '정상 모니터링'
      };
    });
    const storeSeries = Object.fromEntries(stores.map((s, i) => [s.id, { labels: ['D-day', 'D+1', 'D+2'], processedRate: processed[i], revenueRate: revenue[i] }]));
    const queue = stores.map((s, i) => ({ id: 'DEMO-REC-' + (i + 1), eventId: 'DEMO-EVENT-' + (i + 1),
      storeId: s.id, store: s.name, storeName: s.name, date, trigger: '강수', status: s.recoveryStatus,
      processedRate: processed[i][2], revenueRate: revenue[i][2], processedRecoveryRate: processed[i][2], revenueRecoveryRate: revenue[i][2],
      stage: i === 0 ? '정상화 대기' : s.crmReady ? 'CRM 검토' : '회복 완료', crmAllowed: s.crmReady,
      dri: s.dri, owner: s.dri,
      next: s.nextAction, nextAction: s.nextAction, crmReady: s.crmReady,
      asBlocked: i === 0, actual: (10 + i) * processed[i][2], baseline: 1000 + i * 100 }));
    const opsActions = stores.filter(s => s.status !== 'Green').map((s, i) => ({ id: 'DEMO-OPS-' + i, store: s.name, storeId: s.id, team: '사업운영팀', owner: s.dri, dri: s.dri, title: s.nextAction, action: s.nextAction, status: '진행 중', due: '17:00', dueAt: date + 'T17:00:00+09:00' }));
    const marketingActions = stores.filter(s => s.crmReady).map((s, i) => ({ id: 'DEMO-CRM-' + i, store: s.name, storeId: s.id, team: '마케팅팀', owner: 'CRM 담당 ' + (i + 1), title: '가상 회복 대상 안내 검토', action: '가상 회복 대상 안내 검토', status: '대기', due: '18:00' }));
    return {
      source: 'synthetic', version: 'demo-2026.10', buildId: 'portfolio-synthetic-20261002', dashboardPayloadVersion: 'demo-v1',
      generatedAt: at, decisionReadiness: 'prod_ready',
      summary: { totalStores: 7, overallStatus: 'Red', actionRequired: 2, watch: 2, normal: 3, dataCheck: 0,
        immediateCount: 2, asBlockedCount: 1, crmReadyCount: marketingActions.length,
        recoveryActionCount: 3, dataWaitCount: 0, systemError24h: 0, systemWarn24h: 0,
        headline: '가상 기상 리스크와 현장 정상화 항목을 확인하세요.' },
      stores, opsActions, marketingActions, overdueExceptions: [],
      weatherSignal: { source: 'synthetic', mode: 'prod', generatedAt: at, observedAt: at, overallStatus: 'Red',
        summary: { totalStores: 7, normal: 3, watch: 2, actionRequired: 2, dataCheck: 0, riskNormal: 3, riskWatch: 2, riskActionRequired: 2 },
        stores: stores.map(s => ({ storeId: s.id, storeName: s.name, status: s.signalStatus, mode: 'prod', reason: s.signalReason, observedAt: at,
          weatherValues: s.weatherValues, enhancedSignal: s.enhancedSignal, siteVulnerability: s.siteVulnerability, sourceStatus: 'complete', riskType: '강수' })) },
      recovery: { labels: ['D-day', 'D+1', 'D+2'], storeSeries, queue, sourceStatus: 'complete', period: date },
      visuals: {
        recoveryFunnel: [{ key: 'detected', label: '하락 감지', count: 7 }, { key: 'action', label: '조치 필요', count: 4 },
          { key: 'asBlocked', label: 'AS 차단', count: 1 }, { key: 'normalized', label: '정상화 통과', count: 6 },
          { key: 'crmQueued', label: 'CRM 후보', count: 2 }, { key: 'crmSent', label: '발송/실행', count: 0 }, { key: 'revisited', label: '재방문 회수', count: 0 }],
        processedBulletByStore: queue.map(q => ({ storeId: q.storeId, store: q.store, actual: q.actual, baseline: q.baseline, status: q.status })),
        openActionTrend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(now.getTime() + 9 * 3600000 - (6 - i) * 86400000).toISOString().slice(0, 10), actions: 4 + i % 3 })),
        systemTrend: Array.from({ length: 7 }, (_, i) => ({ date: new Date(now.getTime() + 9 * 3600000 - (6 - i) * 86400000).toISOString().slice(0, 10), errors: i % 2, unresolved: 1 + i % 2 }))
      },
      weatherTimeline: [{ time: '09:00', label: '오픈 전', action: '가상 기상 신호와 현장 안전 점검' }, { time: '13:00', label: '피크 전', action: '가상 강수와 고객 안내 확인' }, { time: '18:00', label: '마감 전', action: '가상 현장 정상화와 회복 상태 확인' }],
      system: { currentDataMode: 'prod', apiStatus: 'ok', dashboardPayloadStatus: 'ok', decisionReadiness: 'prod_ready',
        lastSummaryAt: at, lastSummaryStatus: 'success', summaryFreshnessLevel: 'ok', lastRevenueSyncAt: at,
        sheetVersion: 'demo-2026.10', expectedPackVersion: 'demo-2026.10', weatherSignalAt: at,
        systemError24h: 0, systemWarn24h: 0, source: 'synthetic' }
    };
  }
  window.PortfolioDemo = { create };
})();
