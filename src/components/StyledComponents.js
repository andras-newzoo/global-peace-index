import styled from 'styled-components'


const secondaryColor = '#666666';
const secondaryColorLight = 'rgba(34,36,38,.15)';

const Wrapper = styled.div`

    font-family: gill-sans-nova-condensed, sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 1.2rem;

    background-color: ${props => props.background || '#fff'};

    grid-row: ${props => props.gridRow};
    grid-column: ${props => props.gridColumn};

    padding: ${props => props.padding || 0};
  
`

const FlexWrapper = styled(Wrapper)`
    display: flex;
    align-items: ${props => props.align || 'center'};
    justify-content: ${props => props.justify || 'flex-start'};
    flex-direction: ${props => props.direction || 'row' };
    width: 100%;
    height: 100%;
`

const SmallTooltip = styled.div`

    position: absolute;
    display: none;
    color: ${props => props.color};
    z-index: 20;

    border-radius: 3px;
    padding: .6rem 1rem;

    background: #fff;

    text-align: center;
    white-space: nowrap;
    pointer-events: none;

    border-style: solid;
    border-width: 1px;
    border-color: ${props => props.color};

    &:after {
      top: 100%;
    	left: 50%;
    	border: solid transparent;
    	content: " ";
    	height: 0;
    	width: 0;
    	position: absolute;
    	pointer-events: none;
    	border-color: rgba(136, 183, 213, 0);
    	border-top-color: ${props => props.color}
    	border-width: 8px;
    	margin-left: -8px;
    }

    p,
    h4 {
      font-size: .8em;
      line-height: .5;
      ${'' /* margin-bottom: .8rem !important; */}
      padding: 0 !important;
    }

    h4,
    span {
      font-weight: 700 !important;
    }

    .score {
      font-size: 1.6rem;
      padding-bottom: 0 !important;
      font-weight: 700;
      padding-top: .7rem !important;
    }



`

const Tooltip = styled.div`

    position: absolute;
    display: none;
    background: #fff;
    opacity: .9;
    z-index: 20;
    height: ${props => props.height || 'auto'}

    border-radius: 5px;
    white-space: nowrap;
    pointer-events: none;

    border-style: solid;
    border-width: 1px;
    border-color: ${props => props.color};

    text-align: center;

    &:after {
      right: ${props => props.left ? '' : '100%'};
      left:  ${props => props.left ? '100%' : ''};
      top: 12%;
      border: solid transparent;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      border-color: rgba(136, 183, 213, 0);
      border-right-color: ${props => props.left ? '' : props.color};
      border-left-color: ${props => props.left ? props.color : ''};
      border-width: 15px;
      margin-top: -15px;
      }

    span {
      font-weight: 700;
    }

    h4,
    p {
      color: ${secondaryColor};
      line-height: 1rem;
    }

    .bar {
      color: #333;
    }

    .tooltip{

      &__title {
        padding-top: 1rem;
        font-size: 1.6rem !important;
        font-weight: 600 !important;
      }
      &__hint {
        padding-top: .3rem;
      }

      &__legend {
        padding-top: 1rem;
      }

    }

    .avg-text {
      fill: #333;
      font-weight: 500;
    }


`

const ChartContainer = styled.div`

    circle,
    line {
      cursor: pointer;
    }

    .label {
      position: absolute;
      
      z-index: 10;
      color: secondaryColor !important;

      &__text {
        top: 0;
      }

      &__left {
        left: -5px;
        top: 0;
      }

      &__right {
        right: 0;
        top: 0;
      }

      &__icon__left{
        margin-right: 5px;
      }

      &__icon__right {
        margin-left: 5px;
      }

      &__calculation-text {
        bottom: 5px;
        right: 0;
        text-align: right;
      }
    }

    text {
      font-family: gill-sans-nova-condensed, sans-serif;
      font-style: normal;
      font-weight: 300;
      font-size: 1.2rem;
    }

    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;


    background-color: ${props => props.background || '#fff'};

    .domain{
      stroke: rgba(34,36,38,.15);
    }

    .label-text {
      fill: #333333;
    }

    .high-inc-avg-value,
    .low-inc-avg-value {
      font-weight: 500;
    }

    /* .label-text-middle {
      font-weight: 400;
    } */

    .year-text {
      font-size: 2.5rem;
      font-weight: 200;
    }
`

export { Wrapper, ChartContainer, FlexWrapper, Tooltip, SmallTooltip, secondaryColor, secondaryColorLight }
