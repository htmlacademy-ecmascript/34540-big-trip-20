const mockOffers = [
  {
    type: 'taxi',
    offers: [
      {
        id: '1',
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: '2',
        title: 'Order Uber',
        price: 20
      },
      {
        id: '3',
        title: 'Switch to comfort',
        price: 80
      }
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: '1',
        title: 'bus 1',
        price: 5
      },
      {
        id: '2',
        title: 'bus 2',
        price: 10
      }
    ]
  },
  {
    type: 'train',
    offers: [
      {
        id: '1',
        title: 'train 1',
        price: 25
      },
      {
        id: '2',
        title: 'train 2',
        price: 40
      }
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: '1',
        title: 'ship 1',
        price: 225
      },
      {
        id: '2',
        title: 'ship 2',
        price: 340
      }
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: '1',
        title: 'Rent a car',
        price: 200
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: '1',
        title: 'Add luggage',
        price: 30
      },
      {
        id: '2',
        title: 'Switch to comfort',
        price: 100
      }
    ]
  },
  {
    type: 'check-in',
    offers: [
      {
        id: '1',
        title: 'Prolongation',
        price: 30
      }
    ]
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: '1',
        title: 'Book tickets',
        price: 40
      },
      {
        id: '2',
        title: 'Lunch in city',
        price: 30
      }
    ]
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: '1',
        title: 'Pizza',
        price: 15
      },
      {
        id: '2',
        title: 'Coffee',
        price: 5
      }
    ]
  }
];

const getOffers = () => mockOffers;

export {getOffers};
