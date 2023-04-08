import { Box, Link } from '@chakra-ui/react';

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    return (
        <Box bg='tomato' px={2} py={4}>
            <Link mr={2}>Login</Link>
            <Link>Register</Link>
        </Box>
    );
};
