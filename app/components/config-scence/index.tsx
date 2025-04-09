import type { FC } from 'react'
import React from 'react'
import Welcome from '../welcome'

const ConfigSence: FC<any> = (props) => {
  return (
    <div className='mb-5 antialiased font-sans overflow-hidden shrink-0'>
      <Welcome {...props} />
    </div>
  )
}
export default React.memo(ConfigSence)
