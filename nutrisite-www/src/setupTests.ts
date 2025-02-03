import '@testing-library/jest-dom';
import { TextEncoder } from 'util';

global.TextEncoder = TextEncoder;

jest.mock('aws-amplify', () => ({
    API: {
        post: jest.fn().mockResolvedValue({}),
    },
}));