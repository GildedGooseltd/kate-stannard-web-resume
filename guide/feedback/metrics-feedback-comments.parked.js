/**
 * PARKED 2026-07-15 — do not load from index.html.
 * Restore: copy this file to ../metrics-feedback.js and bump cache ?v= (see README.md).
 * Task: T065
 *
 * Comment boxes on KPI / guide / impact targets.
 * Storage: browser localStorage. Email + Sheet: Send comments → webhook (metrics_feedback).
 */
(function () {
  const STORAGE_KEY = "pav-metrics-feedback-v2";
  const REVIEWER_KEY = "pav-metrics-reviewer-v1";
  const SESSION_KEY = "pav-metrics-session-v1";

  const TARGET_SELECTORS = [
    ".kpi-stat-card[data-kpi-focus]",
    ".kpi-goal-card[data-kpi-focus]:not([disabled]):not([aria-disabled='true'])",
    ".kpi-mini-card[data-kpi-focus]",
    ".kpi-dash-card[data-kpi-focus]",
    ".kpi-split-panel[data-feedback-id]",
    ".kpi-chart-card[data-kpi-focus]",
    ".kpi-section[data-feedback-id]",
    ".picker-zone[data-feedback-id]",
    ".impact-section[data-feedback-id]",
    "#completed-report-out[data-feedback-id]",
    ".pav-guide-ask-section[data-feedback-id]"
  ].join(", ");

  const state = {
    targets: [],
    feedback: loadFeedback(),
    sessionId: getOrCreateSessionId(),
    toastTimer: null,
    mo: null,
    syncing: false,
    sending: false
  };

  function loadFeedback() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (raw && typeof raw === "object") return raw;
    } catch { /* ignore */ }
    try {
      const legacy = JSON.parse(localStorage.getItem("pav-metrics-feedback-v1") || "{}");
      const migrated = {};
      Object.keys(legacy).forEach(id => {
        const e = legacy[id];
        if (!e) return;
        const comment = String(e.comment || "").trim();
        if (!comment && !e.verdict) return;
        migrated[id] = {
          comment: comment || "",
          targetLabel: e.targetLabel,
          updatedAt: e.updatedAt || new Date().toISOString()
        };
      });
      return migrated;
    } catch {
      return {};
    }
  }

  function getOrCreateSessionId() {
    try {
      let id = sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        id = "s-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
        sessionStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch {
      return "s-anon-" + Date.now().toString(36);
    }
  }

  function loadReviewer() {
    try {
      return JSON.parse(localStorage.getItem(REVIEWER_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function saveReviewer(name, email) {
    const next = { name: (name || "").trim(), email: (email || "").trim() };
    try {
      localStorage.setItem(REVIEWER_KEY, JSON.stringify(next));
    } catch { /* ignore */ }
    return next;
  }

  function readReviewerFromUi() {
    const stored = loadReviewer();
    return saveReviewer(stored.name || "", stored.email || "");
  }

  function getWebhookUrl() {
    const cfg = (typeof window !== "undefined" && window.PAV_PICKER_CONFIG) || {};
    return String(cfg.webhookUrl || "").trim();
  }

  function persistFeedbackLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.feedback));
    } catch { /* ignore quota */ }
    updateScoreBar();
    syncCommentUi();
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function slug(s) {
    return String(s || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled";
  }

  function computeTargetId(el) {
    if (el.dataset.feedbackId) return el.dataset.feedbackId.trim();
    const focus = (el.dataset.kpiFocus || "").trim();
    if (focus) {
      if (el.classList.contains("kpi-chart-card")) return `chart:${focus}`;
      if (el.classList.contains("kpi-mini-card")) return `mini:${focus}`;
      if (el.classList.contains("kpi-dash-card")) return `dash:${focus}`;
      if (el.classList.contains("kpi-goal-card")) return `goal:${focus}`;
      if (el.classList.contains("kpi-stat-card")) return `stat:${focus}`;
      return `kpi:${focus}`;
    }
    if (el.classList.contains("kpi-chart-card")) {
      const head = el.querySelector(".kpi-chart-head strong, h3, .kpi-section-title");
      return "chart:" + slug(head ? head.textContent : "untitled");
    }
    return "";
  }

  function targetLabel(el, id) {
    if (el.dataset.feedbackLabel) return el.dataset.feedbackLabel.trim();
    const kpi = el.dataset.kpiFocus;
    if (kpi) {
      const idEl = el.querySelector(".kpi-stat-id");
      const head = el.querySelector(".kpi-chart-head strong, h3");
      if (idEl) return idEl.textContent.trim();
      if (head) return head.textContent.trim();
      return kpi;
    }
    const title = el.querySelector(".kpi-section-title, .completed-panel-head, .revenue-panel-head, h3");
    if (title) return title.textContent.trim();
    return id || "Metric";
  }

  function targetType(el) {
    if (el.classList.contains("kpi-stat-card") || el.classList.contains("kpi-goal-card")) return "metric";
    if (el.classList.contains("kpi-chart-card") || el.querySelector(".kpi-chart-svg")) return "chart";
    if (
      el.classList.contains("kpi-dash-card") ||
      el.classList.contains("kpi-mini-card") ||
      el.classList.contains("kpi-split-panel")
    ) return "widget";
    if (el.classList.contains("kpi-section") || el.classList.contains("picker-zone") || el.classList.contains("impact-section")) {
      return "section";
    }
    return "other";
  }

  function entryFor(id, el) {
    if (state.feedback[id]) return state.feedback[id];
    const focus = (el?.dataset?.kpiFocus || "").trim();
    if (focus && state.feedback[focus]) {
      const prev = state.feedback[focus];
      state.feedback[id] = {
        comment: String(prev.comment || "").trim(),
        targetLabel: prev.targetLabel,
        updatedAt: prev.updatedAt || new Date().toISOString()
      };
      delete state.feedback[focus];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.feedback));
      } catch { /* ignore */ }
      return state.feedback[id];
    }
    return null;
  }

  function discoverTargets() {
    const candidates = [];
    document.querySelectorAll(TARGET_SELECTORS).forEach(el => {
      if (el.closest(".kpi-detail-panel")) return;
      if (el.closest(".kpi-rate-btns, .kpi-rate-note, .kpi-rate-tray")) return;
      if (el.closest(".impact-panel-body")) return;
      const id = computeTargetId(el);
      if (!id) return;
      el.dataset.feedbackFor = id;
      if (!el.dataset.feedbackId && id.indexOf(":") === -1 && !el.dataset.kpiFocus) {
        el.dataset.feedbackId = id;
      }
      candidates.push({ id, el, label: targetLabel(el, id), type: targetType(el) });
    });

    const leaves = candidates.filter(
      c => !candidates.some(other => other.el !== c.el && c.el.contains(other.el))
    );

    const seen = new Set();
    const out = [];
    leaves.forEach(c => {
      if (seen.has(c.id)) return;
      seen.add(c.id);
      out.push(c);
    });
    return out;
  }

  function entryHasContent(e) {
    return !!(e && String(e.comment || "").trim());
  }

  function scoreTotals() {
    let notes = 0;
    Object.values(state.feedback).forEach(e => {
      if (String(e?.comment || "").trim()) notes += 1;
    });
    return { notes };
  }

  function feedbackItems() {
    const byId = new Map(state.targets.map(t => [t.id, t]));
    return Object.keys(state.feedback)
      .filter(id => entryHasContent(state.feedback[id]))
      .map(id => {
        const t = byId.get(id);
        const e = state.feedback[id];
        return {
          id,
          label: t?.label || e.targetLabel || id,
          type: t?.type || "other",
          comment: String(e.comment || "").trim(),
          updatedAt: e.updatedAt || ""
        };
      });
  }

  function buildReport(eventName) {
    const who = readReviewerFromUi();
    const data = window.KPI_REPORT?.getData?.() || {};
    const items = feedbackItems();
    const stamp = new Date().toISOString();
    return {
      type: "metrics_feedback",
      event: eventName || "full_submit",
      submittedAt: stamp,
      submitterName: who.name || "",
      submitterEmail: who.email || "",
      sessionId: state.sessionId,
      period: data.period || "",
      asOf: data.asOf || "",
      source: data.source || (document.body.classList.contains("metrics-page") ? "metrics.html" : "index.html"),
      scores: scoreTotals(),
      feedbackCount: items.length,
      feedback: items
    };
  }

  async function postToWebhook(payload) {
    const url = getWebhookUrl();
    if (!url) return { ok: false, reason: "no_webhook" };
    const body = JSON.stringify(payload);
    let res;
    try {
      res = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body
      });
    } catch (err) {
      try {
        await fetch(url, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body
        });
        return { ok: true, noCors: true };
      } catch (err2) {
        return { ok: false, reason: String(err2.message || err2) };
      }
    }
    const text = await res.text();
    let data = {};
    try { data = JSON.parse(text); } catch { /* ignore */ }
    if (res.ok && (data.ok || text.includes('"ok":true'))) {
      return { ok: true, emailsSent: data.emailsSent || null };
    }
    return { ok: false, reason: data.error || text.slice(0, 120) || `HTTP ${res.status}` };
  }

  function downloadReport() {
    const report = buildReport("download");
    if (!report.feedbackCount) {
      showToast("Add a comment on at least one card first.", "err");
      return;
    }
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "gilbert-feedback-report-" + Date.now() + ".json";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("Downloaded feedback report.", "ok");
  }

  async function sendComments() {
    if (state.sending) return;
    const report = buildReport("full_submit");
    if (!report.feedbackCount) {
      showToast("Add a comment on at least one card first.", "err");
      return;
    }
    if (!getWebhookUrl()) {
      showToast("Webhook missing — comments stay on this device. Use Download, or set PAV_PICKER_WEBHOOK_URL.", "err");
      return;
    }
    state.sending = true;
    updateScoreBar();
    showToast("Sending comments…");
    try {
      const result = await postToWebhook(report);
      if (!result.ok) {
        showToast("Send failed — " + (result.reason || "try Download instead"), "err");
        return;
      }
      const mailed = result.emailsSent && result.emailsSent.internal;
      if (result.noCors) {
        showToast("Sent (Sheet + email if Apps Script is live). Confirm MetricsFeedback tab.", "ok");
      } else if (mailed) {
        showToast("Saved to MetricsFeedback sheet · email sent to Gilded Goose.", "ok");
      } else {
        showToast("Saved to MetricsFeedback sheet" + (result.emailsSent?.error ? " (email notify failed)" : "") + ".", "ok");
      }
    } finally {
      state.sending = false;
      updateScoreBar();
    }
  }

  function ensureScoreBar() {
    const panel = document.getElementById("cockpit-panel-kpis");
    if (!panel || document.getElementById("kpi-rating-bar")) return;
    const bar = document.createElement("div");
    bar.id = "kpi-rating-bar";
    bar.className = "kpi-rating-bar";
    bar.innerHTML =
      '<div class="kpi-rating-bar-main">' +
      '<p class="kpi-rating-score" id="kpi-rating-score" aria-live="polite"></p>' +
      '<div class="kpi-rating-actions">' +
      '<button type="button" class="kpi-rating-action kpi-rating-action-primary" id="kpi-rating-send">Send comments</button>' +
      '<button type="button" class="kpi-rating-action" id="kpi-rating-download">Download</button>' +
      "</div>" +
      "</div>" +
      '<p class="kpi-rating-hint">Comments save on this device. <strong>Send comments</strong> writes the Sheet and emails Gilded Goose (webhook).</p>' +
      '<p class="kpi-rating-toast" id="kpi-rating-toast" aria-live="polite"></p>';
    const root = panel.querySelector(".kpi-report-root");
    if (root) panel.insertBefore(bar, root);
    else panel.prepend(bar);

    document.getElementById("kpi-rating-send")?.addEventListener("click", () => { sendComments(); });
    document.getElementById("kpi-rating-download")?.addEventListener("click", downloadReport);
  }

  function updateScoreBar() {
    ensureScoreBar();
    const el = document.getElementById("kpi-rating-score");
    if (!el) return;
    const t = scoreTotals();
    const total = state.targets.length;
    const sendBtn = document.getElementById("kpi-rating-send");
    if (sendBtn) sendBtn.disabled = state.sending || t.notes === 0;
    el.innerHTML =
      `<strong>${t.notes}</strong> comment${t.notes === 1 ? "" : "s"}` +
      ` · <span>${total} boxes</span>` +
      (getWebhookUrl() ? "" : ` · <span class="kpi-rating-warn">webhook not set</span>`);
  }

  function showToast(msg, kind) {
    const toast = document.getElementById("kpi-rating-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.className = "kpi-rating-toast" + (kind === "err" ? " is-err" : kind === "ok" ? " is-ok" : "");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      toast.textContent = "";
      toast.className = "kpi-rating-toast";
    }, 4200);
  }

  function ensureCommentUi(t) {
    let wrap = t.el.closest(".kpi-rate-wrap");
    if (wrap && wrap.dataset.feedbackFor && wrap.dataset.feedbackFor !== t.id) {
      wrap = null;
    }
    if (!wrap || !wrap.contains(t.el)) {
      wrap = document.createElement("div");
      wrap.className = "kpi-rate-wrap";
      wrap.dataset.feedbackFor = t.id;
      const parent = t.el.parentNode;
      if (!parent) return null;
      parent.insertBefore(wrap, t.el);
      wrap.appendChild(t.el);
    }
    wrap.dataset.feedbackFor = t.id;
    wrap.classList.add("kpi-rate-wrap--" + (t.type || "other"));
    wrap.classList.remove("has-feedback-ok", "has-feedback-flag");

    let tray = wrap.querySelector(":scope > .kpi-rate-tray");
    if (!tray) {
      tray = document.createElement("div");
      tray.className = "kpi-rate-tray";
      tray.innerHTML =
        `<label class="kpi-rate-note">` +
        `<span class="kpi-rate-note-label">Comment</span>` +
        `<textarea class="kpi-rate-comment" data-comment-id="${escapeHtml(t.id)}" rows="2" placeholder="Note on this box…"></textarea>` +
        `</label>`;
      wrap.appendChild(tray);
    } else {
      tray.querySelectorAll(".kpi-rate-btns").forEach(n => n.remove());
      tray.querySelectorAll("[data-comment-id]").forEach(node => {
        node.dataset.commentId = t.id;
      });
    }

    t.el.classList.add("feedback-target");
    t.el.dataset.feedbackFor = t.id;
    return wrap;
  }

  function applyCommentState(wrap, entry) {
    if (!wrap) return;
    const hasNote = !!(entry?.comment && String(entry.comment).trim());
    wrap.classList.toggle("has-feedback-note", hasNote);
    wrap.classList.remove("has-feedback-ok", "has-feedback-flag");
    const ta = wrap.querySelector(".kpi-rate-comment");
    if (ta && document.activeElement !== ta) {
      ta.value = entry?.comment || "";
    }
  }

  function syncCommentUi() {
    state.targets.forEach(t => {
      const wrap = ensureCommentUi(t);
      applyCommentState(wrap, entryFor(t.id, t.el));
    });
  }

  function saveComment(id, text) {
    const comment = String(text || "").trim();
    const prev = state.feedback[id] || {};
    if (!comment) {
      delete state.feedback[id];
      persistFeedbackLocal();
      return;
    }
    state.feedback[id] = {
      comment,
      targetLabel: state.targets.find(t => t.id === id)?.label || prev.targetLabel,
      updatedAt: new Date().toISOString()
    };
    persistFeedbackLocal();
  }

  function bindClicks() {
    if (document.documentElement.dataset.kpiCommentsBound === "1") return;
    document.documentElement.dataset.kpiCommentsBound = "1";
    document.addEventListener("input", e => {
      const ta = e.target.closest?.(".kpi-rate-comment");
      if (!ta) return;
      const id = ta.getAttribute("data-comment-id") || ta.dataset.commentId;
      if (!id) return;
      const comment = String(ta.value || "");
      if (!comment.trim()) {
        if (state.feedback[id]) {
          delete state.feedback[id];
          persistFeedbackLocal();
        }
        return;
      }
      state.feedback[id] = {
        comment: comment.trim() ? comment : "",
        targetLabel: state.targets.find(t => t.id === id)?.label || state.feedback[id]?.targetLabel,
        updatedAt: new Date().toISOString()
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.feedback));
      } catch { /* ignore */ }
      const wrap = ta.closest(".kpi-rate-wrap");
      applyCommentState(wrap, state.feedback[id]);
      updateScoreBar();
    });
    document.addEventListener(
      "blur",
      e => {
        const ta = e.target?.classList?.contains("kpi-rate-comment") ? e.target : null;
        if (!ta) return;
        const id = ta.getAttribute("data-comment-id") || ta.dataset.commentId;
        if (id) saveComment(id, ta.value);
      },
      true
    );
  }

  function mutationLooksLikeReportRebuild(mutations) {
    for (const m of mutations) {
      for (const node of m.removedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.classList?.contains("kpi-rate-wrap")) continue;
        if (node.classList?.contains("kpi-section") || node.classList?.contains("kpi-stat-card") || node.id === "kpi-report-kpis") {
          return true;
        }
        if (node.querySelector?.(".kpi-section, .kpi-stat-card, .kpi-goals-grid")) return true;
      }
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.classList?.contains("kpi-rate-wrap") || node.classList?.contains("kpi-rate-tray")) continue;
        if (node.classList?.contains("kpi-section") || node.classList?.contains("kpi-stat-grid") || node.classList?.contains("kpi-goals-grid")) {
          return true;
        }
      }
    }
    return false;
  }

  function observeDom() {
    if (state.mo) return;
    const roots = [
      document.getElementById("kpi-report-kpis"),
      document.getElementById("cockpit-panel-impact"),
      document.getElementById("cockpit-panel-picker")
    ].filter(Boolean);
    if (!roots.length) return;
    let scheduled = false;
    state.mo = new MutationObserver(mutations => {
      if (state.syncing || scheduled) return;
      if (!mutationLooksLikeReportRebuild(mutations)) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        refresh();
      });
    });
    roots.forEach(root => {
      state.mo.observe(root, { childList: true, subtree: true });
    });
  }

  function refresh() {
    if (state.syncing) return;
    state.syncing = true;
    try {
      ensureScoreBar();
      state.targets = discoverTargets();
      syncCommentUi();
      updateScoreBar();
      observeDom();
    } finally {
      requestAnimationFrame(() => {
        state.syncing = false;
      });
    }
  }

  function init() {
    bindClicks();
    refresh();
  }

  function onReady() {
    if (document.body.classList.contains("metrics-page") && window.KPI_REPORT) {
      const kpis = document.getElementById("kpi-report-kpis");
      if (kpis) KPI_REPORT.renderAll(kpis);
    }
    const start = () => {
      if (document.getElementById("kpi-report-kpis")?.dataset.rendered || document.body.classList.contains("metrics-page")) {
        init();
      } else {
        setTimeout(start, 50);
      }
    };
    start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  window.addEventListener("kpi-report-rendered", () => {
    refresh();
  });

  window.addEventListener("kpi-report-ready", () => {
    refresh();
  });

  window.PAV_KPI_RATINGS = {
    refresh,
    getScores: scoreTotals,
    getFeedback: () => ({ ...state.feedback }),
    buildReport,
    downloadReport,
    sendComments
  };
})();
