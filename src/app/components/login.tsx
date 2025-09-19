import { AbsoluteCenter, Card, Field, FieldLabel, Fieldset, IconButton, Input } from '@chakra-ui/react'
import { PasswordInput } from '../../lib/chakra/password-input'
import { VscArrowRight } from 'react-icons/vsc'
import { loginUserTokenPost, pingApiSystemPingGet } from '../../lib/hey-api/client'
import { useState } from 'react'
import { on } from 'events'

export async function checkLoginStatus() {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), 5000)
    try {
        return await pingApiSystemPingGet()
            .then(response => {
                return response.response.status === 200
            })
            .catch(() => {
                return false
            })
    } catch (err: any) {
        if (err.name === 'AbortError') {
            console.error('Request timed out')
        } else {
            console.error('Fetch error:', err)
        }
        return false
    }
}

export const Login = (onLoggedIn: (loggedIn: boolean) => void) => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loginLoading, setLoginLoading] = useState<boolean>(false)
    const login = () => {
        setLoginLoading(true)
        loginUserTokenPost({
            body: { username: username, password: String(password) }
        })
            .then(() => {
                setUsername('')
                setPassword('')
                onLoggedIn(true)
            })
            .finally(() => {
                setLoginLoading(false)
            })
    }
    return (
        <AbsoluteCenter width="100vw" height="100vh">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Login</Card.Title>
                    <Card.Description>Please login to continue</Card.Description>
                </Card.Header>
                <form id="login-form" onSubmit={e => e.preventDefault()}>
                    <Card.Body>
                        <Fieldset.Root form="login-form" size="lg">
                            <Field.Root>
                                <Field.Label>Username</Field.Label>
                                <Input
                                    name="username"
                                    autoComplete="username"
                                    onChange={e => {
                                        setUsername(e.target.value)
                                    }}
                                    value={username}
                                    required
                                />
                            </Field.Root>
                            <Field.Root>
                                <FieldLabel>Password</FieldLabel>
                                <PasswordInput
                                    name="password"
                                    autoComplete="current-password"
                                    onChange={e => {
                                        setPassword(e.target.value)
                                    }}
                                    value={password}
                                    required
                                />
                            </Field.Root>
                        </Fieldset.Root>
                    </Card.Body>
                    <Card.Footer justifyContent={'end'}>
                        <IconButton type="submit" loading={loginLoading} onClick={login}>
                            <VscArrowRight />
                        </IconButton>
                    </Card.Footer>
                </form>
            </Card.Root>
        </AbsoluteCenter>
    )
}
