/**
 * Editable DUI signed goal — loaded by index.html before kpi-report.js.
 * Edit via dui-goal.html (or change values here and hard-refresh).
 */
window.DUI_GOAL_DATA = {
  year: 2026,
  current: 20,
  jun: 5,
  jul: 2,
  aug: 0,
  sep: 1,
  target: 50,
  title: "# Auto Cases",
  label: "DUI",
  definition:
    "Client contacts with Created date in 2026 whose Cases (practice area) includes a DUI/DWAI matter — tagged (DUI/DWI), or Criminal Defense with DUI/DWAI/DWI in the matter name. Excludes ancient-only case refs (e.g. 16T9820) and Alcohol-only Criminal Defense without DUI/DWAI. Traffic stack = Client contacts with a (Traffic) practice-area tag and no DUI/DWAI matter. Source export as of 2026-09-23.",
  sourceFile:
    "Downloads/Contact_09-23-2026 (1).csv · Ad Reports/exports/mycase/as-of-2026-09-23/auto-cases-ytd.csv",
  exportStrictCount: 20,
  exportNote:
    "Recount 2026-09-23 from Contact_09-23-2026 (1).csv = DUI 20 · Jun 5 · Jul 2 · Aug 0 · Sep* 1. Traffic (Traffic) tag no DUI = 22. Auto total 42 / 50 · pace 84%. Same exclusion rules as prior lock.",
  updatedAt: "2026-09-23",
  notes: "Verified from Cases (practice area) on contact export. Chart = DUI and Traffic side-by-side columns; total = sum; target line is annual auto goal. Last updated 09/23/2026 · Contact_09-23-2026 (1).csv.",
  /* Auto case-type columns on #03 chart. vsTarget: true = compare to annual DUI goal line. */
  autoColumns: [
    { label: "DUI", current: 20, vsTarget: true },
    { label: "Traffic", current: 22, vsTarget: false }
  ],
  /* Est. revenue · case-num cross-ref Contact_09-23 auto stack × Case_balance/list/revenue · 09/24/2026
     19/42 matched · fill unknowns with kind median DUI $5,500 · Traffic $1,500. Aggregates only. */
  estRevenue: {
    ytd: 150300,
    goal: 170200,
    duiYtd: 110500,
    trafficYtd: 39800,
    matchedN: 19,
    totalN: 42,
    duiMedian: 5500,
    trafficMedian: 1500,
    asOf: "2026-09-24",
    note: "19/42 case-number fee matches + median fill · not Contact fee fields"
  }
};
