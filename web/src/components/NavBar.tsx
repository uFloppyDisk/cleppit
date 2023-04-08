import { Box, Button, Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useQuery } from 'urql';
import { MeDocument } from '../generated/graphql/graphql';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{data, fetching}] = useQuery({ query: MeDocument});
    let content = null;

    if (!data?.me) {
        content = (
            <>
                <NextLink href="/register">
                    <Link>Register</Link>
                </NextLink>
                <NextLink href="/login">
                    <Link ml={2}>Login</Link>
                </NextLink>
            </>
        )
    } else {
        content = (
            <Flex>
                <Box>
                    {data.me.username}
                </Box>
                <Button variant="link" color="white" ml={2}>
                    Logout
                </Button>
            </Flex>
        )
    }

    if (fetching) {
        content = (<Box></Box>)
    }

    return (
        <Flex bg='red' px={2} py={4}>
            <Box color="white" ml={'auto'}>
                {content}
            </Box>
        </Flex>
    );
};
