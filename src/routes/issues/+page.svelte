<script lang="ts">
  import { onMount } from 'svelte';
  import { env } from '$env/dynamic/public';

  let issues = [];
  let loading = true;
  let errorMsg = '';

  // 🧩 ERP config from public env
  const ERP_BASE = env.PUBLIC_ERP_BASE_URL?.replace(/\/$/, '') || '';
  const AUTH = `token ${env.PUBLIC_FRAPPE_API_KEY}:${env.PUBLIC_FRAPPE_API_SECRET}`;

  async function load() {
    loading = true;
    errorMsg = '';
    try {
      const url = `${ERP_BASE}/api/resource/Issue?limit_page_length=10`;

      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          Authorization: AUTH
        }
      });

      const text = await res.text();
      console.log('📦 Raw ERP response:', text);

      // Check if it's JSON
      const type = res.headers.get('content-type') || '';
      if (!type.includes('application/json')) {
  
        throw new Error(`Non-JSON response (${type})`);
      }

      const data = JSON.parse(text);
      issues = data.data ?? [];
      if (!issues.length) errorMsg = 'No issues found.';
    } catch (err) {
      errorMsg = String(err);

      console.error('Load issues error:', err);
    } finally {
      loading = false;
    }
  }

  onMount(load);
</script>

<style>
  .list { padding: 0; list-style: none; }
  .item { padding: 0.5rem; border-bottom: 1px solid #eee; display:flex; justify-content:space-between; align-items:center; }
  .meta { font-size:0.9rem; color:#666; }
  .error { color: red; }
</style>

<h1>Support Issues</h1>
<nav>
  <a href="/issues/new">+ New Issue</a>
</nav>

{#if loading}
  <p>Loading…</p>
{:else if errorMsg}
  <div class="error">{errorMsg}</div>
{:else}
  <ul class="list">
    {#each issues as it}
      <li class="item">
        <div>
          <a href={`/issues/${it.name}`}><strong>{it.subject ?? it.name}</strong></a>
          <div class="meta">{it.status ?? 'Open'} • {it.name}</div>
        </div>
      </li>
    {/each}
  </ul>
{/if}
