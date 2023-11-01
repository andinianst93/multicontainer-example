import '@testing-library/jest-dom'
import { render } from '@testing-library/react';
import Fib from './Fib';


test('Form is present in the document', () => {
    const { getByTestId } = render(<Fib />);
    const form = getByTestId('fib-form'); 
    expect(form).toBeInTheDocument();
});
