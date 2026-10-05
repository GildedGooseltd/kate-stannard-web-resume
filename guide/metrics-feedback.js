/**
 * Metrics / cockpit feedback — DISABLED (2026-07-15).
 * Full comments + Send → Sheet/email implementation parked at:
 *   feedback/metrics-feedback-comments.parked.js
 * Restore: copy parked file over this path, re-add script tag in index.html, bump ?v=
 * Roll-out task: T065
 */
(function () {
  window.PAV_KPI_RATINGS = {
    refresh() {},
    getScores() { return { notes: 0 }; },
    getFeedback() { return {}; },
    buildReport() { return null; },
    downloadReport() {},
    sendComments() {}
  };
})();
