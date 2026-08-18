/**
 * Monthly overseas visitor arrivals by month of arrival, from Stats NZ
 * "International travel" releases (Table 2, estimated short-term travel, overseas
 * visitors). The 2017-2019 months come from the December 2018 and December 2019
 * releases; the 2023-2025 months come from the June 2025 release. The 2020-2022
 * years are omitted because border restrictions broke the series.
 */

export const TOURISM_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export interface TourismArrivalsYear {
  year: number;
  arrivals: (number | null)[];
}

export const TOURISM_ARRIVALS_YEARS: TourismArrivalsYear[] = [
  {
    year: 2017,
    arrivals: [
      null,
      null,
      null,
      null,
      null,
      230088,
      246945,
      233991,
      252746,
      270515,
      360136,
      513349,
    ],
  },
  {
    year: 2018,
    arrivals: [
      379228, 423456, 388327, 283910, 222079, 212245, 250523, 246682, 258155, 283568, 385789,
      529255,
    ],
  },
  {
    year: 2019,
    arrivals: [
      399346, 417934, 378270, 307409, 219331, 213536, 255585, 251131, 261770, 283834, 372108,
      528219,
    ],
  },
  {
    year: 2023,
    arrivals: [null, null, null, null, null, null, null, null, null, null, null, 418869],
  },
  {
    year: 2024,
    arrivals: [
      326427, 362836, 340306, 225024, 179665, 185294, 221837, 214271, 226889, 240195, 321216,
      469842,
    ],
  },
  {
    year: 2025,
    arrivals: [370238, 354408, 311808, 267271, 190593, 186753, null, null, null, null, null, null],
  },
];

export const TOURISM_ARRIVALS_FIRST_YEAR = 2017;
export const TOURISM_ARRIVALS_LAST_YEAR = 2025;
