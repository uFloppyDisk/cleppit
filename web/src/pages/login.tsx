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
import { useQuery } from 'urql';
import { toErrorMap } from '../utils/toErrorMap';
import { useRouter } from 'next/router';
import { LoginDocument } from '../generated/graphql/graphql';

interface loginProps {}

export const Login: React.FC<loginProps> = ({}) => {
    // const router = useRouter();
    const [, doRegister] = useQuery(LoginDocument);
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={async (values, {setErrors}) => {
                    // const response = await doRegister(values);
                    // if (response.data?.register.errors) {
                    //     setErrors(toErrorMap(response.data.register.errors));
                    // } else if (response.data?.register.user) {
                    //     router.push('/');
                    // }
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

export default Login;
