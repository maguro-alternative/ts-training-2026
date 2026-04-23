// 進捗表示ページ: public/test-results.json を読んで各課題の状態を表示する
//
// npm test を実行すると JSON が更新されるので、このページを再読み込み
// (または "進捗を更新" ボタンをクリック) すると最新の状態が反映される。

const EXERCISES = [
  { id: '01-basic-types', title: '基本型を付ける', difficulty: '★☆☆' },
  { id: '02-union-narrowing', title: 'ユニオン型と絞り込み', difficulty: '★★☆' },
  { id: '03-generics', title: 'ジェネリクス', difficulty: '★★☆' },
  { id: '04-utility-types', title: 'ユーティリティ型', difficulty: '★★☆' },
  { id: '05-refactor-any', title: 'any リファクタリング', difficulty: '★★☆' },
  { id: '06-type-puzzle', title: '型パズル', difficulty: '★★★' },
  { id: '07-api-response', title: 'APIレスポンスの型付け', difficulty: '★★★' },
  { id: '08-stretch', title: 'ストレッチ課題 (任意)', difficulty: '★★★' },
] as const;

type ExerciseId = (typeof EXERCISES)[number]['id'];

type ExerciseStats = {
  passed: number;
  failed: number;
  total: number;
  tested: boolean;
};

// vitest の JSON レポーターが出力する型 (抜粋)
type VitestJsonReport = {
  numTotalTests: number;
  numPassedTests: number;
  numFailedTests: number;
  testResults: Array<{
    name: string;
    status: 'passed' | 'failed';
    assertionResults: Array<{
      status: 'passed' | 'failed' | 'skipped' | 'pending';
      fullName: string;
    }>;
  }>;
};

async function fetchResults(): Promise<VitestJsonReport | null> {
  try {
    const res = await fetch('/test-results.json', { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as VitestJsonReport;
  } catch {
    return null;
  }
}

function computeStats(report: VitestJsonReport | null): Record<ExerciseId, ExerciseStats> {
  const empty = Object.fromEntries(
    EXERCISES.map((e) => [e.id, { passed: 0, failed: 0, total: 0, tested: false }]),
  ) as Record<ExerciseId, ExerciseStats>;

  if (!report) return empty;

  for (const fileResult of report.testResults) {
    const match = EXERCISES.find((e) => fileResult.name.includes(`/${e.id}/`));
    if (!match) continue;

    const stats = empty[match.id];
    stats.tested = true;
    for (const test of fileResult.assertionResults) {
      stats.total++;
      if (test.status === 'passed') stats.passed++;
      else if (test.status === 'failed') stats.failed++;
    }
  }

  return empty;
}

function icon(stats: ExerciseStats): string {
  if (!stats.tested) return '⬜';
  if (stats.failed === 0 && stats.passed === stats.total && stats.total > 0) return '✅';
  if (stats.failed > 0) return '❌';
  return '🟡';
}

function exerciseClass(stats: ExerciseStats): string {
  if (!stats.tested) return 'exercise untested';
  if (stats.failed === 0 && stats.passed === stats.total && stats.total > 0)
    return 'exercise all-passed';
  if (stats.failed > 0) return 'exercise has-failed';
  return 'exercise';
}

function render(statsMap: Record<ExerciseId, ExerciseStats>, report: VitestJsonReport | null) {
  const totalPassed = Object.values(statsMap).reduce((a, s) => a + s.passed, 0);
  const totalFailed = Object.values(statsMap).reduce((a, s) => a + s.failed, 0);
  const totalTests = Object.values(statsMap).reduce((a, s) => a + s.total, 0);
  const exercisesPassed = Object.values(statsMap).filter(
    (s) => s.tested && s.failed === 0 && s.passed === s.total && s.total > 0,
  ).length;
  const progressPct = totalTests === 0 ? 0 : Math.round((totalPassed / totalTests) * 100);

  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="eyebrow">TypeScript研修 · Day 3</div>
    <h1>型で <em>守る</em> 一日。</h1>
    <p class="subtitle">
      用意された8つの課題を順に解いていきましょう。<br/>
      <code>npm test</code> を実行するとこの画面の進捗が更新されます。
    </p>

    <div class="summary">
      <div class="summary-card passed">
        <div class="label">クリア済み課題</div>
        <div class="value">${exercisesPassed}<span style="color: var(--text-faint); font-size: 20px;">/${EXERCISES.length}</span></div>
      </div>
      <div class="summary-card passed">
        <div class="label">合格テスト</div>
        <div class="value">${totalPassed}</div>
      </div>
      <div class="summary-card ${totalFailed > 0 ? 'failed' : ''}">
        <div class="label">失敗テスト</div>
        <div class="value">${totalFailed}</div>
      </div>
      <div class="summary-card">
        <div class="label">合計テスト</div>
        <div class="value" style="color: var(--text-dim);">${totalTests}</div>
      </div>
    </div>

    <div class="progress-bar">
      <div class="fill" style="width: ${progressPct}%"></div>
    </div>

    <div class="actions">
      <button class="reload" id="reload-btn">↻ 進捗を更新</button>
      <span class="hint">
        ${
          report
            ? `最終更新: ${new Date().toLocaleTimeString('ja-JP')}`
            : '<code>npm test</code> をまだ実行していません'
        }
      </span>
    </div>

    ${
      !report
        ? `<div class="no-results">
            テスト結果が見つかりません。ターミナルで <code>npm test</code> を実行してください。<br/>
            編集のたびに自動で走らせたい場合は <code>npm run test:watch</code> が便利です。
          </div>`
        : `<div class="exercises">
            ${EXERCISES.map((ex) => {
              const s = statsMap[ex.id];
              return `
                <div class="${exerciseClass(s)}">
                  <div class="num">${ex.id.slice(0, 2)}</div>
                  <div>
                    <div class="title">${ex.title}</div>
                    <div class="difficulty">${ex.difficulty}</div>
                  </div>
                  <div class="count">
                    ${
                      s.tested
                        ? `<span class="pass">${s.passed}</span><span class="total"> / ${s.total}</span>`
                        : '<span class="total">未実行</span>'
                    }
                  </div>
                  <div class="status-icon">${icon(s)}</div>
                </div>
              `;
            }).join('')}
          </div>`
    }

    <div class="footer">
      <span>src/exercises/ を順番に進めていきましょう</span>
      <span>Day 3 · TS Training</span>
    </div>
  `;

  document.getElementById('reload-btn')?.addEventListener('click', refresh);
}

async function refresh() {
  const report = await fetchResults();
  const stats = computeStats(report);
  render(stats, report);
}

refresh();
// 3秒ごとに自動更新 (test:watch と併用したいとき用)
setInterval(refresh, 3000);
