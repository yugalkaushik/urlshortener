const shortenForm = document.getElementById("shorten-form");
const analyticsForm = document.getElementById("analytics-form");
const serviceStatus = document.getElementById("service-status");
const createFeedback = document.getElementById("create-feedback");
const resultCard = document.getElementById("result-card");
const shortCodeLabel = document.getElementById("short-code-label");
const shortUrlText = document.getElementById("short-url");
const copyLinkButton = document.getElementById("copy-link");
const openLinkButton = document.getElementById("open-link");
const expiryLabel = document.getElementById("expiry-label");
const analyticsLink = document.getElementById("analytics-link");
const analyticsSummary = document.getElementById("analytics-summary");
const prefillDemoButton = document.getElementById("prefill-demo");
const analyticsCodeInput = document.getElementById("analytics-code");

const REQUEST_TIMEOUT_MS = 15000;

let latestShortUrl = "";

function setMessage(message, kind) {
  createFeedback.textContent = message;
  createFeedback.className = `feedback ${kind || ""}`.trim();
}

function formatDate(value) {
  if (!value) {
    return "No expiry";
  }

  const date = new Date(value);
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderShortResult(data) {
  latestShortUrl = data.shortUrl;
  resultCard.classList.remove("hidden");
  shortCodeLabel.textContent = data.shortCode;
  shortUrlText.textContent = data.shortUrl;
  openLinkButton.href = data.shortUrl;
  analyticsLink.href = `/api/analytics/${encodeURIComponent(data.shortCode)}`;
  expiryLabel.textContent = data.expiresAt ? `Expires ${formatDate(data.expiresAt)}` : "No expiry set";
  analyticsCodeInput.value = data.shortCode;
}

function renderAnalytics(data) {
  const clickEntries = Object.entries(data.clicksByDay || {}).slice(-5);

  analyticsSummary.innerHTML = `
    <div class="summary-grid">
      <div class="summary-item">
        <span>Total clicks</span>
        <strong>${escapeHtml(data.totalClicks ?? 0)}</strong>
      </div>
      <div class="summary-item">
        <span>Status</span>
        <strong>${data.isActive ? "Active" : "Inactive"}</strong>
      </div>
      <div class="summary-item">
        <span>Created</span>
        <strong>${formatDate(data.createdAt)}</strong>
      </div>
      <div class="summary-item">
        <span>Expires</span>
        <strong>${data.expiresAt ? formatDate(data.expiresAt) : "No expiry"}</strong>
      </div>
    </div>
    <div class="analytics-list">
      <div>
        <h4>Original URL</h4>
        <p class="empty-state">${escapeHtml(data.originalUrl)}</p>
      </div>
      <div>
        <h4>Clicks by day</h4>
        <div class="data-list">
          ${clickEntries.length ? clickEntries.map(([day, count]) => `<div class="data-row"><strong>${escapeHtml(day)}</strong><span>${escapeHtml(count)} clicks</span></div>`).join("") : '<p class="empty-state">No click activity yet.</p>'}
        </div>
      </div>
    </div>
  `;
}

async function loadAnalyticsForCode(code) {
  const response = await fetch(`/api/analytics/${encodeURIComponent(code)}`);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Unable to load analytics");
  }

  renderAnalytics(data.data);
  analyticsSummary.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function loadHealth() {
  if (!serviceStatus) {
    return;
  }

  try {
    const response = await fetch("/health");
    if (!response.ok) {
      throw new Error("Service unavailable");
    }

    serviceStatus.textContent = "Service online";
  } catch {
    serviceStatus.textContent = "Service offline";
  }
}

async function handleShortenSubmit(event) {
  event.preventDefault();
  setMessage("Creating link...", "");

  const originalUrl = document.getElementById("original-url").value.trim();
  const ttlMinutes = document.getElementById("ttl-minutes").value.trim();
  const ttlSeconds = ttlMinutes ? Number(ttlMinutes) * 60 : undefined;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      body: JSON.stringify({
        url: originalUrl,
        ttlSeconds: Number.isFinite(ttlSeconds) ? ttlSeconds : undefined,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || "Unable to create link");
    }

    renderShortResult(data.data);
    setMessage("Link created successfully.", "success");
  } catch (error) {
    const isAbortError = error instanceof DOMException && error.name === "AbortError";
    setMessage(
      isAbortError ? "Request timed out. Please try again." : error instanceof Error ? error.message : "Unable to create link.",
      "error"
    );
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function handleAnalyticsSubmit(event) {
  event.preventDefault();
  const code = analyticsCodeInput.value.trim();

  if (!code) {
    analyticsSummary.innerHTML = '<p class="empty-state">Enter a short code first.</p>';
    return;
  }

  analyticsSummary.innerHTML = '<p class="empty-state">Loading analytics...</p>';

  try {
    await loadAnalyticsForCode(code);
  } catch (error) {
    analyticsSummary.innerHTML = `<p class="empty-state">${escapeHtml(error instanceof Error ? error.message : "Unable to load analytics.")}</p>`;
  }
}

async function copyLatestLink() {
  if (!latestShortUrl) {
    return;
  }

  await navigator.clipboard.writeText(latestShortUrl);
  setMessage("Link copied to clipboard.", "success");
}

function loadDemo() {
  document.getElementById("original-url").value = "https://example.com/products/strategy/playbook";
  document.getElementById("ttl-minutes").value = "1440";
  setMessage("Demo values loaded.", "");
}

analyticsLink.addEventListener("click", async () => {
  const code = analyticsCodeInput.value.trim();

  if (!code) {
    analyticsSummary.innerHTML = '<p class="empty-state">Create or enter a short code first.</p>';
    analyticsSummary.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  analyticsSummary.innerHTML = '<p class="empty-state">Loading analytics...</p>';

  try {
    await loadAnalyticsForCode(code);
  } catch (error) {
    analyticsSummary.innerHTML = `<p class="empty-state">${escapeHtml(error instanceof Error ? error.message : "Unable to load analytics.")}</p>`;
  }
});

shortenForm.addEventListener("submit", handleShortenSubmit);
analyticsForm.addEventListener("submit", handleAnalyticsSubmit);
copyLinkButton.addEventListener("click", copyLatestLink);
prefillDemoButton.addEventListener("click", loadDemo);

loadHealth();
