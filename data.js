(function () {
  var state = { risk: 'all', store: 'all' };

  var metrics = [
    { label: '즉시 조치', value: 3, sub: 'Orange/Red 확인' },
    { label: '주의 관찰', value: 4, sub: 'Yellow 및 회복 관찰' },
    { label: 'AS 차단', value: 1, sub: '정상화 전 유도 금지' },
    { label: '회복 조치', value: 2, sub: 'D+1/D+2 액션' },
    { label: 'CRM 가능', value: 2, sub: '마케팅 실행 후보' },
    { label: '성과 대기', value: 1, sub: '매출/처리대수 확정 전' },
    { label: '시스템 오류', value: 0, sub: '최근 24시간' }
  ];

  var filters = [
    { id: 'all', label: '전체' },
    { id: 'error', label: 'Error' },
    { id: 'red', label: 'Red' },
    { id: 'orange', label: 'Orange' },
    { id: 'yellow', label: 'Yellow' },
    { id: 'green', label: 'Green' }
  ];

  var stores = [
    {
      id: 'w01', name: 'W-01 지점', region: '권역 A', risk: 'orange', score: 91,
      manager: 'OPS-A 담당자', trigger: '강수 집중 · 고객 동선 안전 확인 필요',
      weather: '강수확률 90% · 강수량 5mm · 최고기온 30C',
      as: 'AS 차단', recovery: 'CRM 대기', action: '안전/AS 정상화 확인 전 방문 유도 공지',
      ops: 'AS 차단 해제 확인 및 고객 대기 안내 문구 준비',
      marketing: '회복률 82% 이상 확인 후 재방문 CRM 발송',
      dday: 42, d1: 44, d2: 55, usage: 91, revenue: 87,
      matrix: ['danger', 'normal', 'watch']
    },
    {
      id: 'w02', name: 'W-02 지점', region: '권역 B', risk: 'orange', score: 82,
      manager: 'OPS-B 담당자', trigger: '강한 비 · 피크 전 수요 급락 가능',
      weather: '강수확률 80% · 강수량 4mm · 풍속 4.2m/s',
      as: '정상', recovery: 'CRM 가능', action: '17시 전 점검 완료 후 D+1 재방문 유도',
      ops: '피크 전 배수/진입 동선 확인',
      marketing: '고객 세그먼트별 회복 쿠폰 발송 대기',
      dday: 68, d1: 82, d2: 91, usage: 88, revenue: 86,
      matrix: ['caution', 'normal', 'caution']
    },
    {
      id: 'w03', name: 'W-03 지점', region: '권역 C', risk: 'orange', score: 76,
      manager: 'OPS-C 담당자', trigger: '비/미세먼지 복합 · 예약 취소 증가',
      weather: '강수확률 80% · 강수량 2mm · PM10 58',
      as: '정상', recovery: 'CRM 가능', action: '회복 수요 사전 확보 및 CRM 승인 요청',
      ops: '피크 전 현장 인력 배치 재점검',
      marketing: '비/미세먼지 복합 고객군 리마인드 메시지',
      dday: 70, d1: 79, d2: 88, usage: 85, revenue: 52,
      matrix: ['caution', 'normal', 'caution']
    },
    {
      id: 'w04', name: 'W-04 지점', region: '권역 D', risk: 'yellow', score: 61,
      manager: 'OPS-D 담당자', trigger: '비 예보 · 저녁 수요 가능성 낮음',
      weather: '강수확률 70% · 강수량 4mm · 최고기온 30C',
      as: '정상', recovery: 'CRM 대기', action: '마감 1시간 전 내수/신규 흐름 확인',
      ops: '저녁 수요 회복 여부 확인',
      marketing: '회복률 90% 미만 시 발송 보류',
      dday: 61, d1: 78, d2: 87, usage: 55, revenue: 52,
      matrix: ['watch', 'normal', 'watch']
    },
    {
      id: 'w05', name: 'W-05 지점', region: '권역 E', risk: 'yellow', score: 58,
      manager: 'OPS-E 담당자', trigger: '비 예보 · 오후 수요 가능성 낮음',
      weather: '강수확률 60% · 강수량 3mm · 최고기온 30C',
      as: '정상', recovery: 'CRM 대기', action: '오픈 전 배수/미끄럼 점검, 피크 전 대기열 확인',
      ops: '오픈 전 안전 점검 유지',
      marketing: 'CRM 후보 유지',
      dday: 74, d1: 91, d2: 102, usage: 91, revenue: 87,
      matrix: ['watch', 'normal', 'normal']
    },
    {
      id: 'w06', name: 'W-06 지점', region: '권역 F', risk: 'yellow', score: 54,
      manager: 'OPS-F 담당자', trigger: '비 예보 · 신규 기준 수요 변동',
      weather: '강수확률 60% · 강수량 3mm · 풍속 2.9m/s',
      as: '정상', recovery: 'CRM 대기', action: '운영 로그 확인 및 피크 대응 기록',
      ops: '신규 기준 운영 로그 확인',
      marketing: '재방문 조건 충족 전 대기',
      dday: 66, d1: 84, d2: 95, usage: 88, revenue: 86,
      matrix: ['watch', 'normal', 'normal']
    },
    {
      id: 'w07', name: 'W-07 지점', region: '권역 G', risk: 'green', score: 22,
      manager: 'OPS-G 담당자', trigger: '주의 없음',
      weather: '강수확률 20% · 풍속 2.4m/s · 최고기온 28C',
      as: '정상', recovery: '대상 없음', action: '정상 운영 유지',
      ops: '정상 운영 유지',
      marketing: '대상 없음',
      dday: 93, d1: 105, d2: 111, usage: 88, revenue: 86,
      matrix: ['normal', 'normal', 'normal']
    }
  ];

  var timeline = [
    { time: '07:30', label: '오픈 전 점검', level: 'yellow' },
    { time: '09:10', label: '종합 요약', level: 'orange' },
    { time: '17:00', label: '피크 전 준비', level: 'orange' },
    { time: '마감-1h', label: '마감 전 점검', level: 'yellow' }
  ];

  var systems = [
    { label: '마지막 요약', value: '06. 29. 오후 02:43', level: 'good' },
    { label: '매출 동기화', value: '06. 29. 오후 02:43', level: 'good' },
    { label: 'Apps Script', value: 'v2.15.2', level: 'good' },
    { label: '데이터 상태', value: '생성 데이터', level: 'warn' },
    { label: '주의 신호', value: '실외 AS API 연결 대기 1건', level: 'warn' }
  ];

  function $(id) { return document.getElementById(id); }
  function clsRisk(risk) {
    if (risk === 'red') return 'red';
    if (risk === 'orange') return 'orange';
    if (risk === 'yellow') return 'yellow';
    return 'green';
  }
  function riskLabel(risk) {
    return ({ red: '위험', orange: '조치', yellow: '주의', green: '정상' })[risk] || '정상';
  }
  function filteredStores() {
    return stores.filter(function (s) {
      var riskOk = state.risk === 'all' || s.risk === state.risk;
      var storeOk = state.store === 'all' || s.id === state.store;
      return riskOk && storeOk;
    });
  }
  function pctClass(v) {
    if (v >= 100) return 'high';
    if (v >= 90) return 'mid';
    return 'low';
  }

  function renderMetrics() {
    $('metricGrid').innerHTML = metrics.map(function (m) {
      return '<div class="metric"><div class="metric-label">' + m.label + '</div><div class="metric-value">' +
        m.value + '</div><div class="metric-sub">' + m.sub + '</div></div>';
    }).join('');
  }

  function renderControls() {
    $('riskFilters').innerHTML = filters.map(function (f) {
      return '<button class="filter-btn ' + (state.risk === f.id ? 'active' : '') + '" data-risk="' + f.id + '">' + f.label + '</button>';
    }).join('');
    $('storeSelect').innerHTML = '<option value="all">전체 지점</option>' + stores.map(function (s) {
      return '<option value="' + s.id + '">' + s.name + '</option>';
    }).join('');
    $('storeSelect').value = state.store;
  }

  function renderStoreCards() {
    var list = filteredStores();
    $('storeCount').textContent = list.length + '개 지점';
    $('storeCards').innerHTML = list.map(function (s) {
      return '<button class="store-card ' + (state.store === s.id ? 'active' : '') + '" data-store="' + s.id + '">' +
        '<div class="name">' + s.name + '</div>' +
        '<div class="manager">' + s.region + ' · ' + s.manager + '</div>' +
        '<span class="badge ' + clsRisk(s.risk) + '">' + riskLabel(s.risk) + '</span>' +
        '<span class="small">' + s.trigger + '</span>' +
        '<span class="small">' + s.weather + '</span>' +
      '</button>';
    }).join('') || '<div class="empty">현재 필터 기준 지점이 없습니다.</div>';
  }

  function renderActions() {
    var list = filteredStores();
    var ops = list.filter(function (s) { return s.risk !== 'green'; }).slice(0, 4);
    var mkt = list.filter(function (s) { return s.recovery === 'CRM 가능'; });
    function item(s, type) {
      return '<div class="action-item"><div class="action-top"><span class="action-title">' +
        (type === 'ops' ? s.ops : s.marketing) + '</span><span class="action-owner">' + s.manager.split(' ')[0] + '</span></div>' +
        '<div class="action-meta">' + s.name + ' · ' + s.weather + '</div></div>';
    }
    $('opsActions').innerHTML = ops.map(function (s) { return item(s, 'ops'); }).join('') || '<div class="action-item">현재 필터 기준 조치 항목이 없습니다.</div>';
    $('mktActions').innerHTML = mkt.map(function (s) { return item(s, 'mkt'); }).join('') || '<div class="action-item">현재 필터 기준 실행 대기가 없습니다.</div>';
  }

  function renderRecoveryQueue() {
    var rows = filteredStores().filter(function (s) { return s.recovery !== '대상 없음'; }).slice(0, 5);
    $('recoveryQueue').innerHTML = rows.map(function (s) {
      return '<div class="queue-item"><div><div class="queue-title">' + s.name + '</div><div class="queue-sub">D+1 재방문 회복률 ' + s.d1 + '%</div></div>' +
        '<div class="queue-meta">' + s.action + '</div><span class="badge ' + clsRisk(s.risk) + '">' + s.as + '</span><span class="badge green">' + s.recovery + '</span></div>';
    }).join('') || '<div class="action-item">현재 필터 기준 회복 큐가 없습니다.</div>';
  }

  function renderRiskMatrix() {
    var rows = filteredStores();
    var html = '<div class="risk-head">지점</div><div class="risk-head">강수/기상</div><div class="risk-head">AS</div><div class="risk-head">회복</div>';
    html += rows.map(function (s) {
      return '<div class="risk-head">' + s.name + '</div>' +
        '<div class="risk-cell ' + s.matrix[0] + '">' + (s.matrix[0] === 'danger' ? '위험' : s.matrix[0] === 'caution' ? '조치' : s.matrix[0] === 'watch' ? '주의' : '정상') + '</div>' +
        '<div class="risk-cell ' + s.matrix[1] + '">' + (s.as === 'AS 차단' ? '차단' : '정상') + '</div>' +
        '<div class="risk-cell ' + s.matrix[2] + '">' + (s.matrix[2] === 'caution' ? '조치' : s.matrix[2] === 'watch' ? '주의' : '정상') + '</div>';
    }).join('');
    $('riskMatrix').innerHTML = html;
  }

  function renderFunnel() {
    var stages = [
      { label: '하락 감지', count: 3, note: '전 단계 대비 100% 유지 · 0건 이탈' },
      { label: '조치 필요', count: 3, note: '전 단계 대비 100% 유지 · 0건 이탈' },
      { label: '정상화 통과', count: 2, note: '전 단계 대비 67% 유지 · 1건 이탈' },
      { label: 'CRM 후보', count: 2, note: '전 단계 대비 100% 유지 · 0건 이탈' },
      { label: '발송/실행', count: 0, note: '전 단계 대비 0% 유지 · 2건 이탈' },
      { label: '재방문 회수', count: 0, note: '전 단계 대비 - 유지 · 0건 이탈' }
    ];
    $('funnel').innerHTML = stages.map(function (s) {
      return '<div class="funnel-row"><div class="funnel-label">' + s.label + '</div><div class="bar-track"><div class="bar-fill" style="width:' + (s.count / 3 * 100) + '%"></div></div><div class="funnel-count">' + s.count + '</div><div class="funnel-note">' + s.note + '</div></div>';
    }).join('');
  }

  function renderRecoveryTable() {
    var rows = filteredStores();
    var html = '<div class="recovery-head">지점</div><div class="recovery-head">D-day</div><div class="recovery-head">D+1</div><div class="recovery-head">D+2</div>';
    html += rows.map(function (s) {
      return '<div class="recovery-head">' + s.name + '</div>' +
        '<div class="recovery-cell ' + pctClass(s.dday) + '"><strong>' + s.dday + '%</strong><span>매출 ' + Math.max(20, s.dday - 4) + '%</span></div>' +
        '<div class="recovery-cell ' + pctClass(s.d1) + '"><strong>' + s.d1 + '%</strong><span>매출 ' + Math.max(25, s.d1 - 5) + '%</span></div>' +
        '<div class="recovery-cell ' + pctClass(s.d2) + '"><strong>' + s.d2 + '%</strong><span>매출 ' + Math.max(30, s.d2 - 4) + '%</span></div>';
    }).join('');
    $('recoveryTable').innerHTML = html;
  }

  function renderGaps() {
    var rows = filteredStores().slice(0, 5);
    $('gapList').innerHTML = rows.map(function (s) {
      return '<div class="gap-item"><div class="gap-top"><span>' + s.name + '</span><span>갭 ' + Math.abs(s.usage - s.revenue) + '%p · ' + (s.usage > s.revenue ? '매출 확인' : '균형') + '</span></div>' +
        '<div class="gap-rail"><span class="usage-dot" style="left:' + Math.min(96, s.usage) + '%"></span><span class="revenue-dot" style="left:' + Math.min(96, s.revenue) + '%"></span></div>' +
        '<div class="gap-legend"><span>이용 ' + s.usage + '%</span><span>매출 ' + s.revenue + '%</span></div></div>';
    }).join('');
  }

  function renderTable() {
    $('storeRows').innerHTML = filteredStores().map(function (s) {
      return '<tr><td><strong>' + s.name + '</strong><small>' + s.region + ' · 점수 ' + s.score + '</small></td>' +
        '<td><span class="badge ' + clsRisk(s.risk) + '">' + riskLabel(s.risk) + '</span></td>' +
        '<td>' + s.trigger + '<br><small>' + s.weather + '</small></td>' +
        '<td>' + s.as + '</td><td>' + s.recovery + '</td><td>' + s.manager + '</td><td>' + s.action + '</td></tr>';
    }).join('');
  }

  function renderTimeline() {
    $('timeline').innerHTML = timeline.map(function (t) {
      return '<div class="timeline-item"><span class="timeline-time">' + t.time + '</span><span>' + t.label + '</span><span class="badge ' + t.level + '">' + t.level + '</span></div>';
    }).join('');
  }

  function renderSystem() {
    $('systemStatus').innerHTML = systems.map(function (s) {
      return '<div class="system-card ' + s.level + '"><span>' + s.label + '</span><strong>' + s.value + '</strong></div>';
    }).join('');
  }

  function bind() {
    $('riskFilters').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-risk]');
      if (!btn) return;
      state.risk = btn.getAttribute('data-risk');
      render();
    });
    $('storeSelect').addEventListener('change', function (e) {
      state.store = e.target.value;
      render();
    });
    $('storeCards').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-store]');
      if (!btn) return;
      state.store = btn.getAttribute('data-store');
      render();
    });
    $('refreshBtn').addEventListener('click', function () {
      this.textContent = '갱신 완료';
      var self = this;
      setTimeout(function () { self.textContent = '새로고침'; }, 1200);
    });
    $('copyBtn').addEventListener('click', function () {
      var orange = stores.filter(function (s) { return s.risk === 'orange'; }).map(function (s) { return s.name; }).join(', ');
      var summary = '[Weather Ops] Orange ' + stores.filter(function (s) { return s.risk === 'orange'; }).length + '개 지점: ' + orange + ' 우선 점검';
      if (navigator.clipboard) navigator.clipboard.writeText(summary);
      this.textContent = '복사 완료';
      var self = this;
      setTimeout(function () { self.textContent = '요약 복사'; }, 1200);
    });
  }

  function render() {
    renderControls();
    renderStoreCards();
    renderActions();
    renderRecoveryQueue();
    renderRiskMatrix();
    renderRecoveryTable();
    renderGaps();
    renderTable();
    renderTimeline();
    renderSystem();
  }

  renderMetrics();
  renderFunnel();
  render();
  bind();
})();
