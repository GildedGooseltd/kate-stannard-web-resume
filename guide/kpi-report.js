/**
 * Inline Sample Firm KPI report — no iframe. Renders into #kpi-report-kpis
 * (former Dashboards charts live at the bottom of the KPIs tab).
 */
(function () {
  const RENDER_VER = "20261002-digitalgoals";
  /** Tile-month pills — current month first. May/Jun/Jul = proof months; Oct* MTD. */
  /* Newest first — every month with a tile stack. */
  const PERIOD_OPTIONS = ["October 2026", "September 2026", "August 2026", "July 2026", "June 2026"];
  /** Cash collected chart year: 2026 default · 2025 via toggle. */
  let cashCollectedViewYear = 2026;
  /** Cases created chart year: 2026 default · 2025 via toggle. */
  let casesCreatedViewYear = 2026;
  /** Export-backed source footnotes — file path + fields for quick re-pull. */
  const KPI_SOURCES = {
    "#01": {
      file: "Call details (13) All-time · Campaign report (41) Sep 1–28 · leads-inbox (22) · HubSpot form submits 10/02 · Yelp 10/02 · Justia Mar–Aug · ledger (10) · recheck 2026-10-02",
      fields: "Jun 226 · Jul 281 · Aug 101 · Sep* 100 = Search 41 + LSA 44 + HubSpot 4 + Yelp 11 + Justia 0 · HubSpot forms May 7 · Jun 8 · Jul 6 · Aug 0 · Sep 4 · Search from Call details (13)"
    },
    "yelp": {
      file: "Yelp lead inbox screenshots 2026-10-02 · dated call log Jun–Sep · Case_balance_09-23 + Trust_10-02 for signed fees · Ads by type 09/18 for Aug raw mix · spend Sep 1–27 $432.67 · listing 4.5 · 8 reviews",
      fields: "Contacts = Messages + round(Calls × 40% answered) · Jun 3 · Jul 6 · Aug 10 · Sep* 11 · signed Case_balance Total $23,500 across 3 matters · Trust Credits $9,145 · mean signed $7,833"
    },
    "#02": {
      file: "Downloads/Contact_10-02-2026.csv · export 2026-10-02 · Sep Created through 09/30 · Oct Created 0",
      fields: "Contact group=Client · Created date · practice mix fuzzy · Jun 36 · Jul 35 · Aug 20 · Sep 16 = DV 3 · Traffic/DUI 3 · PPO 3 · Sealing 2 · Weapons 1 · Other 4 · Oct* 0"
    },
    "#03": {
      file: "Downloads/Contact_09-28-2026.csv · dui-goal-data.js · last updated 2026-09-28",
      fields: "DUI YTD 20 · Traffic 22 · Auto 42/50 · est. revenue $150,300 / $170,200 · 19/42 fee cross-ref + median fill"
    },
    "#04": {
      file: "Downloads/Contact_10-02-2026.csv · casesMom newCases · last updated 2026-10-02",
      fields: "New cases MoM · Apr 15 · May 22 · Jun 36 · Jul 35 · Aug 20 · Sep 16 · Oct* 0 · Sep vs Aug −20%. Closed and red accounts not on file."
    },
    "#07": {
      file: "account_activities_202609 (1).csv · Home Services Ads activity · Sep 1–30 · mtime 2026-09-23 · recheck 2026-09-24",
      fields: "LSA MoM + Search spend from account_activities · Jul LSA $14,555.67 · Aug* LSA $6,285.70 · Sep* LSA $4,882.56"
    },
    "#08": {
      file: "Campaign report (32) All time 2026-09-08 · HS live Lifetime: Military $3,412 / 35 calls · DV $1,303 / 7 · NTGUILT $196 / 0 · shared $350 portfolio",
      fields: "All-time HS unit cost only · not Sep calendar · Call details still required for MoM $/call"
    },
    "#10": {
      file: "Derived from #01 channel stack (Call details + LSA inbox)",
      fields: "Search share · LSA share · HubSpot · Yelp · Justia %"
    },
    "#12": {
      file: "Call details Search · HubSpot forms · Yelp messages · Justia Profile Stats · account_activities Search $ · Referral Sites fee",
      fields: "Tile-month Search media + HubSpot forms fee + Yelp spend + Justia fee ÷ Search calls + forms + Yelp + Justia contacts · Yelp contacts = Messages + answered Calls at 40% · Justia = calls + emails · LSA ceiling from May–Aug Home Services $ ÷ inbox leads"
    },
    "#13": {
      file: "leads-inbox (19).csv · account_activities_202609 (1).csv · Sep LSA $4,371.54 · recheck 2026-09-24",
      fields: "May 72/27 · Jun 83/39 locked · Jul 132/52 · Aug* 61/19 · Sep* 44/15 · Jul LSA $14,555.67 · Aug* LSA $6,285.70 · Sep* LSA $4,882.56"
    },
    "#16": {
      file: "Google Maps + Yelp public pages · scraped 2026-07-16 · 102 S Tejon St",
      fields: "GBP 4.9 · 121 reviews · Yelp 4.5 · 8 reviews · FindLaw 0 (no firm reviews)"
    },
    "#19": {
      file: "Staging — DASHBOARD-STAGING.md · Missed Opportunity · Call details (9) Sep 1–23 in phoneByMonth",
      fields: "Sep* snapshot · weekday 19/33 missed · LSA uncharged 11/15 · × 7.3% × $5,661"
    },
    "#21": {
      file: "Call details (7).csv Sep 1–18 · LSA leads-inbox / lsaEfficiency · Yelp Ads Leads by type byMonth",
      fields: "Search answer · LSA % charged · Yelp call answer · Data tab Answer Rate chart"
    },
    "answer-rate": {
      file: "phoneByMonth weekday Call details (13) All-time · lsaEfficiency Charged÷Leads · yelpBaseline.byMonth answeredCalls÷calls · recheck 10/02/2026",
      fields: "Search weekday May–Sep* · LSA May–Sep* · Yelp Jun–Sep* when calls > 0 · Search target ≥ 90% · weekends excluded from Search"
    },
    "#28": {
      file: "Downloads/Contact_09-28-2026.csv · Client + fee · locked order Pre-Trial Flat Fee → pre-File flat → trial_fee → retainer → payment_amount · recheck 2026-10-02",
      fields: "Client + fee mean $5,661 · n=139 · Contact_09-28-2026 aggregates · not cash collected"
    },
    "#30": {
      file: "Staging — DASHBOARD-STAGING.md · Cost per Case · model still hydrates for Avg Case Value notes",
      fields: "May–Aug complete · $67,017 media + $12,000 management + $3,000 HubSpot + $6,000 Referral Sites ÷ 113 cases = $779/case · known stack only · prior installments ≥$20k YTD not fully visible"
    },
    "#33": {
      file: "Staging — PAV_HISTORICAL 9/124 in app.js · phoneIntake.leadToCaseRate in kpi-report.js · not a measured MoM join yet",
      fields: "Placeholder 7.3% · replace with signed cases ÷ #01 leads on a defined window · channel split is #32"
    },
    "avg-case-value": {
      file: "ledger_account_activity_report (1).csv credits · MyCase new cases by Created month",
      fields: "Same complete months as #30 · ledger credits ÷ new cases created in those months · contracted mean fee from KPI #28 shown for comparison"
    },
    "#29": {
      file: "Downloads/Contact_09-28-2026.csv · Client + fee · n≥5 practice means · recheck 2026-10-02",
      fields: "Client + fee · Case Type / practice · n≥5 means · LOE 1–5 from Kate chart 09/23/2026 · biggest opportunity = mean ÷ LOE"
    },
    "cash-pace": {
      file: "ledger_account_activity_report (10).csv export 10/02/2026 · Credits Sep $113,985 through 09/30/2026 · Jan–Aug locked · Contact_09-28 cases",
      fields: "Follows tile month · Sep Credits through 09/30/2026 · W1–W4 running Trust Credit by calendar week · completed gray · future = pace × week-end day"
    },
    "cases-leads-spend": {
      file: "Contact_10-02 · Billing activity (1) · Call details (13)/(15) · leads-inbox (22) · HubSpot forms 10/02 · Yelp 10/02 · ledger (10) · recheck 2026-10-02",
      fields: "May 125 · Jun 226 · Jul 281 · Aug 101 · Sep* cases 16 · leads 100 · spend $19,083.93 = Search $13,651.22 + LSA $5,432.71 · Oct* cases 0 · leads 2 · spend $1,914.03"
    },
    "sales-cost-funnel": {
      file: "Campaign report (41) · Call details (13) · leads-inbox (22) · HubSpot · Yelp 10/02 · Justia Mar–Aug · channelMonths · recheck 10/02/2026",
      fields: "Direct contacts = Search + LSA + HubSpot + Yelp + Justia. May 125 · Jun 226 · Jul 281 · Aug 101 · Sep* 100 · Oct* 2 = 1 + 1 + 0 + 0 + 0 · spend from Billing activity (1)"
    },
    "dg-ctr": {
      file: "funnelAds impressions + clicks · Campaign report when on file · recheck 10/02/2026",
      fields: "CTR = clicks ÷ impressions · October digital goal ≥ 4%"
    },
    "dg-click-call": {
      file: "funnelAds clicks + phoneCalls · Call details / Billing when phoneCalls null · recheck 10/02/2026",
      fields: "Click → call = Search phones ÷ clicks · October digital goal ≥ 20%"
    },
    "dg-phone-cost": {
      file: "funnelAds searchSpendLock + phoneCalls · Billing Search $ ÷ Call details phones · recheck 10/02/2026",
      fields: "Search $/phone · October digital goal ≤ $175 · Kate acceptable band ~$173"
    },
    "dg-case-cost": {
      file: "casesLeadsSpend media spend ÷ Contact Client creates · Search + LSA + Yelp · recheck 10/02/2026",
      fields: "Media $/new Client · October digital goal ≤ $650 · proof Jun–Aug ~$518–$623"
    },
    "cash-collected": {
      file: "ledger_account_activity_report (10).csv · export 10/02/2026 · Jan–Aug locked · Sep through 09/30",
      fields: "Trust Credits · Aug $104,545 · Jul $108,350 · Sep $113,985 through 09/30/2026"
    },
    "financial": {
      file: "ledger_account_activity_report (10).csv · Contact_09-28-2026 · export 10/02/2026",
      fields: "Trust Credits · $100k goal · Aug $104,545 · Sep cases 16 · Sep revenue $113,985 · Oct* cases 0 · Oct* revenue $6,075"
    },
    "cases-created": {
      file: "Contact_10-02-2026 aggregates · export 2026-10-02",
      fields: "Cases created by month · 2026 Jun 36 · Jul 35 · Aug 20 full · Sep 16 through 09/30 · Oct* 0 through 10/02"
    },
    "cases-yoy": {
      file: "Contact_09-28-2026 · cashCollected 2025 newCases + cashCollected2026Ytd · Jan–Aug complete only",
      fields: "YoY % = (2026 − 2025) ÷ 2025 for same calendar month · Sep* excluded until complete"
    },
    "roas-monthly": {
      file: "cashCollected2026Ytd Trust Credits · Search + LSA from casesLeadsSpend · target 10×",
      fields: "ROAS = ledger Credits ÷ Search + LSA · paid-stack target 10× · watch below 4×"
    },
  };

  const KPI_HELP = {
    "#01": {
      title: "#01 Lead Calls",
      desc: "Uses the selected tile month. June and July are proof months for the paid stack. August MTD is low because Search ads are paused unpaid. That is a funding gap, not an expected quiet month. Stack = Search Call details + LSA inbox + HubSpot forms + Yelp contacts + Justia contacts + Firm website. Yelp contacts = Messages + answered Calls at 40%. Justia contacts = calls + emails allocated across Mar–Aug. Track table breaks out each channel.",
      formula: "Oct* 2 = Search 1 + LSA 1 + HubSpot 0 + Yelp 0 + Justia 0. Sep* 100 = Search 41 + LSA 44 + HubSpot 4 + Yelp 11 + Justia 0. Search from Call details. LSA Oct billed lead from Billing activity (1). HubSpot forms May 7 · Jun 8 · Jul 6 · Aug 0 · Sep 4. Target = round(average Lead Calls over the last 3 complete months)."
    },
    "#02": {
      title: "#02 New Cases",
      desc: "MyCase Contact group = Client counted by Created date. June 36 and July 35 are full calendar months. August 20 is full month. September is 16 through Created 09/30/2026 from Contact_10-02-2026. October* is 0 Created through 10/02. Track table is practice mix for that month from Cases practice area text. Fuzzy buckets only. Case target exists so monthly revenue can clear $100k. Gauge only.",
      formula: "Count of Client contacts with Created date in month. Practice rows = same contacts bucketted from Cases (practice area). Target = floor($100k ÷ revenue/case) + 1 so monthly revenue clears $100k."
    },
    "#07": {
      title: "#07 Spend Waste",
      desc: "Modeled excess LSA media cost versus producing the same response volume at digital Search’s observed cost per response. Jun full month + Jul* (leads through Jul 24; LSA Home Services spend still from Jul 17 activities — Jul 24 activities file was incomplete).",
      formula: "LSA spend − (LSA responses × digital cost per response). Jun: $13,206 − (83 × $60.12) = $8,216 waste. Jul*: $7,163 − (96 × $64.19) = $1,001. Total = −$9,217. Modeled responses missed at the digital rate: 152."
    },
    "#12": {
      title: "#12 Avg. Cost per Direct Contact",
      desc: "Blended cost of digital Search phone calls, HubSpot form submits, Yelp leads, and Justia contacts for the tile month. Gauge ceiling / target = average LSA call cost from account_activities Home Services $ ÷ LSA inbox leads. Stay under that LSA average.",
      formula: "Direct contact spend = Search media + HubSpot forms fee + Yelp ad spend + Justia Referral Sites fee when wired. Contacts = Search calls + form submits + Yelp contacts + Justia contacts. Yelp contacts = Messages + round(Calls × 40% Yelp answer rate). Justia contacts = calls + emails."
    },
    "#13": {
      title: "#13 LSA % charged · leads · avg charge cost",
      desc: "Local Services inbox Charge status + Home Services media from account_activities. May 72/27 and Jun 83/39 stay locked. Jul 132/52 full month from inbox(3). Aug* 61/19 through Aug 21. Jul Home Services $14,555.67 · Aug* $6,285.70 from account_activities_202608(3).",
      formula: "% charged = Charged ÷ LSA leads. Avg charge cost = LSA Home Services activity $ ÷ Charged when spend is known."
    },
    "#19": {
      title: "#19 Missed Opportunity",
      desc: "Staged off the Data tab. Estimated potential revenue not earned from unanswered Search calls. Shows estimated money lost for the tile month, the calendar quarter, and YTD, then the missed-call rate split weekday vs weekend against the ≤10% target. June locked from Call details.csv Jul 11. July from Call details (1)/(4). August* from Call details (4) through Aug 14. September* from Call details (7) Sep 1–18. Weekday/weekend splits come from Start time day-of-week in those same pulls and each pair sums to the month total. Snapshot and restore notes: DASHBOARD-STAGING.md · Missed Opportunity.",
      formula: "Missed Search calls × 7.3% lead→case × avg case value ($5,661). Month / quarter / year sum missed calls in that window from phoneByMonth. Uncharged LSA calls are not in this number: filter the LSA inbox to not charged, check each against the phone log for a callback within 48 hours, and count only never-reached calls as lost."
    },
    "#21": {
      title: "Answer Rate",
      desc: "Data chart shows one bar per month: mean of available Search weekday answer, LSA % charged, and Yelp call answer. Search uses weekday Call details only. Weekend Search calls are excluded. Target 90%. Monthly KPI tile is Search weekday-only.",
      formula: "Avg % = mean of channel rates on file that month. Search: weekday answered ÷ weekday calls. LSA: Charged ÷ Leads. Yelp: answeredCalls ÷ calls."
    },
    "answer-rate": {
      title: "Answer Rate",
      desc: "One column per month = average of Search weekday, LSA, and Yelp rates when each is available. Search excludes weekends from Call details day-of-week. LSA and Yelp stay full-week until day splits exist. KPI tile is Search weekday Received ÷ weekday Calls.",
      formula: "Search weekday answered ÷ weekday calls. Avg % = mean of available channel percentages. Target ≥ 90%."
    },
    "#03": {
      title: "#03 Auto Cases",
      desc: "YTD auto signed matters stacked by type from Contact_09-28-2026. DUI 20 · Jun 5 · Jul 2 · Aug 0 · Sep* 1. Traffic tag no DUI = 22. Auto total 42 / annual goal 50 · pace 84%. Est. revenue $150,300 / $170,200 from case-number fee cross-ref on 19 of 42 plus median fill DUI $5,500 · Traffic $1,500. Last updated 09/28/2026.",
      formula:
        "Stack = DUI practice-area rule + Traffic tag without DUI. Total = sum of stack. Est. revenue = matched Case_balance/list/revenue fees + kind median for unmatched. Schedule = total − (50 × days elapsed ÷ days in year)."
    },
    "#04": {
      title: "#04 Cases MoM",
      desc: "New Client creates by month from Contact_10-02-2026. Apr 15 · May 22 · Jun 36 · Jul 35 · Aug 20 · Sep 16 · Oct* 0. Sep vs Aug new cases −20%. Closed cases and red accounts not on this export. Last updated 10/02/2026.",
      formula: "New cases = Contact group Client · Created date in month. MoM % = current ÷ prior − 1."
    },
    "#08": {
      title: "#08 Leads by campaign",
      desc: "MoM chart still uses prior Campaign day-range pulls. Sep 8 Campaign report (32) is All time only: live HS Lifetime Military $3,412 / 35 calls · DV $1,303 / 7 · NTGUILT $196 / 0 · shared $350 Maximize Conversions portfolio. Not a Sep calendar fill. Guide projects: Retainer, NtguiltAd, AdEnhance, SocialAds.",
      formula: "Campaign report phone calls by campaign. Prefer calendar-month Campaign + Call details for tile month."
    },
    "#10": {
      title: "#10 Source mix",
      desc: "Share of leads by channel from the same stack as #01: Paid Search, LSA, HubSpot, Yelp, and Justia. Est. potential client revenue = leads × lead→case rate × avg case (#28).",
      formula: "Channel count ÷ #01 lead total. Justia contacts = calls + emails. Yelp contacts = Messages + round(Calls × 40%). Partial months are labeled in the source export."
    },
    "#16": {
      title: "#16 Reviews by channel",
      desc: "Public review ratings and counts by directory. Yelp listing live 2026-09-18: 4.5 · 8 reviews. Ads/lead funnel baseline lives on the Yelp card (Data tab) and Project Guide DigProf.",
      formula: null
    },
    "#17": {
      title: "#17 Referral Network",
      desc: "Referral channel counts. Yelp last-30 ads panel 09/18/2026: 15 leads · 12 from ads. Justia Mar–Aug 2026: 27 contacts = 19 calls + 8 emails. Calendar-month contacts stay on the Yelp and Justia stacks. Past-client, friend, attorney, and Nextdoor still wait on Referral Client Referral Program tracking.",
      formula: "Yelp last-30 = 15 leads · Messages 5 · Website 5 · Calls 5. Justia last-6 = 27 contacts · $333 per contact at $1,500/mo Referral Sites fee."
    },
    "yelp": {
      title: "Yelp Reviews — listing count",
      desc: "Public Yelp listing review total toward the 20-review goal. Tile month row follows the KPI pill. Listing as of 09/18/2026: 4.5 · 8 reviews.",
      formula: "Total 8 / 20 · Sep* new ≥ 2 · rating 4.5."
    },
    "#28": {
      title: "#28 Avg case fee",
      desc: "Mean contracted / quoted Client fee from Contact_09-28-2026 aggregates · last updated 2026-10-02. $5,661 · n=139. Not cash collected.",
      formula: "First nonzero among Pre-Trial Flat Fee → pre-File flat → trial → retainer → payment_amount. Contact group = Client."
    },
    "#30": {
      title: "#30 Cost per Case",
      desc: "Staged off the Data tab. Firm-wide marketing cost to sign one new case. Not split by channel. Only complete months with a full lead stack — Sep* excluded. Cases = MyCase Created. Known stack = Search + LSA media + $3,000/mo digital management + $1,000/mo HubSpot forms fee from Jun onward + $1,500/mo Referral Sites. Total cost is higher: prior payments and subscriptions still in monthly installments are not fully visible. At least $20k this year is not paid off. Final amount unknown. Snapshot and restore notes: DASHBOARD-STAGING.md · Cost per Case.",
      formula: "Cost per case = media + management + HubSpot + Referral Sites ÷ new cases. Known stack only. Does not include prior installment subscriptions."
    },
    "#33": {
      title: "#33 Lead → case %",
      desc: "Staging. Share of leads that become signed cases. Live tile is archived until the measured formula is locked. Current 7.3% is the historical estimate used by #19 Missed Opportunity from PAV_HISTORICAL 9÷124 — not a verified monthly join. Do not treat as channel ROI; that is #32.",
      formula: "Target method: new cases in window ÷ #01 leads in the same defined window. Placeholder until then: 9 ÷ 124 ≈ 7.3%."
    },
    "avg-case-value": {
      title: "Avg case value — cash per new case",
      desc: "Method not verified — carries a red X. Collections are probably the wrong denominator for case value: cash in a month mixes payments on older cases with deposits on cases signed inside the window, so this divides one cohort of money by a different cohort of cases. Open question is whether the tile should move to contracted fee at signing, or to cash traced back to the case it belongs to. Contracted mean fee is the separate #28 figure. Until that is settled, read the number as directional only.",
      formula: "Ledger credits ÷ new cases for the same months as #30. Aug* excluded because the month is partial."
    },
    "#29": {
      title: "#29 Practice Area Average Fee",
      desc: "Mean contracted / quoted fee by practice area (Client + fee · n ≥ 5) from Contact_09-01-2026 aggregates. LOE 1–5 from Kate rough LOE chart 09/23/2026. Biggest opportunity = highest mean fee ÷ LOE. Not cash collected.",
      formula: "Mean fee from contracted / quoted fees. Biggest opportunity = mean fee ÷ LOE. LOE blank = no opportunity mark."
    },
    "cases-leads-spend": {
      title: "#05 Key Channel Activity",
      desc: "Last 4 months: new cases and direct contacts on the left axis, Search + LSA media spend on the right. Jun/Jul full · Aug* cases through 2026-09-01 · LSA through 2026-08-24 · Search Call details through Aug 14 · cash ledger through 2026-08-24. Cost per response uses LSA inbox leads + Search media, plus Yelp and Justia when on file. Review and credited leads are not in that count. HubSpot forms fee is not a channel cost.",
      formula: "Bars = new cases + leads. Line = Search + LSA media spend. LSA $/call = LSA media ÷ inbox leads. Table under each chart lists the plotted values."
    },
    "ad-spend-by-channel": {
      title: "Ad spend",
      desc: "Tile-month paid media only: Search Campaign / account activities, LSA Home Services, Yelp Ads, and Justia Referral Sites fee when on file. HubSpot forms fee and digital management retainer are not included. Hero total is Search + LSA + Yelp + Justia; table breaks out each channel.",
      formula: "Total = Search + LSA + Yelp + Justia. September* Search $11,471.51 + LSA $4,371.54 + Yelp $219.57 + Justia not on file."
    },
    "cash-pace": {
      title: "Revenue",
      desc: "Follows the KPI tile month. Monthly client revenue from MyCase Trust account activity. Sum Credit column by calendar month. Client Owner’s ~$104k August figure is this report, not operating cash flow or P and L. June and July are full months vs the $100k revenue goal. August is full month $104,545 from ledger (5)/(7). September is $113,985 through 09/30/2026 from ledger (10). W1–W4 under the dial are a running Trust Credit total by calendar week. Completed weeks are gray and show the cumulative collected through that week from the ledger. The live week shows only the end-of-week projected running total if the current daily Credit pace continues through that week’s last day. Later weeks project the running total if pace continues through the end of that week. W1 days 1–7 · W2 days 8–14 · W3 days 15–21 · W4 days 22–end. $85k is the operating-expense assumption on Predictions. June sample baseline, not this revenue goal.",
      formula: "Running total = sum of Trust Credits from day 1 through that week. Completed = ledger actuals. Live/future week proj = MTD daily Credit pace × last day of that week. Current MTD stays on the dial."
    },
    "sales-cost-funnel": {
      title: "Sales Funnel",
      desc: "Follows the KPI tile month. Impressions → clicks → direct contacts → signed cases. Direct contacts add every lead channel on file: Search + LSA + HubSpot forms + Yelp + Justia. Breakdown table shows contacts and cost per conversion by channel. Cost per conversion = channel spend ÷ contacts. Not channel ROI.",
      formula: "May 125 = 39 + 72 + 7 + 0 + 7. Jun 226 = 126 + 83 + 8 + 3 + 6. Jul 281 = 131 + 132 + 6 + 6 + 6. Aug 101 = 30 + 61 + 0 + 10 + 0. Sep* 100 = 41 + 44 + 4 + 11 + 0. Oct* 2 = 1 + 1 + 0 + 0 + 0. Spend from Billing activity (1) for Aug–Oct. Cost per conversion = spend ÷ contacts per leg."
    },
    "dg-ctr": {
      title: "Digital goal · CTR",
      desc: "One of four October digital quality goals. Early creative and query-fit signal from Campaign impressions and clicks. Available mid-month before cases land. Watch ≥ 4%. Sep held at 4.9% while $/phone burned, so CTR alone is not enough.",
      formula: "CTR % = Search clicks ÷ Search impressions × 100. Goal ≥ 4%."
    },
    "dg-click-call": {
      title: "Digital goal · Click → call",
      desc: "One of four October digital quality goals. Share of Search clicks that become tracked phones. Available from Call details + clicks as soon as both land. Watch ≥ 20%. Sep held at 26% while $/phone burned.",
      formula: "Click → call % = Search phones ÷ Search clicks × 100. Goal ≥ 20%."
    },
    "dg-phone-cost": {
      title: "Digital goal · Search $/phone",
      desc: "One of four October digital quality goals. Early kill switch for Search bleed. Proof months ~$55–$66. Kate acceptable band ~$173. Goal ≤ $175. If this breaks while CTR and click→call look fine, cut bleeders and keep Military only. Do not wait for month-end cases.",
      formula: "Search media $ ÷ Search phone calls. Goal ≤ $175."
    },
    "dg-case-cost": {
      title: "Digital goal · Media $/Client",
      desc: "One of four October digital quality goals. Month outcome check. Search + LSA + Yelp media ÷ MyCase Client creates that month. Proof Jun–Aug ~$518–$623. Sep $1,220 was the burn. Goal ≤ $650. Directional until Lead Source join exists.",
      formula: "Media spend ÷ new Client creates. Goal ≤ $650."
    },
    "financial": {
      title: "#09 Financials",
      desc: "Monthly client revenue from MyCase Trust account activity export. Credit column. Jan–Jul from ledger_account_activity_report (5). Aug $104,545 from ledger (5)/(7). Sep $113,985 through 09/30/2026 from ledger (10). Not operating cash flow. Not accrual billed revenue. 2026 chart goal line = $150k.",
      formula: "Revenue = Credit sum by calendar month. Monthly goal = $100,000."
    },
    "cases-created": {
      title: "Cases Created",
      desc: "MyCase Client contacts by Created month — 2026 from Contact_10-02-2026 · Jun 36 · Jul 35 · Aug 20 full · Sep 16 through 09/30 · Oct* 0 through 10/02. Chart shows monthly bars plus a trend line per year. Table is year totals, average MoM change, and trend slope — not the same monthly counts.",
      formula: "Count of Client contacts with Created date in month. Trend = OLS on complete months. Avg MoM = mean of month-to-month percent change. Aug* MTD is not in trend or avg MoM."
    },
    "cases-yoy": {
      title: "YOY Cases",
      desc: "Same calendar month 2025 vs 2026 new cases on the Data tab under Cases created. Jun–Jul YoY % spikes from soft 2025 bases — read the count columns beside %. Chart scale ends at −100% on the downside. Do not average YoY % into one Key metrics tile without base-month labels.",
      formula: "YoY % = (2026 cases − 2025 cases) ÷ 2025 cases × 100. Jan–Aug complete months only. Sep* held out until the month is complete. Negative axis floor = −100%."
    },
    "roas-monthly": {
      title: "Return on Marketing Spend",
      desc: "Trust Credits from the MyCase ledger ÷ Search + LSA media for the same calendar month. Credits are cashCollected2026Ytd, not cases × fee. Industry criminal-defense mature ROAS often ~3.5×–7×. Guide target 10× when both Search and LSA run. Watch below 4×. Months with $0 Search spend are omitted from the chart. LSA-only media inflates ROAS.",
      formula: "ROAS = Trust Credits ÷ (Search media + LSA media). Target line = 10×. Null when Search ads spend is $0."
    },
    "cash-collected": {
      title: "Monthly Revenue",
      desc: "MyCase Trust account activity. Client revenue collected by month. Default chart is 2026 YTD. Aug $104,545 full month. Jan–Jul from ledger (5). Sep $113,985 through 09/30/2026 from ledger (10). 2026 royal dashed line = $150k monthly revenue goal.",
      formula: "Sum Credit column by month from Trust account activity CSV."
    }
  };

  function kpiHelpBtn(kpiId) {
    const id = String(kpiId || "");
    if (!KPI_HELP[id] && !KPI_SOURCES[id]) return "";
    return `<span class="kpi-help" role="button" tabindex="0" data-kpi-help="${escapeHtml(id)}" aria-label="About ${escapeHtml(id)}">?</span>`;
  }

  /** Card header label only — green check lives in statusCorner upper-right. */
  function kpiCardTitle(label) {
    return `<span class="kpi-stat-id">${escapeHtml(String(label || "").replace(/^#\S+\s+/, ""))}</span>`;
  }

  /** Value-icon marks for Key Metrics row — same badge system as Project Guide. */
  const KPI_TILE_ICONS = {
    financial: { id: "finance", label: "Finance" },
    "#12": { id: "intake", label: "Direct contact" }
  };

  const KPI_TILE_ICON_SVGS = {
    foundation: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="17" width="7" height="4.5" rx="0.5"/><rect x="9.5" y="17" width="7" height="4.5" rx="0.5"/><rect x="17" y="17" width="6" height="4.5" rx="0.5"/><rect x="5" y="11.5" width="7" height="4.5" rx="0.5"/><rect x="13.5" y="11.5" width="7" height="4.5" rx="0.5"/><rect x="1" y="6" width="7" height="4.5" rx="0.5"/><rect x="9.5" y="6" width="7" height="4.5" rx="0.5"/></svg>`,
    leads: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="7" r="3.5"/><path d="M2 20v-1.5a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5V20"/><circle cx="17.5" cy="8.5" r="2.5"/><path d="M21 20v-1a3.5 3.5 0 0 0-2.5-3.35"/></svg>`,
    finance: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v10"/><path d="M15 9.5c-.6-.9-1.5-1.4-3-1.4-1.8 0-3 1-3 2.3 0 1.2.9 1.9 2.7 2.3l.8.2c1.8.4 2.7 1.1 2.7 2.4 0 1.4-1.3 2.4-3.2 2.4-1.5 0-2.6-.5-3.2-1.3"/></svg>`,
    intake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.86 19.86 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`
  };

  function kpiMetricIconHtml(kpiId) {
    const meta = KPI_TILE_ICONS[kpiId];
    if (!meta) return "";
    const svg = KPI_TILE_ICON_SVGS[meta.id];
    if (!svg) return "";
    return `<span class="value-icon icon-${escapeHtml(meta.id)} kpi-metric-icon" title="${escapeHtml(meta.label)}" aria-label="${escapeHtml(meta.label)}">${svg}</span>`;
  }

  /** Display numeric KPI ids without # or a leading zero. */
  function kpiDisplayNumber(kpiId) {
    const raw = String(kpiId || "").trim().replace(/^#/, "");
    return /^\d+$/.test(raw) ? String(Number(raw)) : raw;
  }

  /** KPI number eggs removed — ids live in the ? help title. */
  function kpiRefMark() {
    return "";
  }

  /** Guide deep-links stay on the Guide tab only. */
  function projectEggLink() {
    return "";
  }

  /** Current month first, then count down. Math and lookups only — not for display order. */
  function newestFirst(rows) {
    return [...(rows || [])].reverse();
  }

  /** Display order for every time axis and period table: oldest → newest, left to right. */
  function chronological(rows) {
    return [...(rows || [])];
  }

  /** Trailing n periods, still oldest → newest. */
  function lastPeriods(rows, n) {
    return chronological(rows).slice(-Math.max(1, n || 3));
  }

  const KPI_RELATED_PROJECTS = {
    "#19": ["HsVoip", "LsaCall"],
    "#07": ["REC:savings", "RETAINER"],
    "#03": ["NtguiltAd", "InsMailer"], // Add HolidayAds back in August; add SummerAds back next summer.
    "#01": ["HsVoip", "DigProf", "InsMailer"],
    "#12": ["HsVoip", "RETAINER"],
    yelp: ["DigProf", "HsSetup"],
    "cash-pace": ["REC:savings", "RETAINER"],
    financial: ["REC:savings", "RETAINER"]
  };

  const KPI_RELATED_LINKS = {
    "REC:budget": {
      title: "Shift LSA budget → digital",
      href: "#recommendation-primary",
      view: "recommendations",
      scrollTo: "recommendation-primary"
    },
    "REC:savings": {
      title: "Use known savings now",
      href: "#recommendation-financial-audit",
      view: "recommendations",
      scrollTo: "recommendation-financial-audit"
    }
  };

  function relatedProjectById(id) {
    const data = window.PROJECT_DATA || {};
    if (id === "RETAINER" && data.retainer) return { ...data.retainer, id };
    return (data.projects || []).find(project => project.id === id) || null;
  }

  /** Related project bands stay off report tabs. Guide owns project cards. */
  function relatedProjectsHtml() {
    return "";
  }

  /** One shared Related Projects header per row — never one per tile. */
  function relatedProjectsBandHtml(kpiIds, gridClass) {
    const ids = kpiIds || [];
    let any = false;
    const cells = ids.map(id => {
      const html = relatedProjectsHtml(id);
      if (!html) return `<div class="kpi-tile-with-projects kpi-related-projects-spacer" aria-hidden="true"></div>`;
      any = true;
      return `<div class="kpi-tile-with-projects">${html}</div>`;
    }).join("");
    if (!any) return "";
    return `<div class="kpi-goals-related-band">
      <strong class="kpi-related-projects-title kpi-goals-related-head">Related Projects</strong>
      <div class="${gridClass} kpi-goals-related-grid">${cells}</div>
    </div>`;
  }

  function getKpiHelp(kpiId) {
    const id = String(kpiId || "");
    const h = KPI_HELP[id];
    const src = KPI_SOURCES[id];
    let source = "";
    if (src) {
      source = `${src.file} · Fields: ${src.fields}`;
    } else if (id === "#03") {
      const d = window.DUI_GOAL_DATA || {};
      if (d.sourceFile) {
        source = `${d.sourceFile}${d.definition ? ` · ${d.definition}` : ""}`;
      }
    }
    if (!h) {
      return { title: id || "Help", desc: "No description yet.", formula: "", source };
    }
    let formula = h.formula || "";
    if (id === "#02" && DATA.newCasesCashGoal) {
      const g = DATA.newCasesCashGoal;
      formula = `${formula} Observed cash/case $${g.cashPerCase.toLocaleString("en-US")} (${g.basis} · $${g.sampleCash.toLocaleString("en-US")} ÷ ${g.sampleCases}). Need ≥ ${g.needed} creates/mo for >$${Math.round(g.goalCash / 1000)}k cash.`;
    }
    if (id === "#01" && DATA.leadsCashGoal) {
      const g = DATA.leadsCashGoal;
      const months = (g.sampleMonths || []).map(m => `${m.month} ${m.leads}`).join(" · ") || "—";
      formula = `${formula} Last 3 complete months: ${months}. Average ≥ ${g.needed}. ${g.note || ""}`;
    }
    if (id === "#12" && DATA.directContactCost) {
      const d = DATA.directContactCost;
      const yelpSpendLine = d.yelpSpend ? ` + $${d.yelpSpend.toLocaleString("en-US")} Yelp` : "";
      const justiaSpendLine = d.justiaSpend ? ` + $${d.justiaSpend.toLocaleString("en-US")} Justia` : "";
      const yelpPart = d.yelp ? ` + ${d.yelp} Yelp` : "";
      const justiaPart = d.justia ? ` + ${d.justia} Justia` : "";
      formula = `${formula} ${d.month} tile: $${d.digitalSpend.toLocaleString("en-US")} Search + $${d.formFee.toLocaleString("en-US")} forms${yelpSpendLine}${justiaSpendLine} ÷ ${d.digitalCalls} calls + ${d.forms} forms${yelpPart}${justiaPart} = $${d.cost.toLocaleString("en-US")}.`;
    }
    if (id === "#12" && DATA.lsaAvgCallCost) {
      const g = DATA.lsaAvgCallCost;
      formula = `${formula} LSA avg ceiling = $${g.avg.toLocaleString("en-US")} ($${g.spend.toLocaleString("en-US")} ÷ ${g.calls} leads · ${g.basis}). Stay under that.`;
    }
    if (id === "#30") {
      const m = DATA.marketingCostPerCase || marketingCostPerClosedCaseModel();
      const monthBreak = (m.monthLines || []).join(" · ");
      formula = `${m.formulaAllIn}. Inputs by month: ${monthBreak || "—"}. Known stack only. Prior payments and subscriptions still in monthly installments are not fully visible. At least $20k this year is not paid off. Final amount unknown.`;
    }
    return {
      title: h.title,
      desc: h.desc,
      formula,
      source
    };
  }

  const DATA = {
    period: "October 2026",
    asOf: "2026-10-02",
    lastUpdated: "2026-10-02",
    updateLabel: "October 2026",
    updateScope: "Oct* MTD · Billing activity (1) Aug 1–Oct 2 · Call details (15) Search 1 · LSA billed 1 / $531.09 · Search billed $1,382.94 · Contact_10-02 Oct cases 0 · Sep cases 16 · ledger (10) · last updated 10/02/2026",
    source: "Billing activity report (1) · Call details (15)/(13) · Campaign report (41) · leads-inbox (22) · Contact_10-02 · HubSpot forms 10/02 · Yelp 10/02 · ledger (10) · last updated 10/02/2026",
    /* Per Monthly KPI tile · source export date · shown next to the corner checkbox */
    tileAsOf: {
      "#01": "2026-10-02",
      "#02": "2026-10-02",
      "#03": "2026-09-28",
      "#04": "2026-09-28",
      "cash-pace": "2026-10-02",
      "yelp": "2026-10-02",
      "justia": "2026-09-18",
      "answer-rate": "2026-10-02",
      "ad-spend-by-channel": "2026-10-02",
      "dg-ctr": "2026-10-02",
      "dg-click-call": "2026-10-02",
      "dg-phone-cost": "2026-10-02",
      "dg-case-cost": "2026-10-02",
      "#19": "2026-10-02",
      "#21": "2026-10-02",
      "#28": "2026-10-02"
    },
    /**
     * Four digital quality goals for the tile month.
     * Early: CTR · click→call · Search $/phone. Late: media $/new Client.
     */
    digitalGoals: {
      ctr: 4,
      clickToCall: 20,
      costPerPhone: 175,
      costPerClient: 650
    },
    kpis: [
      /* #01/#02 hydrated by applyTileMonth from channelMonths + casesLeadsSpend */
      { id: "#01", label: "Lead Calls", value: "—", target: "≥ 203", mom: null, count: null, verified: false, hit: false, alert: true, gauge: true, augUpdated: false, updatedAsOf: "2026-10-02" },
      { id: "#02", label: "New Cases", value: "0", target: "≥ 24", mom: null, count: 0, verified: true, hit: false, alert: true, gauge: true, augUpdated: true, updatedAsOf: "2026-10-02" },
      /* staging — restore by removing archived: true · work doc DASHBOARD-STAGING.md · Missed Opportunity */
      { id: "#19", label: "Missed Opportunity", value: "—", target: "$0", mom: null, verified: false, alert: false, lostTracker: true, augUpdated: false, archived: true },
      { id: "#21", label: "Answered Calls", value: "—", target: "≥ 90%", mom: null, verified: false, alert: false, gauge: true, goal: true, archived: true },
      /* archived for future iteration — restore by removing archived: true */
      { id: "#22", label: "Speed to lead", value: "8 min", target: "< 5 min", mom: null, verified: false, archived: true },
      { id: "#28", label: "Avg case fee", value: "$5,661", target: "MyCase mean", mom: null, verified: true },
      /* staging — restore by removing archived: true · work doc DASHBOARD-STAGING.md · Cost per Case */
      { id: "#30", label: "Cost per Case", value: "—", target: "", mom: null, verified: true, archived: true },
      /* staging — restore by removing archived: true · work doc parked/KPI-33-LEAD-TO-CASE.md */
      { id: "#33", label: "Lead → case %", value: "7.3%", target: "Measure signed ÷ leads", mom: null, verified: false, archived: true },
      { id: "#BHI", label: "Business health index", value: "71", target: "100", mom: "−3%", verified: false, alert: true, letterGrade: true, archived: true }
    ],
    channels: [
      { name: "Search calls", count: null, prior: 41, mom: "—", spend: "—", color: "#3a1a6e", verified: false },
      { name: "LSA calls", count: null, prior: 44, mom: "—", spend: "—", color: "#1e3a8a", verified: false },
      { name: "HubSpot forms", count: null, prior: 4, mom: "—", spend: "—", color: "#b23a78", verified: false },
      { name: "Yelp", count: null, prior: 11, mom: "—", spend: "—", color: "#64748b", verified: false },
      { name: "Justia", count: null, prior: 0, mom: "—", spend: "—", color: "#6a5acd", verified: false }
    ],
    /* Lead Channel Stack — Jun Search locked from Call details.csv Jul 11; Jul/Aug* from Call details (1) */
    channelMonths: [
      {
        month: "May",
        search: 39,
        lsa: 72,
        hubspot: 7,
        hubspotForms: 7,
        justia: 7,
        justiaSpend: 1500,
        searchSpend: 6005,
        lsaSpend: 11006,
        note: "HubSpot form submits report 10/02/2026 · 7. Justia 09/18/2026 · 5 calls + 2 emails = 7 contacts · 2 website clicks"
      },
      {
        month: "Jun",
        search: 126,
        lsa: 83,
        hubspot: 8,
        hubspotForms: 8,
        yelp: 3,
        yelpSpend: 0,
        justia: 6,
        justiaSpend: 1500,
        searchSpend: 8296,
        lsaSpend: 13206,
        note: "Search Call details (13) All-time · 126 calls · 90 received / 36 missed · ≥60s 27. HubSpot form submits report 10/02/2026 · 8. Yelp · 2 Messages · 2 Calls · 3 contacts. Justia 09/18/2026 · 4 calls + 2 emails = 6 contacts"
      },
      {
        month: "Jul",
        search: 131,
        lsa: 132,
        hubspot: 6,
        hubspotForms: 6,
        yelp: 6,
        yelpSpend: 0,
        justia: 6,
        justiaSpend: 1500,
        searchSpend: 7262,
        lsaSpend: 14556,
        note: "Search Call details (1) Jul 1–31 · LSA inbox(3) Jul full · HubSpot form submits report 10/02/2026 · 6. Yelp · 5 Messages · 2 Calls · 6 contacts · Carlos lead dated ~3 mo on 10/02 inbox. Justia 09/18/2026 · 4 calls + 2 emails = 6 contacts · 4 website clicks"
      },
      {
        month: "Aug",
        search: 30,
        lsa: 61,
        hubspot: 0,
        hubspotForms: 0,
        yelp: 10,
        yelpSpend: 72.58,
        justia: 0,
        justiaSpend: 1500,
        searchSpend: 1775.40,
        lsaSpend: 8516.70,
        note: "Search Call details (13) · 30 calls. LSA inbox(3) 61 leads. Billing activity (1) Aug · Search $1,775.40 · LSA Home Services $8,516.70 / 27 billed leads. HubSpot forms 10/02 · 0. Yelp contacts 10."
      },
      {
        month: "Sep*",
        search: 41,
        lsa: 44,
        hubspot: 4,
        hubspotForms: 4,
        yelp: 11,
        yelpSpend: 432.67,
        justia: 0,
        justiaSpend: null,
        searchSpend: 13651.22,
        lsaSpend: 5432.71,
        note: "Search Call details (13) · Sep 41 calls. LSA inbox (22) 44 leads. Billing activity (1) Sep · Search $13,651.22 · LSA Home Services $5,432.71 / 20 billed leads. Campaign (41) Sep 1–28 Impr 3,224. Yelp 11 · HubSpot forms 4. Cases Contact_10-02 · Sep 16 through 09/30. Cash ledger (10) Sep $113,985."
      },
      {
        month: "Oct*",
        search: 1,
        lsa: 1,
        hubspot: 0,
        hubspotForms: 0,
        yelp: 0,
        yelpSpend: 0,
        justia: 0,
        justiaSpend: null,
        searchSpend: 1382.94,
        lsaSpend: 531.09,
        note: "Oct* MTD through 10/02/2026. Search Call details (15) · 1 call. Billing (1) · Search $1,382.94 · LSA $531.09 / 1 billed lead. Cases Contact_10-02 · 0. Cap ≤ $20k Search+LSA+Yelp for October · W3 Oct 15–21 OOO off/min · fund HS: Military · Yelp ≤ $500 · projected month-end ≤ $20k."
      }
    ],
    /** Search Campaign Impr/Clicks/Phone calls by tile month. */
    funnelAds: {
      May: {
        impressions: null,
        clicks: null,
        phoneCalls: null,
        searchSpendLock: null,
        windowNote: "May Search calls from channelMonths · Impr/clicks not on file"
      },
      Jun: {
        impressions: null,
        clicks: null,
        phoneCalls: null,
        searchSpendLock: null,
        windowNote: "No June 1–30 Campaign with Impr. + Clicks on file"
      },
      Jul: {
        impressions: 15871,
        clicks: 640,
        phoneCalls: null,
        searchSpendLock: 6277.36,
        windowNote: "Campaign Jun 11–Jul 10 · not July calendar · Search calls from Call details"
      },
      Aug: {
        impressions: null,
        clicks: null,
        phoneCalls: 30,
        searchSpendLock: 1775.40,
        windowNote: "Billing activity (1) Aug Search $1,775.40 · Call details (13) 30 phones"
      },
      Sep: {
        impressions: 3224,
        clicks: 157,
        phoneCalls: 41,
        searchSpendLock: 13651.22,
        windowNote: "Billing activity (1) Sep Search $13,651.22 · Campaign (41) Impr 3,224 · Call details (13) 41 phones · answer 19/41"
      },
      Oct: {
        impressions: null,
        clicks: 18,
        phoneCalls: 1,
        searchSpendLock: 1382.94,
        windowNote: "Billing activity (1) Oct 1–2 Search $1,382.94 / 18 clicks · Call details (15) 1 phone"
      }
    },
    sourceMix: [
      { name: "Paid Search", pct: 50, color: "#3a1a6e", count: 1, prior: 41, mom: "−98%" },
      { name: "LSA", pct: 50, color: "#1e3a8a", count: 1, prior: 44, mom: "−98%" },
      { name: "HubSpot", pct: 0, color: "#b23a78", count: 0, prior: 4, mom: "—" },
      { name: "Yelp", pct: 0, color: "#64748b", count: 0, prior: 11, mom: "—" },
      { name: "Justia", pct: 0, color: "#6a5acd", count: 0, prior: 0, mom: "—" }
    ],
    /* Campaign brand: Military royal · Core DV burnt orange · NTGUILT rose (GGL — no teal/gold categories) */
    searchCallsByCampaign: [
      { name: "Military", count: 103, color: "#3a1a6e" },
      { name: "Core DV", count: 12, color: "#c45c26" },
      { name: "NTGUILT", count: 11, color: "#b23a78" }
    ],
    leadsByCampaign: [
      { name: "Military", count: 99, prior: 36, mom: "+175%", spend: "$3,983", color: "#3a1a6e" },
      { name: "Core DV", count: 3, prior: 3, mom: "0%", spend: "$179", color: "#c45c26" },
      { name: "NTGUILT", count: 15, prior: 0, mom: "—", spend: "$1,924", color: "#b23a78" }
    ],
    /** Search phone by calendar month — Jun from Call details.csv Jul 11; Jul/Aug* from Call details (1). */
    /* Weekday/weekend splits from the same Call details pulls — each pair sums to the month total. */
    phoneByMonth: {
      May: {
        calls: 39, received: 26, missed: 13, answeredPct: 67,
        weekdayCalls: 39, weekdayMissed: 13, weekendCalls: 0, weekendMissed: 0
      },
      Jun: {
        calls: 126, received: 90, missed: 36, answeredPct: 71,
        weekdayCalls: 118, weekdayMissed: 32, weekendCalls: 8, weekendMissed: 4
      },
      Jul: {
        calls: 131, received: 73, missed: 58, answeredPct: 56,
        weekdayCalls: 125, weekdayMissed: 56, weekendCalls: 6, weekendMissed: 2
      },
      Aug: {
        calls: 30, received: 16, missed: 14, answeredPct: 53,
        weekdayCalls: 22, weekdayMissed: 9, weekendCalls: 8, weekendMissed: 5
      },
      Sep: {
        calls: 41, received: 19, missed: 22, answeredPct: 46,
        weekdayCalls: 41, weekdayMissed: 22, weekendCalls: 0, weekendMissed: 0
      },
      Oct: {
        calls: 1, received: 1, missed: 0, answeredPct: 100,
        weekdayCalls: 1, weekdayMissed: 0, weekendCalls: 0, weekendMissed: 0
      }
    },
    phoneIntake: {
      targetPct: 90,
      missedTargetPct: 10,
      answeredPct: 52,
      priorAnsweredPct: 56,
      missedPct: 48,
      priorMissedPct: 44,
      missedMomPp: 4,
      monthlyCalls: 25,
      missedSearchCalls: 12,
      priorMissedSearchCalls: 58,
      missedLsaCalls: 12,
      priorMissedLsaCalls: 58,
      closeRateEst: 0.073,
      avgCaseFee: 5661,
      leadToCaseRate: 0.073,
      cumulativeYtd: 45087 /* 109 missed May–Jul × 7.3% × $5,661 */
    },
    /* #30 fee + collection inputs for the cost-per-case ceiling. Collection rate updates when fees-collected lands. */
    estValuePerLead: {
      collectionRate: 0.8,
      avgCaseFee: 5661
    },
    /* KPI #29 support — Client + fee means · n≥5 · Contact_09-28 · fees as of 2026-10-02
       loe = level of effort 1–5 from Kate rough LOE chart 2026-09-23 · biggest opportunity = mean fee ÷ LOE */
    feeByPractice: [
      { name: "Theft / Property", n: 10, mean: 7750, loe: 4 },
      { name: "Sex Assault / Sex Offense", n: 9, mean: 7778, loe: 5 },
      { name: "Assault / Menacing", n: 17, mean: 7456, loe: 5 },
      { name: "Domestic Violence / DV", n: 37, mean: 5899, loe: 5 },
      { name: "Criminal Defense (other)", n: 20, mean: 4295, loe: 3 },
      { name: "Probation Revocation", n: 7, mean: 4214, loe: 1 },
      { name: "DUI / DWAI / Traffic", n: 25, mean: 3860, loe: 2 }
    ],
    /* Extra LOE weights from same chart · not on n≥5 fee table */
    feeLoeExtra: [
      { name: "SO Dereg", loe: 1 },
      { name: "SA Prefile", loe: 1 },
      { name: "PO Revo", loe: 1, mapsTo: "Probation Revocation" }
    ],
    costPerCall: [
      { channel: "Direct contact (blended)", cost: "$65" },
      { channel: "Military", cost: "$40" },
      { channel: "Core DV", cost: "$60" },
      { channel: "NTGUILT", cost: "$128" }
    ],
    referrals: [
      { platform: "Past-client program", count: null, delta: null, status: "building", verified: false },
      { platform: "Friend / family", count: null, delta: null, status: "not wired", verified: false },
      { platform: "Attorney cross-referral", count: null, delta: null, status: "not wired", verified: false },
      { platform: "Yelp", count: 8, delta: null, status: "active", verified: true },
      { platform: "Justia", count: 27, delta: null, status: "active", verified: true },
      { platform: "Nextdoor", count: null, delta: null, status: "not on", verified: false }
    ],
    reviews: [
      { platform: "Google Business Profile", rating: "4.9", count: 121, status: "active", verified: true },
      {
        platform: "Yelp",
        rating: "4.5",
        count: 8,
        status: "active",
        verified: true
      },
      { platform: "Nextdoor Business", rating: "—", count: null, status: "not on", verified: false },
      {
        platform: "Avvo",
        rating: "—",
        count: null,
        status: "outdated",
        verified: false
      },
      { platform: "Justia", rating: "1838", count: 27, status: "active", verified: true },
      { platform: "FindLaw", rating: "—", count: 0, status: "outdated", verified: true },
      {
        platform: "US Attorneys",
        rating: "—",
        count: null,
        status: "not wired",
        verified: false
      },
      {
        platform: "Martindale",
        rating: "—",
        count: null,
        status: "not on",
        verified: false
      },
      { platform: "Facebook", rating: "—", count: null, status: "outdated", verified: false },
      { platform: "LinkedIn (firm)", rating: "—", count: null, status: "outdated", verified: false },
      { platform: "BBB", rating: "—", count: null, status: "not on", verified: false },
      { platform: "Bing Places / Apple", rating: "—", count: null, status: "not wired", verified: false }
    ],
    verticals: [
      { name: "DUI/DWAI", jun: 5, ytd: 20 },
      { name: "Military", jun: 2, ytd: 8 },
      { name: "Traffic", jun: 2, ytd: 22 },
      { name: "DV", jun: 1, ytd: 3 }
    ],
    /* Client Created practice mix · Jun–Aug locked Contact_09-10 · Sep Contact_10-02 · fuzzy Cases practice area · aggregates only */
    newCasesByPractice: {
      Jun: [
        { name: "DV", n: 2 },
        { name: "Assault", n: 5 },
        { name: "Theft", n: 2 },
        { name: "Traffic / DUI", n: 12 },
        { name: "Other", n: 15 }
      ],
      Jul: [
        { name: "DV", n: 11 },
        { name: "Assault", n: 4 },
        { name: "Sex offense", n: 1 },
        { name: "Traffic / DUI", n: 7 },
        { name: "Other", n: 12 }
      ],
      Aug: [
        { name: "DV", n: 9 },
        { name: "Assault", n: 3 },
        { name: "Sex offense", n: 2 },
        { name: "Theft", n: 3 },
        { name: "Traffic / DUI", n: 2 },
        { name: "Other", n: 1 }
      ],
      Sep: [
        { name: "DV", n: 3 },
        { name: "Traffic / DUI", n: 3 },
        { name: "PPO", n: 3 },
        { name: "Sealing", n: 2 },
        { name: "Weapons", n: 1 },
        { name: "Other", n: 4 }
      ],
      Oct: []
    },
    bhi: { value: 71, target: 100, mom: "−3%" },
    avgDeposit: { current: 400, target: 700 },
    duiGoal: (function () {
      const d = window.DUI_GOAL_DATA || {};
      const autoColumns = Array.isArray(d.autoColumns) && d.autoColumns.length
        ? d.autoColumns.map(col => ({
            label: col.label || "Auto",
            current: col.current != null ? Number(col.current) : 0,
            vsTarget: col.vsTarget === true
          }))
        : null;
      return {
        current: d.current != null ? Number(d.current) : 15,
        jun: d.jun != null ? Number(d.jun) : 3,
        target: d.target != null ? Number(d.target) : 50,
        year: d.year != null ? Number(d.year) : 2026,
        title: d.title || "# Auto Cases",
        label: d.label || "DUI",
        exportNote: d.exportNote || "",
        autoColumns,
        estRevenue: d.estRevenue || null,
        updatedAt: d.updatedAt || null
      };
    })(),
    casesMomSeries: [
      { name: "Closed cases", color: "#64748b", verified: false },
      { name: "New cases", color: "#3a1a6e", verified: true },
      { name: "Red accounts", color: "#b23a78", verified: false }
    ],
    /* #04 Cases MoM · newCases from Contact Client Created · Closed/red not on Contact export · last updated 2026-10-02 */
    casesMom: [
      { month: "Apr", closed: 6, newCases: 15, redAccounts: 3 },
      { month: "May", closed: 8, newCases: 22, redAccounts: 2 },
      { month: "Jun", closed: 11, newCases: 36, redAccounts: 4 },
      { month: "Jul", closed: null, newCases: 35, redAccounts: null },
      { month: "Aug", closed: null, newCases: 20, redAccounts: null },
      { month: "Sep*", closed: null, newCases: 16, redAccounts: null },
      { month: "Oct*", closed: null, newCases: 0, redAccounts: null }
    ],
    pipeline: [
      { month: "Jun", closed: 11, mom: "+38%" },
      { month: "Jun", rate: "51%", retained: 14 }
    ],
    /* Dual-axis: left = cases + incoming · right = $ spend. */
    casesLeadsSpend: [
      { month: "Jan", cases: 12, leads: null, spend: 0, lsaSpend: 0, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "Feb", cases: 14, leads: null, spend: 3197, lsaSpend: 3197, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "Mar", cases: 17, leads: null, spend: 921, lsaSpend: 921, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "Apr", cases: 15, leads: null, spend: 3449, lsaSpend: 3449, adsSpend: 0, adsLeads: null, websiteLeads: null },
      { month: "May", cases: 22, leads: 125, spend: 17011, lsaSpend: 11006, adsSpend: 6005, adsLeads: 39, websiteLeads: 7 },
      { month: "Jun", cases: 36, leads: 226, spend: 21502, lsaSpend: 13206, adsSpend: 8296, adsLeads: 126, websiteLeads: 8 },
      { month: "Jul", cases: 35, leads: 281, spend: 21818, lsaSpend: 14556, adsSpend: 7262, adsLeads: 131, websiteLeads: 6 },
      { month: "Aug", cases: 20, leads: 101, spend: 10292.10, lsaSpend: 8516.70, adsSpend: 1775.40, adsLeads: 30, websiteLeads: 0 },
      { month: "Sep*", cases: 16, leads: 100, spend: 19083.93, lsaSpend: 5432.71, adsSpend: 13651.22, adsLeads: 41, websiteLeads: 4 },
      { month: "Oct*", cases: 0, leads: 2, spend: 1914.03, lsaSpend: 531.09, adsSpend: 1382.94, adsLeads: 1, websiteLeads: 0 }
    ],
    /**
     * Justia Profile Stats · Kate 09/18/2026.
     * Lead-stack contacts = calls + emails. Website clicks are engagement only, not contacts.
     * Eight emails over Mar–Aug are allocated by call share.
     * Spend uses Referral Sites $1,500/mo until a Justia-only invoice splits it.
     */
    justiaBaseline: {
      asOf: "2026-09-18",
      window: "Justia Profile Stats · Mar–Aug 2026 · emails last 6 months · pulled 09/18/2026",
      contactFormula: "calls + emails allocated by call share",
      emailsLast6: 8,
      spendMonthly: 1500,
      spendSource: "referralSitesMonthly · $1,500/mo Referral Sites fee attributed to Justia until invoice split",
      byMonth: {
        Mar: { calls: 5, websiteClicks: 1, emails: 2, contacts: 7 },
        Apr: { calls: 1, websiteClicks: 5, emails: 0, contacts: 1 },
        May: { calls: 5, websiteClicks: 2, emails: 2, contacts: 7 },
        Jun: { calls: 4, websiteClicks: 3, emails: 2, contacts: 6 },
        Jul: { calls: 4, websiteClicks: 4, emails: 2, contacts: 6 },
        Aug: { calls: 0, websiteClicks: 2, emails: 0, contacts: 0 }
      },
      last6: {
        calls: 19,
        websiteClicks: 17,
        emails: 8,
        contacts: 27,
        spend: 9000,
        costPerContact: 333,
        costPerCall: 474,
        costPerWebsiteClick: 529
      }
    },
    /**
     * Yelp Ads Leads · Aug raw mix from 09/18 by-type · Sep Messages/Direct Requests from lead inbox 10/02 · Calls from dated call log 10/02.
     * channelMonths.yelp contacts = Messages + round(Calls × 0.40). Website/Directions stay in raw totals only.
     * Listing 2026-09-18: 4.5 · 8 reviews. Last-30 ads panel is rolling, not the calendar-month stack.
     */
    yelpBaseline: {
      asOf: "2026-10-02",
      reviewsAsOf: "2026-09-18",
      messagesAsOf: "2026-10-02",
      spendAsOf: "2026-09-28",
      window: "Yelp lead inbox 10/02 · dated call log Jun–Sep · Aug by-type 09/18 · billing spend Sep 1–27 $432.67 · Calls to your business answer rate 40%",
      answerRate: 0.4,
      answerRateNote: "Calls to your business · Answered 40%",
      contactFormula: "Messages + round(Calls × answerRate)",
      byMonth: {
        Jun: { messages: 2, calls: 2, website: 0, directions: 0, cta: 0, total: 4, answeredCalls: 1, contacts: 3 },
        Jul: { messages: 5, calls: 2, website: 2, directions: 1, cta: 0, total: 10, answeredCalls: 1, contacts: 6 },
        Aug: { messages: 8, calls: 4, website: 4, directions: 0, cta: 0, total: 16, answeredCalls: 2, contacts: 10 },
        Sep: { messages: 9, calls: 5, website: 4, directions: 0, cta: 0, total: 18, answeredCalls: 2, contacts: 11 }
      },
      impressions: 5400,
      impressionsFromAds: 5000,
      pageVisits: 86,
      pageVisitsFromAds: 61,
      last30: {
        impressions: 5400,
        impressionsFromAds: 5000,
        pageVisits: 86,
        pageVisitsFromAds: 61,
        leads: 15,
        leadsFromAds: 12,
        messages: 5,
        website: 5,
        calls: 5,
        other: 0
      },
      billingSpend: 432.67,
      billingSpendWindow: "2026-09-01 to 2026-09-27",
      avgCpc: 6.98,
      avgCpl: 31.37,
      messages: 9,
      messageCategories: [],
      messageRecencyDays: [],
      visiblyReplied: null,
      responseStatusNotVisible: null,
      calls: 5,
      websiteVisits: 4,
      directions: 0,
      leads: 18,
      juneLeads: 3,
      julyLeads: 6,
      augustLeads: 10,
      septemberLeads: 11,
      todayLeads: null,
      /**
       * Yelp lead → MyCase matches · contracted fee = Case_balance Total · trust in = Trust summary Credit.
       * Aggregates only. 5 Contact matches · 3 signed with fee · 1 Potential Case $0 · billing contact rolls into homicide matter.
       */
      caseValue: {
        asOf: "2026-10-02",
        source: "Case_balance_summary_09-23-2026 · Trust_account_summary_10-02-2026 · Contact_09-28 match",
        matchedContacts: 5,
        signedWithFee: 3,
        potentialNoFee: 1,
        contractedTotal: 23500,
        contractedMean: 7833,
        trustCreditTotal: 9145,
        byMonth: {
          Jul: { signed: 2, contractedTotal: 8500, trustCredits: 3145 },
          Aug: { signed: 1, contractedTotal: 15000, trustCredits: 6000 },
          Sep: { signed: 0, contractedTotal: 0, trustCredits: 0, potential: 1 }
        }
      },
      reviews: 8,
      reviewsTotal: 8,
      reviewsJuly: 0,
      reviewsSeptember: 2,
      reviewsPrior: 6,
      rating: "4.5"
    },
    /** HubSpot forms fee — $1k/mo starting Jun 2026 (not charged Jan–May). */
    websiteHubspotMonthlyFromJun: 1000,
    /** Guide Digital Ads Maintenance Retainer — contractor management for Search/LSA/Microsoft. */
    digitalMgmtMonthly: 3000,
    /** Referral Sites listings — $1,500/mo. */
    referralSitesMonthly: 1500,
    /** Consulting allocation estimates for channel CPL (not full retainer). */
    consultingLsaMonthly: 1000,
    consultingAdsMonthly: 2000,
    /* NEW-A primary chart = full calendar year 2025 (ledger Credits). */
    cashCollected: [
      { month: "Jan", credit: 76030, newCases: 23 },
      { month: "Feb", credit: 56750, newCases: 16 },
      { month: "Mar", credit: 60550, newCases: 12 },
      { month: "Apr", credit: 92200, newCases: 31 },
      { month: "May", credit: 106780, newCases: 24 },
      { month: "Jun", credit: 106900, newCases: 15 },
      { month: "Jul", credit: 108712, newCases: 10 },
      { month: "Aug", credit: 69689, newCases: 11 },
      { month: "Sep", credit: 65315, newCases: 9 },
      { month: "Oct", credit: 95435, newCases: 13 },
      { month: "Nov", credit: 42775, newCases: 5 },
      { month: "Dec", credit: 64300, newCases: 9 }
    ],
    /* 2026 YTD revenue — Jan–Sep locked · Oct* MTD through 10/02/2026 ledger (10). */
    cashCollected2026Ytd: [
      { month: "Jan", credit: 57925, newCases: 12 },
      { month: "Feb", credit: 83950, newCases: 14 },
      { month: "Mar", credit: 80500, newCases: 17 },
      { month: "Apr", credit: 70026, newCases: 15 },
      { month: "May", credit: 92140, newCases: 22 },
      { month: "Jun", credit: 103485, newCases: 36 },
      { month: "Jul", credit: 108350, newCases: 35 },
      { month: "Aug", credit: 104545, newCases: 20 },
      { month: "Sep", credit: 113985, newCases: 16 },
      { month: "Oct*", credit: 6075, newCases: 0 }
    ],
    cashCollectedTotals: {
      total2025: 945436,
      total2026ToDate: 820981,
      allCredits: 1766417,
      contractedMean: 5661,
      yearLabel: "2025",
      asOf: "2026-10-02",
      partialMonthKey: "Oct",
      partialDaysElapsed: 2,
      partialDaysInMonth: 31,
      cashGoalMonthly: 100000,
      rangeNote: "Jan–Sep Trust activity Credits · Oct* $6,075 MTD through 10/02/2026 ledger (10) · cases Contact_10-02 Sep 16 · Oct Created 0"
    },
    /* Trust Credits by calendar week · aggregates only · Jun–Jul ledger (5) · Aug ledger (7) · Sep–Oct ledger (10). */
    cashCreditsByWeek: {
      Jun: { W1: 27400, W2: 19650, W3: 30625, W4: 25810 },
      Jul: { W1: 14850, W2: 21600, W3: 34425, W4: 37475 },
      Aug: { W1: 15070, W2: 31825, W3: 8800, W4: 48850 },
      Sep: { W1: 28565, W2: 30900, W3: 27000, W4: 27520 },
      Oct: { W1: 6075, W2: 0, W3: 0, W4: 0 }
    },
    /* NEW-C / NEW-D — LSA efficiency · inbox lead volume · billed leads + spend from Billing activity (1) Aug–Oct */
    lsaEfficiency: [
      { month: "May", leads: 72, charged: 27, notCharged: 45, lsaSpend: 11006 },
      { month: "Jun", leads: 83, charged: 39, notCharged: 44, lsaSpend: 13206 },
      { month: "Jul", leads: 132, charged: 52, notCharged: 79, lsaSpend: 14556 },
      { month: "Aug", leads: 61, charged: 27, notCharged: 34, lsaSpend: 8516.70 },
      { month: "Sep*", leads: 44, charged: 20, notCharged: 24, lsaSpend: 5432.71 },
      { month: "Oct*", leads: 1, charged: 1, notCharged: 0, lsaSpend: 531.09 }
    ],
    lsaChargeRateOverall: { charged: 166, leads: 393, pct: 42.2 },
    /* NEW-E — Payment Method = Trust applications (ledger) + Client trust balance snapshot */
    trustTransfers: {
      rangeStart: "2025-05-01",
      rangeEnd: "2026-08-24",
      method: "Payment Method = Trust",
      /* Debits = trust applied to invoices. Credits on Trust method are rare refunds (excluded from MoM bars). */
      monthly: [
        { month: "Jan 2025", applications: 0, rows: 0 },
        { month: "Feb 2025", applications: 0, rows: 0 },
        { month: "Mar 2025", applications: 0, rows: 0 },
        { month: "Apr 2025", applications: 0, rows: 0 },
        { month: "May 2025", applications: 0, rows: 0 },
        { month: "Jun 2025", applications: 75833, rows: 24 },
        { month: "Jul 2025", applications: 271427, rows: 65 },
        { month: "Aug 2025", applications: 0, rows: 0 },
        { month: "Sep 2025", applications: 0, rows: 0 },
        { month: "Oct 2025", applications: 0, rows: 0 },
        { month: "Nov 2025", applications: 0, rows: 0 },
        { month: "Dec 2025", applications: 0, rows: 0 },
        { month: "Jan 2026", applications: 0, rows: 0 },
        { month: "Feb 2026", applications: 0, rows: 0 },
        { month: "Mar 2026", applications: 0, rows: 0 },
        { month: "Apr 2026", applications: 0, rows: 0 },
        { month: "May 2026", applications: 1500, rows: 1 },
        { month: "Jun 2026", applications: 0, rows: 0 },
        { month: "Jul 2026", applications: 0, rows: 0 },
        { month: "Aug* 2026", applications: 0, rows: 0 }
      ],
      snapshot: {
        asOf: "2026-09-23",
        sourceFile: "Downloads/Trust_account_summary_09-23-2026.csv",
        clientsWithBalance: 366,
        totalBalance: 1664464,
        meanBalance: 4548
      },
      refundCredits2025Feb: 7000
    }
  };

  function applyLsaAverageCallCostTarget() {
    const rows = (DATA.lsaEfficiency || []).filter(r => r && Number(r.lsaSpend) > 0 && Number(r.leads) > 0);
    const totals = rows.reduce((sum, row) => ({
      calls: sum.calls + (Number(row.leads) || 0),
      spend: sum.spend + (Number(row.lsaSpend) || 0)
    }), { calls: 0, spend: 0 });
    if (!totals.calls || !totals.spend) return;
    const avg = totals.spend / totals.calls;
    const target = Math.round(avg); /* nearest $ — average LSA call cost */
    const basis = rows.map(r => r.month).join(" · ");
    const kpi = (DATA.kpis || []).find(item => item.id === "#12");
    if (kpi) {
      kpi.target = "≤ $•••";
      kpi.cashGoalNote = "LSA avg";
      kpi.lsaAvgCallCost = target;
    }
    DATA.lsaAvgCallCost = {
      avg: target,
      exact: Math.round(avg * 100) / 100,
      spend: Math.round(totals.spend),
      calls: totals.calls,
      basis
    };
  }

  /** Tile month key from DATA.period — e.g. "June 2026" → "Jun". */
  function periodToChannelMonth(period) {
    const name = String(period || "").trim().split(/\s+/)[0];
    const map = {
      January: "Jan", February: "Feb", March: "Mar", April: "Apr", May: "May",
      June: "Jun", July: "Jul", August: "Aug", September: "Sep", October: "Oct",
      November: "Nov", December: "Dec"
    };
    return map[name] || name.slice(0, 3);
  }

  /**
   * #12 = blended direct contact cost for tile month.
   * Spend: Search media + HubSpot forms fee (+ Yelp ad spend when wired).
   * Contacts: Search calls + form submits + Yelp leads.
   */
  function findChannelMonthRow(abbrev) {
    const key = String(abbrev || "").replace(/\*$/, "");
    const rows = DATA.channelMonths || [];
    return rows.find(r => String(r.month) === key)
      || rows.find(r => String(r.month).replace(/\*$/, "") === key)
      || null;
  }

  function findCasesLeadsSpendRow(abbrev) {
    const key = String(abbrev || "").replace(/\*$/, "");
    const rows = DATA.casesLeadsSpend || [];
    return rows.find(r => String(r.month) === key)
      || rows.find(r => String(r.month).replace(/\*$/, "") === key)
      || null;
  }

  function daysInCalendarMonth(key) {
    const map = {
      Jan: 31, Feb: 28, Mar: 31, Apr: 30, May: 31, Jun: 30,
      Jul: 31, Aug: 31, Sep: 30, Oct: 31, Nov: 30, Dec: 31
    };
    return map[String(key || "").replace(/\*$/, "")] || 31;
  }

  function tileMonthMeta() {
    const key = periodToChannelMonth(DATA.period);
    const ch = findChannelMonthRow(key);
    const cls = findCasesLeadsSpendRow(key);
    const partial = !!(ch && /\*/.test(String(ch.month || "")))
      || !!(cls && /\*/.test(String(cls.month || "")));
    const names = { May: "May", Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October" };
    const short = names[key] || key || "";
    const label = `${short}${partial ? "*" : ""}`;
    return { key, ch, cls, partial, short, label, full: `${label} 2026` };
  }

  function channelLeadTotal(ch) {
    if (!ch) return null;
    const core = [ch.search, ch.lsa, ch.hubspot];
    if (core.every(v => v == null || v === "")) return null;
    const yelp = Number(ch.yelp) || 0;
    const justia = Number(ch.justia) || 0;
    const site = Number(ch.pavLawWebsite) || 0;
    return core.reduce((sum, v) => sum + (Number(v) || 0), 0) + yelp + justia + site;
  }

  function priorMonthAbbrev(abbrev) {
    const order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const key = String(abbrev || "").replace(/\*$/, "");
    const i = order.indexOf(key);
    return i > 0 ? order[i - 1] : null;
  }

  function momPct(curr, prior) {
    if (curr == null || prior == null || !Number(prior)) return null;
    const pct = Math.round(((Number(curr) - Number(prior)) / Number(prior)) * 100);
    return `${pct > 0 ? "+" : ""}${pct}%`;
  }

  function applyDirectContactCostKpi() {
    const monthKey = periodToChannelMonth(DATA.period);
    const ch = findChannelMonthRow(monthKey);
    if (!ch) return;

    const digitalCalls = Number(ch.search) || 0;
    const digitalSpend = Number(ch.searchSpend) || 0;
    const yelp = Number(ch.yelp) || 0;
    const justia = Number(ch.justia) || 0;
    const forms = ch.hubspotForms != null
      ? Number(ch.hubspotForms) || 0
      : Math.max(0, (Number(ch.hubspot) || 0) - yelp);
    const hubFee = DATA.websiteHubspotMonthlyFromJun || 0;
    const formFee = forms > 0 ? hubFee : 0;
    const yelpSpend = Number(ch.yelpSpend) || 0;
    const justiaSpend = justia > 0
      ? (ch.justiaSpend != null ? Number(ch.justiaSpend) || 0 : Number(DATA.referralSitesMonthly) || 0)
      : 0;

    const totalSpend = digitalSpend + formFee + yelpSpend + justiaSpend;
    const totalContacts = digitalCalls + forms + yelp + justia;
    if (!totalContacts || !totalSpend) return;

    const exact = totalSpend / totalContacts;
    const cost = Math.round(exact);
    const lsaCeiling = DATA.lsaAvgCallCost && DATA.lsaAvgCallCost.avg;

    const kpi = (DATA.kpis || []).find(item => item.id === "#12");
    if (kpi) {
      kpi.label = "Avg. Cost per Direct Contact";
      kpi.value = "$•••";
      if (Number.isFinite(lsaCeiling)) kpi.hit = cost <= lsaCeiling;
    }

    DATA.directContactCost = {
      cost,
      exact: Math.round(exact * 100) / 100,
      month: monthKey,
      digitalCalls,
      digitalSpend: Math.round(digitalSpend),
      forms,
      formFee,
      yelp,
      yelpSpend: Math.round(yelpSpend),
      justia,
      justiaSpend: Math.round(justiaSpend),
      totalSpend: Math.round(totalSpend),
      totalContacts
    };

    const avgRow = (DATA.costPerCall || []).find(c => /direct contact|all campaigns/i.test(String(c.channel)));
    if (avgRow) avgRow.cost = "$•••";
  }

  /**
   * #02 target = new cases needed so monthly cash clears $100k.
   * cash/case = 2026 full months (ledger credits ÷ newCases); fallback mean fee × 80%.
   */
  function applyNewCasesCashGoalTarget() {
    const GOAL_CASH = 100000;
    const rows = (DATA.cashCollected2026Ytd || []).filter(r => r && !/\*/.test(String(r.month || "")));
    let cash = 0;
    let cases = 0;
    rows.forEach(r => {
      cash += Number(r.credit) || 0;
      cases += Number(r.newCases) || 0;
    });
    const fee = Number(DATA.cashCollectedTotals && DATA.cashCollectedTotals.contractedMean)
      || Number(DATA.phoneIntake && DATA.phoneIntake.avgCaseFee)
      || 5661;
    const feeCollectible = fee * 0.8;
    let cashPerCase = cases > 0 ? cash / cases : 0;
    let basis = cases > 0
      ? `2026 Jan–${rows[rows.length - 1].month} ledger credits ÷ new cases`
      : "mean fee × 80% collectible";
    if (!cashPerCase || cashPerCase < 1000) {
      cashPerCase = feeCollectible;
      basis = "mean fee × 80% collectible";
    }
    const needed = Math.floor(GOAL_CASH / cashPerCase) + 1;
    const kpi = (DATA.kpis || []).find(item => item.id === "#02");
    if (kpi) {
      const current = Number(kpi.count != null ? kpi.count : parseFloat(String(kpi.value).replace(/[^0-9.]/g, ""))) || 0;
      kpi.target = `≥ ${needed}`;
      kpi.hit = current >= needed;
      kpi.cashGoalNote = `>$${Math.round(GOAL_CASH / 1000)}k cash/mo`;
    }
    DATA.newCasesCashGoal = {
      goalCash: GOAL_CASH,
      cashPerCase: Math.round(cashPerCase),
      needed,
      basis,
      sampleCash: Math.round(cash),
      sampleCases: cases
    };
  }

  /**
   * #01 target = average incoming leads over the last 3 complete months.
   * Same stack as the Lead Calls tile · Search + LSA + HubSpot + Yelp + Justia + site.
   * Not reverse-engineered from $100k Trust Credits · cash is not only new leads.
   */
  function applyLeadsCashGoalTarget() {
    const complete = (DATA.channelMonths || [])
      .filter(m => m && !/\*/.test(String(m.month || "")))
      .map(m => {
        const month = String(m.month).replace(/\*$/, "");
        const leads = channelLeadTotal(m);
        return leads == null ? null : { month, leads: Number(leads) };
      })
      .filter(Boolean);
    const last3 = complete.slice(-3);
    const kpi = (DATA.kpis || []).find(item => item.id === "#01");
    if (!last3.length) {
      if (kpi) {
        kpi.target = "—";
        kpi.hit = false;
        kpi.cashGoalNote = "need 3 complete months";
      }
      DATA.leadsCashGoal = {
        goalCash: null,
        cashPerLead: 0,
        needed: null,
        basis: "last 3 complete months · no rows yet",
        sampleCash: 0,
        sampleLeads: 0,
        sampleMonths: [],
        note: ""
      };
      return;
    }
    const sampleLeads = last3.reduce((s, m) => s + m.leads, 0);
    const needed = Math.round(sampleLeads / last3.length);
    const basis = `last ${last3.length} complete months · Lead Calls stack`;
    if (kpi) {
      const current = Number(kpi.count != null ? kpi.count : parseFloat(String(kpi.value).replace(/[^0-9.]/g, ""))) || 0;
      kpi.target = `≥ ${needed}`;
      kpi.hit = current >= needed;
      kpi.cashGoalNote = "3-mo avg leads";
    }
    DATA.leadsCashGoal = {
      goalCash: null,
      cashPerLead: 0,
      needed,
      basis,
      sampleCash: 0,
      sampleLeads,
      sampleMonths: last3.map(m => ({ month: m.month, leads: m.leads, cash: 0 })),
      note: ""
    };
  }

  /**
   * #30 firm-wide marketing cost per closed case — not by channel.
   * Media spend ÷ new cases for complete months with a full lead stack.
   * All-in adds digital management + HubSpot from Jun onward + Referral Sites.
   */
  function marketingCostPerClosedCaseModel() {
    const cfg = DATA.estValuePerLead || {};
    const fee = Number(cfg.avgCaseFee) || Number(DATA.phoneIntake && DATA.phoneIntake.avgCaseFee) || 5661;
    const collectionRate = Number(cfg.collectionRate);
    const coll = Number.isFinite(collectionRate) && collectionRate > 0 ? collectionRate : 0.8;
    const mgmt = Number(DATA.digitalMgmtMonthly) || 0;
    const hubFee = Number(DATA.websiteHubspotMonthlyFromJun) || 0;
    const referralFee = Number(DATA.referralSitesMonthly) || 0;
    const months = (DATA.channelMonths || []).filter(m => m && !/\*/.test(String(m.month || "")));
    let media = 0;
    let mgmtTotal = 0;
    let hubTotal = 0;
    let referralTotal = 0;
    let cases = 0;
    const basisMonths = [];
    const monthLines = [];
    months.forEach(m => {
      const row = (DATA.casesLeadsSpend || []).find(r => r.month === m.month);
      const monthCases = row ? Number(row.cases) || 0 : 0;
      const monthSpend = row ? Number(row.spend) || 0 : 0;
      if (monthCases > 0 && monthSpend > 0) {
        const monthHub = /^(Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/.test(String(m.month)) ? hubFee : 0;
        media += monthSpend;
        mgmtTotal += mgmt;
        hubTotal += monthHub;
        referralTotal += referralFee;
        cases += monthCases;
        basisMonths.push(m.month);
        const hubPart = monthHub ? ` + $${monthHub.toLocaleString("en-US")} HubSpot` : "";
        const refPart = referralFee ? ` + $${referralFee.toLocaleString("en-US")} Referral Sites` : "";
        monthLines.push(
          `${m.month}: $${monthSpend.toLocaleString("en-US")} media + $${mgmt.toLocaleString("en-US")} management${hubPart}${refPart} · ${monthCases} cases`
        );
      }
    });
    const overhead = mgmtTotal + hubTotal + referralTotal;
    const allIn = media + overhead;
    const allInPerCase = cases ? Math.round(allIn / cases) : 0;
    const collectiblePerCase = Math.round(fee * coll);
    const money = n => "$•••";
    const formulaAllIn = cases
      ? `${money(media)} media + ${money(mgmtTotal)} management + ${money(hubTotal)} HubSpot + ${money(referralTotal)} Referral Sites, all ÷ ${cases} cases = ${money(allInPerCase)}/case`
      : "—";
    const formulaTile = cases
      ? `${money(media)} media + ${money(mgmtTotal)} management + ${money(hubTotal)} HubSpot + ${money(referralTotal)} Referral Sites ÷ ${cases} cases`
      : "—";
    return {
      fee,
      collectionRate: coll,
      media,
      mgmtTotal,
      hubTotal,
      referralTotal,
      overhead,
      cases,
      allInPerCase,
      collectiblePerCase,
      basisMonths,
      monthLines,
      formulaAllIn,
      formulaTile
    };
  }

  function hydrateMarketingCostPerCaseKpi() {
    const m = marketingCostPerClosedCaseModel();
    const kpi = (DATA.kpis || []).find(item => item.id === "#30");
    if (!kpi || !m.cases || !m.media) return;
    const months = m.basisMonths || [];
    const tileKey = periodToChannelMonth(DATA.period);
    const periodInBasis = months.indexOf(tileKey) !== -1;
    kpi.label = "Cost per Case";
    kpi.value = "$•••";
    kpi.target = "";
    kpi.periodRange = months.length >= 2
      ? `${months[0]}–${months[months.length - 1]} 2026`
      : months[0] ? `${months[0]} 2026` : "";
    kpi.formulaLine = m.formulaTile || "";
    kpi.noteLine = "Known stack only. Prior payments and subscriptions still on monthly installments are not fully visible. At least $20k this year is not paid off. Final amount unknown.";
    kpi.cashGoalNote = "";
    /* Green only when the live tile month is inside the complete-month stack. */
    kpi.verified = periodInBasis;
    kpi.augUpdated = periodInBasis;
    DATA.marketingCostPerCase = m;
  }

  /**
   * Avg case value — cash collected ÷ new cases created.
   * Scoped to the same complete months as #30 so cost and value sit on one basis.
   */
  function avgCaseValueModel() {
    const complete = (DATA.cashCollected2026Ytd || []).filter(r => r && !/\*/.test(String(r.month || "")));
    if (!complete.length) return null;
    const basis = (DATA.marketingCostPerCase && DATA.marketingCostPerCase.basisMonths) || [];
    const scoped = basis.length ? complete.filter(r => basis.indexOf(String(r.month)) !== -1) : [];
    const use = scoped.length ? scoped : complete;
    let cash = 0;
    let cases = 0;
    use.forEach(r => {
      cash += Number(r.credit) || 0;
      cases += Number(r.newCases) || 0;
    });
    if (!cases || !cash) return null;
    return {
      cash: Math.round(cash),
      cases,
      perCase: Math.round(cash / cases),
      months: use.map(r => String(r.month)),
      sameBasisAsCost: scoped.length > 0
    };
  }

  /** True when the KPI tile month is one of the complete months in this multi-month average. */
  function completeMonthsIncludeTilePeriod(months) {
    const tileKey = periodToChannelMonth(DATA.period);
    return (months || []).map(m => String(m).replace(/\*$/, "")).indexOf(tileKey) !== -1;
  }

  function hydrateAvgCaseValue() {
    DATA.avgCaseValue = avgCaseValueModel();
  }

  applyLsaAverageCallCostTarget();
  applyDirectContactCostKpi();
  applyNewCasesCashGoalTarget();
  applyLeadsCashGoalTarget();
  hydrateMarketingCostPerCaseKpi();
  hydrateAvgCaseValue();
  applyTileMonth(DATA.period);

  /**
   * #02 pace vs this month’s goal. Partial months use elapsed calendar days vs asOf.
   * Full months compare count to the monthly target. Not MoM.
   */
  function monthGoalPace(current, target, periodLabel) {
    const t = Number(String(target || "").replace(/[^0-9.]/g, ""));
    const c = Number(current);
    if (!Number.isFinite(t) || t <= 0 || !Number.isFinite(c)) {
      return { onTrack: false, label: "", expected: null };
    }
    if (c >= t) return { onTrack: true, label: "On track", expected: t };
    const key = periodToChannelMonth(periodLabel);
    const monthIdx = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }[key];
    const year = 2026;
    if (monthIdx == null) {
      return { onTrack: false, label: "Behind pace", expected: t };
    }
    const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
    const asOf = String(DATA.asOf || "");
    const m = asOf.match(/^(\d{4})-(\d{2})-(\d{2})/);
    let day = daysInMonth;
    if (m && Number(m[1]) === year && Number(m[2]) === monthIdx + 1) {
      day = Math.min(daysInMonth, Math.max(1, Number(m[3])));
    }
    const expected = t * (day / daysInMonth);
    const onTrack = c + 1e-9 >= expected;
    return {
      onTrack,
      label: onTrack ? "On track" : "Behind pace",
      expected: Math.ceil(expected - 1e-9)
    };
  }

  /**
   * Hydrate #01 / #02 / phone strip for the selected tile month.
   * Jun/Jul = proof months. Aug MTD with Search ads paused unpaid — not a positive quiet read.
   */
  function applyTileMonth(period) {
    const label = PERIOD_OPTIONS.includes(period) ? period : "October 2026";
    DATA.period = label;
    DATA.updateLabel = label;
    const key = periodToChannelMonth(label);
    const ch = findChannelMonthRow(key);
    const prior = findChannelMonthRow(priorMonthAbbrev(key));
    const cls = findCasesLeadsSpendRow(key);
    const priorCls = findCasesLeadsSpendRow(priorMonthAbbrev(key));
    const leadsTotal = channelLeadTotal(ch);
    const priorLeads = channelLeadTotal(prior);
    const casesVal = cls && cls.cases != null ? Number(cls.cases) : null;
    const priorCases = priorCls && priorCls.cases != null ? Number(priorCls.cases) : null;
    const isTileMonth = key === periodToChannelMonth(DATA.period);
    const isPartial = !!(ch && /\*/.test(String(ch.month || ""))) || !!(cls && /\*/.test(String(cls.month || "")));

    const phone = (DATA.phoneByMonth && DATA.phoneByMonth[key]) || null;
    const priorPhone = (DATA.phoneByMonth && DATA.phoneByMonth[priorMonthAbbrev(key)]) || null;
    if (phone && DATA.phoneIntake) {
      const pi = DATA.phoneIntake;
      const weekdayAnsweredPct = searchWeekdayAnswerPct(phone);
      const priorWeekdayAnsweredPct = priorPhone ? searchWeekdayAnswerPct(priorPhone) : null;
      const wdCalls = phone.weekdayCalls != null ? Number(phone.weekdayCalls) : Number(phone.calls);
      const wdMissed = phone.weekdayMissed != null ? Number(phone.weekdayMissed) : Number(phone.missed);
      pi.monthlyCalls = wdCalls;
      pi.missedSearchCalls = wdMissed;
      pi.missedLsaCalls = wdMissed;
      pi.answeredPct = weekdayAnsweredPct;
      pi.missedPct = wdCalls ? Math.round((wdMissed / wdCalls) * 100) : null;
      if (priorPhone) {
        const priorWdCalls = priorPhone.weekdayCalls != null ? Number(priorPhone.weekdayCalls) : Number(priorPhone.calls);
        const priorWdMissed = priorPhone.weekdayMissed != null ? Number(priorPhone.weekdayMissed) : Number(priorPhone.missed);
        pi.priorMissedSearchCalls = priorWdMissed;
        pi.priorMissedLsaCalls = priorWdMissed;
        pi.priorAnsweredPct = priorWeekdayAnsweredPct;
        pi.priorMissedPct = priorWdCalls ? Math.round((priorWdMissed / priorWdCalls) * 100) : null;
        pi.missedMomPp = (pi.missedPct != null && pi.priorMissedPct != null)
          ? pi.missedPct - pi.priorMissedPct
          : null;
      }
      const monthlyLost = Math.round(phone.missed * (pi.leadToCaseRate || 0.073) * (pi.avgCaseFee || 5661));
      const k19 = (DATA.kpis || []).find(item => item.id === "#19");
      if (k19) {
        k19.value = "$•••/mo";
        k19.verified = true;
        k19.augUpdated = isTileMonth;
        k19.alert = phone.missed > 0;
      }
      const k21 = (DATA.kpis || []).find(item => item.id === "#21");
      if (k21) {
        k21.value = weekdayAnsweredPct != null ? `${weekdayAnsweredPct}%` : "—";
        k21.mom = priorWeekdayAnsweredPct != null && weekdayAnsweredPct != null
          ? momPct(weekdayAnsweredPct, priorWeekdayAnsweredPct)
          : null;
        k21.verified = weekdayAnsweredPct != null;
        k21.augUpdated = isTileMonth && weekdayAnsweredPct != null;
        k21.hit = weekdayAnsweredPct != null && weekdayAnsweredPct >= (pi.targetPct || 90);
        k21.alert = !k21.hit;
      }
    } else {
      const k19 = (DATA.kpis || []).find(item => item.id === "#19");
      if (k19) {
        k19.value = "—";
        k19.verified = false;
        k19.alert = false;
        k19.augUpdated = false;
      }
      const k21 = (DATA.kpis || []).find(item => item.id === "#21");
      if (k21) {
        k21.value = "—";
        k21.mom = null;
        k21.verified = false;
        k21.augUpdated = false;
        k21.hit = false;
        k21.alert = false;
      }
    }

    const leads = (DATA.kpis || []).find(item => item.id === "#01");
    if (leads) {
      if (leadsTotal == null) {
        leads.value = "—";
        leads.count = null;
        leads.mom = null;
        leads.verified = false;
        leads.hit = false;
        leads.alert = true;
        leads.cashGoalNote = key === "Oct" || key === "Sep" ? `${key}* · stack pending` : "stack missing";
        /* Missing value → red freshness only. Never mark Updated when value is —. */
        leads.augUpdated = false;
      } else {
        leads.value = String(leadsTotal);
        leads.count = leadsTotal;
        leads.mom = priorLeads != null ? momPct(leadsTotal, priorLeads) : null;
        const leadTarget = Number(String(leads.target || "").replace(/[^0-9.]/g, ""));
        leads.hit = Number.isFinite(leadTarget) ? leadsTotal >= leadTarget : false;
        leads.alert = !leads.hit;
        leads.gauge = true;
        /* Kate 10/02/2026: filled lead stack = green on every month tab. */
        leads.augUpdated = isTileMonth;
        leads.verified = true;
        leads.updatedAsOf = resolveTileAsOf("#01") || leads.updatedAsOf;
        if (key === "Oct") {
          leads.cashGoalNote = "Oct* · Search only · LSA/HubSpot/Yelp pending";
        } else if (key === "Sep") {
          leads.cashGoalNote = "Sep*";
        } else if (key === "Aug") {
          leads.cashGoalNote = "Aug full month";
        } else if (key === "Jul") {
          leads.cashGoalNote = "Jul complete stack · HubSpot forms report 10/02";
        } else {
          leads.cashGoalNote = `${key} complete stack`;
        }
      }
    }

    const cases = (DATA.kpis || []).find(item => item.id === "#02");
    if (cases) {
      if (casesVal == null || !Number.isFinite(casesVal)) {
        cases.value = "—";
        cases.count = null;
        cases.mom = null;
        cases.trackLabel = "";
        cases.trackOn = false;
        cases.verified = false;
        cases.hit = false;
        cases.alert = isPartial ? false : true;
        cases.gauge = false;
        cases.augUpdated = false;
        cases.cashGoalNote = key === "Oct" ? "Oct Created · pull Contact" : key === "Sep" ? "Sep Created through export" : "cases missing";
      } else {
        cases.value = String(casesVal);
        cases.count = casesVal;
        cases.mom = priorCases != null ? momPct(casesVal, priorCases) : null;
        const caseTarget = Number(String(cases.target || "").replace(/[^0-9.]/g, ""));
        const cash = cashMonthPaceModel();
        const cashBehind = !!(cash && !cash.onPace);
        const fullMonthShort = !isPartial && Number.isFinite(caseTarget) && casesVal < caseTarget;
        cases.hit = Number.isFinite(caseTarget) ? casesVal >= caseTarget : false;
        cases.trackLabel = "";
        cases.trackOn = false;
        /* Kate 10/02/2026: filled case count = green on every month tab. */
        cases.verified = true;
        cases.alert = !!(cashBehind || fullMonthShort);
        cases.gauge = true;
        cases.augUpdated = isTileMonth;
        cases.updatedAsOf = resolveTileAsOf("#02") || cases.updatedAsOf;
        cases.cashGoalNote = isPartial ? `${cls.month} Created through export` : `${key} Created`;
      }
    }

    if (ch && Array.isArray(DATA.channels)) {
      const searchCh = DATA.channels.find(c => /search/i.test(c.name));
      const lsaCh = DATA.channels.find(c => /lsa/i.test(c.name));
      const hubCh = DATA.channels.find(c => /hubspot/i.test(c.name));
      const yelpCh = DATA.channels.find(c => /^yelp$/i.test(c.name));
      const justiaCh = DATA.channels.find(c => /justia/i.test(c.name));
      const priorSearch = prior && prior.search != null ? Number(prior.search) : null;
      const priorLsa = prior && prior.lsa != null ? Number(prior.lsa) : null;
      const priorHub = prior && prior.hubspot != null ? Number(prior.hubspot) : null;
      const priorYelp = prior && prior.yelp != null ? Number(prior.yelp) : null;
      const priorJustia = prior && prior.justia != null ? Number(prior.justia) : null;
      if (searchCh) {
        searchCh.count = ch.search == null ? null : Number(ch.search);
        searchCh.prior = priorSearch;
        searchCh.mom = ch.search == null ? "—" : momPct(ch.search, priorSearch) || "—";
        searchCh.spend = ch.searchSpend != null ? "$•••" : "—";
        searchCh.verified = ch.search != null;
      }
      if (lsaCh) {
        lsaCh.count = ch.lsa == null ? null : Number(ch.lsa);
        lsaCh.prior = priorLsa;
        lsaCh.mom = ch.lsa == null ? "—" : momPct(ch.lsa, priorLsa) || "—";
        lsaCh.spend = ch.lsaSpend != null ? "$•••" : "—";
        lsaCh.verified = ch.lsa != null;
      }
      if (hubCh) {
        hubCh.count = ch.hubspot == null ? null : Number(ch.hubspot);
        hubCh.prior = priorHub;
        hubCh.mom = ch.hubspot == null ? "—" : momPct(ch.hubspot, priorHub) || "—";
        hubCh.verified = ch.hubspot != null;
      }
      if (yelpCh) {
        yelpCh.count = ch.yelp == null ? null : Number(ch.yelp);
        yelpCh.prior = priorYelp;
        yelpCh.mom = ch.yelp == null ? "—" : momPct(ch.yelp, priorYelp) || "—";
        yelpCh.spend = ch.yelpSpend != null ? "$•••" : "—";
        yelpCh.verified = ch.yelp != null;
      }
      if (justiaCh) {
        justiaCh.count = ch.justia == null ? null : Number(ch.justia);
        justiaCh.prior = priorJustia;
        justiaCh.mom = ch.justia == null ? "—" : momPct(ch.justia, priorJustia) || "—";
        justiaCh.spend = ch.justiaSpend != null
          ? "$•••"
          : "—";
        justiaCh.verified = ch.justia != null;
      }
    }

    if (ch && leadsTotal != null && leadsTotal > 0) {
      const searchN = Number(ch.search) || 0;
      const lsaN = Number(ch.lsa) || 0;
      const hubN = Number(ch.hubspot) || 0;
      const yelpN = Number(ch.yelp) || 0;
      const justiaN = Number(ch.justia) || 0;
      const priorSearchN = prior ? Number(prior.search) || 0 : null;
      const priorLsaN = prior ? Number(prior.lsa) || 0 : null;
      const priorHubN = prior && prior.hubspot != null ? Number(prior.hubspot) : null;
      const priorYelpN = prior && prior.yelp != null ? Number(prior.yelp) : null;
      const priorJustiaN = prior && prior.justia != null ? Number(prior.justia) : null;
      const mixRow = (name, count, priorCount, color, known) => ({
        name,
        pct: Math.round((count / leadsTotal) * 100),
        color,
        count: known ? count : null,
        prior: priorCount,
        mom: !known || priorCount == null ? "—" : momPct(count, priorCount) || "—"
      });
      DATA.sourceMix = [
        mixRow("Paid Search", searchN, priorSearchN, "#3a1a6e", ch.search != null),
        mixRow("LSA", lsaN, priorLsaN, "#1e3a8a", ch.lsa != null),
        mixRow("HubSpot", hubN, priorHubN, "#b23a78", ch.hubspot != null),
        mixRow("Yelp", yelpN, priorYelpN, "#64748b", ch.yelp != null),
        mixRow("Justia", justiaN, priorJustiaN, "#6a5acd", ch.justia != null)
      ].filter(s => s.count != null);
    }

    applyDirectContactCostKpi();
  }

  /** True when this period has lead-stack + cases rows to drive tile numbers. */
  function periodTileReady(periodLabel) {
    const key = periodToChannelMonth(periodLabel);
    const ch = findChannelMonthRow(key);
    const cls = findCasesLeadsSpendRow(key);
    if (!ch || !cls) return false;
    const leads = channelLeadTotal(ch);
    return leads != null || cls.cases != null;
  }

  function keyMetricsPeriodHint() {
    const key = periodToChannelMonth(DATA.period);
    if (key === "May") return "May 2026 · Search + LSA + Justia · verified";
    if (key === "Jun") return "June 2026 complete stack · Justia 6 · verified";
    if (key === "Jul") return "July 2026 · Search + LSA + HubSpot 4 + Justia 6 · verified";
    if (key === "Aug") return "August 2026 full month · revenue $104,545 · 20 cases · Justia 0 · ads paused";
    if (key === "Sep") return "September 2026 · Search 41 · LSA 44 · Billing Search $13,651 · LSA $5,433 · revenue $113,985 · cases Contact_10-02 · 16 cases · weekday answer 46%";
    return "October 2026 MTD · Search 1 · LSA billed 1 · Billing Search $1,383 · LSA $531 · revenue $6,075 · cases Contact_10-02 · 0 · weekday answer 100%";
  }

  function reportPeriodPillsHtml() {
    const active = DATA.period || "October 2026";
    const buttons = PERIOD_OPTIONS.map(label => {
      const on = label === active;
      const ready = periodTileReady(label);
      const classes = [
        "kpi-report-pill",
        on ? "is-active" : "",
        ready ? "" : "is-unavailable"
      ].filter(Boolean).join(" ");
      const disabled = ready ? "" : " disabled aria-disabled=\"true\"";
      const title = ready
        ? `Show ${label} tile numbers`
        : `${label} not updated yet — no tile stack`;
      return `<button type="button" class="${classes}" data-kpi-period="${escapeHtml(label)}" aria-pressed="${on ? "true" : "false"}"${disabled} title="${escapeHtml(title)}">${escapeHtml(label)}</button>`;
    }).join("");
    return `<div class="kpi-report-pills" role="group" aria-label="Tile month">${buttons}</div>`;
  }

  function setTilePeriod(period) {
    if (!PERIOD_OPTIONS.includes(period)) return;
    if (!periodTileReady(period)) return;
    applyTileMonth(period);
    const kpisEl = document.getElementById("kpi-report-kpis");
    if (kpisEl) {
      delete kpisEl.dataset.rendered;
      renderKpis(kpisEl, { force: true });
    }
    const dataEl = document.getElementById("kpi-report-data");
    if (dataEl) {
      delete dataEl.dataset.rendered;
      renderData(dataEl, { force: true });
    }
  }

  function star() {
    return "";
  }

  /**
   * Data freshness corner marks — Monthly KPIs use these only.
   * Green check = period source on file and value filled (0 is valid).
   * Red check = period source missing or value is —.
   * Optional MM/DD/YYYY as-of sits left of the check · never a section Pulled stamp.
   * Never show UPDATED / OUTDATED text badges on tiles.
   */
  function tileValuePresent(value) {
    const s = String(value == null ? "" : value).trim();
    return s !== "" && s !== "—";
  }

  function tilePeriodFresh(updated, verified, value) {
    /* Kate 10/02/2026: filled tiles stay green on every month tab. Red X only when value is —. */
    return tileValuePresent(value);
  }

  /** True when this tile's source as-of matches the KPI pack lastUpdated stamp. */
  function tileSourceIsCurrent(tileId, asOfOverride) {
    const asOf = String(asOfOverride || resolveTileAsOf(tileId) || "");
    const pulled = String(DATA.lastUpdated || DATA.asOf || "");
    return !!(asOf && pulled && asOf >= pulled);
  }

  /** Resolve ISO as-of for a tile id · kpi.updatedAsOf · DATA.tileAsOf · optional override. */
  function resolveTileAsOf(tileId, override) {
    if (override) return String(override);
    const id = String(tileId || "");
    const kpi = (DATA.kpis || []).find(item => item.id === id);
    if (kpi && kpi.updatedAsOf) return String(kpi.updatedAsOf);
    const map = DATA.tileAsOf || {};
    if (map[id]) return String(map[id]);
    return "";
  }

  function tileAsOfHtml(asOfIso) {
    const date = formatPulledMd(asOfIso);
    if (!date) return "";
    return `<span class="kpi-tile-asof" title="Source updated ${escapeHtml(date)}">${escapeHtml(date)}</span>`;
  }

  /** Green checkbox when period data is on file. Optional asOf date sits left of the mark. */
  function statusCorner(ok, asOf) {
    if (!ok) return "";
    return freshMark(asOf);
  }

  function freshMark(asOf) {
    return `<span class="kpi-aug-updated-mark">${tileAsOfHtml(asOf)}<span class="kpi-verified-mark" title="Period data on file" aria-label="Data on file"></span></span>`;
  }

  function staleMark(asOf) {
    return `<span class="kpi-outdated-mark">${tileAsOfHtml(asOf)}<span class="kpi-unverified-mark" title="Period data missing" aria-label="Data missing"></span></span>`;
  }

  /* Alias — same green checkbox, no text badge. */
  function augUpdatedMark(asOf) {
    return freshMark(asOf);
  }

  /* Red check: method still open, or period source missing. Pair method issues with a written status line. */
  function unverifiedMark(asOf) {
    return staleMark(asOf);
  }

  function outdatedMark(asOf) {
    return staleMark(asOf);
  }

  function periodFreshClass(updated, verified, value) {
    return tilePeriodFresh(updated, verified, value) ? " kpi-verified kpi-aug-updated" : " kpi-outdated";
  }

  function periodFreshMark(updated, verified, value, asOf) {
    return tilePeriodFresh(updated, verified, value) ? freshMark(asOf) : staleMark(asOf);
  }

  function verifiedClass(verified) {
    return verified ? " kpi-verified" : "";
  }

  function sourceFootnote(kpiId) {
    /* Chart sources now live in the upper-right ? help popup. */
    return "";
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmtMoney(n) {
    /* Portfolio sample: cash redacted · banner says no live data */
    return "$•••";
  }

  /** Portfolio: redact preformatted $ strings already stored on DATA / rows */
  (function redactPortfolioCashStrings(root) {
    const re = /\$[\d,]+(?:\.\d{1,2})?(?:k)?(?:\/mo)?/gi;
    function walk(v) {
      if (typeof v === "string") return v.replace(re, "$•••");
      if (Array.isArray(v)) {
        for (let i = 0; i < v.length; i++) v[i] = walk(v[i]);
        return v;
      }
      if (v && typeof v === "object") {
        for (const k of Object.keys(v)) v[k] = walk(v[k]);
        return v;
      }
      return v;
    }
    try { walk(root); } catch (e) { /* ignore */ }
  })(typeof DATA !== "undefined" ? DATA : null);

  /**
   * Cash collected monthly tiers (NEW-A):
   * ≥$100k → gold · >$80k → green · $60–70k → burnt umber · else neutral.
   * Gaps (<$60k, $70–80k inclusive of $80k) stay default.
   */
  function cashTierClass(n) {
    const amt = Number(n);
    if (!Number.isFinite(amt)) return "";
    if (amt >= 100000) return "kpi-cash-tier kpi-cash-tier-gold";
    if (amt > 80000) return "kpi-cash-tier kpi-cash-tier-green";
    if (amt >= 60000 && amt <= 70000) return "kpi-cash-tier kpi-cash-tier-umber";
    return "kpi-cash-tier kpi-cash-tier-neutral";
  }

  function cashTierFill(n) {
    const amt = Number(n);
    if (!Number.isFinite(amt)) return null;
    if (amt >= 100000) return "#1f8a65";
    if (amt > 80000) return "#1f8a65";
    if (amt >= 60000 && amt <= 70000) return "#9a3f14";
    return null;
  }

  function fmtCashTier(n) {
    const cls = cashTierClass(n);
    return cls
      ? `<span class="${cls}">${fmtMoney(n)}</span>`
      : fmtMoney(n);
  }

  function kpiDetailAccordion(title, hint, headers, rows, startOpen) {
    const hintHtml = hint
      ? `<span class="kpi-table-acc-hint">${escapeHtml(hint)}</span>`
      : "";
    const openAttr = startOpen ? " open" : "";
    return `<details class="kpi-table-acc"${openAttr}>
      <summary class="kpi-table-acc-summary">${escapeHtml(title)}${hintHtml}</summary>
      <div class="kpi-chart-detail kpi-chart-detail-acc">
        <table class="kpi-table kpi-chart-table kpi-table-dense">
          <thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join("")}</tr></thead>
          <tbody>${rows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
        </table>
      </div>
    </details>`;
  }

  function channelBarChart(channels) {
    const max = chartAxisMax(channels.map(c => c.count));
    const w = 420;
    const h = 200;
    const pad = { l: 44, r: 16, t: 28, b: 40 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / channels.length;
    const barW = Math.min(64, slot * 0.55);
    const ticks = axisTicks(max, 3).map(val => {
      const y = pad.t + plotH * (1 - val / max);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${val}</text>
      </g>`;
    }).join("");
    const bars = channels.map((c, i) => {
      const bh = Math.max(6, (plotH * c.count) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const short = c.name.replace(/\s.*/, "");
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="5" fill="${c.color}"/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total">${c.count}</text>
        <text x="${x + barW / 2}" y="${h - 14}" text-anchor="middle" class="kpi-chart-label">${short}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Leads by channel bar chart">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
    </svg>`;
  }

  function leadsByMonthFromChannels(channels, opts) {
    const useMonths = opts && opts.useChannelMonths && DATA.channelMonths && DATA.channelMonths.length;
    if (useMonths) {
      const colors = {
        search: "#3a1a6e",
        lsa: "#1e3a8a",
        hubspot: "#b23a78",
        yelp: "#64748b",
        justia: "#6a5acd"
      };
      const labels = {
        search: "Search calls",
        lsa: "LSA calls",
        hubspot: "HubSpot forms",
        yelp: "Yelp",
        justia: "Justia"
      };
      return chronological(DATA.channelMonths).map(m => ({
        month: m.month,
        segments: [
          { name: labels.search, count: m.search || 0, color: colors.search },
          { name: labels.lsa, count: m.lsa || 0, color: colors.lsa },
          { name: labels.hubspot, count: m.hubspot || 0, color: colors.hubspot },
          { name: labels.yelp, count: m.yelp || 0, color: colors.yelp },
          { name: labels.justia, count: m.justia || 0, color: colors.justia }
        ]
      }));
    }
    /* Fallback — prior = May, count = Jun only */
    return chronological([
      {
        month: "May",
        segments: channels.map(c => ({ name: c.name, count: c.prior, color: c.color }))
      },
      {
        month: "Jun",
        segments: channels.map(c => ({ name: c.name, count: c.count, color: c.color }))
      }
    ]);
  }

  function stackedLeadsByMonthChart(months) {
    const totals = months.map(m => m.segments.reduce((s, x) => s + (Number(x.count) || 0), 0));
    const rawMax = Math.max(...totals, 1);
    /* Round count axis to a clean step (50/100) — avoid odd ticks like 57 / 113 / 170.
       Top tick must stay ≥ one integer above highest data point (brand §7). */
    const step = rawMax <= 100 ? 25 : rawMax <= 250 ? 50 : 100;
    const axisMax = axisMaxAboveData(rawMax * 1.06, step);
    const tickVals = [];
    for (let t = 0; t <= axisMax; t += step) tickVals.push(t);
    const w = 640;
    const h = 300;
    const pad = { l: 54, r: 22, t: 24, b: 52 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / months.length;
    const barW = Math.min(96, slot * 0.52);
    const ticks = tickVals.map(t => {
      const y = pad.t + plotH * (1 - t / axisMax);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 10}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${t}</text>
      </g>`;
    }).join("");
    const bars = months.map((m, i) => {
      const x = pad.l + i * slot + (slot - barW) / 2;
      let y = pad.t + plotH;
      const segs = m.segments.map(seg => {
        const count = Number(seg.count) || 0;
        const hh = (plotH * count) / axisMax;
        y -= hh;
        if (!count) return "";
        /* Only label when the segment is tall enough — tiny slices live in the table. */
        const showLabel = hh >= 22;
        const label = showLabel
          ? `<text x="${x + barW / 2}" y="${y + hh / 2 + 4}" text-anchor="middle" class="kpi-chart-segment-count">${count}</text>`
          : "";
        return `<g>
          <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(hh, 0)}" fill="${seg.color}">
            <title>${escapeHtml(seg.name)}: ${count}</title>
          </rect>
          ${label}
        </g>`;
      }).join("");
      return `<g>
        ${segs}
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(m.month)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-stacked kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Stacked leads by month: Search, LSA, HubSpot, Yelp, Justia">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <line x1="${pad.l}" y1="${pad.t + plotH}" x2="${w - pad.r}" y2="${pad.t + plotH}" class="kpi-chart-baseline"/>
      <text x="14" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 14 ${pad.t + plotH / 2})" class="kpi-chart-axis">Leads</text>
    </svg>`;
  }

  function casesMomByMonth(rows, series) {
    const colorByName = Object.fromEntries(series.map(s => [s.name, s.color]));
    return chronological(rows).map(r => ({
      month: r.month,
      segments: [
        { name: "Closed cases", count: r.closed, color: colorByName["Closed cases"] },
        { name: "New cases", count: r.newCases, color: colorByName["New cases"] },
        { name: "Red accounts", count: r.redAccounts, color: colorByName["Red accounts"] }
      ]
    }));
  }

  function stackedCasesMomChart(months) {
    const totals = months.map(m => m.segments.reduce((s, x) => s + (Number(x.count) || 0), 0));
    const max = chartAxisMax(totals);
    const w = 560;
    const h = 280;
    const pad = { l: 48, r: 36, t: 48, b: 46 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / months.length;
    const barW = Math.min(84, slot * 0.46);
    const ticks = axisTicks(max, 5).map(val => {
      const y = pad.t + plotH * (1 - val / max);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 10}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${val}</text>
      </g>`;
    }).join("");
    const bars = months.map((m, i) => {
      const total = totals[i];
      const x = pad.l + i * slot + (slot - barW) / 2;
      let y = pad.t + plotH;
      const segs = m.segments.map(seg => {
        const count = Number(seg.count) || 0;
        const hh = total ? (plotH * count) / max : 0;
        y -= hh;
        const label = hh >= 14
          ? `<text x="${x + barW / 2}" y="${y + hh / 2 + 4}" text-anchor="middle" class="kpi-seg-count">${count}</text>`
          : "";
        return `<g>
          <rect x="${x}" y="${y}" width="${barW}" height="${Math.max(hh, 0)}" fill="${seg.color}">
            <title>${escapeHtml(seg.name)}: ${count}</title>
          </rect>
          ${label}
        </g>`;
      }).join("");
      return `<g>
        ${segs}
        <text x="${x + barW / 2}" y="${pad.t - 14}" text-anchor="middle" class="kpi-chart-total">${total}</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${m.month}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-stacked kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Closed, new, and red accounts stacked by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <line x1="${pad.l}" y1="${pad.t + plotH}" x2="${w - pad.r}" y2="${pad.t + plotH}" class="kpi-chart-baseline"/>
    </svg>`;
  }

  function casesMomSeriesMom(rows, key) {
    if (!rows || rows.length < 2) return null;
    const ordered = newestFirst(rows.slice());
    const curr = Number(ordered[0][key]);
    const prior = Number(ordered[1][key]);
    if (!Number.isFinite(curr) || !Number.isFinite(prior) || prior === 0) return null;
    const pct = Math.round(((curr - prior) / prior) * 100);
    return pct > 0 ? `+${pct}%` : `${pct}%`;
  }

  function casesMomLegend(series, rows) {
    const keyByName = {
      "Closed cases": "closed",
      "New cases": "newCases",
      "Red accounts": "redAccounts"
    };
    return `<ul class="kpi-stack-legend" aria-label="Series colors">${series.map(c => {
      const mom = casesMomSeriesMom(rows, keyByName[c.name]);
      const delta = mom ? momChangeHtml(mom) : "";
      return `<li><span class="kpi-stack-swatch" style="background:${c.color}" aria-hidden="true"></span><span>${escapeHtml(c.name)}</span>${delta}</li>`;
    }).join("")}</ul>`;
  }

  function casesMomDetailTable(rows) {
    const ordered = chronological(rows);
    const momPct = (curr, prior) => {
      if (prior == null || prior === 0) return "—";
      const pct = Math.round(((curr - prior) / prior) * 100);
      const label = pct > 0 ? `+${pct}%` : `${pct}%`;
      return momChangeHtml(label) || "—";
    };
    /* Source order is already oldest → newest; pair each month with its prior for MoM math. */
    const chrono = rows.slice();
    const byMonth = Object.fromEntries(chrono.map((r, i) => [r.month, { r, prior: i > 0 ? chrono[i - 1] : null }]));
    const tableRows = ordered.map(r => {
      const prior = (byMonth[r.month] && byMonth[r.month].prior) || null;
      const total = r.closed + r.newCases + r.redAccounts;
      const notes = prior
        ? `Closed ${momPct(r.closed, prior.closed)} · New ${momPct(r.newCases, prior.newCases)} · Red ${momPct(r.redAccounts, prior.redAccounts)}`
        : "—";
      return [
        escapeHtml(r.month),
        String(r.closed),
        String(r.newCases),
        String(r.redAccounts),
        String(total),
        notes
      ];
    });
    const totClosed = rows.reduce((s, r) => s + r.closed, 0);
    const totNew = rows.reduce((s, r) => s + r.newCases, 0);
    const totRed = rows.reduce((s, r) => s + r.redAccounts, 0);
    tableRows.push([
      '<span class="kpi-table-total">Total</span>',
      `<span class="kpi-table-total">${totClosed}</span>`,
      `<span class="kpi-table-total">${totNew}</span>`,
      `<span class="kpi-table-total">${totRed}</span>`,
      `<span class="kpi-table-total">${totClosed + totNew + totRed}</span>`,
      "—"
    ]);
    return kpiDetailTable(
      ["Month", "Closed", "New cases", "Red accounts", "Total", "MoM notes"],
      tableRows
    );
  }

  function channelLegend(channels) {
    /* Series use color swatches only — verified state lives on the panel corner, not per legend row. */
    return `<ul class="kpi-stack-legend" aria-label="Series colors">${channels.map(c =>
      `<li><span class="kpi-stack-swatch" style="background:${c.color}" aria-hidden="true"></span><span>${escapeHtml(c.name)}</span></li>`
    ).join("")}</ul>`;
  }

  function kpiDetailTable(headers, rows) {
    const monthRank = {
      Dec: 12, Nov: 11, Oct: 10, Sep: 9, Aug: 8, Jul: 7,
      Jun: 6, May: 5, Apr: 4, Mar: 3, Feb: 2, Jan: 1
    };
    const monthRowRank = row => {
      const label = String(row && row[0] != null ? row[0] : "")
        .replace(/<[^>]*>/g, "")
        .trim();
      const match = label.match(
        /^(?:20\d{2}\s+)?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\*?(?:\s+20\d{2})?$/i
      );
      if (!match) return null;
      const key = match[1][0].toUpperCase() + match[1].slice(1, 3).toLowerCase();
      const yearMatch = label.match(/\b(20\d{2})\b/);
      return (yearMatch ? Number(yearMatch[1]) * 100 : 0) + monthRank[key];
    };
    const monthRows = [];
    const otherRows = [];
    (rows || []).forEach((row, index) => {
      const rank = monthRowRank(row);
      if (rank == null) otherRows.push({ row, index });
      else monthRows.push({ row, index, rank });
    });
    const displayRows = monthRows.length >= 2
      ? monthRows
          .sort((a, b) => b.rank - a.rank || b.index - a.index)
          .map(item => item.row)
          .concat(otherRows.map(item => item.row))
      : (rows || []);
    return `<div class="kpi-chart-detail">
      <table class="kpi-table kpi-chart-table">
        <thead><tr>${headers.map(h => `<th scope="col">${h}</th>`).join("")}</tr></thead>
        <tbody>${displayRows.map(r => `<tr>${r.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
      </table>
    </div>`;
  }

  /**
   * Locked chart layout for every Guide tab:
   * chartPairGridHtml = 2 chart cards per row where paired.
   * Each card = title · plot · optional legend · detail table.
   * Data tab CSS places plot left and detail table right inside `.kpi-chart-split`.
   * Pass chartBlock() HTML only. Odd leftovers stay in the left cell of the next row.
   */
  function chartPairGridHtml(...blocks) {
    const cells = blocks.filter(Boolean);
    if (!cells.length) return "";
    return `<div class="data-chart-table-grid">${cells.join("")}</div>`;
  }

  /**
   * Required chart card title — one line, no subhead.
   * Brand: REPORTING-BRAND-GUIDE §7 + BRANDING-LAYOUT chart pattern.
   * Required: title · plot · detail table. Never a plot without a breakdown table.
   */
  function chartHeadHtml(title) {
    return `<div class="kpi-chart-title-large"><strong>${escapeHtml(title)}</strong></div>`;
  }

  function chartBlock(opts) {
    const headInner = opts.head || (opts.title ? chartHeadHtml(opts.title) : "");
    const head = headInner ? `<div class="kpi-chart-head">${headInner}</div>` : "";
    const legend = opts.legend || "";
    const table = opts.omitTable
      ? ""
      : (opts.table
        || `<div class="kpi-chart-detail"><p class="data-inline-note">Breakdown table pending.</p></div>`);
    const focus = opts.focus ? ` data-kpi-focus="${opts.focus}"` : "";
    /* help: false suppresses ?. Otherwise helpId, then focus id. */
    const helpKey = opts.help === false ? "" : (opts.helpId || opts.focus || "");
    const help = helpKey ? kpiHelpBtn(helpKey) : "";
    /* Footnotes live under ? help — not under the chart. */
    const badge = opts.verified === true ? statusCorner(true) : "";
    const wipClass = opts.wip ? " kpi-chart-wip" : "";
    const extraClass = opts.cardClass ? ` ${opts.cardClass}` : "";
    const plot = `<div class="kpi-chart-plot">${opts.chart || ""}${legend}</div>`;
    const body = table
      ? `<div class="kpi-chart-split">${plot}<div class="kpi-chart-desc">${table}</div></div>`
      : plot;
    const card = `<div class="kpi-chart-card${wipClass}${extraClass}"${focus}>
      ${badge}
      ${help}
      ${head}
      ${body}
    </div>`;
    if (!opts.wip) return card;
    const note = opts.wipNote
      ? `<p class="kpi-chart-wip-note">${escapeHtml(opts.wipNote)}</p>`
      : `<p class="kpi-chart-wip-note">Needs better data before this chart is live.</p>`;
    return `<div class="kpi-chart-wip-shell" aria-disabled="true">
      <span class="kpi-chart-wip-banner">On hold</span>
      ${note}
      ${card}
    </div>`;
  }

  /**
   * Y-scale top must sit at least one integer above the highest data point
   * (REPORTING-BRAND-GUIDE §7 — bars/lines never kiss or clip the top tick).
   */
  function axisMaxAboveData(rawMax, step) {
    const dataMax = Math.max(Number(rawMax) || 0, 0);
    const minTop = Math.floor(dataMax) + 1;
    if (step && step > 0) {
      let top = Math.ceil(minTop / step) * step;
      if (top <= dataMax) top += step;
      return Math.max(top, minTop);
    }
    return minTop;
  }

  function niceAxisMax(n) {
    const dataMax = Math.max(Number(n) || 0, 0);
    const minTop = Math.floor(dataMax) + 1;
    const v = Math.max(dataMax * 1.12, minTop, 1);
    const mag = Math.pow(10, Math.floor(Math.log10(v)));
    const norm = v / mag;
    const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10;
    return Math.max(nice * mag, minTop);
  }

  /** Count / $ axis max from plotted values — never equals data max, never hard-caps below data. */
  function chartAxisMax(values, step) {
    const dataMax = Math.max(0, ...values.map(v => Number(v) || 0), 0);
    if (step && step > 0) return axisMaxAboveData(dataMax, step);
    return niceAxisMax(dataMax);
  }

  function axisTicks(max, count) {
    const n = Math.max(2, count || 5);
    return Array.from({ length: n }, (_, i) => Math.round((max * i) / (n - 1)));
  }

  /**
   * Direct contacts for casesLeadsSpend rows.
   * `leads` on that series is already the channel stack total — do not add adsLeads/website again.
   */
  function incomingTotal(r) {
    if (!r) return null;
    if (r.leads != null) return Number(r.leads) || 0;
    const parts = [r.adsLeads, r.websiteLeads];
    if (parts.every(v => v == null)) return null;
    return parts.reduce((s, v) => s + (Number(v) || 0), 0);
  }

  /** Phone calls only (LSA + digital Search). Null when both unknown. */
  function phoneCallsTotal(r) {
    if (r.leads == null && r.adsLeads == null) return null;
    return (Number(r.leads) || 0) + (Number(r.adsLeads) || 0);
  }

  function lastCasesLeadsSpendMonths(rows, n) {
    return lastPeriods(rows, n);
  }

  function cashForMonth2026(monthLabel) {
    const key = String(monthLabel || "").replace(/\*$/, "");
    const row = (DATA.cashCollected2026Ytd || []).find(r => String(r.month || "").replace(/\*$/, "") === key);
    return row && row.credit != null ? Number(row.credit) : null;
  }

  /** Dual-axis: cases + leads (left count, fixed 0–300) · marketing spend (right $). */
  function dualAxisCasesSpendChart(rows) {
    rows = lastCasesLeadsSpendMonths(rows, 4);
    const w = 980;
    const h = 360;
    const pad = { l: 58, r: 78, t: 40, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const leftMax = 300;
    const rightMax = 40000;
    const leftY = v => pad.t + plotH * (1 - Math.max(0, Number(v) || 0) / leftMax);
    const rightY = v => pad.t + plotH * (1 - Math.max(0, Number(v) || 0) / rightMax);
    const slot = plotW / Math.max(rows.length, 1);
    const colors = { cases: "#3a1a6e", leads: "#1e3a8a", spend: "#6a5acd" };
    const barW = Math.min(48, slot * 0.28);
    const gap = 10;
    const leftTicks = axisTicks(leftMax, 5).map(t => {
      const y = leftY(t);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${t}</text>
      </g>`;
    }).join("");
    const rightTicks = axisTicks(rightMax, 6).map(t => {
      const y = rightY(t);
      const label = t === 0 ? "$0" : (t >= 1000 ? `$${Math.round(t / 1000)}k` : `$${t}`);
      return `<text x="${w - pad.r + 8}" y="${y + 4}" class="kpi-chart-axis" style="fill:${colors.spend}">${label}</text>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const cx = pad.l + slot * i + slot / 2;
      const leads = incomingTotal(r);
      const casesX = cx - barW - gap / 2;
      const leadsX = cx + gap / 2;
      const spendY = rightY(r.spend);
      const barLabel = (x, value, topY) => {
        const y = Math.max(pad.t + 12, Math.min(topY, spendY) - 10);
        return `<text x="${x + barW / 2}" y="${y}" text-anchor="middle" class="kpi-chart-total" style="fill:#111">${value}</text>`;
      };
      const casesBar = (r.cases != null && r.cases > 0)
        ? `<rect x="${casesX}" y="${leftY(r.cases)}" width="${barW}" height="${pad.t + plotH - leftY(r.cases)}" rx="3" fill="${colors.cases}"/>
           ${barLabel(casesX, r.cases, leftY(r.cases))}`
        : "";
      const leadsBar = (leads != null && leads > 0)
        ? `<rect x="${leadsX}" y="${leftY(leads)}" width="${barW}" height="${pad.t + plotH - leftY(leads)}" rx="3" fill="${colors.leads}"/>
           ${barLabel(leadsX, leads, leftY(leads))}`
        : "";
      return `<g>
        ${casesBar}
        ${leadsBar}
        <text x="${cx}" y="${h - 14}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    const spendPts = rows.map((r, i) => {
      const cx = pad.l + slot * i + slot / 2;
      return `${cx},${rightY(r.spend)}`;
    }).join(" ");
    /* Spend $ labels sit above the line, right of the contact bar, so they do not sit on the line or the counts. */
    const spendDots = rows.map((r, i) => {
      const cx = pad.l + slot * i + slot / 2;
      const cy = rightY(r.spend);
      const leadsX = cx + gap / 2;
      const spendLabel = r.spend >= 1000
        ? `$${Math.round(r.spend / 1000)}k`
        : `$${r.spend || 0}`;
      const labelY = Math.max(pad.t + 12, cy - 14);
      return `<g>
        <circle cx="${cx}" cy="${cy}" r="5" fill="${colors.spend}"/>
        <text x="${leadsX + barW + 8}" y="${labelY}" text-anchor="start" class="kpi-chart-total" style="fill:#111">${spendLabel}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-chart-svg-wide" viewBox="0 0 ${w} ${h}" role="img" aria-label="New cases and leads vs marketing spend — May through Aug* oldest to newest">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${leftTicks}${rightTicks}${bars}
      <polyline points="${spendPts}" fill="none" stroke="${colors.spend}" stroke-width="3"/>
      ${spendDots}
      <text x="14" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 14 ${pad.t + plotH / 2})" class="kpi-chart-axis">Cases / contacts</text>
      <text x="${w - 12}" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(90 ${w - 12} ${pad.t + plotH / 2})" class="kpi-chart-axis" style="fill:${colors.spend}">Spend ($)</text>
    </svg>`;
  }

  function casesLeadsSpendLegend() {
    const items = [
      { name: "New cases", color: "#3a1a6e" },
      { name: "Direct Contacts", color: "#1e3a8a" },
      { name: "Marketing spend", color: "#6a5acd" }
    ];
    return channelLegend(items);
  }

  function lsaResponsesForMonth(month) {
    const key = String(month || "").replace(/\*$/, "");
    const eff = (DATA.lsaEfficiency || []).find(r => String(r.month || "").replace(/\*$/, "") === key);
    if (eff && Number(eff.leads) > 0) return Number(eff.leads);
    const ch = findChannelMonthRow(key);
    if (ch && ch.lsa != null) return Number(ch.lsa);
    return null;
  }

  function costPerResponseChannelsForMonth(rows, month) {
    const row = findCasesLeadsSpendRow(month)
      || (rows || []).find(r => String(r.month || "").replace(/\*$/, "") === String(month || "").replace(/\*$/, ""));
    if (!row) return [];
    const key = String(month || "").replace(/\*$/, "");
    const channelRow = findChannelMonthRow(key) || {};
    const lsaResponses = lsaResponsesForMonth(month);
    const channels = [];
    if (lsaResponses && Number(row.lsaSpend) > 0) {
      channels.push({
        label: "LSA",
        unit: "$/call",
        spend: row.lsaSpend,
        responses: lsaResponses,
        value: row.lsaSpend / lsaResponses,
        color: "#1e3a8a"
      });
    }
    if (Number(row.adsLeads) > 0 && Number(row.adsSpend) > 0) {
      channels.push({
        label: "Digital",
        unit: "$/call",
        spend: row.adsSpend,
        responses: Number(row.adsLeads),
        value: row.adsSpend / Number(row.adsLeads),
        color: "#c45c26"
      });
    }
    if (channelRow.yelp != null) {
      const responses = Number(channelRow.yelp) || 0;
      const spend = Number(channelRow.yelpSpend) || 0;
      channels.push({
        label: "Yelp",
        unit: "$/lead",
        spend,
        responses,
        value: responses > 0 ? spend / responses : null,
        color: "#64748b"
      });
    }
    if (channelRow.justia != null && Number(channelRow.justia) > 0) {
      const responses = Number(channelRow.justia) || 0;
      const spend = channelRow.justiaSpend != null
        ? Number(channelRow.justiaSpend) || 0
        : Number(DATA.referralSitesMonthly) || 0;
      channels.push({
        label: "Justia",
        unit: "$/contact",
        spend,
        responses,
        value: responses > 0 && spend > 0 ? spend / responses : null,
        color: "#6a5acd"
      });
    }
    return channels.filter(c => c.value == null || Number(c.value) >= 0);
  }

  function junCostPerResponseChannels(rows) {
    return costPerResponseChannelsForMonth(rows, "Jun");
  }

  function latestFullCostPerResponseChannels(rows) {
    const jul = costPerResponseChannelsForMonth(rows, "Jul");
    if (jul.length) return { month: "Jul", channels: jul };
    const jun = costPerResponseChannelsForMonth(rows, "Jun");
    if (jun.length) return { month: "Jun", channels: jun };
    return { month: null, channels: [] };
  }

  /** Sep* and other starred casesLeadsSpend rows are MTD — Cost per response uses last complete month. */
  function isPartialCostPerResponseMonth(key) {
    const k = String(key || "").replace(/\*$/, "");
    const cls = findCasesLeadsSpendRow(k);
    if (cls && String(cls.month || "").includes("*")) return true;
    const partialKey = String((DATA.cashCollected2026Ytd || {}).partialMonthKey || "").replace(/\*$/, "");
    return !!k && partialKey === k;
  }

  function tileMonthCostPerResponsePack(rows) {
    const meta = tileMonthMeta();
    if (isPartialCostPerResponseMonth(meta.key)) {
      const full = latestFullCostPerResponseChannels(rows);
      if (full.channels.length) {
        const labels = { Jul: "July 2026", Jun: "June 2026", May: "May 2026" };
        return {
          month: full.month,
          monthLabel: labels[full.month] || full.month,
          channels: full.channels,
          fromCompleteMonth: true
        };
      }
    }
    return {
      month: meta.key,
      monthLabel: meta.label,
      channels: costPerResponseChannelsForMonth(rows, meta.key),
      fromCompleteMonth: false
    };
  }

  function casesLeadsSpendDetailTable(rows) {
    const months = lastCasesLeadsSpendMonths(rows, 4);
    return kpiDetailTable(
      ["Period", "Spend / case", "Cases", "Spend"],
      months.map(r => {
        const cases = r.cases == null ? null : Number(r.cases);
        const spend = Number(r.spend) || 0;
        const ratio = cases != null && cases > 0 ? fmtMoney(Math.round(spend / cases)) : "—";
        return [
          escapeHtml(r.month),
          ratio,
          cases == null ? "—" : String(cases),
          fmtMoney(spend)
        ];
      })
    );
  }

  function costPerResponseDetailTable(rows) {
    const pack = tileMonthCostPerResponsePack(rows);
    if (!pack.channels.length) return "";
    return kpiDetailTable(
      ["Channel", "Calls", "Cost / call"],
      pack.channels.map(c => [
        escapeHtml(c.label),
        String(c.responses),
        c.value == null ? "—" : fmtMoney(c.value)
      ])
    );
  }

  /** Tile-month ad media only: Search + LSA + Yelp + Justia. Not HubSpot forms fee or digital management. */
  function fmtAdSpend(n) {
    return "$•••";
  }

  function currentAdSpendPack() {
    const meta = tileMonthMeta();
    const ch = meta.ch || {};
    const cls = meta.cls || {};
    const search = ch.searchSpend != null
      ? Number(ch.searchSpend)
      : (cls.adsSpend != null ? Number(cls.adsSpend) : null);
    const lsa = ch.lsaSpend != null
      ? Number(ch.lsaSpend)
      : (cls.lsaSpend != null ? Number(cls.lsaSpend) : null);
    const yelp = ch.yelpSpend != null ? Number(ch.yelpSpend) : null;
    const justia = ch.justiaSpend != null ? Number(ch.justiaSpend) : null;
    const channels = [];
    if (search != null) {
      channels.push({ label: "Search", spend: search, color: "#c45c26" });
    }
    if (lsa != null) {
      channels.push({ label: "LSA", spend: lsa, color: "#1e3a8a" });
    }
    if (yelp != null) {
      channels.push({ label: "Yelp", spend: yelp, color: "#64748b" });
    }
    if (justia != null) {
      channels.push({ label: "Justia", spend: justia, color: "#6a5acd" });
    }
    const total = channels.reduce((sum, c) => sum + (Number(c.spend) || 0), 0);
    return { meta, channels, total };
  }

  function adSpendByChannelChart(channels) {
    if (!channels || !channels.length) return "";
    const w = 540;
    const h = 260;
    const pad = { l: 72, r: 18, t: 34, b: 42 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const values = channels.map(c => Number(c.spend) || 0);
    const axisMax = chartAxisMax(values, 500);
    const ticks = axisTicks(axisMax, 5).map(value => {
      const y = pad.t + plotH * (1 - value / axisMax);
      const label = value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`;
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 10}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${label}</text>
      </g>`;
    }).join("");
    const slot = plotW / channels.length;
    const barW = Math.min(84, slot * 0.56);
    const bars = channels.map((c, i) => {
      const spend = Number(c.spend) || 0;
      const bh = spend > 0 ? Math.max(6, (plotH * spend) / axisMax) : 0;
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const bar = bh > 0
        ? `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="5" fill="${c.color}"/>`
        : `<line x1="${x}" y1="${pad.t + plotH}" x2="${x + barW}" y2="${pad.t + plotH}" stroke="${c.color}" stroke-width="4"/>`;
      return `<g>
        ${bar}
        <text x="${x + barW / 2}" y="${y - 9}" text-anchor="middle" class="kpi-chart-total">${fmtAdSpend(spend)}</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(c.label)}</text>
      </g>`;
    }).join("");
    const aria = channels.map(c => `${c.label} ${fmtAdSpend(c.spend)}`).join(", ");
    const axisTitleX = 16;
    const axisTitleY = pad.t + plotH / 2;
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Ad spend by channel: ${aria}">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <text x="${axisTitleX}" y="${axisTitleY}" text-anchor="middle" transform="rotate(-90 ${axisTitleX} ${axisTitleY})" class="kpi-chart-axis">Ad spend ($)</text>
    </svg>`;
  }

  function adSpendByChannelDetailTable(pack) {
    if (!pack.channels.length) return "";
    const rows = pack.channels.map(c => [
      `<span class="kpi-stack-swatch" style="background:${c.color}" aria-hidden="true"></span> ${escapeHtml(c.label)}`,
      fmtAdSpend(c.spend)
    ]);
    return kpiDetailTable(["Channel", "Spend"], rows);
  }

  function adSpendByChannelLegend(channels) {
    return channelLegend(channels.map(c => ({ name: c.label, color: c.color })));
  }

  function adSpendStatCardHtml() {
    const pack = currentAdSpendPack();
    if (!pack.channels.length) return "";
    const total = fmtAdSpend(pack.total);
    const fresh = tilePeriodFresh(true, true, total);
    return `<button type="button" class="kpi-goal-card${fresh ? " kpi-verified kpi-aug-updated" : " kpi-outdated"}" data-kpi-focus="ad-spend-by-channel" aria-label="Ad spend ${total} · ${pack.meta.label}">
      ${periodFreshMark(true, true, total, resolveTileAsOf("ad-spend-by-channel"))}
      ${kpiHelpBtn("ad-spend-by-channel")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Ad Spend")}
        <span class="kpi-stat-val">${total}</span>
      </div>
      ${goalTrackRows(pack.channels.map(c => [escapeHtml(c.label), fmtAdSpend(c.spend)]))}
    </button>`;
  }

  function newCasesContactsSpendChartBlockHtml() {
    const rows = DATA.casesLeadsSpend || [];
    if (!rows.length) return "";
    return chartBlock({
      helpId: "cases-leads-spend",
      title: "New Cases, Contacts & Spend",
      chart: dualAxisCasesSpendChart(rows),
      legend: casesLeadsSpendLegend(),
      table: `${casesLeadsSpendDetailTable(rows)}${sourceFootnote("cases-leads-spend")}`
    });
  }

  function casesLeadsSpendSectionHtml() {
    const rows = DATA.casesLeadsSpend || [];
    if (!rows.length) return "";
    const stackReady = channelLeadTotal(findChannelMonthRow(periodToChannelMonth(DATA.period))) != null;
    const freshClass = stackReady ? " kpi-verified kpi-aug-updated" : " kpi-outdated";
    /* One freshness mark on the panel — never also on nested chart cards. */
    return `<article class="kpi-split-panel data-chart-table-panel${freshClass}" data-feedback-id="section-cases-leads-spend" data-feedback-label="#05 Key Channel Activity">
      ${periodFreshMark(stackReady, stackReady, stackReady ? "ok" : "—", resolveTileAsOf("#01"))}
      ${kpiHelpBtn("cases-leads-spend")}
      <div class="kpi-split-panel-body">
        ${chartPairGridHtml(
          salesCostFunnelChartBlockHtml(),
          leadsByChannelPanelHtml()
        )}
        ${chartPairGridHtml(
          reviewsByChannelPanelHtml(),
          costPerResponseChartBlockHtml()
        )}
      </div>
      ${kpiRefMark("#05")}
    </article>`;
  }

  function costPerResponseChartBlockHtml() {
    const pack = tileMonthCostPerResponsePack(DATA.casesLeadsSpend || []);
    if (!pack.channels || !pack.channels.length) return "";
    return chartBlock({
      helpId: "cases-leads-spend",
      title: "Cost per response",
      chart: costPerResponseChart(pack.channels),
      legend: channelLegend(pack.channels.map(c => ({
        name: c.chartLabel || c.label,
        color: c.color
      }))),
      table: costPerResponseDetailTable(DATA.casesLeadsSpend || [])
    });
  }

  function costPerResponseChart(channels) {
    if (!channels || !channels.length) return "";
    const w = 540;
    const h = 260;
    const pad = { l: 84, r: 18, t: 34, b: 58 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const numericValues = channels
      .map(c => Number(c.value))
      .filter(value => Number.isFinite(value) && value >= 0);
    const axisMax = chartAxisMax(numericValues, 50);
    const ticks = axisTicks(axisMax, 5).map(value => {
      const y = pad.t + plotH * (1 - value / axisMax);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 10}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">$${value}</text>
      </g>`;
    }).join("");
    const slot = plotW / channels.length;
    const barW = Math.min(84, slot * 0.56);
    const bars = channels.map((c, i) => {
      const numericValue = Number(c.value);
      const hasValue = c.value != null && Number.isFinite(numericValue);
      const bh = hasValue && numericValue > 0
        ? Math.max(6, (plotH * numericValue) / axisMax)
        : 0;
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const valueLabel = hasValue ? fmtMoney(numericValue) : "—";
      const bar = bh > 0
        ? `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="5" fill="${c.color}"/>`
        : `<line x1="${x}" y1="${pad.t + plotH}" x2="${x + barW}" y2="${pad.t + plotH}" stroke="${c.color}" stroke-width="4"/>`;
      return `<g>
        ${bar}
        <text x="${x + barW / 2}" y="${y - 9}" text-anchor="middle" class="kpi-chart-total">${valueLabel}</text>
        <text x="${x + barW / 2}" y="${h - 28}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(c.chartLabel || c.label)}</text>
        <text x="${x + barW / 2}" y="${h - 12}" text-anchor="middle" class="kpi-chart-axis">${c.unit}</text>
      </g>`;
    }).join("");
    const aria = channels.map(c => `${c.label} ${c.value == null ? "unavailable" : fmtMoney(c.value)} ${c.unit}`).join(", ");
    const axisTitleX = 18;
    const axisTitleY = pad.t + plotH / 2;
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Cost per response: ${aria}">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <text x="${axisTitleX}" y="${axisTitleY}" text-anchor="middle" transform="rotate(-90 ${axisTitleX} ${axisTitleY})" class="kpi-chart-axis">Cost per response ($)</text>
    </svg>`;
  }

  function junCostPerResponseChart(rows) {
    const pack = tileMonthCostPerResponsePack(rows);
    return costPerResponseChart(pack.channels);
  }

  /**
   * Sales Funnel — tapered volume bands + unit-cost accordion.
   * Follows KPI tile month. Direct contacts = Search + HubSpot forms + LSA + Yelp + Justia + Firm website.
   * Search leg prefers funnelAds.phoneCalls when set, else channelMonths.search.
   * Brand colors only — no teal/cyan.
   */
  function salesCostFunnelContactParts(meta) {
    const m = meta || tileMonthMeta();
    const ch = m.ch || {};
    const ads = (DATA.funnelAds && DATA.funnelAds[m.key]) || {};
    const searchFromAds = ads.phoneCalls != null ? Number(ads.phoneCalls) : null;
    const searchFromCh = ch.search != null ? Number(ch.search) : null;
    const search = searchFromAds != null ? searchFromAds : (searchFromCh != null ? searchFromCh : 0);
    const searchKnown = searchFromAds != null || searchFromCh != null;
    const formsRaw = ch.hubspotForms != null ? ch.hubspotForms : ch.hubspot;
    const forms = formsRaw != null ? Number(formsRaw) || 0 : 0;
    const formsKnown = formsRaw != null;
    const lsa = ch.lsa != null ? Number(ch.lsa) || 0 : 0;
    const lsaKnown = ch.lsa != null;
    const yelp = ch.yelp != null ? Number(ch.yelp) || 0 : 0;
    const yelpKnown = ch.yelp != null;
    const justia = ch.justia != null ? Number(ch.justia) || 0 : 0;
    const justiaKnown = ch.justia != null;
    const site = ch.pavLawWebsite != null ? Number(ch.pavLawWebsite) || 0 : 0;
    const siteKnown = ch.pavLawWebsite != null;
    const known = searchKnown || formsKnown || lsaKnown || yelpKnown || justiaKnown || siteKnown;
    const total = search + forms + lsa + yelp + justia + site;
    return {
      search,
      forms,
      lsa,
      yelp,
      justia,
      site,
      total,
      known,
      searchKnown,
      formsKnown,
      lsaKnown,
      yelpKnown,
      justiaKnown,
      siteKnown
    };
  }

  function salesCostFunnelStages() {
    const meta = tileMonthMeta();
    const ch = meta.ch || {};
    const cls = meta.cls || {};
    const ads = (DATA.funnelAds && DATA.funnelAds[meta.key]) || {};
    const parts = salesCostFunnelContactParts(meta);
    const impressions = ads.impressions != null ? Number(ads.impressions) : null;
    const clicks = ads.clicks != null ? Number(ads.clicks) : null;
    const adsSpend = ads.searchSpendLock != null ? Number(ads.searchSpendLock) : null;
    const searchSpend = ch.searchSpend != null
      ? Number(ch.searchSpend) || 0
      : (adsSpend != null ? adsSpend : 0);
    const lsaSpend = Number(ch.lsaSpend) || 0;
    const yelpSpend = Number(ch.yelpSpend) || 0;
    const formFee = parts.forms > 0 ? Number(DATA.websiteHubspotMonthlyFromJun) || 0 : 0;
    const justiaSpend = parts.justia > 0
      ? (ch.justiaSpend != null ? Number(ch.justiaSpend) || 0 : Number(DATA.referralSitesMonthly) || 0)
      : 0;
    const direct = parts.total;
    const directKnown = parts.known;
    const directSpend = searchSpend + lsaSpend + formFee + yelpSpend + justiaSpend;
    const cases = cls.cases != null ? Number(cls.cases) : null;
    const media = searchSpend + lsaSpend;
    const stepPct = (part, whole) =>
      whole ? `${((part / whole) * 100).toFixed(1)}%` : "—";
    const moneyDigits = (n, digits) =>
      "$" + Number(n).toLocaleString("en-US", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
    const adsBasis = ads.windowNote || `${meta.label} Search Ads · not on file`;
    const contactBasis = `${meta.label} Search ${parts.search} + LSA ${parts.lsa} + HubSpot ${parts.forms} + Yelp ${parts.yelp} + Justia ${parts.justia}`;
    const caseBasis = `${meta.label} Search + LSA media`;
    return [
      {
        key: "impr",
        label: "Impressions",
        volume: impressions || 0,
        volumeText: impressions != null ? impressions.toLocaleString("en-US") : "—",
        color: "#3a1a6e",
        unitCost: impressions && adsSpend != null ? moneyDigits(adsSpend / impressions, 2) : "—",
        spend: adsSpend != null ? moneyDigits(adsSpend, 2) : "—",
        spendBasis: adsBasis,
        conversion: "—"
      },
      {
        key: "clicks",
        label: "Clicks",
        volume: clicks || 0,
        volumeText: clicks != null ? clicks.toLocaleString("en-US") : "—",
        color: "#c45c26",
        unitCost: clicks && adsSpend != null ? moneyDigits(adsSpend / clicks, 2) : "—",
        spend: adsSpend != null ? moneyDigits(adsSpend, 2) : "—",
        spendBasis: adsBasis,
        conversion: stepPct(clicks, impressions)
      },
      {
        key: "contacts",
        label: "Direct contacts",
        volume: direct,
        volumeText: directKnown ? String(direct) : "—",
        color: "#1e3a8a",
        unitCost: directKnown && direct && directSpend ? fmtMoney(directSpend / direct) : "—",
        spend: directKnown && directSpend ? fmtMoney(directSpend) : "—",
        spendBasis: contactBasis,
        conversion: "—"
      },
      {
        key: "cases",
        label: "Signed cases",
        volume: cases || 0,
        volumeText: cases != null ? String(cases) : "—",
        color: "#b23a78",
        unitCost: cases && media ? fmtMoney(media / cases) : "—",
        spend: media ? fmtMoney(media) : "—",
        spendBasis: caseBasis,
        conversion: stepPct(cases, directKnown ? direct : null)
      }
    ];
  }

  function salesCostFunnelChannelSpend(meta) {
    const m = meta || tileMonthMeta();
    const ch = m.ch || {};
    const parts = salesCostFunnelContactParts(m);
    const ads = (DATA.funnelAds && DATA.funnelAds[m.key]) || {};
    const adsSpend = ads.searchSpendLock != null ? Number(ads.searchSpendLock) : null;
    const searchSpend = ch.searchSpend != null
      ? Number(ch.searchSpend) || 0
      : (adsSpend != null ? adsSpend : 0);
    const lsaSpend = Number(ch.lsaSpend) || 0;
    const yelpSpend = Number(ch.yelpSpend) || 0;
    const formFee = parts.forms > 0 ? Number(DATA.websiteHubspotMonthlyFromJun) || 0 : 0;
    const justiaSpend = parts.justia > 0
      ? (ch.justiaSpend != null ? Number(ch.justiaSpend) || 0 : Number(DATA.referralSitesMonthly) || 0)
      : 0;
    return {
      parts,
      search: searchSpend,
      lsa: lsaSpend,
      forms: formFee,
      yelp: yelpSpend,
      justia: justiaSpend,
      site: 0,
      total: searchSpend + lsaSpend + formFee + yelpSpend + justiaSpend
    };
  }

  function salesCostFunnelCostPerContact(spend, contacts) {
    if (!contacts || spend == null || !Number.isFinite(Number(spend)) || Number(spend) <= 0) {
      return "—";
    }
    return fmtMoney(Number(spend) / contacts);
  }

  function salesCostFunnelChannelBreakdownTable() {
    const pack = salesCostFunnelChannelSpend();
    const parts = pack && pack.parts;
    if (!parts || !parts.known) return "";
    const row = (label, contacts, spend) => [
      label,
      String(contacts),
      salesCostFunnelCostPerContact(spend, contacts)
    ];
    const rows = [
      row("Search", parts.search, pack.search),
      row("LSA", parts.lsa, pack.lsa),
      row("HubSpot", parts.forms, pack.forms),
      row("Yelp", parts.yelp, pack.yelp),
      row("Justia", parts.justia, pack.justia)
    ];
    if (parts.siteKnown || parts.site > 0) {
      rows.push(row("Firm website", parts.site, pack.site));
    }
    rows.push([
      '<span class="kpi-table-total">Total</span>',
      `<span class="kpi-table-total">${parts.total}</span>`,
      `<span class="kpi-table-total">${salesCostFunnelCostPerContact(pack.total, parts.total)}</span>`
    ]);
    return kpiDetailTable(["Channel", "Contacts", "Cost per conversion"], rows);
  }

  function salesCostFunnelSvg(stages) {
    const n = stages.length;
    const labelCol = 176;
    const chartW = 320;
    const segH = 58;
    const gap = 8;
    const top = 8;
    const height = top + n * segH + (n - 1) * gap;
    const width = labelCol + chartW + 16;
    const cx = labelCol + chartW / 2;
    const topHalf = chartW / 2 - 4;
    const botHalf = 28;
    const bands = stages.map((stage, i) => {
      const t0 = i / n;
      const t1 = (i + 1) / n;
      const half0 = topHalf + (botHalf - topHalf) * t0;
      const half1 = topHalf + (botHalf - topHalf) * t1;
      const y0 = top + i * (segH + gap);
      const y1 = y0 + segH;
      const poly = [
        `${cx - half0},${y0}`,
        `${cx + half0},${y0}`,
        `${cx + half1},${y1}`,
        `${cx - half1},${y1}`
      ].join(" ");
      const midY = (y0 + y1) / 2;
      return `<g>
        <polygon points="${poly}" fill="${stage.color}"/>
        <text x="6" y="${midY}" dominant-baseline="middle" class="kpi-chart-label" style="fill:var(--gg-brown);font-weight:700;font-size:14px">${escapeHtml(stage.label)}</text>
        <text x="${cx}" y="${midY}" dominant-baseline="middle" text-anchor="middle" class="kpi-chart-total" style="fill:#f5efe6;font-size:18px;font-weight:700;paint-order:stroke;stroke:rgba(61,48,40,0.35);stroke-width:2px">${escapeHtml(stage.volumeText)}</text>
      </g>`;
    }).join("");
    const aria = stages.map(s => `${s.label} ${s.volumeText}`).join(", ");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-sales-funnel-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Sales funnel: ${aria}">
      ${bands}
    </svg>`;
  }

  function salesCostFunnelChartBlockHtml() {
    const stages = salesCostFunnelStages();
    return chartBlock({
      helpId: "sales-cost-funnel",
      title: "Sales Funnel",
      chart: salesCostFunnelSvg(stages),
      table: `${salesCostFunnelChannelBreakdownTable()}${sourceFootnote("sales-cost-funnel")}`
    });
  }

  /** Months with both LSA + digital volume & spend (for cost trend). */
  function costCompareMonths(rows) {
    return chronological(
      (rows || [])
        .filter(r => r.leads > 0 && r.adsLeads > 0 && r.lsaSpend > 0 && r.adsSpend > 0)
        .map(r => {
          const lsaCpl = r.lsaSpend / r.leads;
          const digCpl = r.adsSpend / r.adsLeads;
          return {
            month: r.month,
            partial: /\*/.test(r.month || ""),
            lsaCpl,
            digCpl,
            lsaVsDigRatio: lsaCpl / digCpl
          };
        })
    );
  }

  /** Grouped bars: LSA $/call vs digital $/call by month. */
  function lsaVsDigitalCostTrendChart(rows) {
    const months = costCompareMonths(rows);
    if (!months.length) return "";
    const w = 540;
    const h = 260;
    const pad = { l: 54, r: 18, t: 34, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const max = chartAxisMax(months.map(m => Math.max(m.lsaCpl, m.digCpl)));
    const axisMax = max;
    const colors = { lsa: "#1e3a8a", dig: "#c45c26" };
    const ticks = axisTicks(axisMax, 5).map(t => {
      const y = pad.t + plotH * (1 - t / axisMax);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">$${t}</text>
      </g>`;
    }).join("");
    const slot = plotW / months.length;
    const barW = Math.min(28, slot * 0.28);
    const bars = months.map((m, i) => {
      const cx = pad.l + slot * i + slot / 2;
      const lsaH = Math.max(4, (plotH * m.lsaCpl) / axisMax);
      const digH = Math.max(4, (plotH * m.digCpl) / axisMax);
      const lsaY = pad.t + plotH - lsaH;
      const digY = pad.t + plotH - digH;
      const label = m.partial ? `${escapeHtml(m.month)} partial` : escapeHtml(m.month);
      return `<g>
        <rect x="${cx - barW - 3}" y="${lsaY}" width="${barW}" height="${lsaH}" rx="4" fill="${colors.lsa}"/>
        <text x="${cx - barW / 2 - 3}" y="${lsaY - 7}" text-anchor="middle" class="kpi-chart-total">${fmtMoney(m.lsaCpl)}</text>
        <rect x="${cx + 3}" y="${digY}" width="${barW}" height="${digH}" rx="4" fill="${colors.dig}"/>
        <text x="${cx + barW / 2 + 3}" y="${digY - 7}" text-anchor="middle" class="kpi-chart-total">${fmtMoney(m.digCpl)}</text>
        <text x="${cx}" y="${h - 14}" text-anchor="middle" class="kpi-chart-label">${label}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="LSA vs digital cost per call trend by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
      <text x="14" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 14 ${pad.t + plotH / 2})" class="kpi-chart-axis">$/call</text>
    </svg>`;
  }

  function lsaVsDigitalCostTrendLegend() {
    return channelLegend([
      { name: "LSA $/call", color: "#1e3a8a" },
      { name: "Digital $/call", color: "#c45c26" }
    ]);
  }

  function lsaVsDigitalCostTrendNote(rows) {
    const months = costCompareMonths(rows);
    if (!months.length) return "";
    const complete = months.filter(m => !m.partial);
    const blendLsa = complete.reduce((s, m) => s + m.lsaCpl * ((rows.find(r => r.month === m.month) || {}).leads || 0), 0);
    const blendLsaCalls = complete.reduce((s, m) => s + ((rows.find(r => r.month === m.month) || {}).leads || 0), 0);
    const blendDig = complete.reduce((s, m) => s + m.digCpl * ((rows.find(r => r.month === m.month) || {}).adsLeads || 0), 0);
    const blendDigCalls = complete.reduce((s, m) => s + ((rows.find(r => r.month === m.month) || {}).adsLeads || 0), 0);
    const blendRatio = blendDigCalls && blendLsaCalls
      ? (blendLsa / blendLsaCalls) / (blendDig / blendDigCalls)
      : 0;
    const trend = months
      .map(m => `${escapeHtml(m.month)}${m.partial ? " partial" : ""} ${m.lsaVsDigRatio.toFixed(2)}×`)
      .join(" · ");
    const basis = complete.map(m => m.month).join("–") || "complete months";
    return `<p class="data-inline-note">LSA cost ${trend} digital. ${escapeHtml(basis)} blended ratio: ${blendRatio.toFixed(2)}×.</p>`;
  }

  /** Ordinary least-squares line: y ≈ slope * x + intercept. */
  function linearTrendFit(xs, ys) {
    const n = xs.length;
    if (n < 2) return null;
    let sx = 0;
    let sy = 0;
    let sxy = 0;
    let sxx = 0;
    for (let i = 0; i < n; i++) {
      sx += xs[i];
      sy += ys[i];
      sxy += xs[i] * ys[i];
      sxx += xs[i] * xs[i];
    }
    const denom = n * sxx - sx * sx;
    if (!denom) return null;
    const slope = (n * sxy - sx * sy) / denom;
    const intercept = (sy - slope * sx) / n;
    return { slope, intercept };
  }

  function monthChronoIndex(month) {
    const key = String(month || "").replace(/\*$/, "").slice(0, 3);
    const map = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    return Object.prototype.hasOwnProperty.call(map, key) ? map[key] : 0;
  }

  function cashGoalMonthly() {
    const n = Number((DATA.cashCollectedTotals || {}).cashGoalMonthly);
    return Number.isFinite(n) && n > 0 ? n : 100000;
  }

  function cashCollectedChart(rows) {
    rows = chronological(rows);
    if (!rows.length) return "";
    const years = [...new Set(rows.map(r => Number(r.year)).filter(Boolean))];
    const singleYear = years.length === 1 ? years[0] : null;
    const expenseEarly2025 = 35000; /* Jan–Mar */
    const expenseLate2025 = 65000; /* Apr–Dec */
    const cashGoal = 150000;
    const projColor = "#1e3a8a";
    const trendColor = "#1f8a65";
    const expenseColor = "#9a3f14";
    function expenseFor2025Month(month) {
      const key = String(month || "").replace(/\*$/, "");
      return key === "Jan" || key === "Feb" || key === "Mar" ? expenseEarly2025 : expenseLate2025;
    }
    const current = rows.find(r => /\*/.test(r.month || ""));
    const totals = DATA.cashCollectedTotals || {};
    const partialKey = String(totals.partialMonthKey || "").replace(/\*$/, "");
    const tileKey = periodToChannelMonth(DATA.period);
    const daysElapsed = partialKey && tileKey === partialKey
      ? Number(totals.partialDaysElapsed) || 1
      : Number(totals.augDaysElapsed) || Number(totals.partialDaysElapsed) || 12;
    const daysInMonth = partialKey && tileKey === partialKey
      ? Number(totals.partialDaysInMonth) || daysInCalendarMonth(partialKey)
      : Number(totals.augDaysInMonth) || Number(totals.partialDaysInMonth) || 31;
    const currentPace = current
      ? {
          collected: Number(current.credit) || 0,
          projected: Math.round((Number(current.credit) / daysElapsed) * daysInMonth),
          daysElapsed,
          daysInMonth
        }
      : null;
    const max = chartAxisMax([
      ...rows.map(r => r.credit),
      singleYear === 2025 ? expenseLate2025 : cashGoal,
      currentPace ? currentPace.projected : 0
    ]);
    const w = Math.max(720, rows.length * 72 + 110);
    const h = 300;
    const pad = { l: 58, r: 22, t: 50, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / rows.length;
    const barW = Math.min(42, slot * 0.58);
    const ticks = axisTicks(max, 3).map(tick => {
      const y = pad.t + plotH * (1 - tick / max);
      const val = Math.round(tick / 1000);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">$${val}k</text>
      </g>`;
    }).join("");
    const goalY = pad.t + plotH * (1 - cashGoal / max);
    const dividerIndex = Math.max(0, rows.findIndex(r => Number(r.year) === 2026));
    const dividerX = pad.l + dividerIndex * slot;
    const expense2025Segs = [];
    rows.forEach((r, i) => {
      if (Number(r.year) !== 2025) return;
      const level = expenseFor2025Month(r.month);
      const y = pad.t + plotH * (1 - level / max);
      const x1 = pad.l + i * slot;
      const x2 = x1 + slot;
      const prev = expense2025Segs[expense2025Segs.length - 1];
      if (prev && prev.level === level) {
        prev.x2 = x2;
      } else {
        expense2025Segs.push({ level, y, x1, x2 });
      }
    });
    const expenseLineHtml = expense2025Segs.map(seg => {
      const label = seg.level === expenseEarly2025 ? "$35k Jan–Mar" : "$65k Apr–Dec";
      const labelX = seg.level === expenseEarly2025 ? seg.x2 - 4 : seg.x1 + 4;
      const labelAnchor = seg.level === expenseEarly2025 ? "end" : "start";
      return `<g>
        <line x1="${seg.x1}" y1="${seg.y}" x2="${seg.x2}" y2="${seg.y}" stroke="${expenseColor}" stroke-width="2" stroke-dasharray="7 5"/>
        <text x="${labelX}" y="${seg.y - 8}" text-anchor="${labelAnchor}" class="kpi-chart-total" style="fill:${expenseColor}">${label}</text>
      </g>`;
    }).join("");
    const trendYears = singleYear ? [singleYear] : [2025, 2026];
    const trendLineHtml = trendYears.map(year => {
      const pts = [];
      rows.forEach((r, i) => {
        if (Number(r.year) !== year) return;
        const isCurrent = /\*/.test(r.month || "");
        const yVal = isCurrent && currentPace ? currentPace.projected : Number(r.credit) || 0;
        pts.push({
          displayIndex: i,
          chrono: monthChronoIndex(r.month),
          yVal,
          cx: pad.l + i * slot + slot / 2
        });
      });
      if (pts.length < 2) return "";
      const fit = linearTrendFit(pts.map(p => p.chrono), pts.map(p => p.yVal));
      if (!fit) return "";
      const yForChrono = chrono => {
        const yFit = fit.slope * chrono + fit.intercept;
        return pad.t + plotH * (1 - Math.max(0, Math.min(max, yFit)) / max);
      };
      const fitted = pts
        .slice()
        .sort((a, b) => a.displayIndex - b.displayIndex)
        .map(p => `${p.cx.toFixed(1)},${yForChrono(p.chrono).toFixed(1)}`);
      const labelPt = pts.reduce((best, p) => (p.displayIndex < best.displayIndex ? p : best), pts[0]);
      const labelY = yForChrono(labelPt.chrono);
      return `<g class="kpi-cash-trend-${year}" aria-label="${year} cash trend line">
        <polyline points="${fitted.join(" ")}" fill="none" stroke="${trendColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="${labelPt.cx + 10}" y="${Math.max(pad.t + 12, labelY - 10)}" text-anchor="start" class="kpi-chart-total" style="fill:${trendColor}">Trend</text>
      </g>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const isCurrent = /\*/.test(r.month || "");
      const collected = Number(r.credit) || 0;
      const bh = Math.max(6, (plotH * collected) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const fill = cashTierFill(collected) || "#5c4f45";
      const applicableTarget = Number(r.year) === 2026 ? cashGoal : expenseFor2025Month(r.month);
      const cx = x + barW / 2;
      let projection = "";
      if (isCurrent && currentPace && currentPace.projected > collected) {
        const projH = Math.max(bh + 4, (plotH * currentPace.projected) / max);
        const py = pad.t + plotH - projH;
        const diamond = 6;
        projection = `<rect x="${x}" y="${py}" width="${barW}" height="${projH}" rx="4" fill="${projColor}" fill-opacity="0.28"/>
        <line x1="${x - 6}" x2="${x + barW + 6}" y1="${py}" y2="${py}" stroke="${projColor}" stroke-width="2.5"/>
        <rect x="${cx - diamond}" y="${py - diamond}" width="${diamond * 2}" height="${diamond * 2}" transform="rotate(45 ${cx} ${py})" fill="${projColor}"/>
        <text x="${cx}" y="${py - 12}" text-anchor="middle" class="kpi-chart-total" style="fill:${projColor}">$${Math.round(currentPace.projected / 1000)}k proj</text>`;
      }
      const collectedLabelY = y - 8;
      const collectedFill = collected < applicableTarget ? "#cf2d56" : "#3d3028";
      return `<g>
        ${projection}
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${fill}"/>
        <text x="${cx}" y="${collectedLabelY}" text-anchor="middle" class="kpi-chart-total" style="fill:${collectedFill}">$${Math.round(collected / 1000)}k</text>
        <text x="${cx}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    const yearTitle = singleYear != null
      ? ""
      : `<line x1="${dividerX}" y1="10" x2="${dividerX}" y2="${h - pad.b + 10}" stroke="#7a6a58" stroke-width="2" stroke-dasharray="4 6"/>`;
    const showGoal = singleYear == null || singleYear === 2026;
    const goalLineHtml = showGoal
      ? `<line x1="${singleYear === 2026 ? pad.l : dividerX}" y1="${goalY}" x2="${w - pad.r}" y2="${goalY}" stroke="#3a1a6e" stroke-width="2.5" stroke-dasharray="7 5"/>
      <text x="${(singleYear === 2026 ? pad.l : dividerX) + 8}" y="${goalY - 8}" text-anchor="start" class="kpi-chart-total" style="fill:#3a1a6e">$${Math.round(cashGoal / 1000)}k goal</text>`
      : "";
    const ariaYear = singleYear ? String(singleYear) : "selected year";
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-cash-long-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Monthly Revenue">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      ${yearTitle}
      ${goalLineHtml}
      ${expenseLineHtml}
      ${bars}
      ${trendLineHtml}
    </svg>`;
  }

  function casesCreatedChart(rows) {
    rows = chronological(rows);
    if (!rows.length) return "";
    const years = [...new Set(rows.map(r => Number(r.year)).filter(Boolean))];
    const singleYear = years.length === 1 ? years[0] : null;
    const values = rows.filter(r => r.newCases != null).map(r => Number(r.newCases) || 0);
    const max = chartAxisMax(values);
    const w = Math.max(720, rows.length * 72 + 110);
    const h = 290;
    const pad = { l: 58, r: 22, t: 42, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / rows.length;
    const barW = Math.min(42, slot * 0.58);
    const dividerIndex = Math.max(0, rows.findIndex(r => Number(r.year) === 2026));
    const dividerX = pad.l + dividerIndex * slot;
    const ticks = axisTicks(max, 3).map(val => {
      const y = pad.t + plotH * (1 - val / max);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${val}</text>
      </g>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const missing = r.newCases == null;
      const value = missing ? 0 : Number(r.newCases) || 0;
      const bh = missing ? Math.max(34, plotH * 0.18) : Math.max(6, (plotH * value) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const fill = missing ? "#64748b" : "#3a1a6e";
      const label = missing ? "No data" : String(value);
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${fill}"${missing ? ' opacity="0.72"' : ""}/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total" style="fill:${fill}">${escapeHtml(label)}</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    const trendColors = { 2025: "#c45c26", 2026: "#1e3a8a" };
    const trendYears = singleYear ? [singleYear] : [2025, 2026];
    const trendHtml = trendYears.map(year => {
      const stats = casesYearStats(rows, year);
      if (!stats || !stats.fit || stats.months.length < 2) return "";
      const pts = stats.months.map(r => {
        const i = rows.findIndex(x => Number(x.year) === year && x.month === r.month);
        const cx = pad.l + i * slot + slot / 2;
        const yFit = stats.fit.slope * monthChronoIndex(r.month) + stats.fit.intercept;
        const y = pad.t + plotH * (1 - Math.max(0, Math.min(max, yFit)) / max);
        return `${cx.toFixed(1)},${y.toFixed(1)}`;
      });
      const first = stats.months[0];
      const firstI = rows.findIndex(x => Number(x.year) === year && x.month === first.month);
      const firstCx = pad.l + firstI * slot + slot / 2;
      const firstYFit = stats.fit.slope * monthChronoIndex(first.month) + stats.fit.intercept;
      const firstY = pad.t + plotH * (1 - Math.max(0, Math.min(max, firstYFit)) / max);
      const color = trendColors[year];
      return `<g class="kpi-cases-trend-${year}" aria-label="${year} cases trend">
        <polyline points="${pts.join(" ")}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <text x="${firstCx + 8}" y="${Math.max(pad.t + 14, firstY - 8)}" text-anchor="start" class="kpi-chart-total" style="fill:${color}">Trend</text>
      </g>`;
    }).join("");
    const yearTitle = singleYear != null
      ? ""
      : `<line x1="${dividerX}" y1="10" x2="${dividerX}" y2="${h - pad.b + 10}" stroke="var(--secondary)" stroke-width="2" stroke-dasharray="4 6"/>`;
    const ariaYear = singleYear ? String(singleYear) : "comparable months";
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-cash-long-chart kpi-cases-created-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Cases created by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      ${yearTitle}
      ${bars}
      ${trendHtml}
    </svg>`;
  }

  function casesYearStats(rows, year) {
    const months = chronological(rows || []).filter(r =>
      Number(r.year) === year && r.newCases != null && !/\*/.test(String(r.month || ""))
    );
    const values = months.map(r => Number(r.newCases) || 0);
    if (!values.length) return null;
    const total = values.reduce((sum, n) => sum + n, 0);
    const momRatios = [];
    for (let i = 1; i < values.length; i++) {
      if (!values[i - 1]) continue;
      momRatios.push((values[i] - values[i - 1]) / values[i - 1]);
    }
    const avgMom = momRatios.length
      ? momRatios.reduce((sum, n) => sum + n, 0) / momRatios.length
      : null;
    const xs = months.map(r => monthChronoIndex(r.month));
    return {
      year,
      months,
      span: `${String(months[0].month).replace(/\*$/, "")}–${String(months[months.length - 1].month).replace(/\*$/, "")}`,
      total,
      avg: total / values.length,
      avgMom,
      fit: linearTrendFit(xs, values)
    };
  }

  function fmtSignedPct(ratio) {
    if (ratio == null || !Number.isFinite(ratio)) return "—";
    const pct = Math.round(ratio * 100);
    return `${pct > 0 ? "+" : ""}${pct}%`;
  }

  function casesTrendSlopeLabel(fit) {
    if (!fit || !Number.isFinite(fit.slope)) return "—";
    if (Math.abs(fit.slope) < 0.05) return "Flat";
    const n = Math.round(fit.slope * 10) / 10;
    return `${n > 0 ? "+" : ""}${n} cases/mo`;
  }

  function casesCreatedTrendTable(rows) {
    const years = [2025, 2026].map(year => casesYearStats(rows, year)).filter(Boolean);
    const partial = chronological(rows || []).find(r =>
      Number(r.year) === 2026 && r.newCases != null && /\*/.test(String(r.month || ""))
    );
    const body = years.map(s => [
      String(s.year),
      escapeHtml(s.span),
      String(s.total),
      String(Math.round(s.avg)),
      fmtSignedPct(s.avgMom),
      escapeHtml(casesTrendSlopeLabel(s.fit))
    ]);
    if (partial) {
      body.push([
        `2026 ${String(partial.month || "Sep*").replace(/\*$/, "")}*`,
        "MTD through export",
        String(partial.newCases),
        "—",
        "—",
        "Not in trend"
      ]);
    }
    return kpiDetailTable(
      ["Year", "Span", "Total", "Avg / month", "Avg MoM", "Trend"],
      body
    );
  }

  function cashCollectedTable(rows) {
    return kpiDetailAccordion(
      "Cash Table",
      `${(rows || []).length} months`,
      ["Month", "Revenue", "New cases", "Revenue / new case"],
      newestFirst(rows).map(r => {
        const per = r.newCases ? r.credit / r.newCases : null;
        return [
          escapeHtml(r.month),
          fmtCashTier(r.credit),
          r.newCases != null ? String(r.newCases) : "—",
          per != null ? fmtMoney(per) : "—"
        ];
      }),
      true
    );
  }

  function lsaEfficiencyTable(rows) {
    const newest = chronological(rows);
    const tot = newest.reduce((a, r) => ({
      leads: a.leads + (Number(r.leads) || 0),
      charged: a.charged + (Number(r.charged) || 0),
      lsaSpend: a.lsaSpend + (Number(r.lsaSpend) || 0)
    }), { leads: 0, charged: 0, lsaSpend: 0 });
    const overall = DATA.lsaChargeRateOverall || {};
    const moneyOrDash = n => n == null || !Number.isFinite(Number(n)) ? "—" : fmtMoney(n);
    return kpiDetailTable(
      ["Period", "LSA leads", "Charged", "Charge rate", "LSA media", "LSA media / charged lead"],
      [
        ...newest.map(r => [
          escapeHtml(r.month) + " 2026",
          String(r.leads),
          String(r.charged),
          Math.round((r.charged / r.leads) * 100) + "%",
          moneyOrDash(r.lsaSpend),
          r.charged && r.lsaSpend != null ? fmtMoney(r.lsaSpend / r.charged) : "—"
        ]),
        [
          "May–Aug* totals",
          String(tot.leads),
          String(tot.charged),
          Math.round((tot.charged / tot.leads) * 100) + "%",
          tot.lsaSpend ? fmtMoney(tot.lsaSpend) : "—",
          tot.charged && tot.lsaSpend ? fmtMoney(tot.lsaSpend / tot.charged) : "—"
        ],
        [
          "May–Aug* overall",
          String(overall.leads || tot.leads),
          String(overall.charged || tot.charged),
          (overall.pct != null ? overall.pct + "%" : "—"),
          "—",
          "—"
        ]
      ]
    );
  }

  function lsaChargeRateSectionHtml() {
    const rows = DATA.lsaEfficiency || [];
    if (!rows.length) return "";
    return `<section class="kpi-section kpi-section-static" data-feedback-id="section-lsa-charge-rate" data-feedback-label="#13 LSA % charged">
      <div class="kpi-section-body">
        <article class="kpi-split-panel data-chart-table-panel kpi-aug-updated" data-feedback-id="section-lsa-charge-table" data-feedback-label="#13 LSA charge rate table">
          ${augUpdatedMark()}
          ${kpiHelpBtn("#13")}
          <div class="kpi-split-panel-body">
            ${chartBlock({
              focus: "#13",
              title: "LSA charge rate",
              table: lsaEfficiencyTable(rows)
            })}
            <p class="data-inline-note">Jul full LSA media from account_activities_202607(2). Aug* from account_activities_202608(3) through Aug 24 · inbox(3) through Aug 21.</p>
          </div>
          ${kpiRefMark("#13")}
        </article>
      </div>
    </section>`;
  }

  function trustApplicationsChart(rows) {
    rows = chronological(rows);
    const max = chartAxisMax(rows.map(r => r.applications || 0));
    const w = 720;
    const h = 220;
    const pad = { l: 58, r: 16, t: 28, b: 52 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / rows.length;
    const barW = Math.max(4, Math.min(22, slot * 0.7));
    const ticks = [0, 0.5, 1].map(p => {
      const y = pad.t + plotH * (1 - p);
      const val = Math.round((max * p) / 1000);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">$${val}k</text>
      </g>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const isCurrent = /\*/.test(r.month || "");
      const amt = r.applications || 0;
      const bh = amt ? Math.max(3, (plotH * amt) / max) : 0;
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const short = String(r.month || "").replace(" 20", " '").replace("Jul*", "Jul*");
      return `<g>
        ${bh ? `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="2" fill="${isCurrent ? "#1e3a8a" : "#7a6a58"}"/>` : ""}
        <text x="${x + barW / 2}" y="${h - 8}" text-anchor="middle" class="kpi-chart-label" transform="rotate(-55 ${x + barW / 2} ${h - 8})" style="font-size:8px">${escapeHtml(short)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Trust applications by month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
    </svg>`;
  }

  function trustTransfersTable(trust) {
    const rows = trust.monthly || [];
    const y2025 = rows.filter(r => /2025/.test(r.month));
    const y2026 = rows.filter(r => /2026/.test(r.month));
    const sumApps = list => list.reduce((s, r) => s + (r.applications || 0), 0);
    const sumRows = list => list.reduce((s, r) => s + (r.rows || 0), 0);
    const active = rows.filter(r => (r.applications || 0) > 0);
    const snap = trust.snapshot || {};
    return `
      ${kpiDetailTable(
        ["Window", "Trust applications", "Ledger rows"],
        [
          ...active.map(r => [
            escapeHtml(r.month),
            fmtMoney(r.applications),
            String(r.rows)
          ]),
          ["2025 total (ledger)", fmtMoney(sumApps(y2025)), String(sumRows(y2025))],
          ["2026 to date through Aug 24", fmtMoney(sumApps(y2026)), String(sumRows(y2026))]
        ]
      )}
      ${kpiDetailTable(
        ["Client trust snapshot", "Value"],
        [
          [`As of ${escapeHtml(snap.asOf || "—")}`, "MyCase Contact export"],
          ["Clients with trust balance", String(snap.clientsWithBalance || "—")],
          ["Trust still on books", fmtMoney(snap.totalBalance || 0)],
          ["Mean trust balance", fmtMoney(snap.meanBalance || 0)]
        ]
      )}
      <p class="data-inline-note"><strong>Range:</strong> ledger ${escapeHtml(trust.rangeStart || "")} → ${escapeHtml(trust.rangeEnd || "")} · ${escapeHtml(trust.method || "Payment Method = Trust")}. Bars = trust applied to invoices (debits), not new cash. Insight: Jun–Jul 2025 carried almost all applications ($${Math.round(sumApps(y2025) / 1000)}k); 2026 YTD is nearly quiet ($${Math.round(sumApps(y2026) / 1000)}k) while ~$${Math.round((snap.totalBalance || 0) / 1000)}k remains on Client trust balances.</p>
    `;
  }

  function cashAndCasesChartRows() {
    return [
      ...(DATA.cashCollected || []).map(row => ({ ...row, year: 2025 })),
      ...(DATA.cashCollected2026Ytd || []).map(row => ({ ...row, year: 2026 }))
    ];
  }

  function cashCollectedYearToggleHtml() {
    const y = Number(cashCollectedViewYear) === 2025 ? 2025 : 2026;
    return `<div class="kpi-report-pills kpi-cash-year-pills" role="group" aria-label="Monthly revenue year">
      <button type="button" class="kpi-report-pill${y === 2026 ? " is-active" : ""}" data-cash-year="2026" aria-pressed="${y === 2026 ? "true" : "false"}">2026</button>
      <button type="button" class="kpi-report-pill${y === 2025 ? " is-active" : ""}" data-cash-year="2025" aria-pressed="${y === 2025 ? "true" : "false"}">2025</button>
    </div>`;
  }

  function setCashCollectedYear(year) {
    const next = Number(year) === 2025 ? 2025 : 2026;
    if (cashCollectedViewYear === next) return;
    cashCollectedViewYear = next;
    const el = document.getElementById("kpi-report-data");
    if (el) renderData(el, { force: true });
  }

  function cashCollectedDataSectionHtml() {
    const year = Number(cashCollectedViewYear) === 2025 ? 2025 : 2026;
    const chartRows = cashAndCasesChartRows().filter(r => Number(r.year) === year);
    const tableRows = year === 2026
      ? (DATA.cashCollected2026Ytd || []).map(row => ({ ...row, year: 2026 }))
      : (DATA.cashCollected || []).map(row => ({ ...row, year: 2025 }));
    if (!chartRows.length && !tableRows.length) return "";
    const ledgerHint = formatPulledMd(cashLedgerAsOf());
    /* Do not gray the whole Finances block when ledger MTD is older than the KPI recheck.
       Green = cash months on file. Partial Sep* stays labeled in the chart/table. */
    const hasCash = !!(chartRows.length || tableRows.length);
    const legendGoal = year === 2026
      ? `<li><span class="kpi-stack-swatch" style="background:#3a1a6e" aria-hidden="true"></span><span>$150k goal</span></li>`
      : `<li><span class="kpi-stack-swatch" style="background:#9a3f14" aria-hidden="true"></span><span>Expense pace</span></li>`;
    return `<section class="kpi-section kpi-section-static${hasCash ? " kpi-verified kpi-aug-updated" : ""}" data-feedback-id="section-finances" data-feedback-label="Finances">
      ${hasCash ? freshMark() : staleMark()}
      ${kpiSectionStaticHead("Finances", ledgerHint ? `Trust activity through ${ledgerHint}` : "Monthly revenue")}
      <div class="kpi-section-body">
        ${cashCollectedYearToggleHtml()}
        <div class="data-chart-table-stack">
          ${chartBlock({
            helpId: "cash-collected",
            title: "Monthly Revenue",
            chart: cashCollectedChart(chartRows),
            legend: `<ul class="kpi-stack-legend" aria-label="Cash chart marks">
              <li><span class="kpi-stack-swatch" style="background:#5c4f45" aria-hidden="true"></span><span>Revenue</span></li>
              <li><span class="kpi-stack-swatch" style="background:#1e3a8a" aria-hidden="true"></span><span>Projected</span></li>
              ${legendGoal}
            </ul>`,
            table: cashCollectedTable(tableRows, String(year))
          })}
          ${roasMonthlyPanelHtml()}
        </div>
        ${sourceFootnote("financial")}
      </div>
    </section>`;
  }

  function financialSectionHtml() {
    return cashCollectedDataSectionHtml();
  }

  function cashCollectedSectionHtml() {
    return cashCollectedDataSectionHtml();
  }

  function stackedSeriesDetailTable(series, opts) {
    const firstCol = (opts && opts.firstCol) || "Lead type";
    const totalMom = opts && opts.totalMom;
    const mayTotal = series.reduce((s, c) => s + c.prior, 0);
    const junTotal = series.reduce((s, c) => s + c.count, 0);
    const momLabel = totalMom != null
      ? totalMom
      : (mayTotal ? ((junTotal - mayTotal) / mayTotal >= 0 ? "+" : "") + Math.round(((junTotal - mayTotal) / mayTotal) * 100) + "%" : "—");
    const rows = series.map(c => [
      `<span class="kpi-stack-swatch" style="background:${c.color}" aria-hidden="true"></span> ${escapeHtml(c.name)}`,
      String(c.prior),
      String(c.count),
      String(c.count - c.prior >= 0 ? "+" + (c.count - c.prior) : c.count - c.prior),
      momChangeHtml(c.mom) || "—",
      escapeHtml(c.spend)
    ]);
    rows.push([
      '<span class="kpi-table-total">Total</span>',
      `<span class="kpi-table-total">${mayTotal}</span>`,
      `<span class="kpi-table-total">${junTotal}</span>`,
      `<span class="kpi-table-total">${junTotal - mayTotal >= 0 ? "+" : ""}${junTotal - mayTotal}</span>`,
      momChangeHtml(momLabel) || "—",
      "—"
    ]);
    return kpiDetailTable(
      [firstCol, "May", "Jun", "Δ", "Change", "Spend"],
      rows
    );
  }

  function channelsDetailTable(channels) {
    const months = DATA.channelMonths ? chronological(DATA.channelMonths) : null;
    if (months && months.length >= 3) {
      const keys = [
        { key: "search", name: "Search calls", color: "#3a1a6e" },
        { key: "lsa", name: "LSA calls", color: "#1e3a8a" },
        { key: "hubspot", name: "HubSpot forms", color: "#b23a78" },
        { key: "yelp", name: "Yelp", color: "#64748b" },
        { key: "justia", name: "Justia", color: "#6a5acd" }
      ];
      const monthLabels = months.map(m => m.month);
      const rows = keys.map(k => {
        const vals = months.map(m => Number(m[k.key]) || 0);
        return [
          `<span class="kpi-stack-swatch" style="background:${k.color}" aria-hidden="true"></span> ${escapeHtml(k.name)}`,
          ...vals.map(String)
        ];
      });
      const totals = months.map(m =>
        (Number(m.search) || 0) +
        (Number(m.lsa) || 0) +
        (Number(m.hubspot) || 0) +
        (Number(m.yelp) || 0) +
        (Number(m.justia) || 0) +
        (Number(m.pavLawWebsite) || 0)
      );
      rows.push([
        '<span class="kpi-table-total">Total</span>',
        ...totals.map(t => `<span class="kpi-table-total">${t}</span>`)
      ]);
      return kpiDetailTable(
        ["Lead type", ...monthLabels],
        rows
      );
    }
    return stackedSeriesDetailTable(channels, { firstCol: "Lead type" });
  }

  function campaignLeadsDetailTable(campaigns) {
    return stackedSeriesDetailTable(campaigns, { firstCol: "Campaign" });
  }

  function sourceMixDetailTable(segments) {
    const rate = DATA.phoneIntake.leadToCaseRate;
    const fee = DATA.phoneIntake.avgCaseFee;
    const estRev = count => Math.round(Number(count || 0) * rate * fee);
    const leadRows = segments.map(s => [
      `<span class="kpi-stack-swatch" style="background:${s.color}" aria-hidden="true"></span> ${escapeHtml(s.name)}`,
      String(s.count != null ? s.count : "—"),
      `${s.pct}%`,
      s.count != null ? fmtMoney(estRev(s.count)) : "—"
    ]);
    const leadTotal = segments.reduce((n, s) => n + (Number(s.count) || 0), 0);
    const revTotal = estRev(leadTotal);
    leadRows.push([
      '<span class="kpi-table-total">Total</span>',
      `<span class="kpi-table-total">${leadTotal}</span>`,
      '<span class="kpi-table-total">100%</span>',
      `<span class="kpi-table-total">${fmtMoney(revTotal)}</span>`
    ]);
    const momRows = segments.map(s => {
      const prior = Number(s.prior) || 0;
      const curr = Number(s.count) || 0;
      const delta = curr - prior;
      const deltaLabel = delta === 0 ? "0" : (delta > 0 ? `+${delta}` : String(delta));
      return [
        `<span class="kpi-stack-swatch" style="background:${s.color}" aria-hidden="true"></span> ${escapeHtml(s.name)}`,
        String(prior || "—"),
        String(curr || "—"),
        deltaLabel,
        s.mom ? momChangeHtml(s.mom) : "—"
      ];
    });
    const priorTotal = segments.reduce((n, s) => n + (Number(s.prior) || 0), 0);
    const momTotalPct = priorTotal
      ? `${leadTotal - priorTotal >= 0 ? "+" : ""}${Math.round(((leadTotal - priorTotal) / priorTotal) * 100)}%`
      : "—";
    momRows.push([
      '<span class="kpi-table-total">Total</span>',
      `<span class="kpi-table-total">${priorTotal}</span>`,
      `<span class="kpi-table-total">${leadTotal}</span>`,
      `<span class="kpi-table-total">${leadTotal - priorTotal >= 0 ? "+" : ""}${leadTotal - priorTotal}</span>`,
      momChangeHtml(momTotalPct) || "—"
    ]);
    return (
      kpiDetailTable(["Source", "Leads", "Share", "Est. potential revenue"], leadRows) +
      `<h4 class="kpi-subtable-title">Month comparison</h4>` +
      kpiDetailTable(["Source", "Prior", "Current", "Δ leads", "Change"], momRows)
    );
  }

  function campaignDetailTable(items) {
    const total = items.reduce((s, i) => s + i.count, 0);
    const rows = items.map(i => [
      `<span class="kpi-stack-swatch" style="background:${i.color}" aria-hidden="true"></span> ${escapeHtml(i.name)}`,
      String(i.count),
      total ? `${Math.round((i.count / total) * 100)}%` : "—"
    ]);
    rows.push(['<span class="kpi-table-total">Total</span>', `<span class="kpi-table-total">${total}</span>`, '<span class="kpi-table-total">100%</span>']);
    return kpiDetailTable(["Campaign", "Calls", "Share"], rows);
  }

  function donutChart(segments) {
    const r = 42;
    const cx = 56;
    const cy = 56;
    let angle = -Math.PI / 2;
    const arcs = segments.map(seg => {
      const slice = (seg.pct / 100) * Math.PI * 2;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      angle += slice;
      const x2 = cx + r * Math.cos(angle);
      const y2 = cy + r * Math.sin(angle);
      const large = slice > Math.PI ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      return `<path d="${d}" fill="${seg.color}"/>`;
    }).join("");
    const legend = segments.map((seg, i) =>
      `<span class="kpi-donut-legend-item"><span class="kpi-donut-swatch" style="background:${seg.color}"></span>${seg.name} ${seg.pct}%</span>`
    ).join("");
    return `<div class="kpi-donut-wrap">
      <svg class="kpi-donut-svg" viewBox="0 0 112 112" width="112" height="112" role="img" aria-label="Mix donut">${arcs}<circle cx="${cx}" cy="${cy}" r="24" fill="var(--gg-paper)"/></svg>
      <div class="kpi-donut-legend">${legend}</div>
    </div>`;
  }

  function horizontalBarChart(items) {
    const max = chartAxisMax(items.map(i => i.count));
    const rows = items.map((item, i) => {
      const y = 8 + i * 28;
      const bw = Math.max(8, (item.count / max) * 180);
      return `<g>
        <text x="0" y="${y + 14}" class="kpi-chart-axis">${item.name}</text>
        <rect x="72" y="${y}" width="${bw}" height="18" rx="4" fill="${item.color}"/>
        <text x="${72 + bw + 6}" y="${y + 14}" class="kpi-chart-val-sm">${item.count}</text>
      </g>`;
    }).join("");
    const h = items.length * 28 + 8;
    return `<svg class="kpi-chart-svg" viewBox="0 0 240 ${h}" role="img" aria-label="Search calls by campaign">${rows}</svg>`;
  }

  function missedRevenueModel(pi) {
    const p = pi || DATA.phoneIntake;
    const missed = Number(p.missedSearchCalls != null ? p.missedSearchCalls : p.missedLsaCalls);
    const priorMissed = Number(p.priorMissedSearchCalls != null ? p.priorMissedSearchCalls : p.priorMissedLsaCalls);
    const close = Number(p.closeRateEst != null ? p.closeRateEst : p.leadToCaseRate);
    const fee = Number(p.avgCaseFee);
    const monthlyLost = Math.round(missed * close * fee);
    const priorMonthlyLost = Math.round(priorMissed * close * fee);
    const closePct = (close * 100).toFixed(close * 100 < 10 ? 1 : 0);
    const monthKeys = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const tileKey = periodToChannelMonth(DATA.period);
    const tileIdx = Math.max(0, monthKeys.indexOf(tileKey));
    const qStart = Math.floor(tileIdx / 3) * 3;
    const qKeys = monthKeys.slice(qStart, qStart + 3);
    const ytdKeys = monthKeys.slice(0, tileIdx + 1);
    const phone = DATA.phoneByMonth || {};
    const missedSum = keys => keys.reduce((sum, key) => {
      const row = phone[key];
      return sum + (row ? Number(row.missed) || 0 : 0);
    }, 0);
    const quarterLost = Math.round(missedSum(qKeys) * close * fee);
    const yearLost = Math.round(missedSum(ytdKeys) * close * fee);
    const cumulativeYtd = p.cumulativeYtd != null
      ? Number(p.cumulativeYtd)
      : yearLost;
    return {
      missedSearchCalls: missed,
      missedLsaCalls: missed,
      priorMissedSearchCalls: priorMissed,
      priorMissedLsaCalls: priorMissed,
      closeRateEst: close,
      avgCaseFee: fee,
      monthlyLost,
      priorMonthlyLost,
      quarterLost,
      yearLost,
      cumulativeYtd,
      formulaText: `Missed Search calls × ${closePct}% lead→case × avg case value`,
      formulaWorked: `${missed} × ${closePct}% × ${fmtMoney(fee)} = ${fmtMoney(monthlyLost)}/mo`
    };
  }

  function missedRevenuePanel(pi) {
    const model = missedRevenueModel(pi);
    const momLabel = pi.missedMomPp < 0
      ? `↓ ${Math.abs(pi.missedMomPp)} pp fewer missed`
      : pi.missedMomPp > 0
        ? `↑ +${pi.missedMomPp} pp more missed`
        : "No change";
    const momClassName = pi.missedMomPp <= 0 ? "kpi-mom-up" : "kpi-mom-down";
    const maxLost = Math.max(model.monthlyLost, model.priorMonthlyLost, model.cumulativeYtd / 6, 1);
    const priorW = Math.max(12, (model.priorMonthlyLost / maxLost) * 160);
    const currW = Math.max(12, (model.monthlyLost / maxLost) * 160);
    const cumW = Math.max(12, (model.cumulativeYtd / (maxLost * 6)) * 160);
    return `<div class="kpi-missed-panel">
      <div class="kpi-missed-stats">
        <div class="kpi-missed-stat">
          <span class="kpi-missed-label">Missed calls</span>
          <span class="kpi-missed-val">${pi.missedPct}%</span>
          <span class="kpi-missed-sub">goal ≤ ${pi.missedTargetPct}% · was ${pi.priorMissedPct}% prior month · <span class="${momClassName}">${momLabel}</span></span>
        </div>
        <div class="kpi-missed-stat">
          <span class="kpi-missed-label">Est. revenue lost (Jun)</span>
          <span class="kpi-missed-val">${fmtMoney(model.monthlyLost)}</span>
          <span class="kpi-missed-sub">was ${fmtMoney(model.priorMonthlyLost)} prior month</span>
        </div>
        <div class="kpi-missed-stat">
          <span class="kpi-missed-label">Cumulative YTD lost</span>
          <span class="kpi-missed-val">${fmtMoney(model.cumulativeYtd)}</span>
          <span class="kpi-missed-sub">${escapeHtml(model.formulaText)}</span>
        </div>
      </div>
      <svg class="kpi-chart-svg" viewBox="0 0 260 100" role="img" aria-label="Missed revenue comparison">
        <text x="0" y="14" class="kpi-chart-axis">Prior mo lost</text>
        <rect x="88" y="4" width="${priorW}" height="16" rx="4" fill="#3a1a6e" opacity="0.45"/>
        <text x="${88 + priorW + 6}" y="16" class="kpi-chart-val-sm">${fmtMoney(model.priorMonthlyLost)}</text>
        <text x="0" y="44" class="kpi-chart-axis">Jun lost</text>
        <rect x="88" y="34" width="${currW}" height="16" rx="4" fill="#3a1a6e"/>
        <text x="${88 + currW + 6}" y="46" class="kpi-chart-val-sm">${fmtMoney(model.monthlyLost)}</text>
        <text x="0" y="74" class="kpi-chart-axis">YTD cumulative</text>
        <rect x="88" y="64" width="${cumW}" height="16" rx="4" fill="#c45c26"/>
        <text x="${88 + cumW + 6}" y="76" class="kpi-chart-val-sm">${fmtMoney(model.cumulativeYtd)}</text>
      </svg>
      ${kpiDetailTable(
        ["Measure", "Value", "Notes"],
        [
          ["Missed Search calls", String(model.missedSearchCalls), `rate ${pi.missedPct}% · goal ≤ ${pi.missedTargetPct}%`],
          ["Lead→case", `${(model.closeRateEst * 100).toFixed(1)}%`, "ADS-LSA lock"],
          ["Avg case value", fmtMoney(model.avgCaseFee), "KPI #28"],
          ["Est. lost (Jun)", fmtMoney(model.monthlyLost), escapeHtml(model.formulaWorked)],
          ["YTD cumulative", fmtMoney(model.cumulativeYtd), "109 missed May–Jul"]
        ]
      )}
    </div>`;
  }

  function momClass(mom) {
    if (!mom) return "";
    const s = String(mom).trim();
    if (/^[+↑]/.test(s)) return "kpi-mom-up";
    if (/^[-−↓]/.test(s) || s.startsWith("-")) return "kpi-mom-down";
    return "";
  }

  /** Small change label: black regular-weight arrow + percent — no “MoM” label. */
  function momChangeHtml(mom) {
    if (mom == null || mom === "") return "";
    const raw = String(mom).trim();
    if (!raw || raw === "—" || raw === "-") return "";
    const cls = momClass(raw);
    const val = raw.replace(/^[↑↓]\s*/, "");
    const num = parseFloat(val.replace(/[^0-9.\-−]/g, "").replace("−", "-"));
    let arrow = "";
    if (cls === "kpi-mom-up" || (Number.isFinite(num) && num > 0)) arrow = "↑";
    else if (cls === "kpi-mom-down" || (Number.isFinite(num) && num < 0)) arrow = "↓";
    const tone = arrow === "↑" ? "kpi-mom-up" : arrow === "↓" ? "kpi-mom-down" : "kpi-mom-flat";
    return `<span class="kpi-mom-change ${tone}"><span class="kpi-mom-arrow" aria-hidden="true">${arrow}</span><span class="kpi-mom-pct">${escapeHtml(val)}</span></span>`;
  }

  function metricWithDeltaHtml(mainHtml, mom) {
    const delta = momChangeHtml(mom);
    if (!delta) return mainHtml;
    return `<div class="kpi-metric-with-delta">${mainHtml}${delta}</div>`;
  }

  function metricWithPaceHtml(mainHtml, k) {
    if (!k || !k.trackLabel) return mainHtml;
    const tone = k.trackOn ? "kpi-pace-on" : "kpi-pace-behind";
    return `<div class="kpi-metric-with-delta">${mainHtml}<span class="kpi-pace-status ${tone}">${escapeHtml(k.trackLabel)}</span></div>`;
  }

  function presenceLabel(status) {
    const map = {
      active: "Listed",
      building: "Listed",
      updated: "Updated",
      outdated: "Outdated",
      "not wired": "Unlisted",
      "not on": "Unlisted"
    };
    return map[status] || status || "—";
  }

  /** Listed · Updated · Unlisted · Outdated. Stable within each bucket. */
  function presenceStatusSortRank(status) {
    const label = presenceLabel(status);
    if (label === "Listed") return 0;
    if (label === "Updated") return 1;
    if (label === "Unlisted") return 2;
    if (label === "Outdated") return 3;
    return 4;
  }

  function sortByPresenceStatus(rows) {
    return (rows || []).slice().sort((a, b) =>
      presenceStatusSortRank(a && a.status) - presenceStatusSortRank(b && b.status)
    );
  }

  /** Collapse tracking-only "not wired" into Unlisted for the presence pie. */
  function presenceBucket(status) {
    const s = status || "not on";
    if (s === "active" || s === "building" || s === "updated") return "active";
    if (s === "outdated") return "outdated";
    return "not on";
  }

  const PRESENCE_PIE_COLORS = {
    active: "#1f8a65",
    outdated: "#4c1d95",
    "not on": "#3a1a6e"
  };

  function presencePieSegments(rows) {
    const counts = {};
    (rows || []).forEach(r => {
      const k = presenceBucket(r.status);
      counts[k] = (counts[k] || 0) + 1;
    });
    const keys = ["active", "not on", "outdated"].filter(k => counts[k]);
    const total = keys.reduce((s, k) => s + counts[k], 0) || 1;
    let allocated = 0;
    return keys.map((status, i) => {
      let pct = Math.round((counts[status] / total) * 100);
      if (i === keys.length - 1) pct = Math.max(0, 100 - allocated);
      allocated += pct;
      return {
        name: presenceLabel(status),
        pct,
        color: PRESENCE_PIE_COLORS[status] || "#3a1a6e",
        count: counts[status]
      };
    });
  }

  function dash(v) {
    return v == null || v === "" ? "—" : v;
  }

  function halfMoonPoint(cx, cy, r, progress) {
    const angle = Math.PI * (1 - progress);
    return { x: cx + r * Math.cos(angle), y: cy - r * Math.sin(angle) };
  }

  function halfMoonPath(cx, cy, r, progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    const steps = Math.max(2, Math.ceil(40 * clamped));
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const p = halfMoonPoint(cx, cy, r, (clamped * i) / steps);
      d += (i === 0 ? "M" : " L") + ` ${p.x} ${p.y}`;
    }
    return d;
  }

  function halfMoonFillPath(cx, cy, r, progress) {
    const clamped = Math.max(0, Math.min(1, progress));
    const left = halfMoonPoint(cx, cy, r, 0);
    const right = halfMoonPoint(cx, cy, r, 1);
    if (clamped <= 0) return "";
    if (clamped >= 1) {
      return `${halfMoonPath(cx, cy, r, 1)} L ${right.x} ${cy} L ${left.x} ${cy} Z`;
    }
    const end = halfMoonPoint(cx, cy, r, clamped);
    return `${halfMoonPath(cx, cy, r, clamped)} L ${end.x} ${cy} L ${left.x} ${cy} Z`;
  }

  const SUCCESS_GAUGE = { pale: "#b7e4d2", mid: "#4fb58f", dark: "#1f8a65" };
  const PROGRESS_GAUGE = { red: "#cf2d56", mid: "#eab308", green: "#1f8a65" };

  function halfMoonGauge(pct, gradId, options) {
    const opts = options || {};
    const clamped = Math.max(0, Math.min(1, pct));
    const celebrate = !!(opts.celebrate || clamped >= 1);
    const cx = 94;
    const cy = 88;
    const r = 58;
    const strokeW = 12;
    const left = halfMoonPoint(cx, cy, r, 0);
    const right = halfMoonPoint(cx, cy, r, 1);
    const rimGradId = `${gradId}-rim`;
    const successStops = `<stop offset="0%" stop-color="${SUCCESS_GAUGE.pale}"/><stop offset="40%" stop-color="${SUCCESS_GAUGE.mid}"/><stop offset="100%" stop-color="${SUCCESS_GAUGE.dark}"/>`;
    const progressStops = `<stop offset="0%" stop-color="${PROGRESS_GAUGE.red}"/><stop offset="45%" stop-color="${PROGRESS_GAUGE.mid}"/><stop offset="100%" stop-color="${PROGRESS_GAUGE.green}"/>`;
    const fillAmt = celebrate && opts.goalMark == null ? 1 : clamped;
    const arcLen = Math.PI * r;
    const dashLen = Math.max(0, Math.min(arcLen, fillAmt * arcLen));
    const endLabel = opts.endLabel != null ? opts.endLabel : "";
    const valueLabel = opts.valueLabel != null ? String(opts.valueLabel) : "";
    const centerClass = opts.centerClass ? `kpi-gauge-center ${opts.centerClass}` : "kpi-gauge-center";
    const aria = celebrate ? "Target reached" : "Progress rim gauge";
    const track = "var(--gg-cream-panel)";
    const arcD = `M ${left.x} ${left.y} A ${r} ${r} 0 0 1 ${right.x} ${right.y}`;
    const shadowPct = opts.shadowPct == null ? null : Math.max(0, Math.min(1, Number(opts.shadowPct)));
    const shadowDash = shadowPct != null && Number.isFinite(shadowPct)
      ? Math.max(0, Math.min(arcLen, shadowPct * arcLen))
      : null;
    const shadowSvg = shadowDash != null && shadowDash > 0
      ? `<path class="kpi-gauge-shadow" d="${arcD}" fill="none" stroke-width="${strokeW}" stroke-linecap="round" stroke-dasharray="${shadowDash.toFixed(2)} ${(arcLen + 1).toFixed(2)}"/>`
      : "";
    /* In-progress arcs use red→caution→positive gradient. Solid green only on celebrate / target hit. */
    function gaugeTickLine(t) {
      const p = Math.max(0, Math.min(1, Number(t)));
      const inner = halfMoonPoint(cx, cy, r - strokeW / 2 - 2, p);
      const outer = halfMoonPoint(cx, cy, r + strokeW / 2 + 6, p);
      return `<line x1="${inner.x.toFixed(1)}" y1="${inner.y.toFixed(1)}" x2="${outer.x.toFixed(1)}" y2="${outer.y.toFixed(1)}" class="kpi-gauge-goal-mark"/>`;
    }
    let goalSvg = "";
    if (opts.goalMark != null && Number.isFinite(Number(opts.goalMark))) {
      const g = Math.max(0, Math.min(1, Number(opts.goalMark)));
      goalSvg = gaugeTickLine(g);
      /* Label the goal tick when it is not sitting on the end scale mark. */
      const goalLabel = opts.goalLabel != null ? String(opts.goalLabel).trim() : "";
      const atEnd = g >= 0.97 || g <= 0.03;
      const sameAsEnd = goalLabel !== "" && endLabel !== "" && goalLabel === String(endLabel);
      if (goalLabel && !atEnd && !sameAsEnd) {
        const labelPt = halfMoonPoint(cx, cy, r + strokeW / 2 + 18, g);
        const anchor = g < 0.4 ? "end" : g > 0.6 ? "start" : "middle";
        goalSvg += `<text x="${labelPt.x.toFixed(1)}" y="${labelPt.y.toFixed(1)}" class="kpi-gauge-goal-label" text-anchor="${anchor}" dominant-baseline="middle">${escapeHtml(goalLabel)}</text>`;
      }
    }
    /* Optional end-of-scale tick · same stroke as goal mark · sits on the 150k end. */
    if (opts.endMark) {
      goalSvg += gaugeTickLine(1);
    }

    return `<svg class="kpi-gauge-svg kpi-half-moon-gauge${celebrate ? " kpi-gauge-celebrate" : ""}" viewBox="0 0 188 136" role="img" aria-label="${aria}">
      <defs><linearGradient id="${rimGradId}" x1="0%" y1="0%" x2="100%" y2="0%">${celebrate ? successStops : progressStops}</linearGradient></defs>
      <path d="${arcD}" fill="none" stroke="${track}" stroke-width="${strokeW}" stroke-linecap="round"/>
      ${shadowSvg}
      <path class="kpi-gauge-progress" d="${arcD}" fill="none" stroke="url(#${rimGradId})" stroke-width="${strokeW}" stroke-linecap="round"
        stroke-dasharray="${dashLen.toFixed(2)} ${(arcLen + 1).toFixed(2)}"/>
      ${goalSvg}
      <text x="28" y="126" class="kpi-gauge-tick">0</text>
      ${endLabel !== "" ? `<text x="160" y="126" class="kpi-gauge-tick" text-anchor="end">${endLabel}</text>` : ""}
      ${valueLabel !== "" ? `<text x="${cx}" y="${cy - 4}" class="${centerClass}" text-anchor="middle">${escapeHtml(valueLabel)}</text>` : ""}
    </svg>`;
  }

  function autoCaseColumns(g) {
    const trafficYtd = (DATA.verticals || []).find(v => /^Traffic$/i.test(v.name));
    if (g.autoColumns && g.autoColumns.length) return g.autoColumns;
    return [
      { label: g.label || "DUI", current: Number(g.current) || 0 },
      ...(trafficYtd ? [{ label: "Traffic", current: Number(trafficYtd.ytd) || 0 }] : [])
    ];
  }

  function autoCaseTotal(g) {
    return autoCaseColumns(g).reduce((sum, col) => sum + (Number(col.current) || 0), 0);
  }

  /** Mean contracted fee for DUI / DWAI / Traffic from #29 feeByPractice · fallback only. */
  function autoCaseMeanFee() {
    const row = (DATA.feeByPractice || []).find(r => /DUI|DWAI|Traffic/i.test(String(r.name || "")));
    const mean = row && row.mean != null ? Number(row.mean) : NaN;
    return Number.isFinite(mean) && mean > 0 ? mean : 3600;
  }

  /**
   * Est. auto revenue from dui-goal-data cross-ref pack when present.
   * Else count × #29 DUI/Traffic mean.
   */
  function autoCaseEstRevenuePack(g) {
    const pack = (g && g.estRevenue) || (window.DUI_GOAL_DATA && window.DUI_GOAL_DATA.estRevenue) || null;
    if (pack && pack.ytd != null && pack.goal != null) {
      return {
        ytd: Math.round(Number(pack.ytd)),
        goal: Math.round(Number(pack.goal)),
        title: pack.note
          || `Cross-ref ${pack.matchedN || "—"}/${pack.totalN || "—"} case fees + median fill · DUI $${Number(pack.duiMedian || 0).toLocaleString("en-US")} · Traffic $${Number(pack.trafficMedian || 0).toLocaleString("en-US")}`
      };
    }
    const total = autoCaseTotal(g);
    const target = Number(g && g.target) || 50;
    const fee = autoCaseMeanFee();
    return {
      ytd: Math.round(total * fee),
      goal: Math.round(target * fee),
      title: `Est. contracted revenue · DUI + Traffic × $${fee.toLocaleString("en-US")} mean fee`
    };
  }

  /** Fixed column colors — DUI royal-blue, Traffic burnt (different families). */
  const AUTO_CASE_STACK_COLORS = {
    DUI: "#1e3a8a",
    Traffic: "#c45c26"
  };

  function duiGoalTargetBarChart() {
    const g = DATA.duiGoal;
    const columns = autoCaseColumns(g);
    const total = autoCaseTotal(g);
    const target = Number(g.target) || 50;
    const colMax = columns.reduce((m, col) => Math.max(m, Number(col.current) || 0), 0);
    const maxVal = chartAxisMax([colMax, target]);
    /* Fill the goal-card visual — less pad, taller plot, side-by-side columns. */
    const w = 320;
    const h = 210;
    const pad = { l: 36, r: 10, t: 22, b: 28 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const baselineY = pad.t + plotH;
    const targetY = baselineY - (plotH * target) / maxVal;
    const n = Math.max(columns.length, 1);
    const slot = plotW / n;
    const barW = Math.min(52, slot * 0.62);

    const bars = columns.map((col, i) => {
      const count = Number(col.current) || 0;
      const hh = Math.max(count ? 6 : 0, (plotH * count) / maxVal);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = baselineY - hh;
      const fill = AUTO_CASE_STACK_COLORS[col.label] || "#3a1a6e";
      const labelY = Math.max(pad.t + 12, y - 6);
      return `<g class="kpi-target-bar-group">
        <rect x="${x}" y="${y}" width="${barW}" height="${hh}" fill="${fill}">
          <title>${escapeHtml(col.label)}: ${count}</title>
        </rect>
        <text x="${x + barW / 2}" y="${labelY}" text-anchor="middle" class="kpi-target-bar-val">${count}</text>
        <text x="${x + barW / 2}" y="${h - 8}" text-anchor="middle" class="kpi-target-bar-cat">${escapeHtml(col.label)}</text>
      </g>`;
    }).join("");

    return `<svg class="kpi-chart-svg kpi-target-bar-chart kpi-target-bar-chart-compact kpi-target-bar-chart-goal" viewBox="0 0 ${w} ${h}" role="img" aria-label="Auto cases DUI and Traffic ${total} vs goal ${target}">
      <line x1="${pad.l}" y1="${baselineY}" x2="${w - pad.r}" y2="${baselineY}" class="kpi-target-baseline"/>
      <line x1="${pad.l}" y1="${targetY}" x2="${w - pad.r}" y2="${targetY}" class="kpi-target-line"/>
      <text x="${pad.l - 4}" y="${targetY + 4}" text-anchor="end" class="kpi-target-label">${target}</text>
      ${bars}
    </svg>`;
  }

  /** Compare YTD auto total against the straight-line target for elapsed time. */
  function duiScheduleStatus(g, totalSigned) {
    const year = Number(g.year) || new Date().getFullYear();
    const now = new Date();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    let frac = (now - start) / (end - start);
    frac = Math.max(0, Math.min(1, frac));
    const signed = totalSigned != null ? Number(totalSigned) : Number(g.current) || 0;
    const expected = (Number(g.target) || 0) * frac;
    const delta = signed - expected;
    const expectedRounded = Math.round(expected);
    const gap = Math.round(Math.abs(delta));
    if (delta >= 0) {
      return {
        cls: "kpi-mom-up",
        arrow: "↑",
        label: `Ahead ${gap}`,
        detail: `${Math.round(frac * 100)}% of year elapsed — on straight-line pace you'd have ~${expectedRounded} auto cases by now.`
      };
    }
    return {
      cls: "kpi-mom-down",
      arrow: "↓",
      label: `Behind ${gap}`,
      detail: `${Math.round(frac * 100)}% of year elapsed — straight-line pace is ~${expectedRounded} auto cases by now.`
    };
  }

  /**
   * Monthly cases needed Aug–Dec to hit the annual auto goal from current YTD.
   * Front-loads the remainder so early months carry the extra case.
   */
  function monthlyNeedToAnnualGoal(signed, target, fromMonthIndex) {
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const start = Math.max(0, Math.min(11, fromMonthIndex | 0));
    const monthsLeft = 12 - start;
    const remaining = Math.max(0, (Number(target) || 0) - (Number(signed) || 0));
    if (!monthsLeft) return [];
    const base = Math.floor(remaining / monthsLeft);
    const extra = remaining % monthsLeft;
    let running = Number(signed) || 0;
    return monthLabels.slice(start).map((label, i) => {
      const need = base + (i < extra ? 1 : 0);
      running += need;
      return {
        label,
        need,
        ytdAfter: running,
        title: `Need ${need} auto case${need === 1 ? "" : "s"} in ${label} · YTD would be ${running} of ${target}`
      };
    });
  }

  function cashLedgerAsOf() {
    return String((DATA.cashCollectedTotals && DATA.cashCollectedTotals.asOf) || "");
  }

  /** Kate 10/02/2026: cash tile green when a credit value is on the dial. Red only for —. */
  function cashLedgerIsCurrent() {
    const m = cashMonthPaceModel();
    return !!(m && tileValuePresent(String(m.credit)));
  }

  function cashMonthPaceModel() {
    const totals = DATA.cashCollectedTotals || {};
    const target = cashGoalMonthly();
    const rows = DATA.cashCollected2026Ytd || [];
    const meta = tileMonthMeta();
    const row = rows.find(r => String(r.month || "").replace(/\*$/, "") === meta.key)
      || rows.find(r => /\*/.test(String(r.month || "")))
      || rows[rows.length - 1];
    if (!row) return null;
    const credit = Number(row.credit) || 0;
    const isPartial = /\*/.test(String(row.month || ""));
    const daysInMonth = daysInCalendarMonth(meta.key);
    const daysElapsed = isPartial
      ? Number(totals.partialDaysElapsed) || 1
      : daysInMonth;
    const expectedToDate = target * (daysElapsed / daysInMonth);
    const projected = isPartial
      ? Math.round((credit / Math.max(daysElapsed, 1)) * daysInMonth)
      : credit;
    const deltaToDate = Math.round(credit - expectedToDate);
    const gap = Math.abs(deltaToDate);
    const onPace = credit >= expectedToDate;
    const monthKey = meta.key || String(row.month || "").replace(/\*$/, "");
    const monthLabel = meta.short || (monthKey === "Aug" ? "August" : monthKey === "Jul" ? "July" : monthKey === "Jun" ? "June" : monthKey);
    const pacePct = Math.round((projected / target) * 100);
    return {
      credit,
      projected,
      target,
      expectedToDate: Math.round(expectedToDate),
      daysElapsed,
      daysInMonth,
      isPartial,
      onPace,
      deltaToDate,
      gap,
      monthKey,
      monthLabel,
      monthDisplay: isPartial ? `${monthLabel}*` : monthLabel,
      pacePct,
      asOf: totals.asOf || cashLedgerAsOf() || "2026-08-24",
      cls: onPace ? "kpi-mom-up" : "kpi-mom-down",
      arrow: onPace ? "↑" : "↓",
      label: onPace ? `Ahead ${fmtMoney(gap)}` : `Behind ${fmtMoney(gap)}`,
      detail: isPartial
        ? `Through day ${daysElapsed} of ${daysInMonth}: expected ${fmtMoney(expectedToDate)} for an ${fmtMoney(target)} month · revenue ${fmtMoney(credit)} · projected ${fmtMoney(projected)}`
        : `${monthLabel} full month vs ${fmtMoney(target)} target · revenue ${fmtMoney(credit)}`
    };
  }

  /**
   * W1–W4 running Trust Credit total for the Revenue tile.
   * Completed weeks = cumulative ledger actuals through that week, grayed in the UI.
   * Live week = projected running total if MTD pace continues through that week’s last day
   *   (current collected stays on the dial only).
   * Future weeks = projected running total if MTD daily Credit pace continues through that week’s last day.
   */
  function cashWeekCollectionEstimates(m) {
    if (!m) return [];
    const daysInMonth = Math.max(1, Number(m.daysInMonth) || 30);
    const day = m.isPartial
      ? Math.max(1, Number(m.daysElapsed) || 1)
      : daysInMonth;
    const pace = (Number(m.credit) || 0) / Math.max(day, 1);
    const actuals = (DATA.cashCreditsByWeek && DATA.cashCreditsByWeek[m.monthKey]) || {};
    const weeks = [
      { id: "W1", start: 1, end: 7 },
      { id: "W2", start: 8, end: 14 },
      { id: "W3", start: 15, end: 21 },
      { id: "W4", start: 22, end: daysInMonth }
    ];
    let runActual = 0;
    return weeks
      .filter(w => w.start <= daysInMonth)
      .map(w => {
        const end = Math.min(w.end, daysInMonth);
        const weekActual = Math.round(Number(actuals[w.id]) || 0);
        const eowProj = Math.round(pace * end);
        if (day >= end) {
          runActual += weekActual;
          return {
            id: w.id,
            start: w.start,
            end,
            kind: "done",
            weekActual,
            running: runActual,
            eowProj: null
          };
        }
        if (day >= w.start) {
          runActual += weekActual;
          return {
            id: w.id,
            start: w.start,
            end,
            kind: "live",
            weekActual,
            running: runActual,
            eowProj
          };
        }
        return {
          id: w.id,
          start: w.start,
          end,
          kind: "proj",
          weekActual: 0,
          running: eowProj,
          eowProj
        };
      });
  }

  function cashWeekEstimatesTrackHtml(m) {
    const weeks = cashWeekCollectionEstimates(m);
    if (!weeks.length) return "";
    const rows = weeks.map(w => {
      const rowClass = w.kind === "done"
        ? "kpi-week-done"
        : w.kind === "live"
          ? "kpi-week-live"
          : "kpi-week-proj";
      let tip;
      let value;
      if (w.kind === "done") {
        tip = `Week collected ${fmtMoney(w.weekActual)} · running ${fmtMoney(w.running)}`;
        value = fmtMoney(w.running);
      } else if (w.kind === "live") {
        tip = `End-of-week estimate if MTD pace continues through day ${w.end} · now ${fmtMoney(w.running)} on dial`;
        value = `~${fmtMoney(w.eowProj)}`;
      } else {
        tip = `Estimated running total if MTD pace continues through day ${w.end}`;
        value = `~${fmtMoney(w.running)}`;
      }
      return `<tr class="${rowClass}" title="${escapeHtml(tip)}"><th scope="row">${w.id}</th><td>${value}</td></tr>`;
    }).join("");
    return `<table class="kpi-goal-track kpi-cash-week-track"><tbody>${rows}</tbody></table>`;
  }

  function cashCollectedPaceCardHtml() {
    const m = cashMonthPaceModel();
    if (!m) return "";
    /* Dial scale $150k · goal mark stays at monthly $100k target. Celebrate only when collected hits goal. */
    const hit = m.credit >= m.target;
    const scaleMax = Math.max(m.credit, m.target, 150000);
    const cashValue = fmtMoney(m.credit);
    const cashFresh = tilePeriodFresh(true, true, cashValue);
    const gauge = halfMoonGauge(m.credit / scaleMax, "cash-pace", {
      valueLabel: cashValue,
      endLabel: fmtMoney(scaleMax),
      goalMark: m.target / scaleMax,
      goalLabel: "100k",
      endMark: true,
      centerClass: "kpi-gauge-center-amt",
      celebrate: hit
    });
    const paceCell = `${m.pacePct}% <span class="kpi-mom-change ${m.cls}" title="${escapeHtml(m.detail)}">${m.arrow} ${escapeHtml(m.label)}</span>`;
    const freshClass = cashFresh ? " kpi-verified kpi-aug-updated" : " kpi-outdated";
    const cashAsOf = resolveTileAsOf("cash-pace", cashLedgerAsOf());
    const freshMarkHtml = periodFreshMark(true, true, cashValue, cashAsOf);
    const weekAria = cashWeekCollectionEstimates(m)
      .map(w => {
        if (w.kind === "done") return `${w.id} ${fmtMoney(w.running)} done`;
        if (w.kind === "live") return `${w.id} ~${fmtMoney(w.eowProj)}`;
        return `${w.id} ~${fmtMoney(w.running)}`;
      })
      .join(" · ");
    return `<button type="button" class="kpi-goal-card kpi-stat-gauge${freshClass}" data-kpi-focus="cash-pace" aria-label="Revenue ${fmtMoney(m.credit)} of ${fmtMoney(m.target)} · forecast ${fmtMoney(m.projected)} · ${m.label} · ${m.monthDisplay} · weeks ${weekAria} · Trust activity ${cashLedgerAsOf() || "stale"}">
      ${freshMarkHtml}
      ${kpiHelpBtn("cash-pace")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Revenue")}
        ${metricWithDeltaHtml(gauge, null)}
      </div>
      ${goalTrackRows([
        ["Pace", paceCell],
        ["Projected", `${fmtMoney(m.projected)} / ${fmtMoney(m.target)}`]
      ])}
      ${cashWeekEstimatesTrackHtml(m)}
      ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      ${kpiRefMark("#09")}
    </button>`;
  }

  function teamDuiGoalCardHtml() {
    const g = DATA.duiGoal;
    const total = autoCaseTotal(g);
    const target = Number(g.target) || 50;
    const pct = total / (target || 1);
    const hit = pct >= 1;
    const pace = Math.round((total / (target || 1)) * 100);
    const sched = duiScheduleStatus(g, total);
    const paceCell = `${pace}% <span class="kpi-mom-change ${sched.cls}" title="${escapeHtml(sched.detail)}">${sched.arrow} ${escapeHtml(sched.label)}</span>`;
    const rev = autoCaseEstRevenuePack(g);
    const revenueTitle = rev.title;
    const autoAsOf = resolveTileAsOf("#03", (window.DUI_GOAL_DATA && window.DUI_GOAL_DATA.updatedAt) || g.updatedAt);
    const autoFresh = tilePeriodFresh(true, true, String(total));
    const freshClass = autoFresh ? " kpi-verified kpi-aug-updated" : " kpi-outdated";
    return `<button type="button" class="kpi-goal-card kpi-stat-target-bar${freshClass}" data-kpi-focus="#03">
      ${periodFreshMark(true, true, String(total), autoAsOf)}
      ${kpiHelpBtn("#03")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle((g.title || "Auto Cases").replace(/^#\s*/, ""))}
        ${duiGoalTargetBarChart()}
      </div>
      ${goalTrackRows([
        ["Pace", paceCell],
        ["Total", `${total}/${target}`],
        ["Est. revenue", `<span title="${escapeHtml(revenueTitle)}">${fmtMoney(rev.ytd)} / ${fmtMoney(rev.goal)}</span>`]
      ])}
      ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      ${kpiRefMark("#03")}
    </button>`;
  }

  function goalTrackRows(rows) {
    if (!rows || !rows.length) return "";
    return `<table class="kpi-goal-track"><tbody>${rows.map(([k, v]) =>
      `<tr><th scope="row">${k}</th><td>${v}</td></tr>`
    ).join("")}</tbody></table>`;
  }

  function newCasesPracticeTrackHtml(monthKey) {
    const key = String(monthKey || "").replace(/\*$/, "");
    const rows = (DATA.newCasesByPractice && DATA.newCasesByPractice[key]) || [];
    if (!rows.length) return "";
    return goalTrackRows(rows.map(r => [escapeHtml(r.name), String(Number(r.n) || 0)]));
  }

  function placeholderGoalCardHtml() {
    return `<button type="button" class="kpi-goal-card kpi-goal-placeholder kpi-outdated" data-kpi-focus="#GOAL3" disabled aria-disabled="true">
      ${outdatedMark()}
      <div class="kpi-goal-visual">
        <span class="kpi-stat-id">#—</span>
        ${halfMoonGauge(0, "goal-placeholder", { endLabel: "—", valueLabel: "—" })}
      </div>
      ${goalTrackRows([
        ["Change", "—"]
      ])}
    </button>`;
  }

  function kpiSectionSummary(title, hint) {
    const hintHtml = hint ? `<span class="kpi-section-hint">${hint}</span>` : "";
    return `<summary class="kpi-section-summary">
      <span class="kpi-section-heading"><span class="kpi-section-title">${title}</span>${hintHtml}</span>
      <span class="kpi-section-chevron" aria-hidden="true">▾</span>
    </summary>`;
  }

  function kpiSectionStaticHead(title, hint) {
    const hintHtml = hint ? `<span class="kpi-section-hint">${hint}</span>` : "";
    return `<div class="kpi-section-summary kpi-section-summary-static">
      <span class="kpi-section-heading"><span class="kpi-section-title">${title}</span>${hintHtml}</span>
    </div>`;
  }

  function formatPulledMd(iso) {
    const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[2]}/${m[3]}/${m[1]}` : "";
  }

  function monthlyKpisAsOfHint() {
    /* Per-tile dates sit next to each checkbox. No section-level Pulled stamp. */
    return "";
  }

  function kpiSectionIntro(text) {
    if (!text) return "";
    return `<p class="kpi-section-intro">${text}</p>`;
  }

  function reportKey() {
    return "";
  }

  function reportHeader() {
    return `<header class="kpi-report-head">
      ${reportPeriodPillsHtml()}
    </header>
    ${reportKey()}`;
  }

  /** Lower-right stamp — light gray · small. Uses DATA.lastUpdated || DATA.asOf. */
  function syncDataAsOfStamp() {
    const stamp = DATA.lastUpdated || DATA.asOf || "";
    const update = DATA.updateLabel || "";
    let el = document.getElementById("guide-data-as-of");
    if (!el) {
      el = document.createElement("p");
      el.id = "guide-data-as-of";
      el.className = "guide-data-as-of";
      el.setAttribute("aria-live", "polite");
      document.body.appendChild(el);
    }
    if (!stamp) {
      el.textContent = "";
      return;
    }
    el.textContent = update
      ? `Last updated ${stamp} · ${update} KPI refresh`
      : `Last updated ${stamp}`;
  }

  function parseGaugeNums(value, target) {
    const v = parseFloat(String(value).replace(/[^0-9.]/g, ""));
    const tMatch = String(target || "").match(/([0-9]+(?:\.[0-9]+)?)/);
    const t = tMatch ? parseFloat(tMatch[1]) : NaN;
    if (!Number.isFinite(v) || !Number.isFinite(t) || t <= 0) return null;
    return { current: v, target: t, pct: v / t };
  }

  /** Percent gauges: dial 0–100, goal tick at target %, fill = current/100. */
  function percentScaleGauge(k, nums) {
    const looksPct = /%/.test(String(k.value)) || /%/.test(String(k.target));
    return !!(looksPct && nums && nums.target > 0 && nums.target <= 100);
  }

  function halfMoonOptsForKpi(k, nums, hit) {
    const current = nums.current;
    const target = nums.target;
    const scaleMax = Math.max(current, target, 1);
    const isPct = /%/.test(String(k.value)) || /%/.test(String(k.target));
    const isMoney = /\$/.test(String(k.value)) || /\$/.test(String(k.target));
    const valueLabel = isPct
      ? `${Math.round(current)}%`
      : isMoney
        ? `$•••`
        : String(Math.round(current));
    /* #12: right tick = average LSA call cost (the ceiling to stay under), not max(actual, target). */
    const endIsLsaAvg = k.id === "#12" && k.lowerIsBetter && Number.isFinite(target);
    const endVal = endIsLsaAvg ? target : scaleMax;
    const endLabel = isPct
      ? `${Math.round(endVal)}%`
      : isMoney
        ? `$•••`
        : String(Math.round(endVal));
    const goalLabel = isPct
      ? `${Math.round(target)}%`
      : isMoney
        ? `$•••`
        : String(Math.round(target));
    return {
      pct: current / scaleMax,
      endLabel,
      goalMark: target / scaleMax,
      goalLabel,
      celebrate: hit,
      valueLabel
    };
  }

  /* GGL brand: on-target = --gg-positive · over-target = --gg-negative */
  const TARGET_BAR_COLORS = { hit: "#1f8a65", miss: "#cf2d56" };

  function parseMetricNum(val) {
    if (typeof val === "number" && Number.isFinite(val)) return val;
    return parseFloat(String(val).replace(/[^0-9.]/g, "")) || 0;
  }

  function parseTargetNum(targetStr) {
    const m = String(targetStr || "").match(/([0-9]+(?:\.[0-9]+)?)/);
    return m ? parseFloat(m[1]) : NaN;
  }

  /** lowerIsBetter: cost metrics — GGL positive when actual ≤ target, negative when above. */
  function meetsTarget(actual, target, lowerIsBetter) {
    if (!Number.isFinite(target)) return true;
    return lowerIsBetter ? actual <= target : actual >= target;
  }

  function fmtBarMoney(n) {
    return "$•••";
  }

  function fmtBarCount(n) {
    return String(Math.round(n));
  }

  function fmtBarPercent(n) {
    return `${Math.round(n)}%`;
  }

  /**
   * Vertical bars with per-category horizontal target markers (screenshot style).
   * items: [{ label, value, vsTarget?, color? }] — value numeric or "$72" string.
   * vsTarget defaults true (hit/miss vs shared target). Set false + color for context columns.
   */
  function barWithTargetChart(items, options) {
    const opts = options || {};
    const lowerIsBetter = opts.lowerIsBetter !== false;
    const target = opts.target != null ? opts.target : parseTargetNum(opts.targetStr);
    const compact = opts.compact !== false;
    const fmt = typeof opts.formatValue === "function"
      ? opts.formatValue
      : (opts.format === "count" ? fmtBarCount : opts.format === "percent" ? fmtBarPercent : fmtBarMoney);
    const bars = (items || []).map(it => ({
      label: it.label || it.name || it.channel || "",
      actual: parseMetricNum(it.value != null ? it.value : it.cost),
      vsTarget: it.vsTarget !== false,
      color: it.color || null
    })).filter(b => b.label);
    if (!bars.length || !Number.isFinite(target)) return "";

    const maxVal = chartAxisMax([...bars.map(b => b.actual), target]);
    const w = opts.width || (compact ? Math.max(268, 72 * bars.length + 70) : 420);
    const h = opts.height || (compact ? 118 : 200);
    /* Left pad must fit full money labels ($120). Too-tight pad clipped to “20”. */
    const pad = opts.pad || (compact
      ? { l: 46, r: 14, t: 14, b: opts.fullCategoryLabels || bars.length === 1 ? 38 : 30 }
      : { l: 52, r: 20, t: 20, b: 44 });
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / bars.length;
    const barW = Math.min(opts.barWidth || (compact ? 36 : 56), slot * (opts.barWidth ? 1 : 0.52));
    const baselineY = pad.t + plotH;
    const targetY = baselineY - (plotH * target) / maxVal;
    const targetLabel = fmt(target);

    const barEls = bars.map((b, i) => {
      const bh = Math.max(5, (plotH * b.actual) / maxVal);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = baselineY - bh;
      const hit = meetsTarget(b.actual, target, lowerIsBetter);
      const fill = b.color
        ? b.color
        : (b.vsTarget ? (hit ? TARGET_BAR_COLORS.hit : TARGET_BAR_COLORS.miss) : "#1e3a8a");
      const valLabel = fmt(b.actual);
      const labelY = Math.max(pad.t + 12, y - 6);
      const shortLabel = opts.fullCategoryLabels || bars.length === 1
        ? b.label
        : (b.label.length > 14 ? b.label.replace(/\s.*/, "") : b.label);
      return `<g class="kpi-target-bar-group">
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="2" fill="${fill}"/>
        <text x="${x + barW / 2}" y="${labelY}" text-anchor="middle" class="kpi-target-bar-val">${escapeHtml(valLabel)}</text>
        <text x="${x + barW / 2}" y="${h - 8}" text-anchor="middle" class="kpi-target-bar-cat">${escapeHtml(shortLabel)}</text>
      </g>`;
    }).join("");

    return `<svg class="kpi-chart-svg kpi-target-bar-chart${compact ? " kpi-target-bar-chart-compact" : ""}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escapeHtml(opts.ariaLabel || "Actual vs target bar chart")}">
      <line x1="${pad.l}" y1="${baselineY}" x2="${w - pad.r}" y2="${baselineY}" class="kpi-target-baseline"/>
      <line x1="${pad.l}" y1="${targetY}" x2="${w - pad.r}" y2="${targetY}" class="kpi-target-line"/>
      <text x="${pad.l - 4}" y="${targetY + 4}" text-anchor="end" class="kpi-target-label">${escapeHtml(targetLabel)}</text>
      ${barEls}
    </svg>`;
  }

  function costPerCallBarItems() {
    const d = DATA.directContactCost;
    if (d && d.totalContacts) {
      const items = [{ label: "Blend", value: d.cost }];
      if (d.digitalCalls) items.push({ label: "Calls", value: Math.round(d.digitalSpend / d.digitalCalls) });
      if (d.forms) items.push({ label: "Forms", value: Math.round(d.formFee / d.forms) });
      if (d.yelp && d.yelpSpend) items.push({ label: "Yelp", value: Math.round(d.yelpSpend / d.yelp) });
      if (d.justia && d.justiaSpend) items.push({ label: "Justia", value: Math.round(d.justiaSpend / d.justia) });
      return items;
    }
    const overall = DATA.costPerCall.find(c => /direct contact|all campaigns/i.test(String(c.channel)));
    if (overall) return [{ label: "Avg", value: overall.cost }];
    const k12 = DATA.kpis.find(k => k.id === "#12");
    return k12 ? [{ label: "Avg", value: k12.value }] : [];
  }

  function cplByCampaignItems() {
    return DATA.leadsByCampaign.map(c => {
      const spend = parseMetricNum(c.spend);
      const count = Math.max(c.count, 1);
      return { label: c.name, value: Math.round(spend / count) };
    });
  }

  function targetBarChartForKpi(k) {
    const target = parseTargetNum(k.target);
    const items = k.id === "#12" ? costPerCallBarItems() : (k.targetBarItems || []);
    return barWithTargetChart(items, {
      target,
      lowerIsBetter: k.lowerIsBetter !== false,
      targetStr: k.target,
      compact: true,
      ariaLabel: `${k.label} ${k.value} vs ${k.target}`
    });
  }

  function avgDepositTargetBarChart() {
    const { current, target } = DATA.avgDeposit;
    return barWithTargetChart(
      [{ label: "Deposit", value: current }],
      {
        target,
        lowerIsBetter: false,
        compact: true,
        ariaLabel: `Avg deposit ${fmtBarMoney(current)} vs goal ${fmtBarMoney(target)}`
      }
    );
  }

  function kpiGoalCardHtml(k) {
    /* Keep #19 lost-tracker chrome in goals grid — do not force gauge layout */
    if (k.lostTracker) return missedRevenueTrackerHtml();
    const nums = k.gauge ? parseGaugeNums(k.value, k.target) : null;
    const vClass = verifiedClass(!!k.verified);
    /* Source/formula live in ? help popup — not on the goal card face. */
    if (nums) {
      const grad = "goal-" + String(k.id).replace(/\W/g, "");
      const hit = !!(k.hit || meetsTarget(nums.current, nums.target, k.lowerIsBetter === true));
      const gOpts = halfMoonOptsForKpi(k, nums, hit);
      const gauge = halfMoonGauge(gOpts.pct, grad, gOpts);
      return `<button type="button" class="kpi-goal-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""} kpi-outdated" data-kpi-focus="${k.id}">
        ${outdatedMark()}
        ${kpiHelpBtn(k.id)}
        <div class="kpi-goal-visual">
          ${kpiCardTitle(k.label)}
          ${metricWithDeltaHtml(gauge, k.mom)}
        </div>
        ${kpiRefMark(k.id)}
      </button>`;
    }
    const lostCap = 6000;
    const lostN = parseFloat(String(k.value).replace(/[^0-9.]/g, "")) || 0;
    const lostPct = Math.min(1, lostN / lostCap);
    const grad = "goal-" + String(k.id).replace(/\W/g, "");
    const gauge = halfMoonGauge(lostPct, grad, {
      endLabel: k.target || "$0",
      valueLabel: fmtMoney(lostN)
    });
    return `<button type="button" class="kpi-goal-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""} kpi-outdated" data-kpi-focus="${k.id}">
      ${outdatedMark()}
      ${kpiHelpBtn(k.id)}
      <div class="kpi-goal-visual">
        ${kpiCardTitle(k.label || (k.alert ? "Requires action" : k.id))}
        ${metricWithDeltaHtml(gauge, k.mom)}
      </div>
      ${kpiRefMark(k.id)}
    </button>`;
  }

  /**
   * School-style letter grade from 0–100 score.
   * A+ 97–100 · A 93–96 · A- 90–92 · B+ 87–89 · B 83–86 · B- 80–82
   * C+ 77–79 · C 73–76 · C- 70–72 · D+ 67–69 · D 63–66 · D- 60–62 · F <60
   */
  function scoreToLetterGrade(score) {
    const n = Math.round(Number(score) || 0);
    if (n >= 97) return "A+";
    if (n >= 93) return "A";
    if (n >= 90) return "A-";
    if (n >= 87) return "B+";
    if (n >= 83) return "B";
    if (n >= 80) return "B-";
    if (n >= 77) return "C+";
    if (n >= 73) return "C";
    if (n >= 70) return "C-";
    if (n >= 67) return "D+";
    if (n >= 63) return "D";
    if (n >= 60) return "D-";
    return "F";
  }

  function bhiLetterGradeCardHtml(k) {
    const score = Math.round(parseFloat(String(k.value).replace(/[^0-9.]/g, "")) || 0);
    const grade = scoreToLetterGrade(score);
    return `<button type="button" class="kpi-stat-card kpi-bhi-grade${verifiedClass(!!k.verified)}${k.alert ? " kpi-stat-attention" : ""} kpi-outdated" data-kpi-focus="${k.id}">
      ${outdatedMark()}
      ${kpiHelpBtn(k.id)}
      ${kpiCardTitle(k.label)}
      <span class="kpi-bhi-grade-letter">${escapeHtml(grade)}</span>
      <span class="kpi-bhi-grade-pct">${score}%</span>
      <span class="kpi-stat-label">target ${escapeHtml(k.target || "100")}</span>
      ${momChangeHtml(k.mom)}
      ${k.verified ? sourceFootnote(k.id) : ""}
      ${kpiRefMark(k.id)}
    </button>`;
  }

  function missedCallsTargetBarChart(p) {
    /* Match the Auto Cases goal chart box so both goal tiles read at the same scale. */
    return barWithTargetChart(
      [{ label: "Missed Call Rate", value: p.missedPct }],
      {
        target: p.missedTargetPct,
        lowerIsBetter: true,
        format: "percent",
        compact: true,
        fullCategoryLabels: true,
        width: 320,
        height: 210,
        pad: { l: 36, r: 10, t: 18, b: 28 },
        barWidth: 88,
        ariaLabel: `Missed call rate ${p.missedPct}% vs goal ≤ ${p.missedTargetPct}%`
      }
    );
  }

  function missedRevenueTrackerHtml() {
    const p = DATA.phoneIntake;
    const model = missedRevenueModel(p);
    const key = periodToChannelMonth(DATA.period);
    const lsaRows = (DATA.lsaEfficiency || []).slice();
    const lsaRow = lsaRows.find(r => String(r.month).replace(/\*$/, "") === key) || {};
    const lsaCalls = Number(lsaRow.leads) || 0;
    const lsaCharged = Number(lsaRow.charged) || 0;
    const phoneReady = !!(DATA.phoneByMonth && DATA.phoneByMonth[key]);
    const freshClass = phoneReady ? " kpi-verified kpi-aug-updated" : " kpi-outdated";
    const freshMark = phoneReady ? statusCorner(true) : outdatedMark();
    return `<button type="button" class="kpi-goal-card kpi-stat-attention kpi-stat-target-bar${freshClass}" data-kpi-focus="#19">
      ${freshMark}
      ${kpiHelpBtn("#19")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Missed Opportunity")}
        ${missedCallsTargetBarChart(p)}
        <span class="kpi-stat-val kpi-val-negative">${fmtMoney(model.monthlyLost)}/mo</span>
      </div>
      ${goalTrackRows([
        ["Search Calls", `${model.missedSearchCalls} of ${p.monthlyCalls}`],
        ["LSA calls", lsaCalls ? `${lsaCalls} · ${lsaCharged} charged` : "—"],
        ["YTD lost", fmtMoney(model.cumulativeYtd)]
      ])}
      ${kpiRefMark("#19")}
    </button>`;
  }

  function lsaReallocationWasteModel(rows) {
    const periods = (rows || [])
      .filter(r => r.month === "Jun" || r.month === "Jul" || r.month === "Jul*")
      .map(r => {
        const lsaResponses = Number(r.leads) || 0;
        const digitalResponses = Number(r.adsLeads) || 0;
        const lsaSpend = Number(r.lsaSpend) || 0;
        const digitalSpend = Number(r.adsSpend) || 0;
        const digitalCostPerResponse = digitalResponses ? digitalSpend / digitalResponses : 0;
        const sameVolumeAtDigitalRate = lsaResponses * digitalCostPerResponse;
        const waste = Math.max(0, lsaSpend - sameVolumeAtDigitalRate);
        const digitalResponsesAtLsaSpend = digitalCostPerResponse ? lsaSpend / digitalCostPerResponse : 0;
        return {
          month: r.month,
          lsaResponses,
          lsaSpend,
          digitalCostPerResponse,
          waste,
          extraResponses: Math.max(0, digitalResponsesAtLsaSpend - lsaResponses)
        };
      });
    return {
      periods: newestFirst(periods),
      totalWaste: Math.round(periods.reduce((sum, r) => sum + r.waste, 0)),
      extraResponses: Math.round(periods.reduce((sum, r) => sum + r.extraResponses, 0))
    };
  }

  function lsaMismanagementTrackerHtml() {
    const model = lsaReallocationWasteModel(DATA.casesLeadsSpend);
    const benchmark = model.periods[0] || {};
    return `<button type="button" class="kpi-goal-card kpi-spend-waste-card kpi-outdated" data-kpi-focus="#07" aria-description="Under construction">
      ${outdatedMark()}
      ${kpiHelpBtn("#07")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Spend Waste")}
        <span class="kpi-stat-val kpi-negative-value">−${fmtMoney(model.totalWaste)}</span>
      </div>
      ${goalTrackRows([
        ["Potential responses", String(model.extraResponses)],
        ["Digital benchmark", `${fmtMoney(benchmark.digitalCostPerResponse || 0)}/response`]
      ])}
      ${kpiRefMark("#07")}
    </button>`;
  }

  function kpiStatKickerHtml(kpiId) {
    if (kpiId === "financial") {
      return `<span class="kpi-stat-kicker">2026 forecast</span>`;
    }
    return "";
  }

  /* Freshness = export numbers on file. Method caveats stay in the note, not the corner mark. */
  function kpiCostPerCaseCardHtml(k) {
    const foot = k.verified ? sourceFootnote(k.id) : "";
    const range = k.periodRange || "";
    const formula = k.formulaLine || "";
    const note = k.noteLine || "";
    const fresh = tilePeriodFresh(!!k.augUpdated, !!k.verified, k.value);
    return `<button type="button" class="kpi-stat-card${fresh ? " kpi-verified kpi-aug-updated" : " kpi-outdated"}" data-kpi-focus="${k.id}">
      ${periodFreshMark(!!k.augUpdated, !!k.verified, k.value, resolveTileAsOf(k.id, k.updatedAsOf))}
      ${kpiHelpBtn(k.id)}
      ${kpiCardTitle(k.label)}
      ${range ? `<span class="kpi-stat-subhead">${escapeHtml(range)}</span>` : ""}
      <span class="kpi-stat-val">${escapeHtml(k.value)}</span>
      ${formula ? `<span class="kpi-stat-formula">${escapeHtml(formula)}</span>` : ""}
      ${note ? `<span class="kpi-stat-note">${escapeHtml(note)}</span>` : ""}
      ${foot}
      ${kpiRefMark(k.id)}
    </button>`;
  }

  /** Sits beside #30 — same card shape so cost and value read as a pair. */
  function avgCaseValueCardHtml() {
    const m = DATA.avgCaseValue;
    if (!m) return "";
    const months = m.months || [];
    const range = months.length >= 2
      ? `${months[0]}–${months[months.length - 1]} 2026`
      : months[0] ? `${months[0]} 2026` : "";
    const cost = DATA.marketingCostPerCase && DATA.marketingCostPerCase.allInPerCase;
    const fee = Number((DATA.cashCollectedTotals || {}).contractedMean) || 0;
    const formula = `${fmtMoney(m.cash)} collected ÷ ${m.cases} new cases`;
    const noteParts = [
      "Collections mix older-case payments with new deposits. Contracted fee at signing is the cleaner case-value basis when available."
    ];
    if (fee) noteParts.push(`Contracted mean fee is ${fmtMoney(fee)}.`);
    if (cost) noteParts.push(`Net of the ${fmtMoney(cost)} marketing cost per case, ${fmtMoney(m.perCase - cost)} stays with the firm.`);
    const value = fmtMoney(m.perCase);
    /* May–Aug stack while tile month is Sep* = not updated for this period → red. */
    const periodFresh = completeMonthsIncludeTilePeriod(months);
    const fresh = tilePeriodFresh(periodFresh, periodFresh, value);
    return `<button type="button" class="kpi-stat-card${fresh ? " kpi-verified kpi-aug-updated" : " kpi-outdated"}" data-kpi-focus="avg-case-value">
      ${periodFreshMark(periodFresh, periodFresh, value, resolveTileAsOf("avg-case-value", (DATA.avgCaseValue && DATA.avgCaseValue.asOf) || "2026-09-10"))}
      ${kpiHelpBtn("avg-case-value")}
      ${kpiCardTitle("Avg Case Value")}
      ${range ? `<span class="kpi-stat-subhead">${escapeHtml(range)}</span>` : ""}
      <span class="kpi-stat-val">${escapeHtml(value)}</span>
      <span class="kpi-stat-formula">${escapeHtml(formula)}</span>
      <span class="kpi-stat-note">${escapeHtml(noteParts.join(" "))}</span>
    </button>`;
  }

  /* #19 in Financial Breakdown — text only, no mini chart, same shape as the cost/value pair. */
  function missedOpportunityTextCardHtml() {
    const p = DATA.phoneIntake;
    if (!p) return "";
    const key = periodToChannelMonth(DATA.period);
    const monthNames = { May: "May", Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October" };
    const monthName = monthNames[key] || key || "—";
    const phoneReady = !!(DATA.phoneByMonth && DATA.phoneByMonth[key]);
    const model = phoneReady ? missedRevenueModel(p) : null;
    const value = model ? `${fmtMoney(model.monthlyLost)}/mo` : "—";
    const lsaRow = (DATA.lsaEfficiency || []).find(r => String(r.month).replace(/\*$/, "") === key) || {};
    const lsaCalls = Number(lsaRow.leads) || 0;
    const lsaCharged = Number(lsaRow.charged) || 0;
    const lsaUncharged = lsaRow.notCharged != null
      ? Number(lsaRow.notCharged)
      : Math.max(0, lsaCalls - lsaCharged);
    const phone = (DATA.phoneByMonth && DATA.phoneByMonth[key]) || {};
    const splitRows = [
      ["Weekday", phone.weekdayCalls, phone.weekdayMissed],
      ["Weekend", phone.weekendCalls, phone.weekendMissed]
    ].map(([label, calls, missed]) => {
      const n = Number(calls) || 0;
      const m = Number(missed) || 0;
      const cell = !phoneReady
        ? "—"
        : n
        ? `${Math.round((m / n) * 100)}% · ${m} of ${n}`
        : "No calls";
      return `<tr><th scope="row">${label}</th><td>${escapeHtml(cell)}</td></tr>`;
    }).join("");
    const lostLine = model
      ? `Est. lost · month ${fmtMoney(model.monthlyLost)} · quarter ${fmtMoney(model.quarterLost)} · year ${fmtMoney(model.yearLost)}`
      : "Sep Call details still need · missed Search not on file for this month";
    const unchargedNote = lsaCalls
      ? `Uncharged LSA calls this month: ${lsaUncharged} of ${lsaCalls}. To value them, pull the LSA inbox, filter Charge status to not charged, then check each one against the phone log for an outbound callback to the same number within 48 hours. Count only the never-reached calls as lost, and apply the same lead-to-case rate.`
      : "LSA call count not on file for this month. Pull the LSA inbox, filter Charge status to not charged, then check each one against the phone log for a callback within 48 hours before counting any as lost.";
    return `<button type="button" class="kpi-stat-card${phoneReady ? " kpi-verified kpi-aug-updated" : " kpi-outdated kpi-stat-attention"}" data-kpi-focus="#19">
      ${periodFreshMark(phoneReady, phoneReady, value)}
      ${kpiHelpBtn("#19")}
      ${kpiCardTitle("Missed Opportunity")}
      <span class="kpi-stat-subhead">${escapeHtml(monthName)} 2026</span>
      <span class="kpi-stat-val${phoneReady ? " kpi-val-negative" : ""}">${escapeHtml(value)}</span>
      ${model ? `<span class="kpi-stat-formula">${escapeHtml(lostLine)}</span>` : `<span class="kpi-stat-note">${escapeHtml(lostLine)}</span>`}
      <table class="kpi-goal-track kpi-missed-split"><caption class="kpi-stat-formula">Missed call rate · target ${escapeHtml(String(p.missedTargetPct))}% or less</caption><tbody>${splitRows}</tbody></table>
      <span class="kpi-stat-note">${escapeHtml(unchargedNote)}</span>
      ${kpiRefMark("#19")}
    </button>`;
  }

  function kpiStatCardHtml(k) {
    if (k.lostTracker) return missedRevenueTrackerHtml();
    if (k.letterGrade || k.id === "#BHI") return bhiLetterGradeCardHtml(k);
    if (k.id === "#30") return kpiCostPerCaseCardHtml(k);
    const targetLine = k.id === "#01" || k.id === "#02"
      ? ""
      : k.id === "#12" && k.cashGoalNote
      ? `target ${k.target} · ${k.cashGoalNote}`
      : (k.target ? `target ${k.target}` : "");
    const vClass = verifiedClass(!!k.verified);
    const foot = k.verified ? sourceFootnote(k.id) : "";
    const icon = kpiMetricIconHtml(k.id);
    const kicker = kpiStatKickerHtml(k.id);
    const nums = k.gauge ? parseGaugeNums(k.value, k.target) : null;
    if (nums) {
      const grad = "km-" + String(k.id).replace(/\W/g, "");
      const hit = !!(k.hit || meetsTarget(nums.current, nums.target, k.lowerIsBetter === true));
      const goalLine = targetLine;
      const gOpts = halfMoonOptsForKpi(k, nums, hit);
      const gauge = halfMoonGauge(gOpts.pct, grad, gOpts);
      const channelTrack = k.id === "#01"
        ? (() => {
            const ch = findChannelMonthRow(periodToChannelMonth(DATA.period));
            const n = v => (v == null || v === "" ? "—" : String(Number(v) || 0));
            return goalTrackRows([
              ["Search", n(ch && ch.search)],
              ["LSA", n(ch && ch.lsa)],
              ["HubSpot", n(ch && (ch.hubspotForms != null ? ch.hubspotForms : ch.hubspot))],
              ["Yelp", n(ch && ch.yelp)],
              ["Justia", n(ch && ch.justia)],
              ["Firm website", n(ch && ch.pavLawWebsite != null ? ch.pavLawWebsite : 0)]
            ]);
          })()
        : k.id === "#02"
        ? newCasesPracticeTrackHtml(periodToChannelMonth(DATA.period))
        : "";
      /* Monthly KPIs grid chrome = Revenue tile · always kpi-goal-card, never plain kpi-stat-card. */
      return `<button type="button" class="kpi-goal-card kpi-stat-gauge${vClass}${k.alert ? " kpi-stat-attention" : ""}${periodFreshClass(!!k.augUpdated, !!k.verified, k.value)}" data-kpi-focus="${k.id}">
        ${periodFreshMark(!!k.augUpdated, !!k.verified, k.value, resolveTileAsOf(k.id, k.updatedAsOf))}
        ${kpiHelpBtn(k.id)}
        <div class="kpi-goal-visual">
          ${kicker}
          ${icon}
          ${kpiCardTitle(k.label)}
          ${metricWithDeltaHtml(gauge, k.id === "#01" || k.id === "#02" ? null : k.mom)}
          ${goalLine ? `<span class="kpi-stat-label">${goalLine}</span>` : ""}
        </div>
        ${channelTrack}
        ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
        ${foot}
        ${kpiRefMark(k.id)}
      </button>`;
    }
    if (k.targetBar) {
      const targetNum = parseTargetNum(k.target);
      const hit = meetsTarget(parseMetricNum(k.value), targetNum, k.lowerIsBetter !== false);
      return `<button type="button" class="kpi-goal-card kpi-stat-target-bar${vClass}${k.alert ? " kpi-stat-attention" : ""}${periodFreshClass(!!k.augUpdated, !!k.verified, k.value)}" data-kpi-focus="${k.id}">
        ${periodFreshMark(!!k.augUpdated, !!k.verified, k.value, resolveTileAsOf(k.id, k.updatedAsOf))}
        ${kpiHelpBtn(k.id)}
        <div class="kpi-goal-visual">
          ${icon}
          ${kpiCardTitle(k.label)}
          ${metricWithDeltaHtml(targetBarChartForKpi(k), k.mom)}
          <span class="kpi-stat-label">Avg ${escapeHtml(k.value)} · ${escapeHtml(targetLine)}</span>
        </div>
        ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
        ${foot}
        ${kpiRefMark(k.id)}
      </button>`;
    }
    return `<button type="button" class="kpi-goal-card${vClass}${k.alert ? " kpi-stat-attention" : ""}${periodFreshClass(!!k.augUpdated, !!k.verified, k.value)}" data-kpi-focus="${k.id}">
      ${periodFreshMark(!!k.augUpdated, !!k.verified, k.value, resolveTileAsOf(k.id, k.updatedAsOf))}
      ${kpiHelpBtn(k.id)}
      <div class="kpi-goal-visual">
        ${icon}
        ${kpiCardTitle(k.label)}
        ${kicker}
        ${metricWithDeltaHtml(`<span class="kpi-stat-val">${k.value}</span>`, k.mom)}
        <span class="kpi-stat-label">${targetLine}</span>
      </div>
      ${k.hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      ${foot}
      ${kpiRefMark(k.id)}
    </button>`;
  }

  /**
   * Biggest opportunity needs LOE from feedback — not fee pool.
   * When numeric LOE is set: highest mean fee ÷ LOE wins.
   * Blank LOE on every row → no mark.
   */
  function feePracticeLoeNumeric(row) {
    if (!row || row.loe == null || row.loe === "") return null;
    if (typeof row.loe === "number" && Number.isFinite(row.loe) && row.loe > 0) return row.loe;
    const map = { low: 1, med: 2, medium: 2, high: 3 };
    const key = String(row.loe).trim().toLowerCase();
    if (map[key] != null) return map[key];
    const n = Number(row.loe);
    return Number.isFinite(n) && n > 0 ? n : null;
  }

  function feePracticeLoeLabel(row) {
    if (!row || row.loe == null || row.loe === "") {
      return `<span class="kpi-cell-missing" title="LOE not set">—</span>`;
    }
    return escapeHtml(String(row.loe));
  }

  function feeByPracticeOpportunity(rows) {
    const scored = (rows || []).filter(r => feePracticeLoeNumeric(r) != null);
    if (!scored.length) return null;
    return scored.reduce((best, row) => {
      const score = Number(row.mean) / feePracticeLoeNumeric(row);
      const bestScore = Number(best.mean) / feePracticeLoeNumeric(best);
      return score > bestScore ? row : best;
    });
  }

  function feeByPracticeBarChart(rows) {
    const items = rows || DATA.feeByPractice || [];
    const opportunity = feeByPracticeOpportunity(items);
    const practiceColors = {
      "Sex Assault / Sex Offense": "#6a5acd",
      "Theft / Property": "#334155",
      "Assault / Menacing": "#c45c26",
      "Domestic Violence / DV": "#b23a78",
      "Criminal Defense (other)": "#3a1a6e",
      "Probation Revocation": "#64748b",
      "DUI / DWAI / Traffic": "#1e3a8a"
    };
    const max = niceAxisMax(Math.max(...items.map(r => r.mean), 1));
    const w = 720;
    const h = 300;
    const pad = { l: 52, r: 16, t: opportunity ? 40 : 32, b: 72 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / Math.max(items.length, 1);
    const barW = Math.min(56, slot * 0.55);
    const yOf = v => pad.t + plotH * (1 - v / max);
    const ticks = axisTicks(max, 5).map(t => {
      const y = yOf(t);
      const label = t >= 1000 ? `$${Math.round(t / 1000)}k` : `$${t}`;
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${label}</text>
      </g>`;
    }).join("");
    const bars = items.map((r, i) => {
      const bh = Math.max(6, plotH * (r.mean / max));
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const isOpp = opportunity && r.name === opportunity.name;
      const short = String(r.name)
        .replace(" / Sex Offense", "")
        .replace("Domestic Violence / DV", "DV")
        .replace("Criminal Defense (other)", "Crim. Def.")
        .replace("Probation Revocation", "Probation")
        .replace("DUI / DWAI / Traffic", "DUI/Traffic")
        .replace("Assault / Menacing", "Assault")
        .replace("Theft / Property", "Theft")
        .replace("Sex Assault", "Sex Assault");
      const valLabel = r.mean >= 1000
        ? `$${(r.mean / 1000).toFixed(r.mean % 1000 === 0 ? 0 : 1)}k`
        : `$${r.mean}`;
      const color = practiceColors[r.name] || "#64748b";
      const stroke = isOpp
        ? ` stroke="#3a1a6e" stroke-width="2.5"`
        : "";
      const wash = isOpp
        ? `<rect x="${x - 6}" y="${pad.t}" width="${barW + 12}" height="${plotH}" rx="6" fill="rgba(58,26,110,0.08)"/>`
        : "";
      const oppTag = isOpp
        ? `<text x="${x + barW / 2}" y="${Math.max(12, y - 22)}" text-anchor="middle" class="kpi-chart-opp-label">Biggest opportunity</text>`
        : "";
      return `<g>
        ${wash}
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="5" fill="${color}"${stroke}/>
        ${oppTag}
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total">${valLabel}</text>
        <text x="${x + barW / 2}" y="${h - 28}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(short)}</text>
        <text x="${x + barW / 2}" y="${h - 12}" text-anchor="middle" class="kpi-chart-axis">n=${r.n}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Practice Area Average Fee">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}${bars}
    </svg>`;
  }

  function feeByPracticeSectionHtml() {
    const rows = DATA.feeByPractice || [];
    const opportunity = feeByPracticeOpportunity(rows);
    const body = rows.map(r => {
      const isOpp = opportunity && r.name === opportunity.name;
      const nameCell = isOpp
        ? `${escapeHtml(r.name)}<span class="kpi-opportunity-mark">Biggest opportunity</span>`
        : escapeHtml(r.name);
      const trClass = isOpp ? ` class="kpi-row-opportunity"` : "";
      const loeMissing = r.loe == null || r.loe === "";
      const loeTd = loeMissing
        ? `<td class="kpi-td-missing">${feePracticeLoeLabel(r)}</td>`
        : `<td>${feePracticeLoeLabel(r)}</td>`;
      return `<tr${trClass}><td>${nameCell}</td><td>${r.n}</td><td>${fmtMoney(r.mean)}</td>${loeTd}</tr>`;
    }).join("");
    const table = `<div class="kpi-chart-detail">
      <table class="kpi-table kpi-chart-table">
        <thead><tr><th scope="col">Practice area</th><th scope="col">n</th><th scope="col">Mean fee</th><th scope="col">LOE</th></tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>`;
    const note = opportunity
      ? `<p class="kpi-table-note">Biggest opportunity = highest mean fee ÷ LOE · ${escapeHtml(opportunity.name)}.</p>`
      : `<p class="kpi-table-note">Biggest opportunity waits on LOE · level of effort via feedback · not fee pool.</p>`;
    return chartBlock({
      focus: "#29",
      helpId: "#29",
      title: "Practice Area Average Fee",
      chart: feeByPracticeBarChart(rows),
      table: `${table}${note}${sourceFootnote("#29")}`
    });
  }

  function forecastExpenseCoverageDialHtml() {
    const collectibleAnnual = 884981;
    const expensesAnnual = 960000;
    const collectible = collectibleAnnual / 4;
    const expenses = expensesAnnual / 4;
    const coverage = Math.min(1.15, collectible / expenses);
    const shortfall = expenses - collectible;
    const hit = collectible >= expenses;
    const gauge = halfMoonGauge(Math.min(1, coverage), "forecast-expense-coverage", {
      valueLabel: `${Math.round((collectible / expenses) * 100)}%`,
      endLabel: "100%",
      goalMark: 1,
      celebrate: hit
    });
    return `<button type="button" class="kpi-stat-card kpi-stat-gauge kpi-verified kpi-outdated" data-kpi-focus="financial" aria-label="Quarterly collectible forecast coverage of the quarterly expense run-rate">
      ${outdatedMark()}
      ${kpiHelpBtn("financial")}
      ${kpiStatKickerHtml("financial")}
      ${kpiMetricIconHtml("financial")}
      ${kpiCardTitle("Breakeven Forecast")}
      ${metricWithDeltaHtml(gauge, null)}
      <span class="kpi-stat-label">Quarterly expenses ${fmtMoney(expenses)}</span>
      ${hit
        ? '<span class="kpi-target-hit">Target reached</span>'
        : `<span class="kpi-stat-label kpi-negative-value">Coverage gap −${fmtMoney(shortfall)}</span>`}
      ${kpiRefMark("#09")}
    </button>`;
  }

  function forecastExpenseCoverageGoalCardHtml() {
    const collectibleAnnual = 884981;
    const expensesAnnual = 960000;
    const collectible = collectibleAnnual / 4;
    const expenses = expensesAnnual / 4;
    const coverage = Math.min(1.15, collectible / expenses);
    const shortfall = expenses - collectible;
    const hit = collectible >= expenses;
    const gauge = halfMoonGauge(Math.min(1, coverage), "forecast-expense-coverage", {
      valueLabel: `${Math.round((collectible / expenses) * 100)}%`,
      endLabel: "100%",
      goalMark: 1,
      celebrate: hit
    });
    return `<button type="button" class="kpi-goal-card kpi-stat-gauge kpi-verified kpi-outdated" data-kpi-focus="financial" aria-label="Quarterly collectible forecast coverage of the quarterly expense run-rate">
      ${outdatedMark()}
      ${kpiHelpBtn("financial")}
      ${kpiStatKickerHtml("financial")}
      ${kpiMetricIconHtml("financial")}
      ${kpiCardTitle("Breakeven Forecast")}
      ${metricWithDeltaHtml(gauge, null)}
      <span class="kpi-stat-label">Quarterly expenses ${fmtMoney(expenses)}</span>
      ${hit
        ? '<span class="kpi-target-hit">Target reached</span>'
        : `<span class="kpi-stat-label kpi-negative-value">Coverage gap −${fmtMoney(shortfall)}</span>`}
      ${kpiRefMark("#09")}
    </button>`;
  }

  function yelpBaselineData() {
    const y = DATA.yelpBaseline || {};
    const reviewsFromListing = Number((DATA.reviews || []).find(r => r.platform === "Yelp")?.count);
    const cv = y.caseValue || {};
    return {
      messages: Number(y.messages) || 0,
      calls: Number(y.calls) || 0,
      websiteVisits: Number(y.websiteVisits) || 0,
      reviews: Number.isFinite(reviewsFromListing) ? reviewsFromListing : (Number(y.reviews) || 0),
      reviewsTotal: Number(y.reviewsTotal != null ? y.reviewsTotal : (Number.isFinite(reviewsFromListing) ? reviewsFromListing : y.reviews)) || 0,
      reviewsJuly: Number(y.reviewsJuly) || 0,
      reviewsSeptember: Number(y.reviewsSeptember) || 0,
      reviewsPrior: Number(y.reviewsPrior) || 0,
      /* Goal progress uses calendar month from screenshot, not last-30 list length. */
      leads: Number(y.leads) || 0,
      julyLeads: Number(y.julyLeads) || 0,
      augustLeads: Number(y.augustLeads) || 0,
      todayLeads: Number(y.todayLeads) || 0,
      messageCategories: Array.isArray(y.messageCategories) ? y.messageCategories : [],
      visiblyReplied: Number(y.visiblyReplied) || 0,
      responseStatusNotVisible: Number(y.responseStatusNotVisible) || 0,
      asOf: y.asOf || "",
      messagesAsOf: y.messagesAsOf || y.asOf || "",
      reviewsAsOf: y.reviewsAsOf || y.asOf || "",
      caseValue: {
        asOf: cv.asOf || y.asOf || "",
        contractedTotal: Number(cv.contractedTotal) || 0,
        contractedMean: Number(cv.contractedMean) || 0,
        trustCreditTotal: Number(cv.trustCreditTotal) || 0,
        signedWithFee: Number(cv.signedWithFee) || 0,
        byMonth: cv.byMonth || {}
      }
    };
  }

  function answerRateYearAvgPct() {
    const phone = DATA.phoneByMonth || {};
    let calls = 0;
    let answered = 0;
    Object.keys(phone).forEach(k => {
      const row = phone[k] || {};
      if (row.weekdayCalls != null) {
        const wd = Number(row.weekdayCalls) || 0;
        const missed = Number(row.weekdayMissed) || 0;
        calls += wd;
        answered += Math.max(0, wd - missed);
        return;
      }
      calls += Number(row.calls) || 0;
      answered += Number(row.received) || 0;
    });
    if (!calls) return null;
    return Math.round((answered / calls) * 100);
  }

  function answerRateGoalCardHtml() {
    const key = periodToChannelMonth(DATA.period);
    const phone = DATA.phoneByMonth || {};
    const cur = phone[key];
    const prior = phone[priorMonthAbbrev(key)];
    const target = (DATA.phoneIntake && DATA.phoneIntake.targetPct) || 90;
    const pct = cur ? searchWeekdayAnswerPct(cur) : null;
    const priorPct = prior ? searchWeekdayAnswerPct(prior) : null;
    const yearAvg = answerRateYearAvgPct();
    const deltaPp = pct != null && priorPct != null ? Math.round(pct - priorPct) : null;
    const ready = pct != null && Number.isFinite(pct);
    const hit = ready && pct >= target;
    const missed = cur
      ? (cur.weekdayMissed != null ? Number(cur.weekdayMissed) : Number(cur.missed))
      : null;
    const missedReady = missed != null && Number.isFinite(missed);
    const valueHtml = ready
      ? `<p class="kpi-answer-rate-value">${pct}%</p>
         <p class="kpi-answer-rate-missed">${missedReady ? `${missed} missed` : "—"}</p>`
      : `<p class="kpi-answer-rate-value">—</p>
         <p class="kpi-answer-rate-missed">—</p>`;
    const momHtml = deltaPp == null
      ? "—"
      : `<span class="kpi-mom-change ${deltaPp >= 0 ? "kpi-mom-up" : "kpi-mom-down"}">${
          deltaPp === 0 ? "0 pp" : `${deltaPp > 0 ? "↑" : "↓"} ${Math.abs(deltaPp)} pp`
        }</span>`;
    const answerValue = ready ? `${pct}%` : "—";
    const fresh = tilePeriodFresh(true, true, answerValue);
    const answerAsOf = resolveTileAsOf("answer-rate");
    const ariaMissed = missedReady ? `${missed} missed` : "missed unavailable";
    return `<button type="button" class="kpi-goal-card kpi-stat-answer-rate${fresh ? " kpi-verified kpi-aug-updated" : " kpi-outdated"}${!hit && ready ? " kpi-stat-attention" : ""}" data-kpi-focus="answer-rate" aria-label="Weekday answer rate ${ready ? pct + "%" : "unavailable"} · ${ariaMissed} · year avg ${yearAvg != null ? yearAvg + "%" : "—"} · vs last month ${deltaPp == null ? "—" : deltaPp + " pp"}">
      ${periodFreshMark(true, true, answerValue, answerAsOf)}
      ${kpiHelpBtn("answer-rate")}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Answer Rate")}
        ${valueHtml}
      </div>
      ${goalTrackRows([
        ["Year avg", yearAvg == null ? "—" : `${yearAvg}%`],
        ["vs last month", momHtml]
      ])}
      ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      ${kpiRefMark("#21")}
    </button>`;
  }

  function yelpGoalCardHtml() {
    const reviewTarget = 20;
    const y = yelpBaselineData();
    const total = y.reviewsTotal || y.reviews;
    const key = periodToChannelMonth(DATA.period);
    const monthNames = { Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October" };
    const monthName = monthNames[key] || key || "Month";
    let monthReviews = null;
    if (key === "Sep") {
      monthReviews = Number(y.reviewsSeptember) || 0;
    } else if (key === "Aug") {
      monthReviews = Math.max(0, (Number(y.reviewsTotal || y.reviews) || 0) - (Number(y.reviewsPrior) || 0) - (Number(y.reviewsSeptember) || 0));
    } else if (key === "Jul") {
      monthReviews = Number(y.reviewsJuly) || 0;
    } else if (key === "Oct") {
      monthReviews = 0;
    }
    const monthReviewsLabel = monthReviews == null ? "—" : String(monthReviews);
    const reviewPct = total / reviewTarget;
    const hit = total >= reviewTarget;
    const gauge = halfMoonGauge(Math.min(1, reviewPct), "yelp-goal", {
      valueLabel: `${Math.round(reviewPct * 100)}%`,
      endLabel: "20",
      goalMark: 1,
      celebrate: hit
    });
    const pacePct = Math.round(reviewPct * 100);
    const yelpAsOf = resolveTileAsOf("yelp", y.caseValue.asOf || y.reviewsAsOf || y.asOf);
    const yelpFresh = tilePeriodFresh(true, true, String(total));
    const freshClass = yelpFresh ? " kpi-verified kpi-aug-updated" : " kpi-outdated";
    const cvMonth = (y.caseValue.byMonth && y.caseValue.byMonth[key]) || null;
    const monthFee = cvMonth && cvMonth.contractedTotal != null ? Number(cvMonth.contractedTotal) : null;
    const monthFeeLabel = monthFee == null ? "—" : fmtMoney(monthFee);
    const signedTotalLabel = y.caseValue.contractedTotal
      ? fmtMoney(y.caseValue.contractedTotal)
      : "—";
    return `<button type="button" class="kpi-goal-card kpi-stat-gauge${freshClass}" data-kpi-focus="yelp" aria-label="Yelp Reviews progress toward 20 reviews · pace ${pacePct}% · ${monthName} ${monthReviewsLabel} · total ${total} · signed case value ${signedTotalLabel}">
      ${periodFreshMark(true, true, String(total), yelpAsOf)}
      <div class="kpi-goal-visual">
        ${kpiCardTitle("Yelp Reviews")}
        ${metricWithDeltaHtml(gauge, null)}
        ${goalTrackRows([
          ["Pace", `${pacePct}%`],
          [monthName, monthReviewsLabel],
          ["Total", `${total}/${reviewTarget}`],
          [`${monthName} fees`, monthFeeLabel],
          ["Signed fees", signedTotalLabel]
        ])}
        ${hit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      </div>
      ${kpiRefMark("#17")}
    </button>`;
  }

  function financialBreakdownTilesHtml() {
    /* Avg Case Value staged 09/10/2026 · DASHBOARD-STAGING.md */
    const tiles = []
      .filter(Boolean)
      .map(html => `<div class="kpi-tile-with-projects">${html}</div>`)
      .join("");
    if (!tiles) return "";
    return `<section class="kpi-section kpi-section-static" data-feedback-id="section-financial-breakdown-tiles" data-feedback-label="Financial Breakdown">
      ${kpiSectionStaticHead("Financial Breakdown")}
      <div class="kpi-section-body">
        <div class="kpi-goals-layout">
          <div class="kpi-stat-grid kpi-tiles-4">${tiles}</div>
        </div>
      </div>
    </section>`;
  }

  /** Tile-month digital quality metrics for the four October digital goals. */
  function computeDigitalQualityMetrics(abbrev) {
    const key = String(abbrev || "").replace(/\*$/, "");
    const ads = (DATA.funnelAds && DATA.funnelAds[key]) || {};
    const ch = findChannelMonthRow(key);
    const cls = findCasesLeadsSpendRow(key);
    const impressions = ads.impressions != null ? Number(ads.impressions) : null;
    const clicks = ads.clicks != null ? Number(ads.clicks) : null;
    let phones = ads.phoneCalls != null ? Number(ads.phoneCalls) : null;
    if (phones == null && ch && ch.search != null) phones = Number(ch.search);
    let searchSpend = ads.searchSpendLock != null ? Number(ads.searchSpendLock) : null;
    if (searchSpend == null && ch && ch.searchSpend != null) searchSpend = Number(ch.searchSpend);
    const mediaSpend = cls && cls.spend != null ? Number(cls.spend) : null;
    const cases = cls && cls.cases != null ? Number(cls.cases) : null;
    const ctr = impressions != null && impressions > 0 && clicks != null
      ? (clicks / impressions) * 100
      : null;
    const clickToCall = clicks != null && clicks > 0 && phones != null
      ? (phones / clicks) * 100
      : null;
    const costPerPhone = phones != null && phones > 0 && searchSpend != null
      ? searchSpend / phones
      : null;
    const costPerClient = cases != null && cases > 0 && mediaSpend != null
      ? mediaSpend / cases
      : null;
    return { ctr, clickToCall, costPerPhone, costPerClient, impressions, clicks, phones, searchSpend, mediaSpend, cases };
  }

  function digitalQualityGoalSpecs() {
    const key = periodToChannelMonth(DATA.period);
    const m = computeDigitalQualityMetrics(key);
    const g = DATA.digitalGoals || { ctr: 4, clickToCall: 20, costPerPhone: 175, costPerClient: 650 };
    const asOf = "2026-10-02";
    const ctrReady = m.ctr != null && Number.isFinite(m.ctr);
    const ctcReady = m.clickToCall != null && Number.isFinite(m.clickToCall);
    const phoneReady = m.costPerPhone != null && Number.isFinite(m.costPerPhone);
    const caseReady = m.costPerClient != null && Number.isFinite(m.costPerClient);
    return [
      {
        id: "dg-ctr",
        label: "CTR",
        value: ctrReady ? `${Math.round(m.ctr * 10) / 10}%` : "—",
        target: `≥ ${g.ctr}%`,
        gauge: true,
        lowerIsBetter: false,
        verified: ctrReady,
        augUpdated: ctrReady,
        hit: ctrReady && m.ctr >= g.ctr,
        alert: ctrReady && m.ctr < g.ctr,
        updatedAsOf: asOf
      },
      {
        id: "dg-click-call",
        label: "Click → call",
        value: ctcReady ? `${Math.round(m.clickToCall * 10) / 10}%` : "—",
        target: `≥ ${g.clickToCall}%`,
        gauge: true,
        lowerIsBetter: false,
        verified: ctcReady,
        augUpdated: ctcReady,
        hit: ctcReady && m.clickToCall >= g.clickToCall,
        alert: ctcReady && m.clickToCall < g.clickToCall,
        updatedAsOf: asOf
      },
      {
        id: "dg-phone-cost",
        label: "Search $/phone",
        value: phoneReady ? `$•••` : "—",
        target: `≤ $${g.costPerPhone}`,
        gauge: true,
        lowerIsBetter: true,
        verified: phoneReady,
        augUpdated: phoneReady,
        hit: phoneReady && m.costPerPhone <= g.costPerPhone,
        alert: phoneReady && m.costPerPhone > g.costPerPhone,
        updatedAsOf: asOf
      },
      {
        id: "dg-case-cost",
        label: "Media $/Client",
        value: caseReady ? `$•••` : "—",
        target: `≤ $${g.costPerClient}`,
        gauge: true,
        lowerIsBetter: true,
        verified: caseReady,
        augUpdated: caseReady,
        hit: caseReady && m.costPerClient <= g.costPerClient,
        alert: caseReady && m.costPerClient > g.costPerClient,
        updatedAsOf: asOf
      }
    ];
  }

  function digitalQualityGoalsSectionHtml() {
    const cards = digitalQualityGoalSpecs()
      .map(k => `<div class="kpi-tile-with-projects">${kpiStatCardHtml(k)}</div>`)
      .join("");
    const periodLabel = String(DATA.period || "").replace(/\s+\d{4}$/, "");
    return `<section class="kpi-section kpi-section-static kpi-section-digital-goals" data-feedback-id="section-digital-goals" data-feedback-label="Digital quality goals">
      ${kpiSectionStaticHead("Digital quality goals", `${periodLabel} · early CTR · click→call · $/phone · month-close $/Client`)}
      <div class="kpi-section-body">
        <div class="kpi-goals-layout">
          <div class="kpi-goals-grid kpi-stat-grid kpi-tiles-4">${cards}</div>
        </div>
      </div>
    </section>`;
  }

  function renderKpis(el, opts) {
    if (!el) return;
    if (!(opts && opts.force) && el.dataset.rendered === RENDER_VER) return;
    const liveKpis = DATA.kpis.filter(k => !k.archived);
    const goals = liveKpis.filter(k => k.goal);
    const metrics = liveKpis.filter(k => !k.goal && k.id !== "#28" && k.id !== "#30" && k.id !== "#19");
    const goalsSpecs = [
      ...goals.map(k => ({ id: k.id, html: kpiGoalCardHtml(k) })),
      { id: "#03", html: teamDuiGoalCardHtml() },
      { id: "cash-pace", html: cashCollectedPaceCardHtml() }
    ];
    const goalsCards = goalsSpecs.map(s =>
      `<div class="kpi-tile-with-projects">${s.html}</div>`
    ).join("");
    const kpiCards = [
      ...metrics.map(k => kpiStatCardHtml(k)),
      yelpGoalCardHtml(),
      adSpendStatCardHtml(),
      answerRateGoalCardHtml()
    ].filter(Boolean).map(html => `<div class="kpi-tile-with-projects">${html}</div>`).join("");
    const goalsBlock = `<section class="kpi-section kpi-section-static kpi-section-goals" data-feedback-id="section-goals" data-feedback-label="KPIs">
          ${kpiSectionStaticHead("Monthly KPIs", monthlyKpisAsOfHint())}
          <div class="kpi-section-body">
            <div class="kpi-goals-layout">
              <div class="kpi-goals-grid kpi-stat-grid kpi-tiles-4">${goalsCards}${kpiCards}</div>
            </div>
          </div>
        </section>`;

    el.innerHTML = `${reportHeader()}
      ${goalsBlock}
      ${digitalQualityGoalsSectionHtml()}
      <section class="kpi-section kpi-section-static" data-feedback-id="section-cases-leads-spend" data-feedback-label="#05 Key Channel Activity">
        ${kpiSectionStaticHead("Channel activity")}
        <div class="kpi-section-body">
          ${casesLeadsSpendSectionHtml()}
        </div>
      </section>`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "kpis");
  }

  /**
   * #08 panel — Impact / Results tab (campaign lead volume).
   * Data: DATA.leadsByCampaign · source KPI_SOURCES["#08"]
   */
  function leadsByCampaignPanelHtml() {
    return `<article class="kpi-split-panel" data-feedback-id="section-leads-campaign" data-feedback-label="#08 Leads by campaign">
      ${statusCorner(true)}
      ${kpiHelpBtn("#08")}
      ${kpiSectionStaticHead("Leads by campaign", "Stacked by month")}
      <div class="kpi-split-panel-body">
        ${chartBlock({
          focus: "#08",
          title: "Leads by campaign",
          chart: stackedLeadsByMonthChart(leadsByMonthFromChannels(DATA.leadsByCampaign)),
          legend: channelLegend(DATA.leadsByCampaign),
          table: campaignLeadsDetailTable(DATA.leadsByCampaign)
        })}
        ${sourceFootnote("#08")}
      </div>
      ${kpiRefMark("#08")}
    </article>`;
  }

  /** Results tab — map live stacks to Guide project IDs. */
  function resultsCampaignProjectMapHtml() {
    const rows = [
      ["Military Search", "#08 leads / spend", ["RETAINER", "AdEnhance"]],
      ["Core DV Search", "#08 leads / spend", ["RETAINER", "AdEnhance"]],
      ["NTGUILT Ads", "#08 leads / spend", ["NtguiltAd", "SocialAds"]],
      ["LSA intake", "#07 · #13 · phone", ["LsaCall", "HsVoip"]],
      ["Digital profiles / reviews", "#16 presence", ["DigProf", "CaseyBrand"]],
      ["Referral network", "#17 referrals", ["Referral"]],
      ["HubSpot / CRM forms", "Website forms fee", ["HsVoip", "HsSetup"]],
      ["Financial waste", "#07 spend waste", ["RETAINER", "HsVoip"]]
    ];
    const body = rows.map(([stack, metric, ids]) => [
      escapeHtml(stack),
      escapeHtml(metric),
      escapeHtml(ids.join(" · "))
    ]);
    return kpiDetailTable(["Channel / stack", "Tied KPI", "Guide project"], body);
  }

  /** Results tab — INDEX statuses that should show measurable outcomes. */
  function resultsProjectStatusBoardHtml() {
    const data = window.PROJECT_DATA || {};
    const items = [];
    if (data.retainer) items.push({ ...data.retainer, id: "RETAINER" });
    (data.projects || []).forEach(p => items.push(p));
    const keep = new Set(["required", "recommended", "launched", "wip", "started", "completed", "ongoing"]);
    const rows = items
      .filter(p => keep.has(String(p.status || "").toLowerCase().replace(/\s+/g, "")) || /wip|started|launched|recommended|required|completed|ongoing/i.test(String(p.status || "")))
      .slice(0, 18)
      .map(p => {
        const st = String(p.status || "available");
        const tip = p.id === "NtguiltAd" ? "#08 NTGUILT"
          : p.id === "RETAINER" ? "#08 Military · Core DV · mgmt"
          : p.id === "LsaCall" ? "LSA process"
          : p.id === "DigProf" ? "#16 presence"
          : p.id === "Referral" ? "#17 referrals"
          : p.id === "WasteAud" ? "Spend waste"
          : p.id === "SummerEmail" || p.id === "StackAudit" || p.id === "AccessAud" || p.id === "EmailDns" ? "Completed report-out"
          : "Guide outcomes";
        return [
          escapeHtml(p.id),
          escapeHtml(p.title || p.id),
          escapeHtml(st),
          escapeHtml(tip)
        ];
      });
    if (!rows.length) {
      return `<p class="data-inline-note">No INDEX projects with active/completed status yet.</p>`;
    }
    return `${kpiDetailTable(["ID", "Project", "Status", "Results tie-in"], rows)}
      <p class="data-inline-note">Board reads live <code>PROJECT_DATA</code> from INDEX. Completed rows also feed the report-out draft below.</p>`;
  }

  function lsaResultsStripHtml() {
    const rows = DATA.lsaEfficiency || [];
    if (!rows.length) return `<p class="data-inline-note">LSA efficiency rows not loaded.</p>`;
    const newest = chronological(rows);
    const body = newest.map(r => [
      escapeHtml(r.month),
      String(r.leads),
      String(r.charged),
      r.leads ? `${Math.round((r.charged / r.leads) * 1000) / 10}%` : "—",
      fmtMoney(r.lsaSpend),
      r.charged ? fmtMoney(r.lsaSpend / r.charged) : "—"
    ]);
    return kpiDetailTable(["Month", "Leads", "Charged", "Charge rate", "Spend", "Avg charge cost"], body);
  }

  function renderImpact(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    el.innerHTML = `<div class="data-grid">
      ${dataCardHtml(
        "Leads by campaign",
        "#08 · Military · Core DV · NTGUILT",
        leadsByCampaignPanelHtml(),
        { full: true, id: "results-leads-campaign" }
      )}
      ${dataCardHtml(
        "Project status board",
        "Required · recommended · launched · WIP · completed — from INDEX.",
        resultsProjectStatusBoardHtml(),
        { full: true, id: "results-status-board" }
      )}
      ${dataCardHtml(
        "LSA efficiency",
        "Inbox charge rate by month",
        lsaResultsStripHtml(),
        { full: true, id: "results-lsa" }
      )}
    </div>`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "impact");
  }

  /**
   * #17 Referral Network — placeholder counts (null) until Referral tracking wires.
   * Doc: parked/KPI-17-REFERRAL-NETWORK.md
   */
  function totalReferralNetworkPanelHtml() {
    const segs = presencePieSegments(DATA.referrals);
    const tableRows = DATA.referrals.map(r => [
      `${star(!!r.verified)} ${escapeHtml(r.platform)}`,
      dash(r.count),
      r.delta != null ? (momChangeHtml(r.delta) || dash(r.delta)) : dash(r.delta)
    ]);
    return chartBlock({
      focus: "#17",
      title: "Referral Network Activity",
      chart: donutChart(segs),
      table: kpiDetailTable(["Channel", "Referrers", "Change"], tableRows)
    });
  }

  function dashboardSectionsHtml() {
    const depositHit = meetsTarget(DATA.avgDeposit.current, DATA.avgDeposit.target, false);
    return `<section class="kpi-section kpi-section-static" data-feedback-id="section-business-health" data-feedback-label="Pipeline & deposits">
        ${kpiSectionStaticHead("Pipeline & source mix")}
        <div class="kpi-section-body">
          <div class="kpi-split-grid">
            <article class="kpi-split-panel" data-feedback-id="section-cases-mom" data-feedback-label="#04 Cases MoM">
              ${statusCorner(false)}
              ${kpiSectionStaticHead("Cases MoM", "Closed · New · Red accounts")}
              <div class="kpi-split-panel-body">
                ${chartBlock({
                  focus: "#04",
                  title: "Cases by month",
                  chart: stackedCasesMomChart(casesMomByMonth(DATA.casesMom, DATA.casesMomSeries)),
                  legend: casesMomLegend(DATA.casesMomSeries, DATA.casesMom),
                  table: casesMomDetailTable(DATA.casesMom)
                })}
              </div>
              ${kpiRefMark("#04")}
            </article>
            <article class="kpi-split-panel kpi-verified" data-feedback-id="section-source-mix" data-feedback-label="#10 Source mix">
              ${kpiSectionStaticHead("Source mix", "Lead share by channel")}
              <div class="kpi-split-panel-body">
                ${chartBlock({
                  focus: "#10",
                  title: "Source mix",
                  chart: donutChart(DATA.sourceMix),
                  table: sourceMixDetailTable(DATA.sourceMix)
                })}
                ${sourceFootnote("#10")}
              </div>
              ${kpiRefMark("#10")}
            </article>
          </div>
          <div class="kpi-dash-grid-2 kpi-dash-grid-1" style="margin-top:1rem">
            <div class="kpi-dash-card kpi-dash-target-bar" data-kpi-focus="#20">
              ${statusCorner(false)}
              <span class="kpi-stat-id">Avg deposit</span>
              ${avgDepositTargetBarChart()}
              <div class="kpi-stat-label">Goal $${DATA.avgDeposit.target} · placeholder current $${DATA.avgDeposit.current}</div>
              ${depositHit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
              ${kpiDetailTable(
                ["Measure", "Amount"],
                [
                  ["Current (placeholder)", `$${DATA.avgDeposit.current}`],
                  ["Goal", `$${DATA.avgDeposit.target}`],
                  ["Gap", `$${DATA.avgDeposit.target - DATA.avgDeposit.current}`]
                ]
              )}
              ${kpiRefMark("#20")}
            </div>
          </div>
        </div>
      </section>`;
  }

  function presenceToneClass(status) {
    if (status === "active") return "kpi-presence kpi-presence-on";
    if (status === "building") return "kpi-presence kpi-presence-building";
    if (status === "updated") return "kpi-presence kpi-presence-updated";
    if (status === "outdated") return "kpi-presence kpi-presence-outdated";
    return "kpi-presence kpi-presence-gap";
  }

  /** Channel name; optional listing URL opens in a new tab. */
  function presenceChannelNameHtml(r) {
    const name = escapeHtml(r.platform);
    if (!r.url) return `${star(!!r.verified)} ${name}`;
    return `${star(!!r.verified)} <a class="kpi-presence-link" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${name}</a>`;
  }

  /** Rating column — plain value only. Directory ranks use the same cell as star ratings. */
  function presenceRatingHtml(r) {
    if (r && r.rating != null && r.rating !== "") return dash(r.rating);
    if (r && r.rank != null && Number.isFinite(Number(r.rank))) return dash(String(r.rank));
    return dash(null);
  }

  function presenceMixColumnHtml() {
    const anyVerified = DATA.reviews.some(r => r.verified);
    const sorted = sortByPresenceStatus(DATA.reviews);
    const segs = presencePieSegments(DATA.reviews);
    const rows = sorted.map(r => [
      presenceChannelNameHtml(r),
      presenceRatingHtml(r),
      dash(r.count),
      `<span class="${presenceToneClass(r.status)}">${escapeHtml(presenceLabel(r.status))}</span>`
    ]);
    const channelTable = kpiDetailAccordion(
      "Channel table",
      `${DATA.reviews.length} directories`,
      ["Channel", "Rating", "#", "Status"],
      rows,
      true
    );
    return chartBlock({
      focus: "#16",
      help: false,
      verified: anyVerified,
      title: "Legal Referral Sites",
      chart: donutChart(segs),
      table: channelTable
    });
  }

  function reviewsByChannelPanelHtml() {
    return presenceMixColumnHtml();
  }

  function leadsByChannelPanelHtml() {
    const chart = stackedLeadsByMonthChart(leadsByMonthFromChannels(DATA.channels, { useChannelMonths: true }));
    const legend = channelLegend(DATA.channels);
    const table = channelsDetailTable(DATA.channels);
    return chartBlock({
      focus: "#01",
      helpId: "#01",
      title: "Leads by channel",
      chart,
      legend,
      table: `${table}${sourceFootnote("#01")}`
    });
  }

  /**
   * Parked — Lead Share & Potential Revenue (#10).
   * Doc: parked/KPI-10-LEAD-SHARE-REVENUE.md
   * Restore: insert `${sourceMixPanelHtml()}` (or KPI_REPORT.parked.sourceMixPanelHtml()).
   */
  function sourceMixPanelHtml() {
    return `<article class="kpi-split-panel" data-feedback-id="section-source-mix" data-feedback-label="#10 Source mix">
      ${statusCorner(true)}
      ${kpiSectionStaticHead("Source mix", "Lead share by channel")}
      <div class="kpi-split-panel-body">
        ${chartBlock({
          focus: "#10",
          title: "Source mix",
          chart: donutChart(DATA.sourceMix),
          table: sourceMixDetailTable(DATA.sourceMix)
        })}
        ${sourceFootnote("#10")}
      </div>
      ${kpiRefMark("#10")}
    </article>`;
  }

  function casesMomPanelHtml() {
    return chartBlock({
      focus: "#04",
      title: "Cases by month",
      chart: stackedCasesMomChart(casesMomByMonth(DATA.casesMom, DATA.casesMomSeries)),
      legend: casesMomLegend(DATA.casesMomSeries, DATA.casesMom),
      table: casesMomDetailTable(DATA.casesMom)
    });
  }

  function casesCreatedYearToggleHtml() {
    const y = Number(casesCreatedViewYear) === 2025 ? 2025 : 2026;
    return `<div class="kpi-report-pills kpi-cash-year-pills" role="group" aria-label="Cases created year">
      <button type="button" class="kpi-report-pill${y === 2026 ? " is-active" : ""}" data-cases-year="2026" aria-pressed="${y === 2026 ? "true" : "false"}">2026</button>
      <button type="button" class="kpi-report-pill${y === 2025 ? " is-active" : ""}" data-cases-year="2025" aria-pressed="${y === 2025 ? "true" : "false"}">2025</button>
    </div>`;
  }

  function setCasesCreatedYear(year) {
    const next = Number(year) === 2025 ? 2025 : 2026;
    if (casesCreatedViewYear === next) return;
    casesCreatedViewYear = next;
    const el = document.getElementById("kpi-report-data");
    if (el) renderData(el, { force: true });
  }

  function casesCreatedPanelHtml() {
    const year = Number(casesCreatedViewYear) === 2025 ? 2025 : 2026;
    const chartRows = cashAndCasesChartRows().filter(r => Number(r.year) === year);
    if (!chartRows.length) return "";
    const trendLegend = year === 2026
      ? `<li><span class="kpi-stack-swatch" style="background:#1e3a8a" aria-hidden="true"></span><span>2026 trend</span></li>`
      : `<li><span class="kpi-stack-swatch" style="background:#c45c26" aria-hidden="true"></span><span>2025 trend</span></li>`;
    return chartBlock({
      helpId: "cases-created",
      title: "Cases Created",
      chart: casesCreatedChart(chartRows),
      legend: `<ul class="kpi-stack-legend" aria-label="Cases chart marks">
        <li><span class="kpi-stack-swatch" style="background:#3a1a6e" aria-hidden="true"></span><span>Cases</span></li>
        ${trendLegend}
      </ul>`,
      table: `${casesCreatedTrendTable(chartRows)}${sourceFootnote("cases-created")}`
    });
  }

  /** Jan–Aug complete months only · YoY % for Data tab. */
  function casesYoyComparableRows() {
    const y25 = new Map(
      (DATA.cashCollected || [])
        .filter(r => r.newCases != null && !/\*/.test(String(r.month || "")))
        .map(r => [String(r.month).replace(/\*$/, ""), Number(r.newCases) || 0])
    );
    const y26 = new Map(
      (DATA.cashCollected2026Ytd || [])
        .filter(r => r.newCases != null && !/\*/.test(String(r.month || "")))
        .map(r => [String(r.month).replace(/\*$/, ""), Number(r.newCases) || 0])
    );
    const order = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    return order
      .filter(m => y25.has(m) && y26.has(m) && y25.get(m) > 0)
      .map(month => {
        const c25 = y25.get(month);
        const c26 = y26.get(month);
        const delta = c26 - c25;
        const yoyPct = Math.round(((c26 - c25) / c25) * 1000) / 10;
        return { month, c25, c26, delta, yoyPct };
      });
  }

  function casesYoyPctChart(rows) {
    rows = chronological(rows || []);
    if (!rows.length) return "";
    const vals = rows.map(r => Number(r.yoyPct) || 0);
    /* Negative scale ends at −100%. Positive scale still clears the highest YoY bar. */
    const axisMin = -100;
    const posMax = Math.max(...vals.filter(v => v > 0), 1);
    const axisMax = chartAxisMax([posMax]);
    const w = Math.max(720, rows.length * 72 + 110);
    const h = 290;
    const pad = { l: 58, r: 22, t: 28, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / rows.length;
    const barW = Math.min(42, slot * 0.58);
    const span = axisMax - axisMin;
    const yFor = val => {
      const clamped = Math.max(axisMin, Math.min(axisMax, Number(val) || 0));
      return pad.t + plotH * (1 - (clamped - axisMin) / span);
    };
    const zeroY = yFor(0);
    const tickVals = [axisMin, Math.round(axisMin / 2), 0];
    const posStep = axisMax >= 200 ? Math.round(axisMax / 2) : Math.round(axisMax / 2) || axisMax;
    if (posStep > 0 && posStep < axisMax) tickVals.push(posStep);
    tickVals.push(axisMax);
    const ticks = [...new Set(tickVals)].sort((a, b) => a - b).map(val => {
      const y = yFor(val);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${val}%</text>
      </g>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const pct = Number(r.yoyPct) || 0;
      const y1 = yFor(pct);
      const y = Math.min(zeroY, y1);
      const bh = Math.max(4, Math.abs(zeroY - y1));
      const x = pad.l + i * slot + (slot - barW) / 2;
      const fill = pct >= 0 ? "var(--gg-positive)" : "var(--gg-negative)";
      const label = `${pct > 0 ? "+" : ""}${pct}%`;
      const labelY = pct >= 0 ? y - 8 : y + bh + 14;
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${fill}"/>
        <text x="${x + barW / 2}" y="${labelY}" text-anchor="middle" class="kpi-chart-total" style="fill:${fill}">${escapeHtml(label)}</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-cash-long-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="YoY percent change in new cases, comparable months Jan through Aug, scale from negative 100 percent to positive peak">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      <line x1="${pad.l}" y1="${zeroY}" x2="${w - pad.r}" y2="${zeroY}" stroke="var(--gg-brown)" stroke-width="1.5"/>
      ${bars}
    </svg>`;
  }

  function casesYoyCountsChart(rows) {
    rows = chronological(rows || []);
    if (!rows.length) return "";
    const values = rows.flatMap(r => [r.c25, r.c26]);
    const max = chartAxisMax(values);
    const w = Math.max(720, rows.length * 72 + 110);
    const h = 290;
    const pad = { l: 58, r: 22, t: 28, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / rows.length;
    const groupW = Math.min(48, slot * 0.7);
    const barW = Math.max(8, (groupW - 4) / 2);
    const ticks = axisTicks(max, 4).map(val => {
      const y = pad.t + plotH * (1 - val / max);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${val}</text>
      </g>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const x0 = pad.l + i * slot + (slot - groupW) / 2;
      const h25 = Math.max(4, (plotH * r.c25) / max);
      const h26 = Math.max(4, (plotH * r.c26) / max);
      return `<g>
        <rect x="${x0}" y="${pad.t + plotH - h25}" width="${barW}" height="${h25}" rx="3" fill="#64748b"/>
        <rect x="${x0 + barW + 4}" y="${pad.t + plotH - h26}" width="${barW}" height="${h26}" rx="3" fill="#3a1a6e"/>
        <text x="${x0 + groupW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-cash-long-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="New cases 2025 versus 2026 by comparable month">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      ${bars}
    </svg>`;
  }

  function casesYoyDetailTable(rows) {
    return kpiDetailTable(
      ["Month", "2025", "2026", "Δ cases", "YoY %"],
      rows.map(r => [
        r.month,
        String(r.c25),
        String(r.c26),
        `${r.delta > 0 ? "+" : ""}${r.delta}`,
        `${r.yoyPct > 0 ? "+" : ""}${r.yoyPct}%`
      ])
    );
  }

  function casesYoyPanelHtml() {
    const rows = casesYoyComparableRows();
    if (!rows.length) return "";
    return chartBlock({
      helpId: "cases-yoy",
      title: "YOY Cases",
      chart: casesYoyPctChart(rows),
      legend: `<ul class="kpi-stack-legend" aria-label="YoY percent marks">
        <li><span class="kpi-stack-swatch" style="background:var(--gg-positive)" aria-hidden="true"></span><span>Up vs 2025</span></li>
        <li><span class="kpi-stack-swatch" style="background:var(--gg-negative)" aria-hidden="true"></span><span>Down vs 2025</span></li>
      </ul>`,
      table: `${casesYoyDetailTable(rows)}${sourceFootnote("cases-yoy")}`
    });
  }

  function casesYoyCountsPanelHtml() {
    const rows = casesYoyComparableRows();
    if (!rows.length) return "";
    return chartBlock({
      helpId: "cases-yoy",
      title: "Cases by Comparable Month",
      chart: casesYoyCountsChart(rows),
      legend: `<ul class="kpi-stack-legend" aria-label="Year count marks">
        <li><span class="kpi-stack-swatch" style="background:#64748b" aria-hidden="true"></span><span>2025</span></li>
        <li><span class="kpi-stack-swatch" style="background:#3a1a6e" aria-hidden="true"></span><span>2026</span></li>
      </ul>`,
      table: casesYoyDetailTable(rows)
    });
  }

  const ROAS_TARGET_X = 10;

  /** Match casesLeadsSpend month keys to cashCollected2026Ytd · Sep* ↔ Sep*. */
  function cashCreditForMonth(monthKey) {
    const want = String(monthKey || "").trim();
    const wantBase = want.replace(/\*$/, "");
    const rows = DATA.cashCollected2026Ytd || [];
    const hit =
      rows.find(r => String(r.month || "").trim() === want) ||
      rows.find(r => String(r.month || "").replace(/\*$/, "").trim() === wantBase);
    if (!hit || hit.credit == null) return null;
    return Number(hit.credit);
  }

  function roasMonthlyRows() {
    const rows = chronological(DATA.casesLeadsSpend || []).filter(r => r && r.month);
    return rows.map(r => {
      const cases = r.cases == null ? null : Number(r.cases);
      const search = r.adsSpend == null ? null : Number(r.adsSpend);
      const lsa = r.lsaSpend == null ? null : Number(r.lsaSpend);
      const media =
        search == null && lsa == null
          ? null
          : (Number(search) || 0) + (Number(lsa) || 0);
      const credits = cashCreditForMonth(r.month);
      let roas = null;
      /* Skip Search $0 months — LSA-only media inflates ROAS. */
      const searchOn = search != null && search > 0;
      if (credits != null && media != null && media > 0 && searchOn) {
        roas = Math.round((credits / media) * 10) / 10;
      }
      return {
        month: r.month,
        cases,
        credits,
        search,
        lsa,
        media,
        roas
      };
    });
  }

  function roasMonthlyChart(rows) {
    const plot = chronological((rows || []).filter(r => r.roas != null));
    if (!plot.length) return "";
    const vals = plot.map(r => Number(r.roas) || 0);
    const max = chartAxisMax([...vals, ROAS_TARGET_X]);
    const w = Math.max(720, plot.length * 72 + 110);
    const h = 290;
    const pad = { l: 58, r: 22, t: 28, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / plot.length;
    const barW = Math.min(42, slot * 0.58);
    const targetY = pad.t + plotH * (1 - ROAS_TARGET_X / max);
    const ticks = axisTicks(max, 4).map(val => {
      const y = pad.t + plotH * (1 - val / max);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${val}×</text>
      </g>`;
    }).join("");
    const bars = plot.map((r, i) => {
      const v = Number(r.roas) || 0;
      const bh = Math.max(4, (plotH * v) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const fill = "#64748b";
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${fill}"/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total">${v.toFixed(1)}×</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-cash-long-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Monthly return on marketing spend with ${ROAS_TARGET_X} times target">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      <line x1="${pad.l}" y1="${targetY}" x2="${w - pad.r}" y2="${targetY}" stroke="var(--gg-brown)" stroke-width="1.5" stroke-dasharray="6 4"/>
      <text x="${w - pad.r}" y="${targetY - 6}" text-anchor="end" class="kpi-chart-axis">target ${ROAS_TARGET_X}×</text>
      ${bars}
    </svg>`;
  }

  function roasMonthlyTable(rows) {
    const list = chronological(rows || []);
    return kpiDetailTable(
      ["Month", "Cases", "Credits", "Search", "LSA", "Media", "ROAS"],
      list.map(r => [
        escapeHtml(r.month),
        r.cases == null ? "—" : String(r.cases),
        r.credits == null ? "—" : "$•••",
        r.search == null ? "—" : "$•••",
        r.lsa == null ? "—" : "$•••",
        r.media == null ? "—" : "$•••",
        r.roas == null ? "—" : `${r.roas.toFixed(1)}×`
      ])
    );
  }

  function roasMonthlyPanelHtml() {
    const rows = roasMonthlyRows();
    if (!rows.length) return "";
    return chartBlock({
      helpId: "roas-monthly",
      title: "Return on Marketing Spend",
      chart: roasMonthlyChart(rows),
      table: `${roasMonthlyTable(rows)}${sourceFootnote("roas-monthly")}`
    });
  }

  function findLsaEfficiencyMonth(key) {
    const want = String(key || "").replace(/\*$/, "");
    return (DATA.lsaEfficiency || []).find(r => String(r.month || "").replace(/\*$/, "") === want) || null;
  }

  function searchWeekdayAnswerPct(phoneRow) {
    const p = phoneRow || {};
    const wdCalls = Number(p.weekdayCalls);
    const wdMissed = Number(p.weekdayMissed);
    if (p.weekdayCalls != null && Number.isFinite(wdCalls) && wdCalls > 0) {
      const answered = Math.max(0, wdCalls - (Number.isFinite(wdMissed) ? wdMissed : 0));
      return Math.round((answered / wdCalls) * 100);
    }
    if (p.answeredPct != null) return Number(p.answeredPct);
    const calls = Number(p.calls) || 0;
    const received = Number(p.received) || 0;
    return calls ? Math.round((received / calls) * 100) : null;
  }

  function answerRateRows() {
    const phone = DATA.phoneByMonth || {};
    const yelpBy = (DATA.yelpBaseline && DATA.yelpBaseline.byMonth) || {};
    const target = (DATA.phoneIntake && DATA.phoneIntake.targetPct) || 90;
    /* Yelp answer rate stays on file at 40% baseline · add into Avg % next month. */
    const includeYelpInAvg = false;
    const order = ["May", "Jun", "Jul", "Aug", "Sep"];
    const partial = { Aug: true, Sep: true };
    return order.filter(k => phone[k] || findLsaEfficiencyMonth(k) || yelpBy[k] || yelpBy[String(k).toLowerCase()]).map(k => {
      const p = phone[k] || {};
      const weekdayCalls = p.weekdayCalls != null ? Number(p.weekdayCalls) || 0 : null;
      const weekdayMissed = p.weekdayMissed != null ? Number(p.weekdayMissed) || 0 : null;
      const weekdayReceived = weekdayCalls != null && weekdayMissed != null
        ? Math.max(0, weekdayCalls - weekdayMissed)
        : null;
      const searchCalls = weekdayCalls != null ? weekdayCalls : Number(p.calls) || 0;
      const searchReceived = weekdayReceived != null ? weekdayReceived : Number(p.received) || 0;
      const searchMissed = weekdayMissed != null ? weekdayMissed : Number(p.missed) || 0;
      const searchPct = searchWeekdayAnswerPct(p);
      const lsa = findLsaEfficiencyMonth(k);
      const lsaLeads = lsa ? Number(lsa.leads) || 0 : null;
      const lsaCharged = lsa ? Number(lsa.charged) || 0 : null;
      const lsaPct = lsaLeads
        ? Math.round((lsaCharged / lsaLeads) * 100)
        : null;
      const y = yelpBy[k] || yelpBy[String(k).toLowerCase()] || null;
      const yelpCalls = y ? Number(y.calls) || 0 : null;
      const yelpAnswered = y ? Number(y.answeredCalls) || 0 : null;
      const yelpPct = yelpCalls > 0
        ? Math.round((yelpAnswered / yelpCalls) * 100)
        : null;
      const channelPcts = includeYelpInAvg
        ? [searchPct, lsaPct, yelpPct].filter(v => v != null && Number.isFinite(v))
        : [searchPct, lsaPct].filter(v => v != null && Number.isFinite(v));
      const avgPct = channelPcts.length
        ? Math.round(channelPcts.reduce((sum, v) => sum + v, 0) / channelPcts.length)
        : null;
      return {
        month: partial[k] ? `${k}*` : k,
        key: k,
        searchCalls,
        searchReceived,
        searchMissed,
        searchPct,
        searchWeekdayOnly: p.weekdayCalls != null,
        lsaLeads,
        lsaCharged,
        lsaPct,
        yelpCalls,
        yelpAnswered,
        yelpPct,
        avgPct,
        channelCount: channelPcts.length,
        target,
        /* Keep answeredPct alias for KPI tile Search-only callers. */
        answeredPct: searchPct,
        calls: searchCalls,
        received: searchReceived,
        missed: searchMissed
      };
    });
  }

  function answerRateChart(rows) {
    const plot = chronological((rows || []).filter(r => r.avgPct != null));
    if (!plot.length) return "";
    const target = (plot[0] && plot[0].target) || 90;
    const max = 100;
    const w = Math.max(720, plot.length * 72 + 110);
    const h = 290;
    const pad = { l: 58, r: 22, t: 28, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const slot = plotW / plot.length;
    const barW = Math.min(42, slot * 0.58);
    const targetY = pad.t + plotH * (1 - target / max);
    const ticks = [0, 25, 50, 75, 100].map(val => {
      const y = pad.t + plotH * (1 - val / max);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 8}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${val}%</text>
      </g>`;
    }).join("");
    const bars = plot.map((r, i) => {
      const v = Number(r.avgPct) || 0;
      const bh = Math.max(4, (plotH * v) / max);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      const fill = "#64748b";
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="${fill}"/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total">${v}%</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}</text>
      </g>`;
    }).join("");
    return `<svg class="kpi-chart-svg kpi-chart-svg-plot kpi-cash-long-chart" viewBox="0 0 ${w} ${h}" role="img" aria-label="Average answer rate across Search weekday, LSA, and Yelp with ${target} percent target">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      <line x1="${pad.l}" y1="${targetY}" x2="${w - pad.r}" y2="${targetY}" stroke="var(--gg-brown)" stroke-width="1.5" stroke-dasharray="6 4"/>
      <text x="${w - pad.r}" y="${targetY - 6}" text-anchor="end" class="kpi-chart-axis">target ${target}%</text>
      ${bars}
    </svg>`;
  }

  function answerRateTable(rows) {
    return kpiDetailTable(
      [
        "Month",
        "Avg %",
        "Search %",
        "LSA %"
      ],
      newestFirst(rows || []).map(r => [
        escapeHtml(r.month),
        r.avgPct == null ? "—" : `${r.avgPct}%`,
        r.searchPct == null ? "—" : `${r.searchPct}%`,
        r.lsaPct == null ? "—" : `${r.lsaPct}%`
      ])
    );
  }

  function answerRatePanelHtml() {
    const rows = answerRateRows();
    if (!rows.length) return "";
    return chartBlock({
      focus: "#21",
      help: false,
      title: "Answer Rate",
      chart: answerRateChart(rows),
      table: `${answerRateTable(rows)}${sourceFootnote("answer-rate")}`
    });
  }

  function answerRateDataSectionHtml() {
    const panel = answerRatePanelHtml();
    if (!panel) return "";
    return `<section class="kpi-section kpi-section-static kpi-verified kpi-aug-updated" data-feedback-id="section-answer-rate" data-feedback-label="Answer rate">
      ${statusCorner(true)}
      ${kpiHelpBtn("answer-rate")}
      ${kpiSectionStaticHead("Answer Rate", "Avg of Search · LSA · target ≥ 90% · Yelp next month")}
      <div class="kpi-section-body">
        <div class="data-chart-table-stack">
          ${panel}
        </div>
      </div>
    </section>`;
  }

  function avgDepositPanelHtml() {
    const depositHit = meetsTarget(DATA.avgDeposit.current, DATA.avgDeposit.target, false);
    return `<div class="kpi-dash-card kpi-dash-target-bar" data-kpi-focus="#20">
      ${statusCorner(false)}
      <span class="kpi-stat-id">Avg deposit</span>
      ${avgDepositTargetBarChart()}
      <div class="kpi-stat-label">Goal $${DATA.avgDeposit.target} · placeholder current $${DATA.avgDeposit.current}</div>
      ${depositHit ? '<span class="kpi-target-hit">Target reached</span>' : ""}
      ${kpiDetailTable(
        ["Measure", "Amount"],
        [
          ["Current (placeholder)", `$${DATA.avgDeposit.current}`],
          ["Goal", `$${DATA.avgDeposit.target}`],
          ["Gap", `$${DATA.avgDeposit.target - DATA.avgDeposit.current}`]
        ]
      )}
      ${kpiRefMark("#20")}
    </div>`;
  }

  function dataCardHtml(title, note, body, opts) {
    const full = opts && opts.full ? " data-grid-full" : "";
    const extraClass = opts && opts.className ? ` ${escapeHtml(opts.className)}` : "";
    const id = opts && opts.id ? ` id="${escapeHtml(opts.id)}"` : "";
    const inputNeeded = opts && opts.inputNeeded;
    const inputClass = inputNeeded ? " data-card-input-needed" : "";
    const disabled = inputNeeded ? ' aria-disabled="true"' : "";
    const inputProjectEgg = opts && opts.inputProjectId
      ? projectEggLink(opts.inputProjectId, opts.inputProjectLabel, opts.inputProjectEgg)
      : "";
    const head = title ? `<h3>${escapeHtml(title)}</h3>` : "";
    return `<section class="data-card${full}${extraClass}${inputClass}"${id}${disabled}>
      ${head}
      ${note ? `<p class="data-card-note">${escapeHtml(note)}</p>` : ""}
      <div class="data-card-body">${body || ""}</div>
      ${inputNeeded ? '<div class="data-input-needed-overlay" role="status">Data Input Needed</div>' : ""}
      ${inputProjectEgg}
    </section>`;
  }

  function trustTransfersSectionHtml() {
    const trust = DATA.trustTransfers;
    if (!trust) return "";
    const rows = (trust.monthly || []).filter(r => (r.applications || 0) > 0 || /\*/.test(String(r.month || "")));
    return `<section class="kpi-section kpi-section-static kpi-verified kpi-aug-updated" data-feedback-id="section-trust-transfers" data-feedback-label="Trust applications">
      ${statusCorner(true)}
      ${kpiSectionStaticHead("Trust applications", `Ledger through ${formatPulledMd(trust.rangeEnd) || "—"}`)}
      <div class="kpi-section-body">
        ${chartBlock({
          title: "Trust applications",
          chart: trustApplicationsChart(trust.monthly || []),
          table: trustTransfersTable(trust)
        })}
      </div>
    </section>`;
  }

  function searchEfficiencyDataSectionHtml() {
    const months = chronological(DATA.channelMonths || []).filter(m => m && Number(m.searchSpend) >= 0);
    if (!months.length) return "";
    const phone = DATA.phoneByMonth || {};
    const rows = newestFirst(months).map(m => {
      const key = String(m.month || "").replace(/\*$/, "");
      const p = phone[key] || {};
      const calls = Number(p.calls) || Number(m.search) || 0;
      const received = Number(p.received) || 0;
      const missed = Number(p.missed) || 0;
      const spend = Number(m.searchSpend) || 0;
      const answeredPct = p.answeredPct != null ? p.answeredPct : (calls ? Math.round((received / calls) * 100) : null);
      return [
        escapeHtml(m.month),
        fmtMoney(spend),
        String(received),
        String(missed),
        answeredPct != null ? `${answeredPct}%` : "—",
        calls ? fmtMoney(spend / calls) : "—",
        received ? fmtMoney(spend / received) : "—"
      ];
    });
    return `<section class="kpi-section kpi-section-static kpi-verified kpi-aug-updated" data-feedback-id="section-search-efficiency" data-feedback-label="Search efficiency">
      ${statusCorner(true)}
      ${kpiSectionStaticHead("Search efficiency", "Call details + activities")}
      <div class="kpi-section-body">
        ${chartBlock({
          title: "Search efficiency",
          table: kpiDetailTable(
            ["Month", "Search $", "Received", "Missed", "Answer %", "$ / call", "$ / answered"],
            rows
          )
        })}
        <p class="data-inline-note">Aug* Search calls through Aug 14 from Call details (4) · no rows Aug 15–24 · Search $ from account_activities_202608(3) NTGUILT clicks only.</p>
      </div>
    </section>`;
  }

  function renderData(el, opts) {
    if (!el) return;
    if (!(opts && opts.force) && el.dataset.rendered === RENDER_VER) return;
    el.innerHTML = `
      ${financialBreakdownTilesHtml()}
      ${cashCollectedDataSectionHtml()}
      ${answerRateDataSectionHtml()}
      <section class="kpi-section kpi-section-static kpi-verified kpi-aug-updated" data-feedback-id="section-cases-yoy-fee" data-feedback-label="Cases YoY and fees">
        ${statusCorner(true)}
        ${kpiSectionStaticHead("Cases and Fees", "Practice area average fee · year-over-year cases · contacts and spend")}
        <div class="kpi-section-body">
          <div class="data-chart-table-stack">
            ${feeByPracticeSectionHtml()}
            ${casesYoyPanelHtml()}
            ${newCasesContactsSpendChartBlockHtml()}
          </div>
        </div>
      </section>`;
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "data");
  }

  /** Blended 2026 case forecast: prior-year H2 seasonality + current H1 run rate. */
  function caseForecastPanelHtml() {
    const forecast = [
      { month: "Nov", cases: 12 },
      { month: "Dec", cases: 14 }
    ];
    const actual = [
      { month: "Feb", cases: 14 },
      { month: "Mar", cases: 17 },
      { month: "Apr", cases: 15 },
      { month: "May", cases: 22 },
      { month: "Jun", cases: 36 },
      { month: "Jul", cases: 35 },
      { month: "Aug", cases: 20 },
      { month: "Sep", cases: 16 },
      { month: "Oct*", cases: 0 }
    ];
    const rows = [
      ...actual.map(r => ({ ...r, forecast: false })),
      ...forecast.map(r => ({ ...r, forecast: true }))
    ];
    const w = 820;
    const h = 290;
    const pad = { l: 54, r: 20, t: 50, b: 48 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const axisMax = chartAxisMax(rows.map(r => r.cases));
    const slot = plotW / rows.length;
    const barW = Math.min(42, slot * 0.58);
    const ticks = axisTicks(axisMax, 5).map(value => {
      const y = pad.t + plotH * (1 - value / axisMax);
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 9}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${value}</text>
      </g>`;
    }).join("");
    const bars = rows.map((r, i) => {
      const bh = Math.max(5, (plotH * r.cases) / axisMax);
      const x = pad.l + i * slot + (slot - barW) / 2;
      const y = pad.t + plotH - bh;
      return `<g>
        <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="var(--gg-royal-blue)" fill-opacity="${r.forecast ? "0.38" : "1"}"/>
        <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total"${r.forecast ? ' opacity="0.62"' : ""}>${r.cases}</text>
        <text x="${x + barW / 2}" y="${h - 16}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(r.month)}${r.forecast ? " F" : ""}</text>
      </g>`;
    }).join("");
    const dividerX = pad.l + actual.length * slot;
    const actualCenter = pad.l + (actual.length * slot) / 2;
    const forecastCenter = dividerX + (forecast.length * slot) / 2;
    const chart = `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="2026 cases: February through September actual, then October through December forecast, oldest to newest">
      <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
      ${ticks}
      <text x="${actualCenter}" y="24" text-anchor="middle" class="kpi-chart-total">Completed · Feb → Sep*</text>
      <text x="${forecastCenter}" y="24" text-anchor="middle" class="kpi-chart-total">Forecast · Oct → year end</text>
      <line x1="${dividerX}" y1="32" x2="${dividerX}" y2="${h - pad.b + 8}" stroke="var(--secondary)" stroke-width="2" stroke-dasharray="4 6"/>
      ${bars}
      <text x="15" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 15 ${pad.t + plotH / 2})" class="kpi-chart-axis">Cases</text>
    </svg>`;
    const tableRows = rows.map(r => [
      r.month,
      String(r.cases),
      r.forecast ? "Forecast · transparent" : "Actual · completed"
    ]);
    return `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.75rem;margin-bottom:0.85rem">
        <div class="kpi-mini-card"><h3>Jan–Jun actual</h3><p class="kpi-mini-value">116</p></div>
        <div class="kpi-mini-card"><h3>Jul–Dec forecast</h3><p class="kpi-mini-value">85</p></div>
        <div class="kpi-mini-card"><h3>2026 full-year estimate</h3><p class="kpi-mini-value">201</p></div>
      </div>
      ${chartBlock({
        title: "Cases forecast",
        chart,
        table: kpiDetailTable(["Month", "Cases", "Status"], tableRows)
      })}
      <p class="data-formula-line">Seasonal H2 = 2025 H2 (57) × 2026/2025 H1 factor (116 ÷ 121) = 54 cases</p>
      <p class="data-formula-line">Run-rate H2 = 2026 H1 average (~19.3/mo) × 6 = 116 cases</p>
      <p class="data-formula-line">Blended H2 = (54 seasonal + 116 run-rate) ÷ 2 = 85 cases · full year = 116 actual H1 + 85 forecast H2 = 201</p>
      <p class="data-warning-note">Jul 35 and Aug 20 are actuals. Sep 16 through 09/30 and Oct* 0 through 10/02 from Contact_10-02-2026. Nov–Dec remain estimates until those months close.</p>`;
  }

  function expensePaceGraphHtml() {
    const m = expensePaceMetrics();
    const periods = [
      {
        label: "Full-year forecast",
        forecast: true,
        values: [m.quotedFullYear, m.collectibleFullYear, m.expenseFullYear]
      },
      {
        label: "Jan–Jun actual",
        forecast: false,
        values: [m.quotedH1, m.collectibleH1, m.expenseH1]
      }
    ];
    const series = [
      { name: "Quoted value", color: "var(--gg-royal-blue)" },
      { name: "Est. collectible (80%)", color: "var(--gg-positive)" },
      { name: "Expenses", color: "var(--gg-royal)" }
    ];
    const w = 760;
    const h = 320;
    const pad = { l: 64, r: 22, t: 52, b: 64 };
    const plotW = w - pad.l - pad.r;
    const plotH = h - pad.t - pad.b;
    const axisMax = chartAxisMax(periods.flatMap(p => p.values));
    const groupSlot = plotW / periods.length;
    const barW = 58;
    const gap = 12;
    const groupW = series.length * barW + (series.length - 1) * gap;
    const ticks = axisTicks(axisMax, 5).map(value => {
      const y = pad.t + plotH * (1 - value / axisMax);
      const label = value === 0 ? "$0" : value >= 1000000
        ? `$${(value / 1000000).toFixed(1)}M`
        : `$${Math.round(value / 1000)}k`;
      return `<g>
        <line x1="${pad.l}" y1="${y}" x2="${w - pad.r}" y2="${y}" class="kpi-chart-grid"/>
        <text x="${pad.l - 9}" y="${y + 4}" text-anchor="end" class="kpi-chart-axis">${label}</text>
      </g>`;
    }).join("");
    const bars = periods.map((period, periodIndex) => {
      const groupX = pad.l + periodIndex * groupSlot + (groupSlot - groupW) / 2;
      const periodBars = period.values.map((value, seriesIndex) => {
        const bh = Math.max(6, plotH * value / axisMax);
        const x = groupX + seriesIndex * (barW + gap);
        const y = pad.t + plotH - bh;
        const label = value >= 1000000
          ? `$${(value / 1000000).toFixed(2)}M`
          : `$${Math.round(value / 1000)}k`;
        return `<g>
          <rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="5" fill="${series[seriesIndex].color}" fill-opacity="${period.forecast ? "0.48" : "1"}"/>
          <text x="${x + barW / 2}" y="${y - 8}" text-anchor="middle" class="kpi-chart-total"${period.forecast ? ' opacity="0.68"' : ""}>${label}</text>
        </g>`;
      }).join("");
      return `<g>
        ${periodBars}
        <text x="${groupX + groupW / 2}" y="${h - 22}" text-anchor="middle" class="kpi-chart-label">${escapeHtml(period.label)}</text>
      </g>`;
    }).join("");
    const legend = `<div class="kpi-chart-legend">${series.map(item =>
      `<span><i class="kpi-stack-swatch" style="background:${item.color}"></i> ${escapeHtml(item.name)}</span>`
    ).join("")}<span style="opacity:0.52">Lighter bars = forecast</span></div>`;
    return chartBlock({
      title: "Quoted, collectible & expenses",
      chart: `<svg class="kpi-chart-svg kpi-chart-svg-plot" viewBox="0 0 ${w} ${h}" role="img" aria-label="Full-year forecast and Jan through June actual quoted value, collectible value, and expenses">
        <rect x="${pad.l}" y="${pad.t}" width="${plotW}" height="${plotH}" class="kpi-chart-plot-bg"/>
        ${ticks}${bars}
        <text x="16" y="${pad.t + plotH / 2}" text-anchor="middle" transform="rotate(-90 16 ${pad.t + plotH / 2})" class="kpi-chart-axis">Value ($)</text>
      </svg>`,
      legend,
      table: kpiDetailTable(
        ["Window", "Quoted value", "Est. collectible", "Expenses"],
        periods.map(p => [
          escapeHtml(p.label),
          fmtMoney(p.values[0]),
          fmtMoney(p.values[1]),
          fmtMoney(p.values[2])
        ])
      )
    });
  }

  /** Shared $85k/mo expense-pace math for Financials + Predictions · June sample baseline. */
  function expensePaceMetrics() {
    const mean = 5661;
    const collectionRate = 0.8;
    const monthlyExpense = 85000;
    const monthsElapsed = 6;
    const actualH1 = 116;
    const fullYearCases = 201;
    const quotedH1 = actualH1 * mean;
    const collectibleH1 = Math.round(quotedH1 * collectionRate);
    const quotedFullYear = fullYearCases * mean;
    const collectibleFullYear = Math.round(quotedFullYear * collectionRate);
    const expenseH1 = monthlyExpense * monthsElapsed;
    const expenseFullYear = monthlyExpense * 12;
    const linearQuotedPace = Math.round(quotedFullYear * monthsElapsed / 12);
    const linearCollectiblePace = Math.round(collectibleFullYear * monthsElapsed / 12);
    const quotedPaceDelta = quotedH1 - linearQuotedPace;
    const collectiblePaceDelta = collectibleH1 - linearCollectiblePace;
    const netCollectibleH1 = collectibleH1 - expenseH1;
    const netCollectibleFullYear = collectibleFullYear - expenseFullYear;
    const quotedPacePct = Math.round((quotedPaceDelta / linearQuotedPace) * 100);
    return {
      monthlyExpense,
      quotedH1,
      collectibleH1,
      quotedFullYear,
      collectibleFullYear,
      expenseH1,
      expenseFullYear,
      linearQuotedPace,
      linearCollectiblePace,
      quotedPaceDelta,
      collectiblePaceDelta,
      netCollectibleH1,
      netCollectibleFullYear,
      quotedPacePct
    };
  }

  function expensePaceCheckpointTableHtml() {
    const m = expensePaceMetrics();
    return kpiDetailTable(
      ["Checkpoint", "Target / expense", "Actual or forecast", "Gap", "Status"],
      [
        ["Mid-year quoted pace", fmtMoney(m.linearQuotedPace), fmtMoney(m.quotedH1), `+${fmtMoney(m.quotedPaceDelta)}`, "Ahead"],
        ["Mid-year collectible pace", fmtMoney(m.linearCollectiblePace), fmtMoney(m.collectibleH1), `+${fmtMoney(m.collectiblePaceDelta)}`, "Ahead"],
        ["H1 expenses covered (collectible)", fmtMoney(m.expenseH1), fmtMoney(m.collectibleH1), `+${fmtMoney(m.netCollectibleH1)}`, "Issue — unknown debt"],
        ["Full-year expenses covered (collectible forecast)", fmtMoney(m.expenseFullYear), fmtMoney(m.collectibleFullYear), `−${fmtMoney(Math.abs(m.netCollectibleFullYear))}`, "Short"]
      ]
    );
  }

  /** $85k/mo expense pace vs 2026 quoted / collectible forecast · June sample baseline. */
  function expensePaceRecommendationHtml() {
    const m = expensePaceMetrics();
    return `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.75rem;margin-bottom:0.85rem">
        <div class="kpi-mini-card"><h3>Expense / month</h3><p class="kpi-mini-value">${fmtMoney(m.monthlyExpense)}</p></div>
        <div class="kpi-mini-card"><h3>Quoted pace vs mid-year</h3><p class="kpi-mini-value">+${fmtMoney(m.quotedPaceDelta)}</p></div>
        <div class="kpi-mini-card"><h3>Full-year collectible after expenses</h3><p class="kpi-mini-value">−${fmtMoney(Math.abs(m.netCollectibleFullYear))}</p></div>
      </div>
      ${expensePaceGraphHtml()}
      <p class="data-warning-note"><strong>Recommendation:</strong> Case/quoted volume is <strong>ahead of mid-year pace</strong> (+${m.quotedPacePct}%), but the full-year collectible forecast still does <strong>not cover</strong> an $85k/mo expense run-rate (June sample: 36 cases · $20k digital · $6k ops · ~$59k salaries/misc). Treat expense coverage as the tighter constraint — raise collectible value (higher-fee practice mix, Sex Crimes Defense, collection rate) or cut recurring spend before assuming the ~$1.14M quoted forecast means the year is safe. Add Jack full-time payroll on top of this floor when start date and rate lock.</p>
      <p class="data-warning-note"><strong>Issue — do not treat H1 surplus as positive:</strong> H1 collectible after expenses shows +${fmtMoney(m.netCollectibleH1)}, but <strong>unknown business debt</strong> (loans, credit balances, and other liabilities outside the $85k/mo operating assumption) is not included. Flag this as a negative / unreliable indicator until WasteAud maps every liability.</p>
      <p class="data-inline-note"><strong>Mid-year quoted pace:</strong> Target ${fmtMoney(m.linearQuotedPace)} · actual ${fmtMoney(m.quotedH1)} · ahead ${fmtMoney(m.quotedPaceDelta)} (+${m.quotedPacePct}%).</p>
      <p class="data-inline-note"><strong>Mid-year collectible pace:</strong> Target ${fmtMoney(m.linearCollectiblePace)} · actual ${fmtMoney(m.collectibleH1)} · ahead ${fmtMoney(m.collectiblePaceDelta)}.</p>
      <p class="data-formula-line">H1 expenses = ${fmtMoney(m.monthlyExpense)} × 6 = ${fmtMoney(m.expenseH1)} · H1 collectible after expenses = ${fmtMoney(m.netCollectibleH1)} (unreliable — unknown debt)</p>
      <p class="data-formula-line">Full-year expenses = ${fmtMoney(m.expenseFullYear)} · collectible forecast ${fmtMoney(m.collectibleFullYear)} · shortfall ${fmtMoney(Math.abs(m.netCollectibleFullYear))}</p>
      ${expensePaceCheckpointTableHtml()}
      <p class="data-inline-note"><strong>Next actions:</strong> Keep Sex Crimes Defense / high-mean practice focus in AdEnhance · cut known waste now without waiting on a full WasteAud audit · lock Jack FT start + salary into the expense floor · reforecast after September MyCase close.</p>`;
  }

  /** Intake-driven cash projection — historical case volume × practice-weighted fee × financed payment curve. */
  function cashProjectionPanelHtml() {
    const meanFee = 5661;
    const collectionRate = 0.8;
    /* Financing / payment-plan curve: month 0 deposit through month 6. */
    const payCurve = [0.4, 0.2, 0.15, 0.1, 0.07, 0.05, 0.03];
    const practiceMix = DATA.feeByPractice || [];
    const practiceN = practiceMix.reduce((s, p) => s + (Number(p.n) || 0), 0);
    const mixWeightedFee = practiceN
      ? practiceMix.reduce((s, p) => s + (Number(p.mean) || 0) * (Number(p.n) || 0), 0) / practiceN
      : meanFee;
    const feeUsed = Math.round(mixWeightedFee);
    const collectibleUsed = feeUsed * collectionRate;

    const actualCohorts = [
      { month: "Jan", cases: 12, forecast: false },
      { month: "Feb", cases: 14, forecast: false },
      { month: "Mar", cases: 17, forecast: false },
      { month: "Apr", cases: 15, forecast: false },
      { month: "May", cases: 22, forecast: false },
      { month: "Jun", cases: 36, forecast: false },
      { month: "Jul", cases: 23, forecast: false }
    ];
    const forecastCohorts = [
      { month: "Aug", cases: 15, forecast: true },
      { month: "Sep", cases: 14, forecast: true },
      { month: "Oct", cases: 15, forecast: true },
      { month: "Nov", cases: 12, forecast: true },
      { month: "Dec", cases: 14, forecast: true }
    ];
    const cohorts = [...actualCohorts, ...forecastCohorts];
    const monthIndex = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
    const cash = Array(12).fill(0);
    const residual = Array(12).fill(0);
    const newIntake = Array(12).fill(0);

    cohorts.forEach(c => {
      const signIdx = monthIndex[c.month];
      const billed = c.cases * collectibleUsed;
      payCurve.forEach((share, lag) => {
        const arriveIdx = signIdx + lag;
        if (arriveIdx > 11) return;
        const amt = billed * share;
        cash[arriveIdx] += amt;
        if (c.forecast) newIntake[arriveIdx] += amt;
        else residual[arriveIdx] += amt;
      });
    });

    const forwardMonths = ["Aug", "Sep", "Oct", "Nov", "Dec"];
    const cashTable = kpiDetailTable(
      ["Cash arrives", "Projected cash-in", "From prior cohorts", "From new intake", "Notes"],
      forwardMonths.map(m => {
        const i = monthIndex[m];
        const total = Math.round(cash[i]);
        const fromPrior = Math.round(residual[i]);
        const fromNew = Math.round(newIntake[i]);
        return [
          m,
          fmtMoney(total),
          fmtMoney(fromPrior),
          fmtMoney(fromNew),
          fromNew
            ? "Prior payment tails + financed new cases"
            : "Payment-plan tails from Jan–Jul* only"
        ];
      })
    );

    const cohortTable = kpiDetailTable(
      ["Signing month", "New cases", "Billed", "Collectible (80%)", "Status"],
      chronological(cohorts).map(c => [
        c.month,
        String(c.cases),
        fmtMoney(Math.round(c.cases * feeUsed)),
        fmtMoney(Math.round(c.cases * collectibleUsed)),
        c.forecast ? "Forecast cases" : "Actual"
      ]).concat([[
        "Jan–Jul* total",
        "139",
        fmtMoney(Math.round(139 * feeUsed)),
        fmtMoney(Math.round(139 * collectibleUsed)),
        "Actual through 2026-07-23"
      ]])
    );

    const h1AvgCases = 19;
    const recentAvgCases = 24;
    const junCases = 36;
    const runRateTable = kpiDetailTable(
      ["Steady-state intake", "Monthly cash-in"],
      [
        [`Jun run-rate (${junCases}/mo)`, fmtMoney(Math.round(junCases * collectibleUsed))],
        [`Recent avg (${recentAvgCases}/mo)`, fmtMoney(Math.round(recentAvgCases * collectibleUsed))],
        [`H1 avg (${h1AvgCases}/mo)`, fmtMoney(Math.round(h1AvgCases * collectibleUsed))]
      ]
    );

    const mixLine = practiceMix.slice(0, 4).map(p =>
      `${escapeHtml(String(p.name).replace(" / Sex Offense", ""))} ${Math.round((p.n / practiceN) * 100)}% @ ${fmtMoney(p.mean)}`
    ).join(" · ");

    return `${cashTable}
      <p class="data-inline-note"><strong>Model:</strong> historical + forecast cases/month × practice-weighted mean fee (${fmtMoney(feeUsed)}) × 80% collectible × financed payment plan 40/20/15/10/7/5/3% over months 0–6.</p>
      <p class="data-formula-line">Collectible/case = ${fmtMoney(feeUsed)} × 0.80 = ${fmtMoney(Math.round(collectibleUsed))}</p>
      <p class="data-formula-line">Practice mix (fee sample n=${practiceN}): ${mixLine}</p>
      <p class="data-formula-line">Cash in month M = Σ (cases signed in M−lag × collectible/case × plan share[lag]) for lag 0–6</p>
      <h3 class="kpi-subtable-title">2026 cohorts</h3>
      ${cohortTable}
      <h3 class="kpi-subtable-title">Steady-state run rates</h3>
      ${runRateTable}
      <p class="data-warning-note"><strong>Research note:</strong> Jul–Dec adds forecast intake on top of payment tails from Jan–Jun. Pre-2026 collections are excluded. Fee sample is quoted means, not QuickBooks cash — reforecast when July MyCase + collections land.</p>
      <p class="data-inline-note">Source basis: MyCase cases-by-month · fee-by-practice means · financed payment curve (Ad Reports cash-from-cases model).</p>`;
  }

  /** Known A/R subset with payment_amount — MyCase Contact_07-25-2026 · assumed monthly. */
  function knownPaymentArPanelHtml() {
    const knownBal = 160700;
    const paySum = 48617;
    const cycle1 = 47617;
    const unknownBal = 140374;
    const arTotal = 301074;
    const payoff = [
      { c: 0, rem: 160700, cash: 0, cum: 0 },
      { c: 1, rem: 113083, cash: 47617, cum: 47617 },
      { c: 2, rem: 73967, cash: 39117, cum: 86733 },
      { c: 3, rem: 43500, cash: 30467, cum: 117200 },
      { c: 4, rem: 24000, cash: 19500, cum: 136700 },
      { c: 5, rem: 16000, cash: 8000, cum: 144700 },
      { c: 6, rem: 9500, cash: 6500, cum: 151200 },
      { c: 7, rem: 4750, cash: 4750, cum: 155950 },
      { c: 8, rem: 1000, cash: 3750, cum: 159700 },
      { c: 9, rem: 250, cash: 750, cum: 160450 },
      { c: 10, rem: 0, cash: 250, cum: 160700 }
    ];
    const byCycles = [
      [1, 3, 7000],
      [2, 4, 12000],
      [3, 7, 24700],
      [4, 6, 47000],
      [5, 2, 21500],
      [6, 1, 9000],
      [7, 2, 8500],
      [8, 2, 24000],
      [10, 1, 7000]
    ];
    const payoffTable = kpiDetailTable(
      ["Cycle", "Cash this cycle", "Cumulative", "Remaining", "% known $ in"],
      payoff.map(r => [
        String(r.c),
        fmtMoney(r.cash),
        fmtMoney(r.cum),
        fmtMoney(r.rem),
        `${Math.round((r.cum / knownBal) * 100)}%`
      ])
    );
    const cycleTable = kpiDetailTable(
      ["Cycles to payoff", "Accounts", "Balance"],
      byCycles.map(([c, n, bal]) => [String(c), String(n), fmtMoney(bal)])
    );
    return `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0.75rem;margin-bottom:0.85rem">
        <div class="kpi-mini-card"><h3>Known A/R balance</h3><p class="kpi-mini-value">${fmtMoney(knownBal)}</p></div>
        <div class="kpi-mini-card"><h3>Cycle-1 expected cash</h3><p class="kpi-mini-value">${fmtMoney(cycle1)}</p></div>
        <div class="kpi-mini-card"><h3>Median cycles</h3><p class="kpi-mini-value">3.5</p></div>
        <div class="kpi-mini-card"><h3>Unknown A/R (no plan)</h3><p class="kpi-mini-value">${fmtMoney(unknownBal)}</p></div>
      </div>
      <p class="data-inline-note"><strong>Definition:</strong> 28 of 67 positive A/R rows (${fmtMoney(knownBal)} / ${fmtMoney(arTotal)} = 53%) have <code>payment_amount</code>. Cycles = ceil(balance ÷ payment_amount). Cadence assumed monthly — not in export.</p>
      <p class="data-formula-line">Sum of payment_amount = ${fmtMoney(paySum)} · Cycle-1 cash = Σ min(payment, remaining) = ${fmtMoney(cycle1)} · Aggregate balance ÷ payments = 3.31 cycles</p>
      <p class="data-formula-line">Milestones (from 2026-07-25): 50% known $ by cycle 2 (~Sep) · 75% by cycle 4 (~Nov) · 90% by cycle 5 (~Dec) · tail through cycle 10 (~May 2027)</p>
      <h3 class="kpi-subtable-title">Accounts by cycles to payoff</h3>
      ${cycleTable}
      <h3 class="kpi-subtable-title">Assumed monthly runoff · known subset</h3>
      ${payoffTable}
      <p class="data-warning-note"><strong>Do not treat as firm cash:</strong> Unknown ${fmtMoney(unknownBal)} has no installment. Contact A/R ≠ QuickBooks collections. Cross-check ledger Credits before booking runoff as collected.</p>
      <p class="data-inline-note">Source: mycase/as-of-2026-07-25/Contact_07-25-2026.csv · ar-known-payment-cycles.csv · last updated 2026-07-25 · canvas: mycase-close-and-payment-estimate</p>`;
  }

  function predictionsPageHtml() {
    return `<header class="data-page-head">
      <div>
        <h2 class="data-page-title">Predictions</h2>
        <p class="data-page-sub">Rest-of-year case forecast · $85k/mo expense pace · intake cash · known A/R payment cycles</p>
      </div>
    </header>
    <div class="data-grid">
      ${dataCardHtml(
        "Headline",
        "Collectible cash from 2026 case intake — not total firm cash.",
        `<div class="kpi-mini-grid" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:0.75rem">
          <div class="kpi-mini-card"><h3>Collectible / case</h3><p class="kpi-mini-value">$4,470</p></div>
          <div class="kpi-mini-card"><h3>Jan–Jun collectible</h3><p class="kpi-mini-value">$509,534</p></div>
          <div class="kpi-mini-card"><h3>Jun steady-state</h3><p class="kpi-mini-value">~$152k/mo</p></div>
        </div>`,
        { full: true, id: "prediction-headline" }
      )}
      ${dataCardHtml(
        "Recommendation · expense pace vs 2026 forecast",
        "Quoted volume is ahead of mid-year pace, but $85k/mo expenses still outrun the full-year collectible forecast.",
        expensePaceRecommendationHtml(),
        { full: true, id: "prediction-expense-pace" }
      )}
      ${dataCardHtml(
        "2026 cases · actual + rest-of-year forecast",
        "Oldest to newest · forecast bars are lighter and transparent.",
        caseForecastPanelHtml(),
        { full: true, id: "prediction-case-forecast" }
      )}
      ${dataCardHtml(
        "Projected cash-in by month",
        "Next months estimated from case volume, practice-weighted fees, and financed payment plans.",
        cashProjectionPanelHtml(),
        { full: true, id: "prediction-cash-by-month" }
      )}
      ${dataCardHtml(
        "Known A/R payment-plan subset",
        "MyCase contacts with payment_amount · assumed monthly cycles · last updated 2026-07-25.",
        knownPaymentArPanelHtml(),
        { full: true, id: "prediction-known-ar-pay" }
      )}
    </div>`;
  }

  function renderPredictions(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    el.innerHTML = predictionsPageHtml();
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "predictions");
  }

  /** June LSA → digital reallocation recommendations (media + management retainer). */
  function junPaidChannelRecs() {
    const jun = (DATA.casesLeadsSpend || []).find(r => r.month === "Jun");
    if (!jun || !jun.leads || !jun.adsLeads) return null;
    const mgmt = DATA.digitalMgmtMonthly || 3000;
    const lsaCpl = jun.lsaSpend / jun.leads;
    const digCpl = jun.adsSpend / jun.adsLeads;
    const digAllIn = (jun.adsSpend + mgmt) / jun.adsLeads;
    const breakEvenCalls = mgmt / (lsaCpl - digCpl);
    const breakEvenMedia = breakEvenCalls * digCpl;
    const minDivert = mgmt + breakEvenMedia;
    const closeMultiple = lsaCpl / digAllIn;
    const paidCalls = jun.leads + jun.adsLeads;
    const paidSpend = jun.lsaSpend + jun.adsSpend;
    const digEff = jun.adsLeads / paidCalls / (jun.adsSpend / paidSpend);
    const lsaEff = jun.leads / paidCalls / (jun.lsaSpend / paidSpend);
    const divertRows = [mgmt, Math.round(minDivert), 5000, 8000, 10000, mgmt + jun.adsSpend].map(total => {
      const toMgmt = Math.min(mgmt, total);
      const toMedia = Math.max(0, total - mgmt);
      const calls = toMedia > 0 ? toMedia / digCpl : 0;
      const allIn = calls > 0 ? (toMedia + mgmt) / calls : null;
      let decision = "Consulting only — no media";
      if (allIn != null) {
        const d = lsaCpl - allIn;
        if (Math.abs(d) < 1) decision = "Cost break-even vs LSA";
        else if (d > 0) decision = `Digital cheaper by ${fmtMoney(d)}/call`;
        else decision = `LSA cheaper by ${fmtMoney(-d)}/call`;
      }
      return {
        total,
        toMgmt,
        toMedia,
        mgmtPct: Math.round((toMgmt / total) * 100),
        mediaPct: Math.round((toMedia / total) * 100),
        calls,
        allIn,
        decision
      };
    });
    return {
      jun,
      mgmt,
      lsaCpl,
      digCpl,
      digAllIn,
      breakEvenCalls,
      breakEvenMedia,
      minDivert,
      closeMultiple,
      digEff,
      lsaEff,
      divertRows,
      digAtLsaCost: jun.adsLeads * lsaCpl,
      digAdvantage: jun.adsLeads * lsaCpl - jun.adsSpend,
      digAllInAdvantage: jun.adsLeads * lsaCpl - (jun.adsSpend + mgmt)
    };
  }

  function recCallout(kind, label, statusLabel, html) {
    return `<aside class="rec-callout rec-callout-${escapeHtml(kind)}" aria-label="${escapeHtml(statusLabel)}">
      <span class="rec-callout-status">${escapeHtml(statusLabel)}</span>
      <span class="rec-callout-label">${escapeHtml(label)}</span>
      <div class="rec-callout-body">${html}</div>
    </aside>`;
  }

  function recSolutionsHtml(html) {
    return `<section class="kpi-related-projects rec-solutions" aria-label="Solutions">
      <strong class="kpi-related-projects-title">Solutions</strong>
      <div class="rec-solutions-body">${html}</div>
    </section>`;
  }

  function recProofHtml(summary, bodyHtml) {
    return `<details class="rec-proof"><summary>${escapeHtml(summary)}</summary><div class="rec-proof-body">${bodyHtml}</div></details>`;
  }

  function recStatTile(label, value, context) {
    return `<div class="rec-stat-tile">
      <span class="rec-stat-label">${escapeHtml(label)}</span>
      <span class="rec-stat-value">${value}</span>
      ${context ? `<span class="rec-stat-context">${escapeHtml(context)}</span>` : ""}
    </div>`;
  }

  function recSectionHtml(id, title, hint, bodyHtml) {
    return `<section class="kpi-section kpi-section-static rec-section" id="${escapeHtml(id)}">
      ${kpiSectionStaticHead(title, hint)}
      <div class="kpi-section-body rec-section-body">${bodyHtml}</div>
    </section>`;
  }

  function recStatusKind(statusLabel) {
    const s = String(statusLabel || "").toLowerCase();
    if (s.includes("action") || s.includes("required") || s.includes("negative")) return "negative";
    if (s.includes("on track") || s.includes("verified") || s.includes("positive")) return "positive";
    return "watch";
  }

  function recFillTokens(text, tokens) {
    return String(text || "").replace(/\{\{(\w+)\}\}/g, (_, key) => (
      Object.prototype.hasOwnProperty.call(tokens, key) ? String(tokens[key]) : `{{${key}}}`
    ));
  }

  function recInlineMd(text, tokens) {
    let s = escapeHtml(recFillTokens(text, tokens));
    s = s.replace(/\[([^\]]+)\]\(project:([A-Za-z0-9_-]+)\)/g, (_, label) => label);
    s = s.replace(/\*\*([^*]+)\*\*/g, "$1");
    s = s.replace(/\*([^*]+)\*/g, "$1");
    return s;
  }

  function recSexCrimesChartHtml() {
    return chartPairGridHtml(chartBlock({
      title: "Case recovery",
      chart: barWithTargetChart(
        [
          { label: "YTD", value: 5 },
          { label: "Pace", value: 10 },
          { label: "Recovery", value: 13 }
        ],
        {
          target: 13,
          lowerIsBetter: false,
          compact: false,
          width: 640,
          height: 220,
          format: "count",
          ariaLabel: "Sex Crimes Defense cases: 5 year to date, 10 at current full-year pace, and 13 under the recovery plan"
        }
      ),
      table: kpiDetailTable(
        ["Stage", "Cases"],
        [
          ["YTD", "5"],
          ["Pace", "10"],
          ["Recovery", "13"]
        ]
      )
    }));
  }

  function recYelpAugustChartHtml() {
    const baseline = 6;
    const goal = 20;
    return chartPairGridHtml(chartBlock({
      title: "Yelp referral target",
      chart: barWithTargetChart(
        [
          { label: "Baseline", value: baseline },
          { label: "Aug MTD", value: 0, vsTarget: false, color: "#6a5acd" }
        ],
        {
          target: goal,
          lowerIsBetter: false,
          compact: false,
          width: 640,
          height: 220,
          format: "count",
          targetLabel: String(goal),
          ariaLabel: `Yelp baseline ${baseline} leads per 30 days vs August goal ${goal} channel referrals`
        }
      ),
      table: kpiDetailTable(
        ["Measure", "Leads"],
        [
          ["Baseline last 30", String(baseline)],
          ["Aug MTD", "0"],
          ["Goal", String(goal)]
        ]
      )
    }));
  }

  function recLsaVsDigitalChartHtml() {
    const rows = DATA.casesLeadsSpend || [];
    if (!rows.length) return "";
    const months = costCompareMonths(rows);
    return `${chartPairGridHtml(chartBlock({
      title: "LSA vs digital cost per call",
      chart: lsaVsDigitalCostTrendChart(rows),
      legend: lsaVsDigitalCostTrendLegend(),
      table: kpiDetailTable(
        ["Period", "LSA $/call", "Digital $/call"],
        months.map(m => [
          escapeHtml(m.partial ? `${m.month}*` : m.month),
          fmtMoney(m.lsaCpl),
          fmtMoney(m.digCpl)
        ])
      )
    }))}${lsaVsDigitalCostTrendNote(rows)}`;
  }

  function recommendationsPageHtml() {
    const r = junPaidChannelRecs();
    if (!r) {
      return `<header class="data-page-head"><div><h2 class="data-page-title">Recommendations</h2></div></header>
        <p class="data-inline-note">Need a complete June LSA + digital month to build recommendations.</p>`;
    }
    const content = window.RECOMMENDATIONS_CONTENT;
    if (!content || !Array.isArray(content.recs) || !content.recs.length) {
      return `<header class="data-page-head"><div><h2 class="data-page-title">Recommendations</h2></div></header>
        <p class="data-inline-note">Missing recommendations content. Edit <code>content/recommendations.md</code> and run <code>npm run build</code>.</p>`;
    }
    const tokens = {
      lsaCpl: fmtMoney(r.lsaCpl),
      digCpl: fmtMoney(r.digCpl),
      digAllIn: fmtMoney(r.digAllIn),
      minDivert: fmtMoney(r.minDivert),
      mgmt: fmtMoney(r.mgmt),
      breakEvenMedia: fmtMoney(r.breakEvenMedia),
      closeMultiple: r.closeMultiple.toFixed(2),
      junLsaSpend: fmtMoney(r.jun.lsaSpend),
      junLeads: String(r.jun.leads),
      junAdsSpend: fmtMoney(r.jun.adsSpend),
      junAdsLeads: String(r.jun.adsLeads)
    };
    const divertRows = r.divertRows.map(row => [
      fmtMoney(row.total),
      fmtMoney(row.toMgmt),
      fmtMoney(row.toMedia),
      `${row.mgmtPct}%`,
      `${row.mediaPct}%`,
      row.allIn != null ? fmtMoney(row.allIn) : "—",
      escapeHtml(row.decision)
    ]);
    const page = content.page || {};
    const jump = (content.jump || []).map(item => {
      const rankHtml = item.rank
        ? `<span class="rec-rank">${escapeHtml(item.rank)}</span> `
        : "";
      return `<a class="rec-jump-link" href="#${escapeHtml(item.anchor)}">${rankHtml}${escapeHtml(item.label)}</a>`;
    }).join("");
    const sections = content.recs.map(rec => {
      const bodyType = rec.bodyType || "";
      if (bodyType === "projects-table") {
        const rows = (rec.projects || []).map(row => [
          recInlineMd(row.project, tokens),
          escapeHtml(recFillTokens(row.priority, tokens)),
          escapeHtml(recFillTokens(row.fee, tokens)),
          escapeHtml(recFillTokens(row.role, tokens)),
          escapeHtml(recFillTokens(row.gate, tokens))
        ]);
        return recSectionHtml(
          rec.id,
          recFillTokens(rec.title, tokens),
          recFillTokens(rec.hint, tokens),
          kpiDetailTable(["Project", "Score / status", "Fee", "Role", "Success gate"], rows)
        );
      }
      if (bodyType === "actions-list") {
        const items = (rec.actions || []).map(item =>
          `<li>${recInlineMd(item, tokens)}</li>`
        ).join("");
        return recSectionHtml(
          rec.id,
          recFillTokens(rec.title, tokens),
          recFillTokens(rec.hint, tokens),
          `<ol class="rec-actions kpi-action-list">${items}</ol>`
        );
      }
      const stats = rec.stats || [];
      const statsHtml = stats.length
        ? `<div class="rec-stat-grid" data-cols="${Math.min(4, Math.max(2, stats.length))}">${stats.map(s =>
            recStatTile(
              recFillTokens(s.label, tokens),
              escapeHtml(recFillTokens(s.value, tokens)),
              recFillTokens(s.context, tokens)
            )
          ).join("")}</div>`
        : "";
      const chartHtml = (rec.chart === "yelp-august" || rec.id === "recommendation-yelp")
        ? recYelpAugustChartHtml()
        : (rec.chart === "cases-recovery" || rec.id === "recommendation-sex-crimes")
        ? recSexCrimesChartHtml()
        : (rec.chart === "lsa-vs-digital" || rec.id === "recommendation-divert" || rec.id === "recommendation-primary")
          ? recLsaVsDigitalChartHtml()
          : "";
      const whyKind = recStatusKind(rec.whyStatus);
      const whyHtml = rec.why
        ? recCallout(whyKind, "Why", rec.whyStatus || "Watch", `<p>${recInlineMd(rec.why, tokens)}</p>`)
        : "";
      const solutionsHtml = rec.solutions
        ? recSolutionsHtml(`<p>${recInlineMd(rec.solutions, tokens)}</p>`)
        : "";
      let proofBody = "";
      if (rec.proofType === "divert-table") {
        proofBody = kpiDetailTable(
          ["Divert from LSA", "→ Consulting", "→ Digital ads", "Consulting %", "Media %", "All-in $/call", "Decision"],
          divertRows
        );
      } else if ((rec.proof || []).length) {
        proofBody = rec.proof.map(line => {
          const filled = recInlineMd(line, tokens);
          const cls = /savings windows|do not double-count/i.test(line)
            ? "data-inline-note"
            : "data-formula-line";
          return `<p class="${cls}">${filled}</p>`;
        }).join("");
      }
      const proofHtml = proofBody
        ? recProofHtml(rec.proofTitle || "Proof", proofBody)
        : "";
      return recSectionHtml(
        rec.id,
        recFillTokens(rec.title, tokens),
        recFillTokens(rec.hint, tokens),
        `${statsHtml}${chartHtml}${whyHtml}${solutionsHtml}${proofHtml}`
      );
    }).join("");
    const alertText = String(page.alert || "").trim();
    const alertHtml = alertText
      ? `<aside class="rec-callout rec-callout-${recStatusKind(page.alertStatus)} rec-page-alert" aria-label="${escapeHtml(page.alertStatus || "Action required")}">
      <span class="rec-callout-status">${escapeHtml(page.alertStatus || "Action required")}</span>
      <span class="rec-callout-label">${escapeHtml(page.alertLabel || "Alert")}</span>
      <div class="rec-callout-body"><p>${recInlineMd(alertText, tokens)}</p></div>
    </aside>`
      : "";
    return `<header class="data-page-head">
      <div>
        <h2 class="data-page-title">${escapeHtml(page.title || "Recommendations")}</h2>
        <p class="data-page-sub">${escapeHtml(page.subtitle || "")}</p>
      </div>
    </header>
    ${alertHtml}
    <nav class="rec-jump" aria-label="Jump to recommendation">${jump}</nav>
    <div class="rec-stack">${sections}</div>`;
  }

  function renderRecommendations(el) {
    if (!el || el.dataset.rendered === RENDER_VER) return;
    el.innerHTML = recommendationsPageHtml();
    el.dataset.rendered = RENDER_VER;
    bindKpiInteractions(el);
    bindDashboardInteractions(el);
    dispatchRendered(el, "recommendations");
  }

  /** @deprecated Dashboards tab removed — content is in renderKpis(). Kept for callers. */
  function renderDashboards(el) {
    if (!el) return;
    el.innerHTML = "";
    delete el.dataset.rendered;
    dispatchRendered(el, "dashboards");
  }

  function dispatchRendered(el, kind) {
    syncDataAsOfStamp();
    window.dispatchEvent(new CustomEvent("kpi-report-rendered", { detail: { root: el, kind } }));
  }

  function renderAll(kpisEl) {
    if (kpisEl) renderKpis(kpisEl);
    window.dispatchEvent(new CustomEvent("kpi-report-ready"));
  }

  function bindKpiInteractions(root) {
    root.querySelectorAll(".kpi-report-pill[data-kpi-period]").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.disabled || btn.classList.contains("is-unavailable")) return;
        const period = btn.getAttribute("data-kpi-period");
        if (period) setTilePeriod(period);
      });
    });
    root.querySelectorAll(".kpi-stat-card[data-kpi-focus], .kpi-goal-card[data-kpi-focus]").forEach(btn => {
      btn.addEventListener("click", () => {
        root.querySelectorAll(".kpi-stat-card, .kpi-goal-card").forEach(c => c.classList.remove("kpi-stat-active"));
        btn.classList.add("kpi-stat-active");
      });
    });
  }

  function bindDashboardInteractions(root) {
    root.querySelectorAll(".kpi-expand-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.expand;
        const panel = root.querySelector(`.kpi-expand-panel[data-panel="${key}"]`);
        if (!panel) return;
        const open = panel.hidden;
        panel.hidden = !open;
        btn.textContent = open ? "Hide table" : "Show table";
      });
    });
    root.querySelectorAll("[data-cash-year]").forEach(btn => {
      btn.addEventListener("click", () => {
        const year = btn.getAttribute("data-cash-year");
        if (year) setCashCollectedYear(year);
      });
    });
    root.querySelectorAll("[data-cases-year]").forEach(btn => {
      btn.addEventListener("click", () => {
        const year = btn.getAttribute("data-cases-year");
        if (year) setCasesCreatedYear(year);
      });
    });
  }

  function focusKpi(kpiId) {
    const id = kpiId && String(kpiId).startsWith("#") ? kpiId : `#${String(kpiId || "").replace(/\D/g, "").padStart(2, "0")}`;
    const root = document.getElementById("kpi-report-kpis");
    if (!root) return false;
    const btn = root.querySelector(`[data-kpi-focus="${id}"]`);
    if (!btn) return false;
    const section = btn.closest("details");
    if (section) section.open = true;
    if (btn.classList.contains("kpi-stat-card") || btn.classList.contains("kpi-goal-card")) btn.click();
    btn.scrollIntoView({ behavior: "smooth", block: "nearest" });
    btn.classList.add("kpi-stat-active");
    setTimeout(() => btn.classList.remove("kpi-stat-active"), 2400);
    return true;
  }

    window.KPI_REPORT = {
    renderKpis,
    renderData,
    renderImpact,
    renderPredictions,
    renderRecommendations,
    renderDashboards,
    renderAll,
    setTilePeriod,
    setCashCollectedYear,
    setCasesCreatedYear,
    focusKpi,
    getHelp: getKpiHelp,
    getData: () => ({ ...DATA }),
    relatedProjectsForKpi(kpiId) {
      const raw = String(kpiId || "").trim();
      if (!raw) return [];
      const ids = KPI_RELATED_PROJECTS[raw] || KPI_RELATED_PROJECTS[`#${raw.replace(/^#/, "")}`] || [];
      return ids.filter(id => !String(id).startsWith("REC:"));
    },
    kpiLabel(kpiId) {
      const help = getKpiHelp(kpiId);
      if (help && help.title) return String(help.title).replace(/^#\S+\s+/, "").trim();
      return String(kpiId || "");
    },
    /** Parked panels for other dashboard views */
    parked: {
      leadsByCampaignPanelHtml,
      totalReferralNetworkPanelHtml,
      sourceMixPanelHtml
    },
    refresh() {
      document.querySelectorAll("[data-rendered]").forEach(el => {
        delete el.dataset.rendered;
        el.innerHTML = "";
      });
    }
  };
})();
