/**
 * Dated event markers for time-series charts. Each marker is a verifiable
 * public fact (policy announcement, rate change, crisis) with the date it
 * happened. Markers are contextual, never causal claims: the charts show
 * that the event and the series moved in the same window, nothing more.
 */

export interface ChartEventMarker {
  /** Category value on the chart x-axis (matches the series label). */
  x: string | number;
  /** Short label shown in the legend under the chart. */
  label: string;
  /** Where the fact is documented. */
  citation: string;
}

/**
 * Housing affordability chart markers, December 2003 to March 2026. The
 * x value must match a quarter label on the chart, so the OCR hike in
 * October 2021 and the house-price peak in November 2021 are marked on
 * the December 2021 quarter that contains both.
 */
export const HOUSING_AFFORDABILITY_EVENTS: ChartEventMarker[] = [
  {
    x: 'Mar 2020',
    label: 'COVID-19 border closure',
    citation: 'New Zealand closed its border to most travellers on 19 March 2020.',
  },
  {
    x: 'Mar 2021',
    label: 'Housing package',
    citation:
      'On 23 March 2021 the government announced loan-to-value (LVR) limits on bank lending, changes to mortgage interest deductions, and a longer bright-line property test.',
  },
  {
    x: 'Dec 2021',
    label: 'OCR hikes begin, prices peak',
    citation:
      'The Reserve Bank of New Zealand (RBNZ) raised its official cash rate (OCR) from 0.25% to 0.50% on 6 October 2021, the first rise since 2014, and the Real Estate Institute of New Zealand (REINZ) national median house price peaked in November 2021.',
  },
];

/**
 * Main benefit chart markers, September 2013 to September 2018. The
 * welfare-reform change sits on the first quarter of the series, and the
 * government change on the December 2017 quarter that followed the election.
 */
export const BENEFIT_EVENTS: ChartEventMarker[] = [
  {
    x: 'Sep 2013',
    label: 'Jobseeker Support begins',
    citation:
      'The Welfare Reform Act 2012 replaced older benefits with Jobseeker Support from 15 July 2013.',
  },
  {
    x: 'Dec 2017',
    label: 'Government change',
    citation:
      'The 2017 general election was held on 23 September, and the Labour-led government was sworn in on 26 October 2017.',
  },
];

/** Road-user casualty chart markers, 1990 to 2016. */
export const ROAD_CASUALTY_EVENTS: ChartEventMarker[] = [
  {
    x: 2014,
    label: 'Drink-drive limit lowered',
    citation:
      'The adult blood-alcohol limit dropped from 80mg to 50mg per 100ml on 1 December 2014.',
  },
];
