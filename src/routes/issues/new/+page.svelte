<script lang="ts">
  import { goto } from '$app/navigation';
  import { env } from '$env/dynamic/public';


  let subject = '';
  let description = '';
  let priority = 'Medium';
  let creating = false;
  let errorMsg = '';

  // Use environment vars for real backend
  const ERP_BASE = env.PUBLIC_ERP_BASE_URL?.replace(/\/$/, '') || '';
  const AUTH = `token ${env.PUBLIC_FRAPPE_API_KEY}:${env.PUBLIC_FRAPPE_API_SECRET}`;

  async function submitForm(e: Event) {
    e.preventDefault();
    creating = true;
    errorMsg = '';

    try {
      const url = `${ERP_BASE}/api/resource/Issue`;
      const payload = {
        subject,
        description,
        priority,
        status: 'Open'
      };

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH
        },
        body: JSON.stringify(payload)
      });

      const text = await res.text();
      console.log('📦 ERP create response:', text);

      if (!res.ok) {

        throw new Error(`Failed: ${res.status}\n${text}`);
      }

      const data = JSON.parse(text);
      const created = data.data ?? data;
      const name = created.name ?? created.data?.name;

      if (name) goto(`/issues/${encodeURIComponent(name)}`);
      else goto('/issues');
    } catch (err) {
      console.error('Create issue error:', err);
      errorMsg = String(err);
    } finally {
      creating = false;
    }
  }
</script>

<h2>Create Issue</h2>

<form on:submit={submitForm}>
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
    <button type="submit" disabled={creating}>
      {creating ? 'Creating…' : 'Create'}
    </button>
    <a href="/issues" style="margin-left:1rem">Cancel</a>
  </div>

  {#if errorMsg}
    <div style="color:crimson; margin-top:1rem;">{errorMsg}</div>
  {/if}
</form>
