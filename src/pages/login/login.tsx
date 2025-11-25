import {
    AbsoluteCenter,
    Box,
    Card,
    Field,
    FieldLabel,
    Fieldset,
    Group,
    IconButton,
    Input,
    Spinner,
    VStack
} from '@chakra-ui/react'
import { CircleArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useAsync } from 'react-use'
import { PasswordInput } from '../../../lib/chakra/password-input'
import { Toaster, toaster } from '../../../lib/chakra/toaster'
import { getUser, loginUser, refreshToken } from '../../../lib/hey-api/client'
import { useUserDataContext } from '../../providers/user-data'
import { setAccessToken } from '../../utils/api'

async function refresh(): Promise<string | null> {
    return refreshToken({ credentials: 'include' }).then(data => {
        if (data.data) {
            console.log(data)
            return (data.data as any).access_token as string
        }
        return null
    })
}

const LoginState = {
    CHECKING: 'checking',
    LOGGED_OUT: 'logged_out',
    LOGGED_IN: 'logged_in'
}

type LoginStateType = (typeof LoginState)[keyof typeof LoginState]

export const Login = ({ children }: { children: React.ReactNode }) => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [loginLoading, setLoginLoading] = useState<boolean>(false)
    const [checkingStatus, setCheckingStatus] = useState<boolean>(true)
    const [loginState, setLoginState] = useState<LoginStateType>(LoginState.CHECKING)
    const { setUserData } = useUserDataContext()

    useAsync(async () => {
        // Check login status on mount
        refresh()
            .then(token => {
                if (token) {
                    setAccessToken(token)
                    setLoginState(LoginState.LOGGED_IN)
                }
            })
            .catch(() => {
                setLoginState(LoginState.LOGGED_OUT)
            })
            .finally(() => {
                setCheckingStatus(false)
            })
    }, [])

    const createAccount = async () => {
        setLoginLoading(true)
        toaster.error({
            title: 'Register Failed',
            description: 'This feature is not added yet'
        })
        setLoginLoading(false)
    }

    useEffect(() => {
        if (loginState === LoginState.LOGGED_IN) {
            // Fetch user data
            getUser().then(response => {
                setUserData(response.data)
            })
        }
    }, [LoginState])

    const login = async () => {
        setLoginLoading(true)
        try {
            await loginUser({
                body: { username, password }
            }).then(response => {
                if (response.response.status === 200 && response.data) {
                    setAccessToken((response.data as any).access_token as string)

                    setLoginState(LoginState.LOGGED_IN)
                } else {
                    toaster.error({
                        title: 'Login Failed',
                        description: 'Invalid username or password.'
                    })
                }
            })
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

    if (loginState === LoginState.LOGGED_IN) {
        return <Box>{children}</Box>
    }

    return (
        <>
            <VStack height="100vh" width="100vw">
                <Box width="100vw"></Box>
                <AbsoluteCenter width="100vw" zIndex={1}>
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
                                        <Group attached>
                                            <PasswordInput
                                                name="password"
                                                autoComplete="current-password"
                                                onChange={e => setPassword(e.target.value)}
                                                value={password}
                                                required
                                                roundedRight={0}
                                            />
                                            <IconButton type="submit" loading={loginLoading} onClick={login}>
                                                <CircleArrowRight />
                                            </IconButton>
                                        </Group>
                                    </Field.Root>
                                </Fieldset.Root>
                            </Card.Body>
                        </form>
                        <Card.Footer justifyContent={'center'} onClick={createAccount}></Card.Footer>
                    </Card.Root>
                </AbsoluteCenter>
            </VStack>
            <Toaster />
        </>
    )
}
