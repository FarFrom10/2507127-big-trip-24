import SortView from '../view/sort-view.js';
import EventListView from '../view/events-list-view.js';
import EventItemView from '../view/event-item-view.js';
import FormEditEventView from '../view/form-edit-event-view.js';
import BoardView from '../view/board-view.js';
import { render } from '../render.js';

export default class BoardPresenter {
  boardComponent = new BoardView;
  eventListComponent = new EventListView;

  constructor({boardContainer, boardModel}) {
    this.boardContainer = boardContainer;
    this.boardModel = boardModel;
  }

  init() {
    this.boardEvents = [...this.boardModel.getEvents()];

    render(this.boardComponent, this.boardContainer);
    render(this.eventListComponent, this.boardContainer);
    render(new SortView, this.boardComponent.getElement());

    for (let i = 0; i < this.boardEvents.length; i++) {
      const eventData = this.boardModel.getEventData(this.boardEvents[i], this.boardModel);
      const typeOffers = this.boardModel.getOffersByType(this.boardEvents[i].type).offers;
      const allTypes = this.boardModel.getAllTypes();

      const event = new EventItemView(eventData);

      //Временное решение для отображения формы вместо элемента списка (event-item-view)
      if (i === 0) {
        render(new FormEditEventView(eventData, typeOffers, allTypes), this.eventListComponent.getElement());
        continue;
      }

      render(event, this.eventListComponent.getElement());
    }
  }
}


