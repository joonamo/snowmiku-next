import classNames from 'classnames'
import React from 'react'

type Props = {
  type: 'winner' | 'finalist'
}
export const Ribbon: React.FC<Props> = ({ type }) => (
  <div className='ribbon-container is-clipped' aria-hidden='true' aria-disabled='true'>
    <div
      className={classNames(
        'ribbon',
        type === 'winner' ? 'has-background-danger' : 'has-background-link',
        'has-text-light',
      )}
    >
      {type}
    </div>
  </div>
)
