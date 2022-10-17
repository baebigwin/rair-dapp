import styled from 'styled-components';

import {
  TStyledSplashCardImage,
  TStyledSplashPageCardWrapper
} from '../splashConfig.types';

export const StyledSplashPageCardWrapper = styled.div<TStyledSplashPageCardWrapper>`
  display: flex;
  justify-content: 'space-between';
  align-items: 'center';
  border-radius: '20px';
  background-color: ${({ bgColor }) => bgColor || '#FFFFFF'};
  width: '100%';
  height: '42vw';
  @media (max-width: 930px) {
    flex-direction: column-reverse;
    border-radius: 16px;
  } ;
`;

export const StyledSplashCardImage = styled.img<TStyledSplashCardImage>`
  width: 100%;
  min-width: 400px;
  height: auto;
  margin: ${({ imageMargin }) => imageMargin};

  @media (max-width: 930px) {
    min-width: 100%;
    margin: 0px;
    padding: 3px;
    border-radius: 0px;
  }
`;
