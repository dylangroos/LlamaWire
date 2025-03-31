import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MessageInput from './MessageInput';

describe('MessageInput Component', () => {
  it('renders input field and send button', () => {
    render(
      <MessageInput 
        input="" 
        setInput={() => {}} 
        handleKeyDown={() => {}} 
        sendMessage={() => {}} 
      />
    );
    expect(screen.getByPlaceholderText(/Type your message.../i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send/i })).toBeInTheDocument();
  });

  it('calls setInput on input change', () => {
    const setInputMock = vi.fn();
    render(
      <MessageInput 
        input="" 
        setInput={setInputMock} 
        handleKeyDown={() => {}} 
        sendMessage={() => {}} 
      />
    );
    const inputElement = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.change(inputElement, { target: { value: 'hello' } });
    expect(setInputMock).toHaveBeenCalledWith('hello');
  });

  it('calls sendMessage on button click', () => {
    const sendMessageMock = vi.fn();
    render(
      <MessageInput 
        input="test" 
        setInput={() => {}} 
        handleKeyDown={() => {}} 
        sendMessage={sendMessageMock} 
      />
    );
    const buttonElement = screen.getByRole('button', { name: /Send/i });
    fireEvent.click(buttonElement);
    expect(sendMessageMock).toHaveBeenCalledTimes(1);
  });

  it('calls handleKeyDown on key down in input', () => {
    const handleKeyDownMock = vi.fn();
    render(
      <MessageInput 
        input="test" 
        setInput={() => {}} 
        handleKeyDown={handleKeyDownMock} 
        sendMessage={() => {}} 
      />
    );
    const inputElement = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter' });
    expect(handleKeyDownMock).toHaveBeenCalledTimes(1);
  });
}); 