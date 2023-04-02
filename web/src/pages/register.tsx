import React from 'react';
import { Form, Formik } from 'formik';
import {
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Box,
    Button,
} from '@chakra-ui/react';
import { Wrapper } from '../components/Wrapper';
import { InputField } from '../components/InputField';
import { useMutation } from 'urql';

interface registerProps {}

const REGISTER_MUT = `
mutation doRegister($username: String!, $password: String!) {
    register(options: { username: $username, password: $password }) {
        errors {
            field
            message
        }
        user {
            id,
            username
        }
    }
}
`;

export const Register: React.FC<registerProps> = ({}) => {
    const [{}, doRegister] = useMutation(REGISTER_MUT);
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={(values) => {
                    return doRegister(values);
                }}>
                {({ values, isSubmitting, handleChange }) => (
                    <Form>
                        <InputField
                            name='username'
                            placeholder='Username'
                            label='Username'
                        />
                        <Box mt={4}>
                            <InputField
                                name='password'
                                placeholder='Password'
                                label='Password'
                                type='password'
                            />
                        </Box>
                        <Button
                            mt={4}
                            type='submit'
                            isLoading={isSubmitting}
                            bgColor={'teal'}
                            color={'white'}>
                            Register
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default Register;
