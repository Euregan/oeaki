export const initialState = {
    players: {},
    messages: [],
};

export const reducer = (state, { type, ...action }) => {
    switch (type) {
        case 'new_player': {
            const { id, username } = action;
            return { ...state, players: { ...state.players, [id]: username } };
        }
        case 'new_message': {
            const { emiterId, message } = action;
            return { ...state, messages: [{ emiterId, message }, ...state.messages] };
        }
        case 'remove_player': {
            const { [action.id]: _, ...filteredPlayers } = state.players;
            return { ...state, players: filteredPlayers };
        }
        default:
            console.error(`Unknown dispatched type ${type}`);
            break;
    }
};
