// OA self-test — 15 questions adapted from "Are You a Compulsive Overeater?"
(function () {
  const list = document.getElementById("self-test-questions");
  const result = document.getElementById("self-test-result");
  if (!list || !result) return;

  const QUESTIONS = [
    "Do I eat when I'm not hungry, or not eat when my body needs nourishment?",
    "Do I go on eating binges for no apparent reason, sometimes eating until I'm stuffed or feel sick?",
    "Do I have feelings of guilt, shame, or embarrassment about my weight or the way I eat?",
    "Do I eat sensibly in front of others and then make up for it when I am alone?",
    "Is my eating affecting my health or the way I live my life?",
    "When my emotions are intense — positive or negative — do I find myself reaching for food?",
    "Do my eating behaviors make me or others unhappy?",
    "Have I ever used laxatives, vomiting, diuretics, excessive exercise, diet pills, shots, or other medical interventions (including bariatric surgery) to try to control my weight?",
    "Do I fast or severely restrict my food intake to control my weight?",
    "Do I fantasize about how much better life would be if I were a different size or weight?",
    "Do I need to chew or have something in my mouth all the time — food, gum, mints, candies, or beverages?",
    "Have I ever eaten food that is burned, frozen, or spoiled; from containers in the grocery store; or out of the garbage?",
    "Are there certain foods I can't stop eating after having the first bite?",
    "Have I lost weight with a diet or program, only to be followed by bouts of uncontrolled eating or weight gain?",
    "Do I spend too much time thinking about food, arguing with myself about whether or what to eat, planning the next diet or exercise cure, or counting calories?",
  ];

  const answers = new Array(QUESTIONS.length).fill(null);

  function escapeHTML(s) {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function render() {
    list.innerHTML = QUESTIONS.map((q, i) => `
      <li>
        <span class="q-text">${escapeHTML(q)}</span>
        <span class="q-toggle" role="group" aria-label="Answer question ${i + 1}">
          <button type="button" data-q="${i}" data-value="yes" aria-pressed="${answers[i] === "yes"}" class="${answers[i] === "yes" ? "active" : ""}">Yes</button>
          <button type="button" data-q="${i}" data-value="no"  aria-pressed="${answers[i] === "no"}"  class="${answers[i] === "no"  ? "active" : ""}">No</button>
        </span>
      </li>
    `).join("");
  }

  function updateResult() {
    const yes = answers.filter((a) => a === "yes").length;
    const answered = answers.filter((a) => a !== null).length;
    if (answered < QUESTIONS.length) {
      result.hidden = true;
      return;
    }
    const high = yes >= 5;
    const cls = high ? "test-result high" : "test-result";
    const headline = high
      ? "You may find OA helpful."
      : yes >= 2
        ? "OA may be worth exploring."
        : "OA is here when you want it.";
    const body = high
      ? `You answered yes to <strong>${yes} of ${QUESTIONS.length}</strong> questions. Many OA members answered yes to most of these before coming to their first meeting. You are not alone — and you don't have to figure this out by yourself.`
      : yes >= 2
        ? `You answered yes to <strong>${yes} of ${QUESTIONS.length}</strong> questions. Even a couple of yeses can be a sign that food has more of a hold on you than you'd like. A meeting is a low-cost way to listen and decide for yourself.`
        : `You answered yes to <strong>${yes} of ${QUESTIONS.length}</strong> questions. If your eating still concerns you, or if it changes in the future, OA welcomes anyone with a desire to stop eating compulsively.`;
    result.className = cls;
    result.innerHTML = `
      <h5>${headline}</h5>
      <p>${body}</p>
      <div class="test-actions">
        <a class="btn btn-primary btn-sm" href="meetings.html">Find a meeting</a>
        <a class="btn btn-ghost btn-sm" href="tel:+12026814056">Call (202) 681-4056</a>
      </div>
    `;
    result.hidden = false;
  }

  list.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-q]");
    if (!btn) return;
    const idx = Number(btn.dataset.q);
    answers[idx] = btn.dataset.value;
    render();
    updateResult();
  });

  render();
})();
