(function () {
  var state = {
    tab: 'today',
    status: 'all',
    store: 'all'
  };

  var tabs = [
    { id: 'today', label: '오늘 판단' },
    { id: 'detail', label: '지점 상세' },
    { id: 'recovery', label: '회복' },
    { id: 'data', label: '데이터 상태' }
  ];

  var statusFilters = [
    { id: 'all', label: '전체' },
    { id: 'error', label: '오류' },
    { id: 'limit', label: '제한확인' },
    { id: 'action', label: '조치' },
    { id: 'caution', label: '주의' },
    { id: 'normal', label: '정상' },
    { id: 'wait', label: '신호대기' }
  ];

  var metrics = [
    { label: '안전 확보', value: '6개점', sub: '운영 4 · 기상 신호 6' },
    { label: '다운타임 축소', value: '0개점', sub: '현재 AS 차단 없음' },
    { label: 'CS 안정화', value: '4건', sub: '미확인 3개점 · 대기 4건' },
    { label: '수요·매출 회복', value: '85건', sub: '회복 조치·관찰 후보' },
    { label: 'CRM 후보', value: '7건', sub: 'AS/운영 게이트 통과' },
    { label: '현장 취약정보', value: '7/7', sub: '강수·강풍 취약정보 수신' }
  ];

  var stores = [
    {
      id: 'w01',
      name: 'W-01 지점',
      region: '권역 A',
      status: 'limit',
      signal: 'limit',
      score: 100,
      manager: '운영 A',
      triggerType: '강수',
      trigger: 'D-day 당일대응 · 예상 시간당 최대 강수 18mm',
      weather: '현재 강수 0mm · 최대 강수확률 60% · AWS 0mm · 레이더 0mm/h',
      asState: '정상',
      csState: '고객 영향 확인 필요',
      recovery: '회복 조치 필요 · CRM 가능',
      vulnerability: '배수·입출차 안전',
      action: '고객 유도/쿠폰 발송은 보류하고 배수·입출차 안전 확인 후 회복 준비',
      rainNow: 0,
      rainMax: 18,
      forecastHour: '14:00',
      dday: 58,
      d1: 72,
      d2: 86,
      usage: 76,
      revenue: 59,
      csWaiting: 1,
      recoveryPool: 14
    },
    {
      id: 'w02',
      name: 'W-02 지점',
      region: '권역 B',
      status: 'limit',
      signal: 'limit',
      score: 100,
      manager: '운영 B',
      triggerType: '강수',
      trigger: 'D-day 당일대응 · 예상 시간당 최대 강수 22mm',
      weather: '현재 강수 0mm · 최대 강수확률 60% · AWS 0mm · 레이더 0mm/h',
      asState: '정상',
      csState: '고객 영향 즉시 확인',
      recovery: '회복 조치 필요 · CRM 가능',
      vulnerability: '누전·진입 동선',
      action: '고객 유도는 중단하고 누전·입출차 안전 및 재개 기준 확보 우선',
      rainNow: 0,
      rainMax: 22,
      forecastHour: '12:00',
      dday: 52,
      d1: 69,
      d2: 84,
      usage: 72,
      revenue: 51,
      csWaiting: 2,
      recoveryPool: 17
    },
    {
      id: 'w03',
      name: 'W-03 지점',
      region: '권역 C',
      status: 'action',
      signal: 'limit',
      score: 84,
      manager: '운영 C',
      triggerType: '폭염',
      trigger: 'D-day 당일대응 · 오늘 최고기온 33도',
      weather: '현재 29.3도 · 최고기온 33도 · 강수 신호 없음',
      asState: '정상',
      csState: '고객 영향 발생 시 안내',
      recovery: '회복 조치 필요 · CRM 가능',
      vulnerability: '장비 과열·대기 동선',
      action: '장비 과열 방지, 근무자 휴식, 고객 대기 동선 관리',
      rainNow: 0,
      rainMax: 2,
      forecastHour: '15:00',
      dday: 65,
      d1: 82,
      d2: 91,
      usage: 83,
      revenue: 75,
      csWaiting: 0,
      recoveryPool: 11
    },
    {
      id: 'w04',
      name: 'W-04 지점',
      region: '권역 D',
      status: 'action',
      signal: 'action',
      score: 78,
      manager: '운영 D',
      triggerType: '강풍',
      trigger: '사전점검 · 오후 순간풍속 10m/s 예상',
      weather: '풍속 6.5m/s · 예상 최대 10m/s · 강수확률 40%',
      asState: '정상',
      csState: '대기 1건',
      recovery: '회복 관찰',
      vulnerability: '간판·외부 시설물',
      action: '외부 시설물 고정 상태를 점검하고 고객 동선 안내 문구 준비',
      rainNow: 0,
      rainMax: 4,
      forecastHour: '16:00',
      dday: 70,
      d1: 87,
      d2: 96,
      usage: 88,
      revenue: 82,
      csWaiting: 1,
      recoveryPool: 9
    },
    {
      id: 'w05',
      name: 'W-05 지점',
      region: '권역 E',
      status: 'caution',
      signal: 'caution',
      score: 62,
      manager: '운영 E',
      triggerType: '강수',
      trigger: '주의 관찰 · 저녁 약한 비 예보',
      weather: '현재 강수 0mm · 최대 강수확률 50% · 예상 5mm',
      asState: '정상',
      csState: '안내 대기 없음',
      recovery: 'CRM 후보 관찰',
      vulnerability: '배수로·미끄럼 주의',
      action: '피크 전 배수 상태를 확인하고 회복 후보군은 성과 확인 후 발송',
      rainNow: 0,
      rainMax: 5,
      forecastHour: '18:00',
      dday: 78,
      d1: 92,
      d2: 101,
      usage: 91,
      revenue: 84,
      csWaiting: 0,
      recoveryPool: 12
    },
    {
      id: 'w06',
      name: 'W-06 지점',
      region: '권역 F',
      status: 'normal',
      signal: 'wait',
      score: 46,
      manager: '운영 F',
      triggerType: '신호대기',
      trigger: '신규 검증 신호 · shadow 기준 관찰',
      weather: '강수확률 30% · 예상 1mm · AWS 정상',
      asState: '정상',
      csState: '정상',
      recovery: '관찰',
      vulnerability: '신규 기준 검증',
      action: '운영 로그만 확인하고 shadow 신호 확정 전 별도 조치 보류',
      rainNow: 0,
      rainMax: 1,
      forecastHour: '17:00',
      dday: 86,
      d1: 98,
      d2: 106,
      usage: 94,
      revenue: 91,
      csWaiting: 0,
      recoveryPool: 8
    },
    {
      id: 'w07',
      name: 'W-07 지점',
      region: '권역 G',
      status: 'normal',
      signal: 'normal',
      score: 20,
      manager: '운영 G',
      triggerType: '정상',
      trigger: '운영 영향 없음',
      weather: '강수확률 20% · 풍속 2.4m/s · 최고기온 28도',
      asState: '정상',
      csState: '정상',
      recovery: '대응 없음',
      vulnerability: '특이사항 없음',
      action: '정상 운영 유지',
      rainNow: 0,
      rainMax: 0,
      forecastHour: '-',
      dday: 93,
      d1: 105,
      d2: 111,
      usage: 97,
      revenue: 96,
      csWaiting: 0,
      recoveryPool: 14
    }
  ];

  var sourceStatus = [
    { label: '단기예보', value: '정상', sub: '기준 07-27 08:00', level: 'good' },
    { label: '실황', value: '정상', sub: '기준 07-27 08:00', level: 'good' },
    { label: '에어코리아', value: '정상', sub: '기준 07-27 09:00', level: 'good' },
    { label: 'AWS', value: '정상', sub: '기준 07-27 09:36', level: 'good' },
    { label: '레이더', value: '정상', sub: '기준 07-27 09:15', level: 'good' },
    { label: '기상특보', value: '조회 정상', sub: '활성 특보 없음', level: 'good' }
  ];

  var timeline = [
    { time: '07:30', label: '기상 원천 갱신 및 취약정보 매칭', level: 'normal' },
    { time: '08:10', label: '제한확인 지점 운영 큐 생성', level: 'limit' },
    { time: '10:30', label: '현장 안전 확인 및 고객 안내 대기', level: 'action' },
    { time: '14:00', label: '강수 피크 전 회복 액션 보류/승인 판단', level: 'limit' },
    { time: 'D+1', label: '회복률 기준 CRM 후보 재분류', level: 'caution' }
  ];

  var systems = [
    { label: '운영 판단', value: '가능 · mock', level: 'good' },
    { label: '운영 원장', value: '제한확인', level: 'warn' },
    { label: '기상 신호', value: '제한확인', level: 'warn' },
    { label: '신규 검증', value: 'shadow', level: 'info' },
    { label: '실제 원천 오류', value: '0개점', level: 'good' },
    { label: '데이터 범위', value: '가상 7개점', level: 'info' }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function statusLabel(status) {
    var found = statusFilters.find(function (filter) { return filter.id === status; });
    return found ? found.label : '정상';
  }

  function statusClass(status) {
    if (status === 'error') return 'error';
    if (status === 'limit') return 'limit';
    if (status === 'action') return 'action';
    if (status === 'caution') return 'caution';
    if (status === 'wait') return 'wait';
    return 'normal';
  }

  function selectedStores() {
    return stores.filter(function (store) {
      var statusOk = state.status === 'all' || store.status === state.status || store.signal === state.status;
      var storeOk = state.store === 'all' || store.id === state.store;
      return statusOk && storeOk;
    });
  }

  function renderMetrics() {
    $('metricGrid').innerHTML = metrics.map(function (metric) {
      return '<div class="metric">' +
        '<div class="metric-label">' + metric.label + '</div>' +
        '<div class="metric-value">' + metric.value + '</div>' +
        '<div class="metric-sub">' + metric.sub + '</div>' +
      '</div>';
    }).join('');
  }

  function renderControls() {
    $('tabNav').innerHTML = tabs.map(function (tab) {
      return '<button class="tab-btn ' + (state.tab === tab.id ? 'active' : '') + '" type="button" data-tab="' + tab.id + '">' + tab.label + '</button>';
    }).join('');

    $('statusFilters').innerHTML = statusFilters.map(function (filter) {
      return '<button class="filter-btn ' + (state.status === filter.id ? 'active' : '') + '" type="button" data-status="' + filter.id + '">' + filter.label + '</button>';
    }).join('');

    $('storeSelect').innerHTML = '<option value="all">전체 지점</option>' + stores.map(function (store) {
      return '<option value="' + store.id + '">' + store.name + '</option>';
    }).join('');
    $('storeSelect').value = state.store;
  }

  function priorityList(list) {
    return list
      .filter(function (store) { return store.status !== 'normal' || store.signal !== 'normal'; })
      .sort(function (a, b) { return b.score - a.score; })
      .slice(0, 5)
      .map(function (store, index) {
        return '<button class="queue-card" type="button" data-store="' + store.id + '">' +
          '<span class="rank">' + (index + 1) + '</span>' +
          '<div>' +
            '<strong>' + store.triggerType + ' · ' + store.name + '</strong>' +
            '<p>' + store.action + '</p>' +
            '<small>' + store.manager + ' · 운영 점수 ' + store.score + '</small>' +
          '</div>' +
          '<span class="badge ' + statusClass(store.status) + '">' + statusLabel(store.status) + '</span>' +
        '</button>';
      }).join('');
  }

  function matrixTable(list) {
    return '<div class="table-wrap">' +
      '<table>' +
        '<thead>' +
          '<tr>' +
            '<th>지점</th>' +
            '<th>운영/신호</th>' +
            '<th>기상/트리거</th>' +
            '<th>AS</th>' +
            '<th>CS/고객</th>' +
            '<th>회복</th>' +
            '<th>담당</th>' +
            '<th>다음 액션</th>' +
          '</tr>' +
        '</thead>' +
        '<tbody>' +
          list.map(function (store) {
            return '<tr>' +
              '<td><strong>' + store.name + '</strong><small>' + store.region + ' · 점수 ' + store.score + '</small></td>' +
              '<td><span class="badge ' + statusClass(store.status) + '">' + statusLabel(store.status) + '</span>' +
                '<span class="badge ' + statusClass(store.signal) + '">신호 ' + statusLabel(store.signal) + '</span></td>' +
              '<td><strong>' + store.triggerType + '</strong><small>' + store.trigger + '<br>' + store.weather + '</small></td>' +
              '<td>' + store.asState + '</td>' +
              '<td>' + store.csState + '</td>' +
              '<td>' + store.recovery + '</td>' +
              '<td>' + store.manager + '</td>' +
              '<td>' + store.action + '</td>' +
            '</tr>';
          }).join('') +
        '</tbody>' +
      '</table>' +
    '</div>';
  }

  function storeCards(list) {
    return '<div class="store-card-grid">' + list.map(function (store) {
      return '<button class="store-card" type="button" data-store="' + store.id + '">' +
        '<div class="store-top">' +
          '<strong>' + store.name + '</strong>' +
          '<span class="badge ' + statusClass(store.status) + '">' + statusLabel(store.status) + '</span>' +
        '</div>' +
        '<p>' + store.region + ' · ' + store.manager + '</p>' +
        '<small>' + store.trigger + '</small>' +
        '<div class="store-meta">' +
          '<span>CS ' + store.csWaiting + '건</span>' +
          '<span>회복 ' + store.recoveryPool + '건</span>' +
        '</div>' +
      '</button>';
    }).join('') + '</div>';
  }

  function vulnerabilityCards() {
    var items = [
      { label: '강수 취약정보', value: '7개점' },
      { label: '출입·동선 확인', value: '2개점' },
      { label: '방수·전기·설비', value: '6개점' },
      { label: '시·도 레이더 대체', value: '0개점' },
      { label: '실제 원천 오류', value: '0개점' }
    ];
    return '<div class="chip-grid">' + items.map(function (item) {
      return '<button class="chip-card" type="button"><strong>' + item.label + '</strong><span>' + item.value + '</span></button>';
    }).join('') + '</div>';
  }

  function recoveryTable(list) {
    return '<div class="recovery-table">' +
      '<div class="recovery-head">지점</div><div class="recovery-head">D-day</div><div class="recovery-head">D+1</div><div class="recovery-head">D+2</div>' +
      list.map(function (store) {
        return '<div class="recovery-head">' + store.name + '</div>' +
          recoveryCell(store.dday) +
          recoveryCell(store.d1) +
          recoveryCell(store.d2);
      }).join('') +
    '</div>';
  }

  function recoveryCell(value) {
    var klass = value >= 95 ? 'high' : value >= 80 ? 'mid' : 'low';
    return '<div class="recovery-cell ' + klass + '"><strong>' + value + '%</strong><span>처리대수 기준</span></div>';
  }

  function gapList(list) {
    return '<div class="gap-list">' + list.map(function (store) {
      var gap = Math.abs(store.usage - store.revenue);
      return '<div class="gap-item">' +
        '<div class="gap-top"><strong>' + store.name + '</strong><span>격차 ' + gap + '%p</span></div>' +
        '<div class="gap-rail">' +
          '<span class="usage-dot" style="left:' + Math.min(96, store.usage) + '%"></span>' +
          '<span class="revenue-dot" style="left:' + Math.min(96, store.revenue) + '%"></span>' +
        '</div>' +
        '<div class="gap-legend"><span>이용 ' + store.usage + '%</span><span>매출 ' + store.revenue + '%</span></div>' +
      '</div>';
    }).join('') + '</div>';
  }

  function sourceCards() {
    return '<div class="source-grid">' + sourceStatus.map(function (source) {
      return '<div class="source-card ' + source.level + '">' +
        '<span>' + source.label + '</span>' +
        '<strong>' + source.value + '</strong>' +
        '<small>' + source.sub + '</small>' +
      '</div>';
    }).join('') + '</div>';
  }

  function timelineList() {
    return '<div class="timeline">' + timeline.map(function (item) {
      return '<div class="timeline-item">' +
        '<span class="timeline-time">' + item.time + '</span>' +
        '<span>' + item.label + '</span>' +
        '<span class="badge ' + statusClass(item.level) + '">' + statusLabel(item.level) + '</span>' +
      '</div>';
    }).join('') + '</div>';
  }

  function systemCards() {
    return '<div class="system-grid">' + systems.map(function (system) {
      return '<div class="system-card ' + system.level + '">' +
        '<span>' + system.label + '</span>' +
        '<strong>' + system.value + '</strong>' +
      '</div>';
    }).join('') + '</div>';
  }

  function renderToday(list) {
    return '<section class="grid two">' +
      '<article class="panel">' +
        '<div class="section-head"><div><h2>우선 확인 큐 <span>ⓘ</span></h2><p>기상 신호와 운영 리스크를 함께 반영해 오늘 먼저 확인할 지점을 정렬했습니다.</p></div></div>' +
        '<div class="queue-list">' + priorityList(list) + '</div>' +
      '</article>' +
      '<article class="panel">' +
        '<div class="section-head"><div><h2>데이터 상태 <span>ⓘ</span></h2><p>가상 원천 기준으로 판단 가능 여부와 오류 상태를 빠르게 확인합니다.</p></div></div>' +
        systemCards() +
      '</article>' +
    '</section>' +
    '<section class="grid two">' +
      '<article class="panel wide-panel">' +
        '<div class="section-head"><div><h2>지점 운영 매트릭스 <span>ⓘ</span></h2><p>운영 상태, 기상 트리거, CS 영향, 회복 가능 여부를 한 줄에서 비교합니다.</p></div></div>' +
        matrixTable(list) +
      '</article>' +
      '<article class="panel">' +
        '<div class="section-head"><div><h2>현재 강수 vs 예보 최대 <span>ⓘ</span></h2><p>현재 관측과 오늘 남은 시간 예보 최대치를 비교합니다.</p></div></div>' +
        '<canvas id="rainChart" height="260" aria-label="현재 강수와 예보 최대 비교 차트"></canvas>' +
      '</article>' +
    '</section>';
  }

  function renderDetail(list) {
    return '<section class="panel">' +
      '<div class="section-head"><div><h2>현장 취약정보 <span>ⓘ</span></h2><p>강수·강풍 신호가 있는 지점에 필요한 현장 확인 항목을 묶었습니다.</p></div></div>' +
      vulnerabilityCards() +
    '</section>' +
    '<section class="panel">' +
      '<div class="section-head"><div><h2>지점 상세 <span>ⓘ</span></h2><p>지점 카드를 선택하면 전체 화면이 해당 지점 기준으로 재계산됩니다.</p></div><span class="count-pill">' + list.length + '개 지점</span></div>' +
      storeCards(list) +
    '</section>' +
    '<section class="panel">' +
      '<div class="section-head"><div><h2>지점 운영 매트릭스 <span>ⓘ</span></h2><p>상태 필터와 지점 선택값을 반영한 상세 테이블입니다.</p></div></div>' +
      matrixTable(list) +
    '</section>';
  }

  function renderRecovery(list) {
    return '<section class="grid two">' +
      '<article class="panel">' +
        '<div class="section-head"><div><h2>회복 실행 단계 <span>ⓘ</span></h2><p>기상 하락 감지 후 정상화, CRM 후보, 성과 확인까지의 단계를 추적합니다.</p></div></div>' +
        '<div class="funnel">' +
          funnelRow('신호 감지', 6, 6) +
          funnelRow('조치 필요', 4, 6) +
          funnelRow('정상화 통과', 4, 6) +
          funnelRow('CRM 후보', 7, 10) +
          funnelRow('성과 대기', 17, 20) +
        '</div>' +
      '</article>' +
      '<article class="panel">' +
        '<div class="section-head"><div><h2>이용 회복 vs 매출 회복 <span>ⓘ</span></h2><p>이용량은 회복됐지만 매출 회복이 따라오지 않는 지점을 우선 찾습니다.</p></div></div>' +
        gapList(list.slice(0, 5)) +
      '</article>' +
    '</section>' +
    '<section class="panel">' +
      '<div class="section-head"><div><h2>지점별 회복 진행 <span>ⓘ</span></h2><p>D-day, D+1, D+2 회복률을 단계별로 비교합니다.</p></div></div>' +
      recoveryTable(list) +
    '</section>';
  }

  function funnelRow(label, value, max) {
    return '<div class="funnel-row">' +
      '<span class="funnel-label">' + label + '</span>' +
      '<div class="bar-track"><div class="bar-fill" style="width:' + Math.min(100, value / max * 100) + '%"></div></div>' +
      '<strong>' + value + '</strong>' +
    '</div>';
  }

  function renderData(list) {
    return '<section class="panel">' +
      '<div class="section-head"><div><h2>기상 원천 상태 <span>ⓘ</span></h2><p>대시보드 판단에 쓰이는 주요 원천의 최신 상태입니다.</p></div></div>' +
      sourceCards() +
    '</section>' +
    '<section class="grid two">' +
      '<article class="panel">' +
        '<div class="section-head"><div><h2>오늘 운영 타임라인 <span>ⓘ</span></h2><p>기상 신호와 현장 확인, 고객 안내 판단 시점을 정리했습니다.</p></div></div>' +
        timelineList() +
      '</article>' +
      '<article class="panel">' +
        '<div class="section-head"><div><h2>시스템 상태 <span>ⓘ</span></h2><p>목업은 비식별 가상 데이터로 구성되며 실제 원천에는 연결하지 않습니다.</p></div></div>' +
        systemCards() +
      '</article>' +
    '</section>' +
    '<section class="panel">' +
      '<div class="section-head"><div><h2>지점 운영 매트릭스 <span>ⓘ</span></h2><p>데이터 상태 화면에서도 동일한 운영 판단 테이블을 확인할 수 있습니다.</p></div></div>' +
      matrixTable(list) +
    '</section>';
  }

  function emptyState() {
    return '<section class="panel"><div class="empty">현재 필터 조건에 맞는 지점이 없습니다.</div></section>';
  }

  function drawRainChart() {
    var canvas = $('rainChart');
    if (!canvas) return;

    var list = selectedStores();
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var width = Math.max(320, rect.width);
    var height = 260;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.height = height + 'px';

    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.font = '12px Pretendard, sans-serif';
    ctx.fillStyle = '#667085';
    ctx.strokeStyle = '#e4eaf1';
    ctx.lineWidth = 1;

    var padding = { top: 24, right: 18, bottom: 42, left: 38 };
    var chartW = width - padding.left - padding.right;
    var chartH = height - padding.top - padding.bottom;
    var maxRain = Math.max(24, Math.max.apply(null, list.map(function (store) { return store.rainMax; })));

    for (var i = 0; i <= 4; i++) {
      var y = padding.top + chartH / 4 * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText(Math.round(maxRain - maxRain / 4 * i) + 'mm', 4, y + 4);
    }

    var barGap = 10;
    var groupW = chartW / list.length;
    list.forEach(function (store, index) {
      var baseX = padding.left + groupW * index + groupW * 0.24;
      var currentH = chartH * (store.rainNow / maxRain);
      var forecastH = chartH * (store.rainMax / maxRain);
      var barW = Math.max(8, Math.min(18, groupW * 0.18));
      var baseY = padding.top + chartH;

      ctx.fillStyle = '#7aa7cf';
      ctx.fillRect(baseX, baseY - currentH, barW, currentH || 2);
      ctx.fillStyle = '#d8792f';
      ctx.fillRect(baseX + barW + barGap, baseY - forecastH, barW, forecastH || 2);
      ctx.fillStyle = '#17202a';
      ctx.textAlign = 'center';
      ctx.fillText(store.name.replace(' 지점', ''), baseX + barW + barGap / 2, height - 14);
    });

    ctx.textAlign = 'left';
    ctx.fillStyle = '#7aa7cf';
    ctx.fillRect(padding.left, 8, 10, 10);
    ctx.fillStyle = '#667085';
    ctx.fillText('현재 강수', padding.left + 16, 17);
    ctx.fillStyle = '#d8792f';
    ctx.fillRect(padding.left + 92, 8, 10, 10);
    ctx.fillStyle = '#667085';
    ctx.fillText('예보 최대', padding.left + 108, 17);
  }

  function renderDashboard() {
    var list = selectedStores();
    var dashboard = $('dashboard');
    if (!list.length) {
      dashboard.innerHTML = emptyState();
      return;
    }

    if (state.tab === 'detail') {
      dashboard.innerHTML = renderDetail(list);
    } else if (state.tab === 'recovery') {
      dashboard.innerHTML = renderRecovery(list);
    } else if (state.tab === 'data') {
      dashboard.innerHTML = renderData(list);
    } else {
      dashboard.innerHTML = renderToday(list);
      window.requestAnimationFrame(drawRainChart);
    }
  }

  function render() {
    renderControls();
    renderDashboard();
  }

  function bindEvents() {
    $('tabNav').addEventListener('click', function (event) {
      var button = event.target.closest('[data-tab]');
      if (!button) return;
      state.tab = button.getAttribute('data-tab');
      render();
    });

    $('statusFilters').addEventListener('click', function (event) {
      var button = event.target.closest('[data-status]');
      if (!button) return;
      state.status = button.getAttribute('data-status');
      render();
    });

    $('storeSelect').addEventListener('change', function (event) {
      state.store = event.target.value;
      render();
    });

    $('dashboard').addEventListener('click', function (event) {
      var button = event.target.closest('[data-store]');
      if (!button) return;
      state.store = button.getAttribute('data-store');
      render();
    });

    $('refreshBtn').addEventListener('click', function () {
      var button = this;
      button.textContent = '갱신 완료';
      setTimeout(function () { button.textContent = '새로고침'; }, 1000);
    });

    $('copyBtn').addEventListener('click', function () {
      var topStores = stores
        .filter(function (store) { return store.status === 'limit' || store.status === 'action'; })
        .map(function (store) { return store.name; })
        .join(', ');
      var summary = '[Weather Ops] 제한확인 2개점, 조치 2개점. 우선 확인: ' + topStores + '.';
      if (navigator.clipboard) navigator.clipboard.writeText(summary);
      var button = this;
      button.textContent = '복사 완료';
      setTimeout(function () { button.textContent = '요약 복사'; }, 1000);
    });

    window.addEventListener('resize', function () {
      if (state.tab === 'today') drawRainChart();
    });
  }

  renderMetrics();
  render();
  bindEvents();
})();
