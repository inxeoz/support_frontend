<!-- src/routes/issues/[id]/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  let issue: any = null;
  let loading = true;
  let errorMsg = '';
  let saving = false;

  const id = $page.params.id;

  async function load() {
    loading = true;
    errorMsg = '';
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(await res.text());
      const payload = await res.json();
      issue = payload.data ?? payload;
    } catch (err) {
      errorMsg = String(err);
    } finally {
      loading = false;
    }
  }

  async function updateStatus(newStatus: string) {
    if (!confirm(`Set status to "${newStatus}"?`)) return;
    saving = true;
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (err) {
      alert(String(err));
    } finally {
      saving = false;
    }
  }

  async function remove() {
    if (!confirm('Delete this issue?')) return;
    try {
      const res = await fetch(`/api/issues/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(await res.text());
      goto('/issues');
    } catch (err) {
      alert(String(err));
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
