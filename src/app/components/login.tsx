import { AbsoluteCenter, Box, Card, Field, FieldLabel, Fieldset, IconButton, Input, Spinner } from '@chakra-ui/react'
import { PasswordInput } from '../../lib/chakra/password-input'
import { VscArrowRight } from 'react-icons/vsc'
import { loginUserTokenPost, pingApiSystemPingGet } from '../../lib/hey-api/client'
import { useState, useEffect } from 'react'
import { Toaster, toaster } from '../../lib/chakra/toaster'

export async function checkLoginStatus() {
    try {
        const response = await pingApiSystemPingGet({
            credentials: 'include'
        })
        return response.response.status === 200
    } catch {
        return false
    }
}

export const Login = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loginLoading, setLoginLoading] = useState<boolean>(false)
    const [checkingStatus, setCheckingStatus] = useState<boolean>(true)
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        // Check login status on mount
        checkLoginStatus().then(loggedIn => {
            setIsLoggedIn(loggedIn)
            setCheckingStatus(false)
        })
    }, [])

    const login = async () => {
        setLoginLoading(true)
        try {
            await loginUserTokenPost({
                body: { username, password },
                credentials: 'include'
            }).then(response => {
                if (response.response.status === 200) {
                    setIsLoggedIn(true)
                } else {
                    console.log('response', response)
                    toaster.error({
                        title: 'Login Failed',
                        description: 'Invalid username or password.'
                    })
                }
            })
            setUsername('')
        } finally {
            setPassword('')
            setLoginLoading(false)
        }
    }

    if (checkingStatus) {
        return (
            <AbsoluteCenter>
                <Spinner size="lg" />
            </AbsoluteCenter>
        )
    }

    if (isLoggedIn) {
        return <Box>{children}</Box>
    }

    return (
        <>
            <AbsoluteCenter width="100vw" height="100vh" zIndex={1}>
                <Card.Root>
                    <Card.Header>
                        <Card.Title paddingLeft={0}>Login</Card.Title>
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
                                        onChange={e => setUsername(e.target.value)}
                                        value={username}
                                        required
                                    />
                                </Field.Root>
                                <Field.Root>
                                    <FieldLabel>Password</FieldLabel>
                                    <PasswordInput
                                        name="password"
                                        autoComplete="current-password"
                                        onChange={e => setPassword(e.target.value)}
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
            <Toaster />
        </>
    )
}
