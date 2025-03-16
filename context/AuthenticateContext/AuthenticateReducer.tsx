type AuthenticateAction =
    | { type: 'set_true' }
    | { type: 'set_false' }


export const AuthenticateReducer = (state: boolean, action: AuthenticateAction): boolean => {
    switch (action.type) {
        case 'set_true':
            return true

        default:
            return false
    }
}