import * as React from 'react'
import { SVGProps } from 'react'

export const ExternalLink = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 256 256'
    xmlns='http://www.w3.org/2000/svg'
    xmlSpace='preserve'
    style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeMiterlimit: 1.5,
      margin: '0px 0px 6px 4px',
    }}
    {...props}
  >
    <path
      d='M249.436 32.372c3.658 9.031 5.673 18.9 5.673 29.235v114.012c0 43.047-34.948 77.995-77.994 77.995H63.103c-43.046 0-77.994-34.948-77.994-77.995V61.607c0-43.046 34.948-77.994 77.994-77.994h114.012c10.336 0 20.204 2.015 29.235 5.673L170.046 25.59H63.103c-19.879 0-36.018 16.139-36.018 36.017v114.012c0 19.879 16.139 36.018 36.018 36.018h114.012c19.879 0 36.018-16.139 36.018-36.018V68.676l36.303-36.304Z'
      style={{
        fill: '#fff',
      }}
      transform='matrix(.7385 0 0 .7385 16.595 63.15)'
    />
    <path
      d='M128 151.876V45.892'
      style={{
        fill: 'none',
        stroke: '#fff',
        strokeWidth: '22.62px',
      }}
      transform='matrix(.7071 .7071 -1.1737 1.1737 200.787 -125.762)'
    />
    <path
      d='M128 45.892 92.727 88.678'
      style={{
        fill: 'none',
        stroke: '#fff',
        strokeWidth: 31,
      }}
      transform='scale(-1 1) rotate(-45 -87.649 473.37)'
    />
    <path
      d='M128 45.892 92.727 88.678'
      style={{
        fill: 'none',
        stroke: '#fff',
        strokeWidth: 31,
      }}
      transform='rotate(45 215.649 164.35)'
    />
  </svg>
)
