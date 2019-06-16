import React, {Component} from 'react'

import {ChartContainer, Tooltip} from './StyledComponents'
import BarChart from './BarChart'

import { select } from 'd3-selection'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { forceSimulation, forceX, forceY, forceCollide, forceManyBody } from 'd3-force'
import { mouse } from 'd3-selection'
import "d3-transition"
import _ from 'lodash'

import { svgDimensions, appendArea } from './chartFunctions'

class BeeSwarmPlot extends Component {
  state = {
    firstRender: false,
    tooltipLeft: '',
    tooltipColor: ''
  }

  componentDidUpdate(prevProps){

    const { width, height, year, mouseoverValue, mouseClickValue } = this.props
    const { firstRender } = this.state


    if(!firstRender) {
      this.initVis()
      this.setState(state => state.firstRender = true)
    }

    if(prevProps.year !== year){
      this.updateData()
    }

    if(mouseClickValue[0] !== prevProps.mouseClickValue[0] || prevProps.mouseClickValue.length !== mouseClickValue.length){
      this.updateMouseover()
    } else if(prevProps.mouseoverValue !== mouseoverValue ) {
      this.updateMouseover()
    }

    if(prevProps.width !== width){
      this.updateDims()
    }


  }

  initVis(){

    this.svg = select(this.node)

    const { width, height, margin, transition, windowWidth, colorScale } = this.props,
          { data, year, mouseClickValue } = this.props,
          { handleMouseover, handleMouseout, handlemouseClick } = this.props,
          {chartWidth, chartHeight} = svgDimensions(this.svg, width, height, margin),
          values = _.uniq(data.map(e => e.economicClass))

    let mainRadius, subRadius, strokeWidth, tooltipY, forceCollideValue

    if(windowWidth <= 600){
      mainRadius= 4
      subRadius= 6
      strokeWidth= 2
      tooltipY= 10
      forceCollideValue= 8
    } else if (windowWidth < 1000){
      mainRadius= 6
      subRadius= 9
      strokeWidth= 3
      tooltipY= 20
      forceCollideValue= 12
    } else {
      mainRadius= 8
      subRadius= 11
      strokeWidth= 4
      tooltipY= 30
      forceCollideValue= 14
    }


    this.chartWidth = chartWidth
    this.chartHeight = chartHeight

    appendArea(this.svg, 'chart-area', margin.left, margin.top)

    this.chartArea = this.svg.select('.chart-area')

    this.xScale = scaleLinear().domain([3.8, 1]).range([0, chartWidth])

    const tooltip = select(this.div).select('.tooltip')

    this.chartArea
          .selectAll('.sub-circle')
          .data(data, d => d.country)
          .enter()
          .append('circle')
          .attr('class', 'sub-circle')
          .attr("r", subRadius)
          .attr('fill', d => colorScale(d.economicClass))
          .attr('stroke', d => colorScale(d.economicClass))
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', d => mouseClickValue.includes(d.country) ? 1 : 0)
          .attr("cx", d => d[year])
          .attr("cy", d => chartHeight/2)

    this.chartArea
          .selectAll('.main-circle')
          .data(data, d => d.country)
          .enter()
          .append('circle')
          .attr('class', 'main-circle')
          .attr("r", mainRadius)
          .attr("stroke-width", strokeWidth)
          .attr("stroke", 'white')
          .attr('stroke-opacity', 0)
          .attr('fill', d => colorScale(d.economicClass))
          .attr("cx", d => d[year])
          .attr("cy", d => chartHeight/2)
              .on('mouseover', d => {
                tooltip.style('display', 'block')
                handleMouseover(d)
              })
              .on('mousemove', d => {
                const mousePos = mouse(this.div)
                const left = this.chartWidth/2 < mousePos[0]
                const tooltipWidth = tooltip._groups[0][0].clientWidth

                tooltip.style('top', mousePos[1] - 30 + 'px')

                left  ? tooltip.style('left', mousePos[0] - tooltipWidth - tooltipY + 'px')
                      : tooltip.style('left', mousePos[0] + tooltipY + 'px')

                const { tooltipLeft, tooltipColor } = this.state
                if(tooltipLeft !== left){
                  this.setState(s => s.tooltipLeft = left)
                }
                if(tooltipColor !== d.economicClass){
                  this.setState(s => s.tooltipColor = d.economicClass)
                }

              })
              .on('mouseout', () => {
                 handleMouseout()
                 tooltip.style('display', 'none')
              })
              .on('click', handlemouseClick)

    this.simulation = forceSimulation(data)
        .force("charge", forceManyBody().strength(-10))
        .force('x', forceX(d => this.xScale(d[year])).strength(1))
        .force('y', forceY(chartHeight/2).strength(.15))
        .force('collide', forceCollide(forceCollideValue))
        .alphaDecay(0)
			  .alpha(.1)
        .on("tick", () => {

          this.chartArea.selectAll('.main-circle')
              .attr("cx", d => d.x)
              .attr("cy", d => d.y)

          this.chartArea.selectAll('.sub-circle')
              .attr("cx", d => d.x)
              .attr("cy", d => d.y)

        })

    this.simulation.tick(120)

    this.init_decay = setTimeout(() => {
    		this.simulation.alphaDecay(0.1);
    	}, transition.veryLong * 2);

  }

  updateData(){

    const { data, year, transition } = this.props

  	this.simulation.force('x', forceX(d => this.xScale(d[year])).strength(1))

  	this.simulation
  			.alphaDecay(0)
  			.alpha(0.05)
  			.restart()

    this.chartArea.selectAll('.main-circle').data(data, d => d.country)

    clearTimeout(this.init_decay);

    this.init_decay = setTimeout(() => {
        this.simulation.alphaDecay(0.1);
      }, transition.veryLong);

  }

  updateMouseover(){

    const { mouseoverValue, mouseClickValue } = this.props

    this.chartArea
          .selectAll('.sub-circle')
          .attr('stroke-opacity', d => d.country === mouseoverValue || mouseClickValue.includes(d.country) ? 1 : 0)
  }

  updateDims(){

    const { width, height, margin } = this.props,
          {chartWidth} = svgDimensions(this.svg, width, height, margin)

    this.xScale.range([0, chartWidth])

    this.updateData()

  }

  render(){

    const { tooltipData, mouseoverValue, year, colorScale } = this.props
    const { tooltipLeft, tooltipColor } = this.state
    const color = tooltipColor && colorScale(tooltipColor)

    return(
      <div>
        <ChartContainer ref={div => this.div = div}>
          <svg ref={node => this.node = node}/>
          <Tooltip
              className="tooltip"
              color = {color}
              left = {tooltipLeft}
              >
              <BarChart
                  data = {tooltipData}
                  value = {mouseoverValue}
                  year = {year}
                  width = {300}
                  height = {200}
              />
          </Tooltip>
        </ChartContainer>
      </div>
    )

  }

}

BeeSwarmPlot.defaultProps = {

  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  },

  transition: {
    veryLong: 10000
  }

}

export default BeeSwarmPlot
