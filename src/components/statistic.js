
import AbstractSmartComponent from "./abstact-smart-components.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

const BAR_HEIGHT = 55;
const ELEMENT_DATES_DIFFERENCE_KEY = `dateDifference`;
const ELEMENT_PRICE_KEY = `price`;

const MoneyAndTimeEvents = {
  FLY: `FLIGHT`,
  STAY: `CHECKIN`,
  DRIVE: `DRIVE`,
  LOOK: `SIGHTSEEING`,
  EAT: `RESTAURANT`,
  RIDE: [`TRANSPORT`, `SHIP`, `TRAIN`, `BUS`, `TAXI`]
};

const TransportEvents = {
  DRIVE: `DRIVE`,
  FLY: `FLIGHT`,
  SAIL: `SHIP`,
  RIDE: [`TRANSPORT`, `SHIP`, `TRAIN`, `BUS`, `TAXI`]
};

const getTotalData = (points, type, elementKey) => {

  const filteredElements = points.filter((element) => {

    if (Array.isArray(MoneyAndTimeEvents[type])) {
      for (const item of MoneyAndTimeEvents[type]) {
        if (item === element.type) {
          return true;
        }
      }
    }

    return element.type === MoneyAndTimeEvents[type];
  });


  return filteredElements.reduce((accumulator, currentElement) =>{
    return accumulator + currentElement[elementKey];
  }, 0);
};


const renderMoneyChart = (moneyCtx, points) => {
  moneyCtx.height = BAR_HEIGHT * 6;
  let moneyData = [];

  const types = Object.keys(MoneyAndTimeEvents);

  types.forEach((element) => {
    moneyData.push(getTotalData(points, element, ELEMENT_PRICE_KEY));
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: moneyData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const findDriveCount = (points, type) => {
  let count = 0;

  points.map((point) => {
    const formattedType = point.type;
    if (Array.isArray(TransportEvents[type])) {

      for (const transportType of TransportEvents[type]) {
        if (transportType === formattedType) {
          count++;
        }
      }
    }

    if (formattedType === TransportEvents[type]) {
      count++;
    }

  });
  return count;
};

const renderTransportChart = (transportCtx, points) => {
  transportCtx.height = BAR_HEIGHT * 6;

  const types = Object.keys(TransportEvents);
  let transportData = [];
  types.map((element) => {
    transportData.push(findDriveCount(points, element));
  });


  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: transportData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const findTime = (points, type) => {
  const spentTime = moment.duration(getTotalData(points, type, ELEMENT_DATES_DIFFERENCE_KEY));


  return Math.floor(spentTime.asHours());
};

const renderTimeChart = (transportCtx, points) => {
  transportCtx.height = BAR_HEIGHT * 6;

  let timeData = [];

  const types = Object.keys(MoneyAndTimeEvents);

  types.forEach((element) => {
    timeData.push(findTime(points, element));
  });

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: timeData,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticTemplate = () => {

  return (`<section class="statistics">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
 </section>`);
};


export default class Statistics extends AbstractSmartComponent {
  constructor(points) {
    super();

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._points = points;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticTemplate();
  }

  show() {
    super.show();

    this.rerender(this._points);
  }

  recoveryListeners() {}

  rerender() {
    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();


    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._points.getPoints());
    this._transportChart = renderTransportChart(transportCtx, this._points.getPoints());
    this._timeChart = renderTimeChart(timeCtx, this._points.getPoints());
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}
