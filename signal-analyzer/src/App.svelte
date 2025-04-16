<script>
  import SignalGenerator from './components/SignalGenerator.svelte';
  import SignalProcessor from './components/SignalProcessor.svelte';
  import ChannelViewer from './components/ChannelViewer.svelte';
</script>

<main>
  <header>
    <h1>Signal Analyzer</h1>
    <p>Generate, process, and analyze signals</p>
  </header>

  <div class="app-container">
    <div class="tools-panel">
      <SignalGenerator />
      <SignalProcessor />
    </div>
    
    <ChannelViewer />
  </div>
</main>

<style>
  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f8f9fa;
    color: #333;
  }
  
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  h1 {
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }
  
  header p {
    color: #7f8c8d;
    margin-top: 0;
  }
  
  .app-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .tools-panel {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  @media (min-width: 768px) {
    .tools-panel > :global(*) {
      flex: 1;
      min-width: 300px;
    }
  }
</style>
