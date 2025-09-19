import {
    AbsoluteCenter,
    Card,
    Field,
    FieldLabel,
    Fieldset,
    IconButton,
    Input
} from '@chakra-ui/react'
import { PasswordInput } from '../../lib/chakra/password-input'
import { VscArrowRight } from 'react-icons/vsc'
import { loginUserTokenPost } from '../../lib/hey-api/client'
import { useState } from 'react'

export const Login = ({
    onLoginSuccess
}: {
    onLoginSuccess: (token: string) => void
}) => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const login = () => {
        loginUserTokenPost({
            body: { username: username, password: String(password) }
        }).then(response => {
            setUsername('')
            setPassword('')
            onLoginSuccess((response.data as any)['access_token'])
        })
    }
    return (
        <AbsoluteCenter width="100vw" height="100vh">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Login</Card.Title>
                    <Card.Description>
                        Please login to continue
                    </Card.Description>
                </Card.Header>
                <Card.Body>
                    <Fieldset.Root size="lg">
                        <Field.Root>
                            <Field.Label>Username</Field.Label>
                            <Input
                                onChange={e => {
                                    setUsername(e.target.value)
                                }}
                                value={username}
                            />
                        </Field.Root>
                        <Field.Root>
                            <FieldLabel>Password</FieldLabel>
                            <PasswordInput
                                onChange={e => {
                                    setPassword(e.target.value)
                                }}
                                value={password}
                            />
                        </Field.Root>
                    </Fieldset.Root>
                </Card.Body>
                <Card.Footer justifyContent={'end'}>
                    <IconButton onClick={login}>
                        <VscArrowRight />
                    </IconButton>
                </Card.Footer>
            </Card.Root>
        </AbsoluteCenter>
    )
}
