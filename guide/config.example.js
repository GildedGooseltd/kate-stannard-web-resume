/**
 * Copy to config.js and fill in after Apps Script + QuickBooks setup.
 * Local config.js merges on top of pages-config.js (empty fields are ignored on live).
 */
window.PAV_PICKER_CONFIG = Object.assign({}, window.PAV_PICKER_CONFIG || {}, {
  webhookUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  depositAmount: 2500,
  quickbooksDepositUrl: "https://pay.intuit.com/YOUR_PAYMENT_LINK",
  notifyEmail: "support@gildedgooselimited.com"
});
