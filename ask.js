/**
 * ============================================================
 * ask.js — AI Question Answering (Placeholder)
 * ============================================================
 * Currently shows a "coming soon" state.
 *
 * TO INTEGRATE A LOCAL LLM (Ollama):
 * 1. Install Ollama: https://ollama.ai
 * 2. Pull a model: ollama pull qwen3 (or llama3, gemma3)
 * 3. Start Ollama server: ollama serve
 * 4. Replace the askQuestion() function below with an actual
 *    fetch() call to http://localhost:11434/api/generate
 *
 * EXAMPLE integration (uncomment and adapt when ready):
 *
 * async function askQuestion(prompt) {
 *   const response = await fetch('http://localhost:11434/api/generate', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({
 *       model: 'qwen3',   // change to your model
 *       prompt: buildSystemPrompt() + '\n\nQuestion: ' + prompt,
 *       stream: false
 *     })
 *   });
 *   const data = await response.json();
 *   return data.response;
 * }
 *
 * function buildSystemPrompt() {
 *   return `You are a GMP regulatory expert. Answer questions about
 *   Good Manufacturing Practice for pharmaceuticals, cell & gene therapies,
 *   ATMPs, and biological products. Cite specific guidelines where possible.
 *   Be precise and practical.`;
 * }
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function () {

  const input    = document.getElementById('ask-input');
  const examples = document.querySelectorAll('.ask-example');

  // Clicking an example question pre-fills the input
  examples.forEach(function (ex) {
    ex.addEventListener('click', function () {
      if (input && !input.disabled) {
        input.value = ex.textContent.replace(/^"/, '').replace(/"$/, '');
        input.focus();
      }
    });
  });

  // Placeholder: log when user tries to type (disabled state)
  console.log('Ask GMP AI — AI backend not yet connected.');
  console.log('See ask.js for integration instructions.');
});
