import HeaderPresenter from './presenter/header-presenter.js';
import MainPresenter from './presenter/main-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';

const $siteHeaderElement = document.querySelector('.page-header');
const $siteMainElement = document.querySelector('.page-main');

const tripsModel = new TripModel();
const filterModel = new FilterModel();

const headerPresenter = new HeaderPresenter({
  headerContainer: $siteHeaderElement,
  tripsModel
});
const mainPresenter = new MainPresenter({
  mainContainer: $siteMainElement,
  tripsModel
});

headerPresenter.init();
mainPresenter.init();
