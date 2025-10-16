<!-- src/routes/issues/new/+page.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
  let subject = '';
  let description = '';
  let priority = 'Medium';
  let creating = false;
  let errorMsg = '';

  async function submitForm(e: Event) {
    e.preventDefault();
    creating = true;
    errorMsg = '';
    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          description,
          priority,
          status: 'Open'
        })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create');
      }
      const payload = await res.json();
      // ERPNext returns created doc in .data
      const created = payload.data ?? payload;
      const name = (created.name ?? created.data?.name);
      // go back to list (or to detail)
      if (name) goto(`/issues/${encodeURIComponent(name)}`);
      else goto('/issues');
    } catch (err) {
      errorMsg = String(err);
    } finally {
      creating = false;
    }
  }
</script>

<h2>Create Issue</h2>

<form on:submit|preventDefault={submitForm}>
  <div>
    <label for="subject">Subject</label>
    <input id="subject" required bind:value={subject} />
  </div>

  <div>
    <label for="description">Description</label>
    <textarea id="description" bind:value={description}></textarea>
  </div>

  <div>
    <label for="priority">Priority</label>
    <select id="priority" bind:value={priority}>
      <option>Low</option>
      <option selected>Medium</option>
      <option>High</option>
      <option>Critical</option>
    </select>
  </div>

  <div>
    <button type="submit" disabled={creating}>{creating ? 'Creating…' : 'Create'}</button>
    <a href="/issues" style="margin-left:1rem">Cancel</a>
  </div>

  {#if errorMsg}
    <div style="color:crimson">{errorMsg}</div>
  {/if}
</form>
