'use client'

import React from 'react'
import styled from 'styled-components'

interface GameButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  className?: string
  size?: 'sm' | 'lg'
}

const GameButton = ({ 
  children, 
  onClick, 
  disabled = false,
  type = 'button',
  className = '',
  size = 'lg'
}: GameButtonProps) => {
  return (
    <StyledWrapper className={className} size={size}>
      <button 
        onClick={onClick} 
        disabled={disabled}
        type={type}
      >
        <span>{children}</span>
      </button>
    </StyledWrapper>
  )
}

interface StyledWrapperProps {
  size: 'sm' | 'lg'
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  button {
    position: relative;
    height: ${props => props.size === 'sm' ? '36px' : '50px'};
    padding: 0 ${props => props.size === 'sm' ? '20px' : '30px'};
    border: 2px solid #000;
    background: #ffffff;
    user-select: none;
    white-space: nowrap;
    transition: all .05s linear;
    font-family: inherit;
  }

  button:before, button:after {
    content: "";
    position: absolute;
    background: #ffffff;
    transition: all .2s linear;
  }

  button:before {
    width: calc(100% + 6px);
    height: calc(100% - 16px);
    top: 8px;
    left: -3px;
  }

  button:after {
    width: calc(100% - 16px);
    height: calc(100% + 6px);
    top: -3px;
    left: 8px;
  }

  button:hover {
    cursor: crosshair;
  }

  button:active {
    transform: scale(0.95);
  }

  button:hover:before {
    height: calc(100% - 32px);
    top: 16px;
  }

  button:hover:after {
    width: calc(100% - 32px);
    left: 16px;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button span {
    font-size: ${props => props.size === 'sm' ? '13px' : '15px'};
    z-index: 3;
    position: relative;
    font-weight: 600;
  }
`

export default GameButton
