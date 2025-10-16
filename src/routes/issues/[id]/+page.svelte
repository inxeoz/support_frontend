<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { env } from '$env/dynamic/public';

  let issue: any = null;
  let loading = true;
  let errorMsg = '';
  let saving = false;

  // 🧩 Environment config
  const ERP_BASE = env.PUBLIC_ERP_BASE_URL?.replace(/\/$/, '') || '';
  const AUTH = `token ${env.PUBLIC_FRAPPE_API_KEY}:${env.PUBLIC_FRAPPE_API_SECRET}`;

  const id = $page.params.id;

  async function load() {
    loading = true;
    errorMsg = '';
    try {
      const url = `${ERP_BASE}/api/resource/Issue/${encodeURIComponent(id)}`;
      const res = await fetch(url, {
        headers: {
          Accept: 'application/json',
          Authorization: AUTH
        }
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`Error ${res.status}: ${text}`);

      const payload = JSON.parse(text);
      issue = payload.data ?? payload;
    } catch (err) {
      console.error('❌ Load error:', err);
      errorMsg = String(err);
    } finally {
      loading = false;
    }
  }

  async function updateStatus(newStatus: string) {
    if (!confirm(`Set status to "${newStatus}"?`)) return;
    saving = true;
    try {
      const url = `${ERP_BASE}/api/resource/Issue/${encodeURIComponent(id)}`;
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH
        },
        body: JSON.stringify({ status: newStatus })
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`Update failed: ${res.status} ${text}`);

      await load(); // reload issue details
      alert(`✅ Status updated to "${newStatus}"`);
    } catch (err) {
      console.error('❌ Update error:', err);
      alert(`❌ ${err}`);
    } finally {
      saving = false;
    }
  }

  async function remove() {
    if (!confirm('Delete this issue?')) return;
    try {
      const url = `${ERP_BASE}/api/resource/Issue/${encodeURIComponent(id)}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: AUTH }
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`Delete failed: ${res.status} ${text}`);

      alert('✅ Issue deleted');
      goto('/issues');
    } catch (err) {
      console.error('❌ Delete error:', err);
      alert(`❌ ${err}`);
    }
  }

  onMount(load);
</script>

{#if loading}
  <p>Loading issue…</p>
{:else}
  {#if errorMsg}
    <div style="color:crimson">{errorMsg}</div>
  {:else}
    <h2>{issue.subject ?? issue.name}</h2>
    <p><strong>Status:</strong> {issue.status}</p>
    <p><strong>Priority:</strong> {issue.priority}</p>
    <p><strong>Raised By:</strong> {issue.raised_by}</p>
    <hr>
    <div>
      <h3>Description</h3>
      <div>{@html issue.description ?? ''}</div>
    </div>

    <div style="margin-top:1rem">
      <button on:click={() => updateStatus('Work In Progress')} disabled={saving}>Start</button>
      <button on:click={() => updateStatus('Resolved')} disabled={saving}>Resolve</button>
      <button on:click={() => updateStatus('Closed')} disabled={saving}>Close</button>
      <button on:click={remove} style="margin-left:1rem">Delete</button>
      <a href="/issues" style="margin-left:1rem">Back</a>
    </div>
  {/if}
{/if}
