import {getRandomArrayElement} from '../utils.js';
import {POINT_TYPES, POINT_DESTINATIONS} from '../const.js';

const mockPoints = [
  {
    basePrice: 800,
    dateFrom: new Date('2023-06-15 05:00:00'),
    dateTo: new Date('2023-06-15 08:00:00'),
    destination: getRandomArrayElement(POINT_DESTINATIONS),
    isFavorite: true,
    offers: [
      {
        title: 'Some title 1',
        price: 120
      },
      {
        title: 'Some title 2',
        price: 20
      },
      {
        title: 'Some title 3',
        price: 20
      }
    ],
    type: 'taxi'
  },
  {
    basePrice: 1000,
    dateFrom: new Date('2023-06-25 03:15:00'),
    dateTo: new Date('2023-06-25 04:00:00'),
    destination: getRandomArrayElement(POINT_DESTINATIONS),
    isFavorite: false,
    offers: [
      {
        title: 'Some title 1',
        price: 5
      },
      {
        title: 'Some title 2',
        price: 10
      }
    ],
    type: getRandomArrayElement(POINT_TYPES)
  },
  {
    basePrice: 750,
    dateFrom: new Date('2023-07-05 11:00:00'),
    dateTo: new Date('2023-07-05 12:00:00'),
    destination: getRandomArrayElement(POINT_DESTINATIONS),
    isFavorite: false,
    offers: [
      {
        title: 'Some title',
        price: 10
      }
    ],
    type: getRandomArrayElement(POINT_TYPES)
  },
  {
    basePrice: 1700,
    dateFrom: new Date('2023-07-20 12:00:00'),
    dateTo: new Date('2023-07-20 14:45:00'),
    destination: getRandomArrayElement(POINT_DESTINATIONS),
    isFavorite: true,
    offers: [],
    type: getRandomArrayElement(POINT_TYPES)
  }
];

const getRandomPoint = () => getRandomArrayElement(mockPoints);

export {getRandomPoint};
