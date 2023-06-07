import {getRandomPoint} from '../mock/points.js';
import {POINT_COUNT} from '../const.js';

export default class PointsModel {
  tasks = Array.from({length: POINT_COUNT}, getRandomPoint);

  getPoints() {
    return this.tasks;
  }
}
