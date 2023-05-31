import HeaderPresenter from './presenter/header-presenter.js';
import MainPresenter from './presenter/main-presenter.js';

const headerPresenter = new HeaderPresenter();
const mainPresenter = new MainPresenter();

const $siteHeaderElement = document.querySelector('.page-header');
const $siteMainElement = document.querySelector('.page-main');

headerPresenter.init($siteHeaderElement);
mainPresenter.init($siteMainElement);
