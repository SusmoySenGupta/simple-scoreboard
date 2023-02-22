// select dom elements
const allMatchesEl = document.querySelector('.all-matches');
const addAnotherMathEl = document.querySelector('.lws-addMatch');
const resetEl = document.querySelector('.lws-reset');

// Form elements
const incrementField = 'increment';
const decrementField = 'decrement';

// action identifiers
const ADD_MATCH = 'add_match';
const RESET = 'reset';
const REMOVE_MATCH = 'remove_match';
const INCREMENT = 'increment';
const DECREMENT = 'decrement';

// initial state
const state = {
	matchNo: 1,
	matches: [getMatch(0)],
};

// create reducer function
const reducer = (state, action) => {
	switch (action.type) {
		case ADD_MATCH:
			return {
				...state,
				matchNo: state.matchNo + 1,
				matches: [...state.matches, action.payload],
			};
		case INCREMENT:
			if (action.payload.score === '') {
				return state;
			}
			const incrementMatch = state.matches.find(
				(match) => match.id === parseInt(action.payload.id)
			);

			incrementMatch.score += parseInt(action.payload.score);

			return {
				...state,
				matches: state.matches.map((match) => {
					if (match.id === parseInt(action.payload.id)) {
						return incrementMatch;
					}
					return match;
				}),
			};
		case DECREMENT:
			if (action.payload.score === '') {
				return state;
			}
			const decrementMatch = state.matches.find(
				(match) => match.id === parseInt(action.payload.id)
			);
			decrementMatch.score -= parseInt(action.payload.score);
			if (decrementMatch.score < 0) {
				decrementMatch.score = 0;
			}
			return {
				...state,
				matches: state.matches.map((match) => {
					if (match.id === parseInt(action.payload.id)) {
						return decrementMatch;
					}
					return match;
				}),
			};
		case RESET:
			return {
				...state,
				matches: state.matches.map((match) => {
					match.score = 0;
					return match;
				}),
			};
		case REMOVE_MATCH:
			return {
				...state,
				matches: state.matches.filter(
					(match) => match.id !== parseInt(action.payload)
				),
			};
		default:
			return state;
	}
};

// create store
const store = Redux.createStore(reducer, state);

// create action creators
const addMatch = (match) => ({
	type: ADD_MATCH,
	payload: match,
});

const increment = (id, score) => ({
	type: INCREMENT,
	payload: { id, score },
});

const decrement = (id, score) => ({
	type: DECREMENT,
	payload: { id, score },
});

const reset = () => ({
	type: RESET,
});

const removeMatch = (id) => ({
	type: REMOVE_MATCH,
	payload: id,
});

// create render function
const render = () => {
	const { matches } = store.getState();
	allMatchesEl.innerHTML = '';
	matches.forEach((match) => {
		const matchEl = document.createElement('div');
		matchEl.classList.add('match');

		matchEl.innerHTML = `
            <div class="wrapper">
                    <button 
                        class="lws-delete" 
                        id="${match.id}" 
                        onclick="handleDelete(this)"
                    >
                        <img src="./image/delete.svg" alt="" />
                    </button>
                    <h3 class="lws-matchName">${match.title}</h3>
                </div>
                <div class="inc-dec">
                    <form class="incrementForm" data-id="${match.id}" onsubmit="handleIncrement(event)">
                        <h4>Increment</h4>
                        <input type="number" name="increment" class="lws-increment" />
                    </form>
                    <form class="decrementForm" data-id="${match.id}" onsubmit="handleDecrement(event)">
                        <h4>Decrement</h4>
                        <input type="number" name="decrement" class="lws-decrement" />
                    </form>
                </div>
                <div class="numbers">
                    <h2 class="lws-singleResult" data-id="${match.id}">${match.score}</h2>
                </div>
        `;
		allMatchesEl.appendChild(matchEl);
	});
};

// initial render
render();

// subscribe to store
store.subscribe(render);

// dispatch actions
addAnotherMathEl.addEventListener('click', () => {
	const match = getMatch(store.getState().matchNo);
	store.dispatch(addMatch(match));
});

resetEl.addEventListener('click', () => {
	store.dispatch(reset());
});

allMatchesEl.addEventListener('click', (e) => {
	if (e.target.classList.contains('increment')) {
		store.dispatch(increment(e.target.dataset.index));
	}
	if (e.target.classList.contains('decrement')) {
		store.dispatch(decrement(e.target.dataset.index));
	}
});

function handleIncrement(e) {
	e.preventDefault();
	const score = e.target[incrementField].value;
	const id = e.target.dataset.id;
	store.dispatch(increment(id, score));
}

function handleDecrement(e) {
	e.preventDefault();
	const score = e.target[decrementField].value;
	const id = e.target.dataset.id;
	store.dispatch(decrement(id, score));
}

function handleDelete(e) {
	store.dispatch(removeMatch(e.id));
}

// helper functions
function getMatch(matchNo) {
	return {
		id: getUniqueID(),
		title: `Match ${matchNo + 1}`,
		score: 0,
	};
}

function getUniqueID() {
	return parseInt(Math.random() * Math.floor(Math.random() * Date.now()));
}
