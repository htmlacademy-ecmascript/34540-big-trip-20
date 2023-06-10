import {getRandomInt} from '../utils.js';

const mockDestinations = [
  {
    id: '1',
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Chamonix',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInt(10)}`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: '2',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.',
    name: 'Serbia',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInt(10)}`,
        description: 'Serbia building'
      }
    ]
  },
  {
    id: '3',
    description: 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    name: 'Armenia',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInt(10)}`,
        description: 'Armenia building'
      }
    ]
  },
  {
    id: '4',
    description: 'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    name: 'Russia',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInt(10)}`,
        description: 'Russia building'
      }
    ]
  },
  {
    id: '5',
    description: 'In rutrum ac purus sit amet tempus.',
    name: 'Amsterdam',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomInt(10)}`,
        description: 'Amsterdam building'
      }
    ]
  }
];

const getDestinations = () => mockDestinations;

export {getDestinations};

