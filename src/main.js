import HeaderPresenter from './presenter/header-presenter.js';
import MainPresenter from './presenter/main-presenter.js';
import TripsModel from './model/trips-model.js';

const $siteHeaderElement = document.querySelector('.page-header');
const $siteMainElement = document.querySelector('.page-main');

const tripsModel = new TripsModel();
const headerPresenter = new HeaderPresenter({
  headerContainer: $siteHeaderElement
});
const mainPresenter = new MainPresenter({
  mainContainer: $siteMainElement,
  tripsModel
});

headerPresenter.init();
mainPresenter.init();
