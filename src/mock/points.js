import {getRandomArrayElement} from '../utils.js';
import {POINT_COUNT, POINT_DESTINATIONS} from '../const.js';

const mockPoints = [
  {
    basePrice: 800,
    dateFrom: new Date('2023-06-15'),
    dateTo: new Date('2023-06-26'),
    destination: getRandomArrayElement(POINT_DESTINATIONS),
    isFavorite: false,
    offers: [
      {
        title: '',
        price: 0
      }
    ],
    type: getRandomArrayElement(POINT_COUNT)
  },
  {
    basePrice: 1000,
    dateFrom: new Date('2023-06-25'),
    dateTo: new Date('2023-06-29'),
    destination: getRandomArrayElement(POINT_DESTINATIONS),
    isFavorite: false,
    offers: [
      {
        title: '',
        price: 0
      }
    ],
    type: getRandomArrayElement(POINT_COUNT)
  },
  {
    basePrice: 750,
    dateFrom: new Date('2023-07-05'),
    dateTo: new Date('2023-07-16'),
    destination: getRandomArrayElement(POINT_DESTINATIONS),
    isFavorite: false,
    offers: [
      {
        title: '',
        price: 0
      }
    ],
    type: getRandomArrayElement(POINT_COUNT)
  }
];

function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}

export {getRandomPoint};
