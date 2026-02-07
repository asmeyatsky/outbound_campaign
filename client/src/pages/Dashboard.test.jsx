import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../api';

vi.mock('../api', () => ({
    startScrape: vi.fn(),
}));

describe('Dashboard Component', () => {
    it('renders the command center title', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );
        expect(screen.getByText(/Command Center/i)).toBeDefined();
    });

    it('enables the scrape button when a city is entered', () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );
        const input = screen.getByPlaceholderText(/Enter city/i);
        const button = screen.getByRole('button', { name: /Begin Scrape/i });

        expect(button).toBeDisabled();

        fireEvent.change(input, { target: { value: 'New York' } });
        expect(button).not.toBeDisabled();
    });

    it('calls startScrape API when button is clicked', async () => {
        const startScrapeSpy = vi.spyOn(api, 'startScrape');
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        const input = screen.getByPlaceholderText(/Enter city/i);
        const button = screen.getByRole('button', { name: /Begin Scrape/i });

        fireEvent.change(input, { target: { value: 'London' } });
        fireEvent.click(button);

        expect(startScrapeSpy).toHaveBeenCalledWith('London');
    });
});
