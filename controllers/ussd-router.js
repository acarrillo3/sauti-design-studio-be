const UssdMenu = require('ussd-menu-builder');
const UssdModel = require('../models/ussd-model');
const router = require('express').Router();

// Function to create a new menu. Recommended to create a new menu for each request
const createMenu = () => {
  const menu = new UssdMenu();
  return menu;
};

const screen = {
  questionText: 'Welcome to Sauti Studio!',
  options: [
    { number: 1, text: 'Show Balance' },
    { number: 2, text: 'Buy Airtime' },
  ],
};

// Constructor for questions and options
class BuildScreen {
  constructor(screens) {
    this.question = screens.questionText;
    this.options = screens.options;
  }
}

function getSessionInfo(body) {
  const session = {
    session_id: body.session_id,
    phone_num: body.phone_num,
    service_code: body.service_code,
    text: body.text,
  };
  return session;
}
// DYNAMIC ROUTE HANDLER
router.post('/', async (req, res) => {
  try {
    // create a new menu for each request
    const menu = createMenu();
    const session = getSessionInfo(req.body);
    const ussdSess = await UssdModel.addSession(session);
    // construct questions and options object for a given flow
    const newScreen = new BuildScreen(screen);

    // format options to be sent to AfricasTalking API
    const nextState = newScreen.options.reduce(
      (obj, item) => ({
        ...obj,
        ...{ [item.number]: item.text },
      }),
      {}
    );

    // Format options to be displayed to clients
    const screenOpts = newScreen.options;
    const currentOption = Object.keys(screenOpts)
      .map((obj, i) => `${screenOpts[obj].number}. ${screenOpts[obj].text}`)
      .toString()
      .split(',')
      .join('\n');
    //   Format questions to be sent to be displayed to clients
    const currentQuestion = `${newScreen.question} \n${currentOption}`;

    // The first menu shown to clients
    menu.startState({
      run: () => {
        menu.con(currentQuestion);
      },
      next: nextState,
    });
    menu.state('Home', {
      run: () => {
        menu.con(currentQuestion);
      },
      next: nextState,
    });
    menu.state('Show Balance', {
      run: () => {
        const balance = '234,434,344';
        menu.end(`Your balance is USD${balance}`);
      },
    });

    menu.state('Buy Airtime', {
      run: () => {
        menu.con('Enter amount: \n1. Go Back');
      },
      next: {
        '*\\d+': 'buyAirtime.amount',
        '1': 'Home',
      },
    });
    menu.state('buyAirtime.amount', {
      run: () => {
        menu.end('Airtime bought successfully!');
      },
    });

    menu.run(req.body, msg => {
      res.send(msg);
    });
  } catch (error) {
    console.log('TCL: error', error);

    res.status(500).json(error);
  }
});

router.get('/', (req, res) => {
  res.send('Welcome to the Sauti Ussd Portal');
});

module.exports = router;
