export interface Experiment {
  slug: string;
  title: string;
  pitch: string;
  dataSource: string;
  status: 'alive' | 'dead';
}

/**
 * Every shipped experiment lives here. Add an entry when a new
 * `experiments/<slug>/page.tsx` route ships; never delete a dead one,
 * flip its status instead — see apps/web/src/app/experiments/_example.
 */
export const experiments: Experiment[] = [
  {
    slug: 'sheep-index',
    title: 'The Sheep Index',
    pitch:
      "New Zealand's national animal is in freefall: the sheep flock has nearly halved since 1994.",
    dataSource:
      'Stats NZ Aotearoa Data Explorer, table AGR_AGR_003 (Livestock Numbers by Regional Council)',
    status: 'alive',
  },
];
