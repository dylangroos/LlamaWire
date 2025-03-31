import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('renders the title', () => {
    render(<Header tps={0} />);
    // Check if text containing "LlamaWire" is present
    expect(screen.getByText(/LlamaWire/i)).toBeInTheDocument();
  });

  it('does not render TPS when tps is 0', () => {
    render(<Header tps={0} />);
    const tpsDisplay = screen.queryByText(/tokens\/sec/i);
    expect(tpsDisplay).not.toBeInTheDocument();
  });

  it('renders TPS when tps is greater than 0', () => {
    render(<Header tps={12.3} />);
    const tpsDisplay = screen.getByText(/\(12\.3 tokens\/sec\)/i);
    expect(tpsDisplay).toBeInTheDocument();
  });

   it('renders the logo image', () => {
    render(<Header tps={0} />);
    const logo = screen.getByRole('img', { name: /LlamaWire Logo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });
}); 