async function loadPosts() {
  const grid = document.getElementById('post-grid');
  if (!grid) return;

  try {
    const res = await fetch('posts/posts.json');
    const posts = await res.json();

    grid.innerHTML = posts.map(post => `
      <a href="post.html?id=${post.id}" class="post-card">
        <div class="post-card__image--placeholder">${post.emoji}</div>
        <div class="post-card__body">
          <p class="post-card__tag">${post.tag}</p>
          <h2 class="post-card__title">${post.title}</h2>
          <p class="post-card__excerpt">${post.excerpt}</p>
          <p class="post-card__meta">${formatDate(post.date)}</p>
        </div>
      </a>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<p style="color:#999;padding:2rem 0">記事を読み込めませんでした。</p>';
  }
}

async function loadPost() {
  const article = document.getElementById('post-article');
  if (!article) return;

  const id = new URLSearchParams(location.search).get('id');
  if (!id) { article.innerHTML = '<p>記事が見つかりません。</p>'; return; }

  try {
    const res = await fetch('posts/posts.json');
    const posts = await res.json();
    const post = posts.find(p => p.id === id);
    if (!post) { article.innerHTML = '<p>記事が見つかりません。</p>'; return; }

    document.title = `${post.title} — Art Interpretation`;

    const body = post.sections.map(section => {
      if (section.type === 'heading') {
        return `<h2 class="post-heading">${section.text}</h2>`;
      }
      if (section.type === 'quote') {
        const html = section.text
          .split('\n')
          .map(line => `<p>${line}</p>`)
          .join('');
        return `<blockquote class="post-quote">${html}</blockquote>`;
      }
      return `<p class="post-text">${renderInline(section.text)}</p>`;
    }).join('');

    article.innerHTML = `
      <header class="post-header">
        <p class="post-tag">${post.tag}</p>
        <h1 class="post-title">${post.title}</h1>
        <p class="post-date">${formatDate(post.date)}</p>
      </header>
      <div class="post-body">${body}</div>
    `;
  } catch (e) {
    article.innerHTML = '<p>記事を読み込めませんでした。</p>';
  }
}

function renderInline(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

loadPosts();
loadPost();
