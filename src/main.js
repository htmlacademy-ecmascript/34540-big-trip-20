import MainPresenter from './presenter/main-presenter.js';
import TripModel from './model/trip-model.js';
import FilterModel from './model/filter-model.js';
import TripApiService from './service/trip-api-service.js';
import {ApiServiceConnector} from './const.js';

const $siteHeaderElement = document.querySelector('.page-header');
const $siteMainElement = document.querySelector('.page-main');

const filterModel = new FilterModel();
const tripModel = new TripModel({
  tripApiService: new TripApiService(ApiServiceConnector.END_POINT, ApiServiceConnector.AUTHORIZATION)
});

const mainPresenter = new MainPresenter({
  headerContainer: $siteHeaderElement,
  mainContainer: $siteMainElement,
  tripModel,
  filterModel
});

mainPresenter.init();
tripModel.init();
