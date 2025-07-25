import { supabase } from '../supabaseClient'

function SignUpPage() {
    const blah = supabase.auth.signUp({
        email: '',
        password: ''
    })
    return (
        <div>
            <h1>Sign Up</h1>
        </div>
    )
}

export default SignUpPage