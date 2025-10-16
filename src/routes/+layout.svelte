<!-- src/routes/+layout.svelte -->
<script>
  export let data;
</script>

<style>
  header { padding: 0.5rem 1rem; background:#0f172a; color:white; display:flex; justify-content:space-between; align-items:center; }
  nav a { color: #dbeafe; margin-right: 1rem; text-decoration:none; }
  main { padding: 1rem; }
</style>

<header>
  <div><strong>Support Test</strong></div>
  <nav>
    <a href="/issues">Issues</a>
    <a href="/issues/new">New</a>
  </nav>
</header>

<main>
  <slot />
</main>
