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

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
    return (
        <Wrapper variant='small'>
            <Formik
                initialValues={{ username: '', password: '' }}
                onSubmit={(values) => {
                    console.log(values);
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
