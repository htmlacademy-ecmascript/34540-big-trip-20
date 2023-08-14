import {render} from './framework/render.js';
import HeaderPresenter from './presenter/header-presenter.js';
import MainPresenter from './presenter/main-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/header/new-point-button-view.js';

const $siteHeaderElement = document.querySelector('.page-header');
const $siteMainElement = document.querySelector('.page-main');

const tripModel = new TripModel();
const filterModel = new FilterModel();

const headerPresenter = new HeaderPresenter({
  headerContainer: $siteHeaderElement,
  tripModel,
  filterModel
});
const mainPresenter = new MainPresenter({
  mainContainer: $siteMainElement,
  tripModel,
  filterModel,
  onNewPointDestroy: handleNewPointFormClose
});

const newPointButtonComponent = new NewPointButtonView({
  onClick: handleNewPointButtonClick
});

function handleNewPointFormClose() {
  mainPresenter.renderNoPointsComponent();
  newPointButtonComponent.element.disabled = false;
}

function handleNewPointButtonClick() {
  mainPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

render(newPointButtonComponent, $siteHeaderElement.querySelector('.trip-main'));

headerPresenter.init();
mainPresenter.init();
