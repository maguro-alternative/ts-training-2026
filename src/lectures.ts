// 講義 markdown を localhost で閲覧するためのビュー
// ハッシュ #/lectures または #/lectures/<slug> でルーティングされる
//
// import.meta.glob で eager に読むのでビルド時にバンドルされる (dev も prod も動く)

/// <reference types="vite/client" />
import { marked } from 'marked';

// lectures/*.md と README.md を生文字列として読み込む
const lectureModules = import.meta.glob('../lectures/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// 受講者向けビューなので INSTRUCTOR.md は含めない
const rootDocs = import.meta.glob('../README.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

type Doc = {
  slug: string;
  title: string;
  content: string;
  group: 'lecture' | 'meta';
};

// "## 講師向けメモ" 以降のセクションを丸ごと落とす (受講者向けビューなので)
function stripInstructorNotes(md: string): string {
  return md.replace(/\n##\s+講師向けメモ[\s\S]*$/m, '\n').trimEnd() + '\n';
}

// ファイルパス → slug, タイトルを抽出
function buildDocs(): Doc[] {
  const docs: Doc[] = [];

  for (const [path, raw] of Object.entries(lectureModules)) {
    const content = stripInstructorNotes(raw);
    const slug = path.replace(/^.*\//, '').replace(/\.md$/, '');
    docs.push({ slug, title: extractTitle(content) ?? slug, content, group: 'lecture' });
  }

  for (const [path, raw] of Object.entries(rootDocs)) {
    const content = stripInstructorNotes(raw);
    const slug = path.replace(/^.*\//, '').replace(/\.md$/, '').toLowerCase();
    docs.push({ slug, title: extractTitle(content) ?? slug, content, group: 'meta' });
  }

  // slug の数字プレフィックスでソート (lecture は番号順、meta は最後)
  docs.sort((a, b) => {
    if (a.group !== b.group) return a.group === 'lecture' ? -1 : 1;
    return a.slug.localeCompare(b.slug);
  });

  return docs;
}

// 1行目の "# タイトル" を抽出
function extractTitle(md: string): string | null {
  const match = md.match(/^#\s+(.+)$/m);
  return match?.[1].trim() ?? null;
}

const docs = buildDocs();

export function renderLectures(slug: string | undefined) {
  const app = document.getElementById('app');
  if (!app) return;

  const current = slug ? docs.find((d) => d.slug === slug) : undefined;

  // サイドバーのリンク一覧
  const navItems = (group: Doc['group'], label: string) => {
    const items = docs.filter((d) => d.group === group);
    if (items.length === 0) return '';
    return `
      <div class="lecture-nav-group">
        <div class="lecture-nav-label">${label}</div>
        ${items
          .map(
            (d) => `
              <a class="lecture-nav-item${current?.slug === d.slug ? ' active' : ''}"
                 href="#/lectures/${d.slug}">
                ${d.title}
              </a>
            `,
          )
          .join('')}
      </div>
    `;
  };

  app.innerHTML = `
    <div class="topbar">
      <a class="topbar-link" href="#/">← 進捗ページに戻る</a>
      <div class="topbar-title">講義資料</div>
    </div>

    <div class="lecture-layout">
      <aside class="lecture-sidebar">
        ${navItems('lecture', 'Day 1〜2 講義')}
        ${navItems('meta', 'リポジトリ説明')}
      </aside>
      <main class="lecture-content markdown-body">
        ${
          current
            ? marked.parse(current.content, { async: false })
            : `<div class="lecture-placeholder">
                <h1>📚 講義資料</h1>
                <p>左のリストから章を選んでください。</p>
              </div>`
        }
      </main>
    </div>
  `;
}
