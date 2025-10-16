<!-- src/routes/issues/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  let issues = [];
  let loading = true;
  let errorMsg = '';

  async function load() {
    loading = true;
    errorMsg = '';
    try {
      const res = await fetch('/api/issues');
      if (!res.ok) throw new Error(await res.text());
      const payload = await res.json();
      // ERPNext returns { data: [...] } for resource list
      issues = payload.data ?? payload;
    } catch (err) {
      errorMsg = String(err);
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
  .actions button { margin-left:0.4rem; }
</style>

<h1>Support Issues</h1>

<nav>
  <a href="/issues/new">+ New Issue</a>
</nav>

{#if loading}
  <p>Loading…</p>
{:else}
  {#if errorMsg}
    <div class="error">{errorMsg}</div>
  {:else}
    <ul class="list">
      {#each issues as it}
        <li class="item">
          <div>
            <a href={`/issues/${it.name}`}><strong>{it.subject ?? it.title ?? it.name}</strong></a>
            <div class="meta">{it.status} • {it.name}</div>
          </div>
          <div class="actions">
            <a href={`/issues/${it.name}`}>View</a>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
{/if}
